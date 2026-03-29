from typing import Dict

from .models import ScoreType


def _normalize_answer(value: str) -> str:
    return (value or "").strip().lower()


def _is_true(value: str) -> bool:
    return _normalize_answer(value) in {
        "true",
        "yes",
        "1",
        "oui",
        "نعم",
        "always",
        "toujours",
    }


def _to_float(value: str):
    try:
        return float(str(value).replace(",", "."))
    except (ValueError, TypeError):
        return None


def build_response_map(questionnaire) -> Dict[str, str]:
    return {
        response.question_code: response.answer_value
        for response in questionnaire.responses.all()
    }


# =========================
# DUKE / functional capacity
# =========================
def compute_duke(response_map: Dict[str, str]) -> dict:
    mets = _to_float(response_map.get("functional_capacity_mets"))

    if mets is not None:
        return {
            "score_type": ScoreType.DUKE,
            "score_value": str(mets),
            "score_details": {
                "method": "direct_mets_input",
                "source": "functional_capacity_mets",
            },
        }

    # Values aligned with the score reference document
    activity_weights = {
        "self_care": 2.75,
        "walk_inside": 1.75,
        "walk_200m": 2.75,
        "climb_stairs": 5.50,
        "run_short_distance": 8.00,
        "light_housework": 2.70,
        "moderate_housework": 3.50,
        "heavy_housework": 8.00,
        "gardening": 4.50,
        "sexual_activity": 5.25,
        "moderate_recreation": 6.00,
        "intense_sport": 7.50,
    }

    best_mets = 0.0
    positives = []

    for key, mets_value in activity_weights.items():
        if _is_true(response_map.get(key, "")):
            best_mets = max(best_mets, mets_value)
            positives.append(key)

    if best_mets > 0:
        return {
            "score_type": ScoreType.DUKE,
            "score_value": str(best_mets),
            "score_details": {
                "method": "derived_from_activity",
                "positive_items": positives,
            },
        }

    return {
        "score_type": ScoreType.DUKE,
        "score_value": "UNKNOWN",
        "score_details": {"reason": "missing input"},
    }


# =========================
# STOP-BANG
# =========================
def compute_stop_bang(response_map: Dict[str, str]) -> dict:
    score = 0
    matched = []

    if _normalize_answer(response_map.get("snoring", "")) in {
        "always",
        "toujours",
        "true",
        "yes",
        "1",
    }:
        score += 1
        matched.append("snoring")

    if _is_true(response_map.get("daytime_tiredness", "")):
        score += 1
        matched.append("daytime_tiredness")

    if _is_true(response_map.get("observed_apnea", "")):
        score += 1
        matched.append("observed_apnea")

    if _is_true(response_map.get("hypertension", "")):
        score += 1
        matched.append("hypertension")

    bmi = None
    weight = _to_float(response_map.get("weight"))
    height_cm = _to_float(response_map.get("height"))

    if weight is not None and height_cm and height_cm > 0:
        height_m = height_cm / 100.0
        bmi = weight / (height_m * height_m)
        if bmi > 35:
            score += 1
            matched.append("bmi_over_35")

    age = _to_float(response_map.get("age"))
    if age is not None and age > 50:
        score += 1
        matched.append("age_over_50")

    # Current seed has female_gender but not male_gender.
    # Support both if data exists.
    if _is_true(response_map.get("male_gender", "")):
        score += 1
        matched.append("male_gender")

    return {
        "score_type": ScoreType.STOP_BANG,
        "score_value": str(score),
        "score_details": {
            "positive_items": matched,
            "bmi": bmi,
            "note": "neck circumference and male sex may be undercounted if not collected",
        },
    }


# =========================
# APFEL
# =========================
def compute_apfel(response_map: Dict[str, str]) -> dict:
    score = 0
    matched = []

    if _is_true(response_map.get("female_gender", "")):
        score += 1
        matched.append("female_gender")

    if _is_true(response_map.get("non_smoker", "")):
        score += 1
        matched.append("non_smoker")

    if _is_true(response_map.get("history_ponv", "")) or _is_true(response_map.get("motion_sickness", "")):
        score += 1
        matched.append("history_ponv_or_motion_sickness")

    if _is_true(response_map.get("postop_opioids", "")):
        score += 1
        matched.append("postop_opioids")

    return {
        "score_type": ScoreType.APFEL,
        "score_value": str(score),
        "score_details": {"positive_items": matched},
    }


# =========================
# NYHA (simplified)
# =========================
def compute_nyha(response_map: Dict[str, str]) -> dict:
    if _is_true(response_map.get("symptoms_at_rest", "")):
        value = "IV"
    elif _is_true(response_map.get("symptoms_moderate_activity", "")):
        value = "III"
    elif _is_true(response_map.get("symptoms_usual_activity", "")):
        value = "II"
    else:
        value = "I"

    return {
        "score_type": ScoreType.NYHA,
        "score_value": value,
        "score_details": {"method": "symptom_based_simplified"},
    }


def compute_placeholder(score_type: str) -> dict:
    return {
        "score_type": score_type,
        "score_value": "PENDING",
        "score_details": {"status": "algorithm not implemented yet"},
    }


def compute_all_scores(questionnaire) -> list:
    response_map = build_response_map(questionnaire)

    return [
        compute_duke(response_map),
        compute_stop_bang(response_map),
        compute_apfel(response_map),
        compute_nyha(response_map),
        compute_placeholder(ScoreType.LEE),
        compute_placeholder(ScoreType.GOLD),
        compute_placeholder(ScoreType.CHILD_PUGH),
        compute_placeholder(ScoreType.CHA2DS2_VASC),
        compute_placeholder(ScoreType.ARISCAT),
    ]