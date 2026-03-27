from typing import Dict

from .models import ScoreType


def _normalize_answer(value: str) -> str:
    return (value or "").strip().lower()


def build_response_map(questionnaire) -> Dict[str, str]:
    return {
        response.question_code: response.answer_value
        for response in questionnaire.responses.all()
    }


def compute_duke(response_map: Dict[str, str]) -> dict:
    mets = response_map.get("functional_capacity_mets", "")
    if mets:
        return {
            "score_type": ScoreType.DUKE,
            "score_value": mets,
            "score_details": {"source": "functional_capacity_mets"},
        }
    return {
        "score_type": ScoreType.DUKE,
        "score_value": "UNKNOWN",
        "score_details": {"reason": "missing input"},
    }


def compute_stop_bang(response_map: Dict[str, str]) -> dict:
    score = 0
    keys = [
        "snoring",
        "daytime_tiredness",
        "observed_apnea",
        "hypertension",
        "bmi_over_35",
        "age_over_50",
        "neck_large",
        "male_gender",
    ]
    matched = []

    for key in keys:
        if _normalize_answer(response_map.get(key, "")) in {"true", "yes", "1"}:
            score += 1
            matched.append(key)

    return {
        "score_type": ScoreType.STOP_BANG,
        "score_value": str(score),
        "score_details": {"positive_items": matched},
    }


def compute_apfel(response_map: Dict[str, str]) -> dict:
    score = 0
    matched = []

    rules = {
        "female_gender": "female_gender",
        "non_smoker": "non_smoker",
        "history_ponv": "history_ponv",
        "postop_opioids": "postop_opioids",
    }

    for key, detail in rules.items():
        if _normalize_answer(response_map.get(key, "")) in {"true", "yes", "1"}:
            score += 1
            matched.append(detail)

    return {
        "score_type": ScoreType.APFEL,
        "score_value": str(score),
        "score_details": {"positive_items": matched},
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
        compute_placeholder(ScoreType.LEE),
        compute_placeholder(ScoreType.GOLD),
        compute_placeholder(ScoreType.CHILD_PUGH),
        compute_placeholder(ScoreType.NYHA),
        compute_placeholder(ScoreType.CHA2DS2_VASC),
        compute_placeholder(ScoreType.ARISCAT),
    ]