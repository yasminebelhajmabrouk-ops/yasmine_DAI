from preop.models import QuestionTemplate, AnswerType


QUESTIONS = [
    # =========================
    # Identity / context
    # =========================
    {
        "section": "identity_context",
        "question_code": "patient_name",
        "label_fr": "Nom et prénom",
        "label_ar": "الاسم واللقب",
        "answer_type": AnswerType.TEXT,
        "is_required": True,
        "used_for_scores": False,
    },
    {
        "section": "identity_context",
        "question_code": "age",
        "label_fr": "Âge",
        "label_ar": "العمر",
        "answer_type": AnswerType.NUMBER,
        "is_required": True,
        "used_for_scores": True,
    },
    {
        "section": "identity_context",
        "question_code": "male_gender",
        "label_fr": "Sexe Masculin",
        "label_ar": "جنس ذكر",
        "answer_type": AnswerType.BOOLEAN,
        "is_required": True,
        "used_for_scores": True,
    },
    {
        "section": "identity_context",
        "question_code": "procedure_type",
        "label_fr": "Nature de l’acte",
        "label_ar": "نوع العملية",
        "answer_type": AnswerType.TEXT,
        "is_required": True,
        "used_for_scores": False,
    },
    {
        "section": "identity_context",
        "question_code": "high_risk_surgery",
        "label_fr": "Chirurgie à haut risque (ex: thoracique, abdominale supra-ombilicale)",
        "label_ar": "جراحة عالية الخطورة",
        "answer_type": AnswerType.BOOLEAN,
        "is_required": False,
        "used_for_scores": True,
    },
    {
        "section": "identity_context",
        "question_code": "weight",
        "label_fr": "Poids (kg)",
        "label_ar": "الوزن (كغ)",
        "answer_type": AnswerType.NUMBER,
        "is_required": False,
        "used_for_scores": True,
    },
    {
        "section": "identity_context",
        "question_code": "height",
        "label_fr": "Taille (cm)",
        "label_ar": "الطول (سم)",
        "answer_type": AnswerType.NUMBER,
        "is_required": False,
        "used_for_scores": True,
    },

    # =========================
    # Medical history
    # =========================
    {"section": "medical_history", "question_code": "hypertension", "label_fr": "Hypertension artérielle", "label_ar": "ارتفاع ضغط الدم", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "medical_history", "question_code": "asthma", "label_fr": "Asthme", "label_ar": "الربو", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "medical_history", "question_code": "history_ischemic_heart_disease", "label_fr": "Maladie cardiaque ischémique (Infarctus, Angine de poitrine)", "label_ar": "مرض القلب الإقفاري", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "medical_history", "question_code": "history_congestive_heart_failure", "label_fr": "Insuffisance cardiaque congestive", "label_ar": "فشل القلب", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "medical_history", "question_code": "history_cerebrovascular_disease", "label_fr": "Maladie cérébrovasculaire (AVC, AIT)", "label_ar": "أمراض الأوعية الدموية الدماغية", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "medical_history", "question_code": "diabetes", "label_fr": "Diabète", "label_ar": "السكري", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "medical_history", "question_code": "diabetes_insulin", "label_fr": "Diabète insulinodépendant", "label_ar": "السكري المعتمد على الأنسولين", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "medical_history", "question_code": "renal_failure", "label_fr": "Insuffisance rénale", "label_ar": "قصور كلوي", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "medical_history", "question_code": "creatinine", "label_fr": "Créatinine sérique (mg/dL ou µmol/L)", "label_ar": "الكرياتينين", "answer_type": AnswerType.NUMBER, "is_required": False, "used_for_scores": True},
    {"section": "medical_history", "question_code": "epilepsy", "label_fr": "Epilepsie", "label_ar": "الصرع", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "medical_history", "question_code": "dyslipidemia", "label_fr": "Dyslipidémie", "label_ar": "ارتفاع الدهون", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "medical_history", "question_code": "anemia", "label_fr": "Anémie", "label_ar": "فقر الدم", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "medical_history", "question_code": "psychiatric_disorder", "label_fr": "Troubles psychiatriques", "label_ar": "اضطرابات نفسية", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "medical_history", "question_code": "cardiopathy", "label_fr": "Cardiopathie", "label_ar": "أمراض القلب", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "medical_history", "question_code": "gastric_ulcer", "label_fr": "Ulcère gastrique", "label_ar": "قرحة في المعدة", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "medical_history", "question_code": "endocrine_disease", "label_fr": "Endocrinopathie", "label_ar": "أمراض الغدد", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "medical_history", "question_code": "other_disease", "label_fr": "Autres maladies", "label_ar": "مرض آخر", "answer_type": AnswerType.TEXT, "is_required": False, "used_for_scores": False},

    # =========================
    # Dialysis
    # =========================
    {"section": "dialysis", "question_code": "dialysis_required", "label_fr": "Dialyse nécessaire", "label_ar": "هل يتطلب الغسيل الكلوي", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "dialysis", "question_code": "dialysis_days", "label_fr": "Jours de dialyse", "label_ar": "أيام الغسيل الكلوي", "answer_type": AnswerType.CHOICE, "is_required": False, "used_for_scores": False, "choices": [{"value": "mon_wed_fri", "label_fr": "Lun / Mer / Ven", "label_ar": "الاثنين / الأربعاء / الجمعة"}, {"value": "tue_thu_sat", "label_fr": "Mar / Jeu / Sam", "label_ar": "الثلاثاء / الخميس / السبت"}]},
    {"section": "dialysis", "question_code": "av_fistula", "label_fr": "Fistule artério-veineuse", "label_ar": "ناسور وريدي شرياني", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "dialysis", "question_code": "av_fistula_side", "label_fr": "Localisation de la fistule", "label_ar": "موقع الناسور", "answer_type": AnswerType.CHOICE, "is_required": False, "used_for_scores": False, "choices": [{"value": "left_arm", "label_fr": "Bras gauche", "label_ar": "الذراع الأيسر"}, {"value": "right_arm", "label_fr": "Bras droit", "label_ar": "الذراع الأيمن"}]},

    # =========================
    # Treatment
    # =========================
    {"section": "treatment", "question_code": "current_treatment", "label_fr": "Traitements en cours", "label_ar": "الأدوية الحالية", "answer_type": AnswerType.TEXT, "is_required": False, "used_for_scores": False},

    # =========================
    # Surgical / anesthesia history
    # =========================
    {"section": "surgical_history", "question_code": "previous_surgery", "label_fr": "Opérations antérieures", "label_ar": "هل أجرى عمليات جراحية قبل الآن", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "surgical_history", "question_code": "previous_surgery_details", "label_fr": "Détails opérations antérieures", "label_ar": "حدد العمليات السابقة", "answer_type": AnswerType.TEXT, "is_required": False, "used_for_scores": False},
    {"section": "anesthesia_history", "question_code": "previous_anesthesia_type", "label_fr": "Type d’anesthésie antérieure", "label_ar": "نوع التبنيج السابق", "answer_type": AnswerType.TEXT, "is_required": False, "used_for_scores": False},
    {"section": "anesthesia_history", "question_code": "anesthesia_other_reason", "label_fr": "Anesthésie pour autre raison", "label_ar": "هل احتاج للتبنيج لغرض آخر", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "anesthesia_history", "question_code": "anesthesia_complications", "label_fr": "Complications anesthésiques", "label_ar": "مضاعفات أثناء أو بعد التبنيج", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "hospitalization_history", "question_code": "prior_hospitalization", "label_fr": "Hospitalisation antérieure", "label_ar": "الإقامة السابقة بالمستشفى", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},

    # =========================
    # Allergy / habits
    # =========================
    {"section": "allergies", "question_code": "drug_allergy", "label_fr": "Allergie médicamenteuse", "label_ar": "حساسية ضد الأدوية", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "allergies", "question_code": "drug_allergy_details", "label_fr": "Détails allergie", "label_ar": "حدد الحساسية", "answer_type": AnswerType.TEXT, "is_required": False, "used_for_scores": False},
    {"section": "habits", "question_code": "smoker", "label_fr": "Fumeur", "label_ar": "يدخن", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "habits", "question_code": "cigarettes_per_day", "label_fr": "Nombre de cigarettes par jour", "label_ar": "عدد السجائر في اليوم", "answer_type": AnswerType.NUMBER, "is_required": False, "used_for_scores": False},
    {"section": "habits", "question_code": "smoking_years", "label_fr": "Années de tabagisme", "label_ar": "عدد سنوات التدخين", "answer_type": AnswerType.NUMBER, "is_required": False, "used_for_scores": False},
    {"section": "habits", "question_code": "alcohol_use", "label_fr": "Alcool", "label_ar": "يتعاطى الكحول", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},

    # =========================
    # Bleeding risk
    # =========================
    {"section": "bleeding_risk", "question_code": "recurrent_bleeding", "label_fr": "Saignement répété", "label_ar": "نزيف متكرر", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "bleeding_risk", "question_code": "prolonged_wound_bleeding", "label_fr": "Saignement prolongé d’une plaie", "label_ar": "انقطاع الدم عن الجروح مدة طويلة", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "bleeding_risk", "question_code": "easy_bruising", "label_fr": "Ecchymoses fréquentes", "label_ar": "ظهور الكدمات بدون سبب", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "bleeding_risk", "question_code": "surgical_bleeding_history", "label_fr": "Hémorragie inhabituelle lors d’un acte", "label_ar": "نزيف غير معتاد أثناء عملية", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "bleeding_risk", "question_code": "blood_transfusion_history", "label_fr": "Transfusion antérieure", "label_ar": "تم نقل الدم", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "bleeding_risk", "question_code": "family_coagulation_disorder", "label_fr": "Trouble de coagulation familial", "label_ar": "اضطراب تخثر الدم عند أحد الأقارب", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},

    # =========================
    # Family history
    # =========================
    {"section": "family_history", "question_code": "family_muscle_disease", "label_fr": "Maladie musculaire héréditaire familiale", "label_ar": "مرض عضلي وراثي عند أحد الأقارب", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "family_history", "question_code": "family_anesthesia_complication", "label_fr": "Incident anesthésique familial", "label_ar": "مضاعفات بسبب التبنيج عند أحد الأقارب", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},

    # =========================
    # Functional capacity / symptoms
    # =========================
    {"section": "functional_capacity", "question_code": "difficulty_two_floors", "label_fr": "Difficulté à monter deux étages", "label_ar": "صعوبة صعود طابقين", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "functional_capacity", "question_code": "difficulty_one_floor", "label_fr": "Difficulté à monter un étage", "label_ar": "صعوبة صعود طابق", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "functional_capacity", "question_code": "dyspnea_effort", "label_fr": "Dyspnée à l’effort", "label_ar": "ضيق في التنفس عند المجهود", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "functional_capacity", "question_code": "chest_pain_effort", "label_fr": "Douleur thoracique à l’effort", "label_ar": "آلام في الصدر عند المجهود", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "functional_capacity", "question_code": "functional_capacity_mets", "label_fr": "Capacité fonctionnelle (METs)", "label_ar": "القدرة الوظيفية (METs)", "answer_type": AnswerType.NUMBER, "is_required": False, "used_for_scores": True},

    # =========================
    # Sleep apnea / STOP-BANG
    # =========================
    {"section": "sleep_apnea", "question_code": "snoring", "label_fr": "Ronflement", "label_ar": "الشخير", "answer_type": AnswerType.CHOICE, "is_required": False, "used_for_scores": True, "choices": [{"value": "never", "label_fr": "Jamais", "label_ar": "أبداً"}, {"value": "sometimes", "label_fr": "Parfois", "label_ar": "أحياناً"}, {"value": "always", "label_fr": "Toujours", "label_ar": "دائماً"}]},
    {"section": "sleep_apnea", "question_code": "observed_apnea", "label_fr": "Apnées observées", "label_ar": "انقطاع التنفس أثناء النوم", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "sleep_apnea", "question_code": "daytime_tiredness", "label_fr": "Somnolence / fatigue diurne", "label_ar": "النعاس أثناء النهار", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},

    # =========================
    # Cardio symptoms / rhythm
    # =========================
    {"section": "cardio_symptoms", "question_code": "palpitations", "label_fr": "Palpitations", "label_ar": "تسارع في دقات القلب", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "cardio_symptoms", "question_code": "dizziness", "label_fr": "Vertiges / syncope", "label_ar": "دوار", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "cardio_symptoms", "question_code": "usual_blood_pressure", "label_fr": "Chiffres tensionnels habituels", "label_ar": "درجات ضغط الدم المعتادة", "answer_type": AnswerType.TEXT, "is_required": False, "used_for_scores": False},

    # =========================
    # Dental / spine / airway
    # =========================
    {"section": "airway_spine", "question_code": "dental_prosthesis", "label_fr": "Prothèse dentaire", "label_ar": "أسنان اصطناعية", "answer_type": AnswerType.CHOICE, "is_required": False, "used_for_scores": False, "choices": [{"value": "none", "label_fr": "Aucune", "label_ar": "لا يوجد"}, {"value": "fixed", "label_fr": "Fixe", "label_ar": "طقم ثابت"}, {"value": "removable", "label_fr": "Amovible", "label_ar": "طقم متحرك"}]},
    {"section": "airway_spine", "question_code": "spine_problem", "label_fr": "Pathologie rachidienne", "label_ar": "مشاكل في العمود الفقري", "answer_type": AnswerType.TEXT, "is_required": False, "used_for_scores": False},
    {"section": "airway_spine", "question_code": "mallampati_class", "label_fr": "Classe de Mallampati", "label_ar": "درجة مالامباتي", "answer_type": AnswerType.CHOICE, "is_required": False, "used_for_scores": True, "choices": [{"value": "I", "label_fr": "Classe I", "label_ar": "الدرجة الأولى"}, {"value": "II", "label_fr": "Classe II", "label_ar": "الدرجة الثانية"}, {"value": "III", "label_fr": "Classe III", "label_ar": "الدرجة الثالثة"}, {"value": "IV", "label_fr": "Classe IV", "label_ar": "الدرجة الرابعة"}]},
    {"section": "airway_spine", "question_code": "asa_physical_status", "label_fr": "Score ASA", "label_ar": "درجة ASA", "answer_type": AnswerType.CHOICE, "is_required": False, "used_for_scores": True, "choices": [{"value": "I", "label_fr": "ASA I", "label_ar": "ASA I"}, {"value": "II", "label_fr": "ASA II", "label_ar": "ASA II"}, {"value": "III", "label_fr": "ASA III", "label_ar": "ASA III"}, {"value": "IV", "label_fr": "ASA IV", "label_ar": "ASA IV"}]},

    # =========================
    # Duke / activity profile
    # =========================
    {"section": "duke_activity", "question_code": "self_care", "label_fr": "Autonomie personnelle", "label_ar": "هل تعتني بنفسك", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "duke_activity", "question_code": "walk_inside", "label_fr": "Marche à l'intérieur", "label_ar": "هل تمشي بالداخل", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "duke_activity", "question_code": "walk_200m", "label_fr": "Marche 200 m", "label_ar": "هل تمشي مسافة 200 متر", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "duke_activity", "question_code": "climb_stairs", "label_fr": "Monter un étage", "label_ar": "هل تصعد الدرج أو هضبة", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "duke_activity", "question_code": "run_short_distance", "label_fr": "Courir une courte distance", "label_ar": "هل تجري مسافة قصيرة", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "duke_activity", "question_code": "light_housework", "label_fr": "Travaux légers maison", "label_ar": "أعمال خفيفة بالمنزل", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "duke_activity", "question_code": "moderate_housework", "label_fr": "Travaux modérés maison", "label_ar": "أعمال متوسطة بالمنزل", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "duke_activity", "question_code": "heavy_housework", "label_fr": "Travaux intenses maison", "label_ar": "أعمال مجهدة بالمنزل", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "duke_activity", "question_code": "gardening", "label_fr": "Jardinage", "label_ar": "أعمال الحديقة", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "duke_activity", "question_code": "sexual_activity", "label_fr": "Relations sexuelles", "label_ar": "تقوم بعلاقات جنسية", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "duke_activity", "question_code": "moderate_recreation", "label_fr": "Activités récréatives modérées", "label_ar": "أنشطة ترفيهية", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "duke_activity", "question_code": "intense_sport", "label_fr": "Sports intenses", "label_ar": "رياضة مجهدة", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},

    # =========================
    # PONV / Apfel
    # =========================
    {"section": "ponv", "question_code": "history_ponv", "label_fr": "Nausées/vomissements postopératoires antérieurs", "label_ar": "غثيان و تقيؤ ما بعد العملية", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "ponv", "question_code": "motion_sickness", "label_fr": "Mal des transports", "label_ar": "الدوار عند ركوب وسائل النقل", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "ponv", "question_code": "non_smoker", "label_fr": "Non fumeur", "label_ar": "غير مدخن", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "ponv", "question_code": "postop_opioids", "label_fr": "Opioïdes postopératoires prévus", "label_ar": "استخدام الأفيونات بعد الجراحة", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "ponv", "question_code": "female_gender", "label_fr": "Sexe féminin", "label_ar": "الجنس أنثى", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},

    # =========================
    # NYHA-like symptoms
    # =========================
    {"section": "nyha", "question_code": "symptoms_usual_activity", "label_fr": "Symptômes à l’activité usuelle", "label_ar": "التعب أو ضيق النفس أو ألم الصدر أثناء النشاط اليومي", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "nyha", "question_code": "symptoms_moderate_activity", "label_fr": "Symptômes à activité légère", "label_ar": "الراحة عند عدم القيام بأي عمل لكن عند النشاط اليومي تظهر الأعراض", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},
    {"section": "nyha", "question_code": "symptoms_at_rest", "label_fr": "Symptômes au repos", "label_ar": "الأعراض عند الراحة", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},

    # =========================
    # Peripheral arterial disease / walking pain
    # =========================
    {"section": "vascular", "question_code": "leg_pain_walking", "label_fr": "Douleur des jambes à la marche", "label_ar": "ألم أو تشنج في الساقين عند المشي", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "vascular", "question_code": "leg_pain_distance", "label_fr": "Distance avant douleur", "label_ar": "بعد مسافة كم تبدأ الآلام", "answer_type": AnswerType.CHOICE, "is_required": False, "used_for_scores": False, "choices": [{"value": "less_50m", "label_fr": "< 50m", "label_ar": "أقل من 50 متر"}, {"value": "50_200m", "label_fr": "50-200m", "label_ar": "50-200 متر"}, {"value": "more_200m", "label_fr": "> 200m", "label_ar": "أكثر من 200 متر"}]},

    # =========================
    # Respiratory infection
    # =========================
    {"section": "respiratory", "question_code": "recent_respiratory_infection", "label_fr": "Infection respiratoire récente", "label_ar": "حمى أو عدوى تنفسية خلال الشهر الماضي", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": True},

    # =========================
    # Women
    # =========================
    {"section": "women", "question_code": "pregnant", "label_fr": "Enceinte ou possible grossesse", "label_ar": "هل المريضة حامل", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "women", "question_code": "breastfeeding", "label_fr": "Allaitement", "label_ar": "هل هي مرضع", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "women", "question_code": "pregnancy_count", "label_fr": "Nombre de grossesses", "label_ar": "عدد مرات الحمل", "answer_type": AnswerType.NUMBER, "is_required": False, "used_for_scores": False},
    {"section": "women", "question_code": "delivery_count", "label_fr": "Nombre d’accouchements", "label_ar": "عدد مرات الولادة", "answer_type": AnswerType.NUMBER, "is_required": False, "used_for_scores": False},
    {"section": "women", "question_code": "living_children_count", "label_fr": "Nombre d’enfants vivants", "label_ar": "عدد الأطفال الأحياء", "answer_type": AnswerType.NUMBER, "is_required": False, "used_for_scores": False},

    # =========================
    # Children
    # =========================
    {"section": "children", "question_code": "birth_mode", "label_fr": "Mode de naissance", "label_ar": "ولادة طبيعية أو قيصرية", "answer_type": AnswerType.CHOICE, "is_required": False, "used_for_scores": False, "choices": [{"value": "vaginal", "label_fr": "Vaginale", "label_ar": "ولادة طبيعية"}, {"value": "cesarean", "label_fr": "Césarienne", "label_ar": "عملية قيصرية"}]},
    {"section": "children", "question_code": "premature", "label_fr": "Prématuré", "label_ar": "الطفل المولود قبل أوانه", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "children", "question_code": "parental_consanguinity", "label_fr": "Parents apparentés", "label_ar": "هل للوالدين علاقة قرابة", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "children", "question_code": "hospitalized_after_birth", "label_fr": "Hospitalisation après naissance", "label_ar": "أقام بالمستشفى بعد الولادة", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "children", "question_code": "psychomotor_development_normal", "label_fr": "Développement psychomoteur normal", "label_ar": "هل تطور النمو والحركة عادي", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "children", "question_code": "vaccinations_complete", "label_fr": "Vaccinations complètes", "label_ar": "هل تلقى جميع التلاقيح اللازمة", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "children", "question_code": "febrile_convulsions", "label_fr": "Convulsions fébriles", "label_ar": "حالة صرع ناتجة عن ارتفاع الحرارة", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},

    # =========================
    # Satisfaction patient
    # =========================
    {"section": "patient_satisfaction", "question_code": "info_clarity_satisfaction", "label_fr": "Clarté des informations", "label_ar": "وضوح المعلومات المقدمة", "answer_type": AnswerType.NUMBER, "is_required": False, "used_for_scores": False},
    {"section": "patient_satisfaction", "question_code": "staff_availability_satisfaction", "label_fr": "Disponibilité du personnel", "label_ar": "توافر الموظفين", "answer_type": AnswerType.NUMBER, "is_required": False, "used_for_scores": False},
    {"section": "patient_satisfaction", "question_code": "staff_kindness_satisfaction", "label_fr": "Courtoisie du personnel", "label_ar": "مجاملة وودية الموظفين", "answer_type": AnswerType.NUMBER, "is_required": False, "used_for_scores": False},
    {"section": "patient_satisfaction", "question_code": "anesthetist_communication_satisfaction", "label_fr": "Communication avec l’anesthésiste", "label_ar": "التواصل مع طبيب التخدير", "answer_type": AnswerType.NUMBER, "is_required": False, "used_for_scores": False},
    {"section": "patient_satisfaction", "question_code": "anxiety_management_satisfaction", "label_fr": "Prise en charge des inquiétudes", "label_ar": "الاهتمام بالمخاوف والقلق", "answer_type": AnswerType.NUMBER, "is_required": False, "used_for_scores": False},
    {"section": "patient_satisfaction", "question_code": "global_preanesthetic_experience", "label_fr": "Qualité globale de l’expérience", "label_ar": "الجودة الشاملة لتجربة ما قبل التخدير", "answer_type": AnswerType.NUMBER, "is_required": False, "used_for_scores": False},
    {"section": "patient_satisfaction", "question_code": "recommend_service", "label_fr": "Recommanderiez-vous le service", "label_ar": "هل تنصح الآخرين بخدمة التخدير", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "patient_satisfaction", "question_code": "patient_comment", "label_fr": "Commentaire patient", "label_ar": "تعليقات إضافية", "answer_type": AnswerType.TEXT, "is_required": False, "used_for_scores": False},

    # =========================
    # Satisfaction anesthetist
    # =========================
    {"section": "anesthetist_satisfaction", "question_code": "relevance_of_information", "label_fr": "Pertinence des informations", "label_ar": "أهمية المعلومات المقدمة", "answer_type": AnswerType.NUMBER, "is_required": False, "used_for_scores": False},
    {"section": "anesthetist_satisfaction", "question_code": "clarity_of_medical_history", "label_fr": "Clarté et exhaustivité des antécédents", "label_ar": "وضوح واكتمال التاريخ الطبي", "answer_type": AnswerType.NUMBER, "is_required": False, "used_for_scores": False},
    {"section": "anesthetist_satisfaction", "question_code": "contraindication_detection_efficiency", "label_fr": "Détection des contre-indications", "label_ar": "فعالية الاستبيان في تحديد موانع الاستعمال", "answer_type": AnswerType.NUMBER, "is_required": False, "used_for_scores": False},
    {"section": "anesthetist_satisfaction", "question_code": "adaptation_usefulness", "label_fr": "Utilité pour adapter l’anesthésie", "label_ar": "فائدة المعلومات لتكييف التخدير", "answer_type": AnswerType.NUMBER, "is_required": False, "used_for_scores": False},
    {"section": "anesthetist_satisfaction", "question_code": "ease_of_use", "label_fr": "Facilité d’utilisation", "label_ar": "سهولة الاستخدام والفهم", "answer_type": AnswerType.NUMBER, "is_required": False, "used_for_scores": False},
    {"section": "anesthetist_satisfaction", "question_code": "helps_planning_anesthesia", "label_fr": "Aide à préparer l’anesthésie", "label_ar": "هل يساعدك الاستبيان على التخطيط للتخدير", "answer_type": AnswerType.BOOLEAN, "is_required": False, "used_for_scores": False},
    {"section": "anesthetist_satisfaction", "question_code": "anesthetist_comment", "label_fr": "Commentaire médecin anesthésiste", "label_ar": "تعليقات أو اقتراحات لتحسين الاستبيان", "answer_type": AnswerType.TEXT, "is_required": False, "used_for_scores": False},
]


def run():
    for item in QUESTIONS:
        QuestionTemplate.objects.update_or_create(
            question_code=item["question_code"],
            defaults=item,
        )
    print(f"{len(QUESTIONS)} question templates seeded successfully.")