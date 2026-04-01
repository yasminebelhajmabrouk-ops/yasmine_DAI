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

    neck_circumference = _to_float(response_map.get("neck_circumference_cm"))
    if neck_circumference is not None and neck_circumference > 40:
        score += 1
        matched.append("neck_circumference_over_40")

    if _is_true(response_map.get("male_gender", "")):
        score += 1
        matched.append("male_gender")

    return {
        "score_type": ScoreType.STOP_BANG,
        "score_value": str(score),
        "score_details": {
            "positive_items": matched,
            "bmi": bmi,
            "neck_circumference_cm": neck_circumference,
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


# =========================
# LEE / RCRI
# =========================
def compute_lee(response_map: Dict[str, str]) -> dict:
    score = 0
    matched = []

    if _is_true(response_map.get("high_risk_surgery", "")):
        score += 1
        matched.append("high_risk_surgery")

    if _is_true(response_map.get("ischemic_heart_disease", "")):
        score += 1
        matched.append("ischemic_heart_disease")

    if _is_true(response_map.get("heart_failure", "")):
        score += 1
        matched.append("heart_failure")

    if _is_true(response_map.get("stroke_history", "")):
        score += 1
        matched.append("stroke_history")

    if _is_true(response_map.get("diabetes_on_insulin", "")):
        score += 1
        matched.append("diabetes_on_insulin")

    creatinine = _to_float(response_map.get("creatinine_mg_dl"))
    if creatinine is not None and creatinine > 2.0:
        score += 1
        matched.append("creatinine_over_2")

    return {
        "score_type": ScoreType.LEE,
        "score_value": str(score),
        "score_details": {
            "positive_items": matched,
            "creatinine_mg_dl": creatinine,
        },
    }


# =========================
# CHA2DS2-VASc
# =========================
def compute_cha2ds2_vasc(response_map: Dict[str, str]) -> dict:
    score = 0
    matched = []

    if _is_true(response_map.get("heart_failure", "")):
        score += 1
        matched.append("heart_failure")

    if _is_true(response_map.get("hypertension", "")):
        score += 1
        matched.append("hypertension")

    age = _to_float(response_map.get("age"))
    if age is not None:
        if age >= 75:
            score += 2
            matched.append("age_75_or_more")
        elif 65 <= age <= 74:
            score += 1
            matched.append("age_65_to_74")

    if _is_true(response_map.get("diabetes", "")):
        score += 1
        matched.append("diabetes")

    if _is_true(response_map.get("stroke_history", "")):
        score += 2
        matched.append("stroke_history")

    if _is_true(response_map.get("vascular_disease", "")):
        score += 1
        matched.append("vascular_disease")

    if _is_true(response_map.get("female_gender", "")):
        score += 1
        matched.append("female_gender")

    return {
        "score_type": ScoreType.CHA2DS2_VASC,
        "score_value": str(score),
        "score_details": {
            "positive_items": matched,
            "age": age,
        },
    }


# =========================
# ARISCAT
# =========================
def compute_ariscat(response_map: Dict[str, str]) -> dict:
    score = 0
    matched = []

    spo2 = _to_float(response_map.get("preop_spo2"))
    if spo2 is not None:
        if spo2 <= 90:
            score += 24
            matched.append("spo2_90_or_less")
        elif 91 <= spo2 <= 95:
            score += 8
            matched.append("spo2_91_95")

    age = _to_float(response_map.get("age"))
    if age is not None:
        if age > 80:
            score += 16
            matched.append("age_over_80")
        elif 51 <= age <= 80:
            score += 3
            matched.append("age_51_80")

    if _is_true(response_map.get("recent_respiratory_infection", "")):
        score += 17
        matched.append("recent_respiratory_infection")

    hb = _to_float(response_map.get("preop_hb"))
    if hb is not None and hb <= 10:
        score += 11
        matched.append("hb_10_or_less")

    incision_site = _normalize_answer(response_map.get("surgical_incision_site", ""))
    if incision_site in {"thoracic", "intrathoracic", "intra-thoracique", "intrathoracique"}:
        score += 24
        matched.append("intrathoracic_incision")
    elif incision_site in {"upper_abdominal", "abdominale_superieure", "abdominale supérieure"}:
        score += 15
        matched.append("upper_abdominal_incision")

    duration = _to_float(response_map.get("surgery_duration_hours"))
    if duration is not None:
        if duration > 3:
            score += 23
            matched.append("duration_over_3h")
        elif 2 <= duration <= 3:
            score += 16
            matched.append("duration_2_to_3h")

    if _is_true(response_map.get("urgent_surgery", "")):
        score += 8
        matched.append("urgent_surgery")

    if score < 26:
        risk_level = "LOW"
    elif score <= 44:
        risk_level = "INTERMEDIATE"
    else:
        risk_level = "HIGH"

    return {
        "score_type": ScoreType.ARISCAT,
        "score_value": str(score),
        "score_details": {
            "positive_items": matched,
            "risk_level": risk_level,
            "preop_spo2": spo2,
            "preop_hb": hb,
            "age": age,
            "surgery_duration_hours": duration,
            "surgical_incision_site": incision_site,
        },
    }


def compute_placeholder(score_type: str) -> dict:
    return {
        "score_type": score_type,
        "score_value": "PENDING",
        "score_details": {"status": "algorithm not implemented yet"},
    }

def compute_gold(response_map: Dict[str, str]) -> dict:
    fev1 = _to_float(response_map.get("fev1_percent"))
    exacerbations = _to_float(response_map.get("copd_exacerbations_per_year"))
    hospitalized = _is_true(response_map.get("copd_hospitalization_last_year", ""))
    mmrc = _to_float(response_map.get("mmrc_grade"))
    cat = _to_float(response_map.get("cat_score"))

    if fev1 is None:
        return {
            "score_type": ScoreType.GOLD,
            "score_value": "UNKNOWN",
            "score_details": {"reason": "missing fev1_percent"},
        }

    if fev1 >= 80:
        gold_grade = "GOLD 1"
    elif 50 <= fev1 <= 79:
        gold_grade = "GOLD 2"
    elif 30 <= fev1 <= 49:
        gold_grade = "GOLD 3"
    else:
        gold_grade = "GOLD 4"

    high_exacerbation_risk = False
    if exacerbations is not None and exacerbations >= 2:
        high_exacerbation_risk = True
    if hospitalized:
        high_exacerbation_risk = True

    symptomatic = False
    symptom_source = None
    if mmrc is not None:
        symptomatic = mmrc >= 2
        symptom_source = "mmrc"
    elif cat is not None:
        symptomatic = cat >= 10
        symptom_source = "cat"

    if high_exacerbation_risk and symptomatic:
        gold_group = "D"
    elif high_exacerbation_risk and not symptomatic:
        gold_group = "C"
    elif not high_exacerbation_risk and symptomatic:
        gold_group = "B"
    else:
        gold_group = "A"

    return {
        "score_type": ScoreType.GOLD,
        "score_value": gold_grade,
        "score_details": {
            "gold_grade": gold_grade,
            "gold_group": gold_group,
            "fev1_percent": fev1,
            "copd_exacerbations_per_year": exacerbations,
            "copd_hospitalization_last_year": hospitalized,
            "mmrc_grade": mmrc,
            "cat_score": cat,
            "symptom_source": symptom_source,
        },
    }

def compute_child_pugh(response_map: Dict[str, str]) -> dict:
    bilirubin = _to_float(response_map.get("bilirubin_umol_l"))
    albumin = _to_float(response_map.get("albumin_g_l"))
    inr = _to_float(response_map.get("inr"))
    ascites = _normalize_answer(response_map.get("ascites", ""))
    encephalopathy = _normalize_answer(response_map.get("encephalopathy_grade", ""))

    missing = []
    if bilirubin is None:
        missing.append("bilirubin_umol_l")
    if albumin is None:
        missing.append("albumin_g_l")
    if inr is None:
        missing.append("inr")
    if not ascites:
        missing.append("ascites")
    if not encephalopathy:
        missing.append("encephalopathy_grade")

    if missing:
        return {
            "score_type": ScoreType.CHILD_PUGH,
            "score_value": "UNKNOWN",
            "score_details": {"reason": "missing input", "missing_fields": missing},
        }

    # Bilirubin
    if bilirubin < 35:
        bilirubin_points = 1
    elif 35 <= bilirubin <= 50:
        bilirubin_points = 2
    else:
        bilirubin_points = 3

    # Albumin
    if albumin > 35:
        albumin_points = 1
    elif 28 <= albumin <= 35:
        albumin_points = 2
    else:
        albumin_points = 3

    # INR
    if inr < 1.7:
        inr_points = 1
    elif 1.7 <= inr <= 2.3:
        inr_points = 2
    else:
        inr_points = 3

    # Ascites
    if ascites in {"absent", "none", "no", "non", "لا"}:
        ascites_points = 1
    elif ascites in {"moderate", "moderee", "modérée", "وسطة", "متوسطة"}:
        ascites_points = 2
    else:
        ascites_points = 3

    # Encephalopathy
    if encephalopathy in {"absent", "none", "no", "non", "لا"}:
        encephalopathy_points = 1
    elif encephalopathy in {"grade_i_ii", "i_ii", "1_2", "moderate", "moderee", "modérée"}:
        encephalopathy_points = 2
    else:
        encephalopathy_points = 3

    total = (
        bilirubin_points
        + albumin_points
        + inr_points
        + ascites_points
        + encephalopathy_points
    )

    if total <= 6:
        child_class = "A"
    elif total <= 9:
        child_class = "B"
    else:
        child_class = "C"

    return {
        "score_type": ScoreType.CHILD_PUGH,
        "score_value": child_class,
        "score_details": {
            "total_points": total,
            "child_pugh_class": child_class,
            "bilirubin_umol_l": bilirubin,
            "albumin_g_l": albumin,
            "inr": inr,
            "ascites": ascites,
            "encephalopathy_grade": encephalopathy,
            "component_points": {
                "bilirubin": bilirubin_points,
                "albumin": albumin_points,
                "inr": inr_points,
                "ascites": ascites_points,
                "encephalopathy": encephalopathy_points,
            },
        },
    }


def compute_all_scores(questionnaire) -> list:
    response_map = build_response_map(questionnaire)

    return [
        compute_duke(response_map),
        compute_stop_bang(response_map),
        compute_apfel(response_map),
        compute_nyha(response_map),
        compute_lee(response_map),
        compute_gold(response_map),
        compute_child_pugh(response_map),
        compute_cha2ds2_vasc(response_map),
        compute_ariscat(response_map),
    ]
