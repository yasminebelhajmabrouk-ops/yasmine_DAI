from django.db import models
import uuid

from casefile.models import AnesthesiaCase


class PreOpValidationStatus(models.TextChoices):
    DRAFT = "DRAFT", "Draft"
    SUBMITTED = "SUBMITTED", "Submitted"
    VALIDATED = "VALIDATED", "Validated"
    CORRECTED = "CORRECTED", "Corrected"


class QuestionLanguage(models.TextChoices):
    FR = "fr", "French"
    AR = "ar", "Arabic"


class AnswerType(models.TextChoices):
    BOOLEAN = "BOOLEAN", "Boolean"
    TEXT = "TEXT", "Text"
    NUMBER = "NUMBER", "Number"
    CHOICE = "CHOICE", "Choice"
    MULTI_CHOICE = "MULTI_CHOICE", "Multi choice"
    DATE = "DATE", "Date"


class ScoreType(models.TextChoices):
    DUKE = "DUKE", "Duke / METs"
    LEE = "LEE", "Lee / RCRI"
    STOP_BANG = "STOP_BANG", "STOP-BANG"
    APFEL = "APFEL", "Apfel"
    GOLD = "GOLD", "GOLD"
    CHILD_PUGH = "CHILD_PUGH", "Child-Pugh"
    NYHA = "NYHA", "NYHA"
    CHA2DS2_VASC = "CHA2DS2_VASC", "CHA2DS2-VASc"
    ARISCAT = "ARISCAT", "ARISCAT"
    ALDRETE = "ALDRETE", "Aldrete"


class PreOpQuestionnaire(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    anesthesia_case = models.OneToOneField(
        AnesthesiaCase,
        on_delete=models.CASCADE,
        related_name="preop_questionnaire",
    )
    language = models.CharField(
        max_length=5,
        choices=QuestionLanguage.choices,
        default=QuestionLanguage.FR,
    )
    validation_status = models.CharField(
        max_length=20,
        choices=PreOpValidationStatus.choices,
        default=PreOpValidationStatus.DRAFT,
    )
    submitted_at = models.DateTimeField(null=True, blank=True)
    validated_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "preop_questionnaires"
        ordering = ["-created_at"]

    def __str__(self):
        return f"PreOp Questionnaire {self.id} - {self.anesthesia_case_id}"

class QuestionTemplate(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    section = models.CharField(max_length=100)
    question_code = models.CharField(max_length=100, unique=True)
    label_fr = models.CharField(max_length=255)
    label_ar = models.CharField(max_length=255, blank=True)
    answer_type = models.CharField(
        max_length=20,
        choices=AnswerType.choices,
        default=AnswerType.TEXT,
    )
    is_required = models.BooleanField(default=False)
    used_for_scores = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "question_templates"
        ordering = ["section", "question_code"]

    def __str__(self):
        return f"{self.section} - {self.question_code}"

class PreOpQuestionnaireResponse(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    questionnaire = models.ForeignKey(
        PreOpQuestionnaire,
        on_delete=models.CASCADE,
        related_name="responses",
    )
    section = models.CharField(max_length=100)
    question_code = models.CharField(max_length=100)
    question_label_fr = models.CharField(max_length=255, blank=True)
    question_label_ar = models.CharField(max_length=255, blank=True)
    answer_type = models.CharField(
        max_length=20,
        choices=AnswerType.choices,
        default=AnswerType.TEXT,
    )
    answer_value = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "preop_questionnaire_responses"
        ordering = ["section", "question_code"]
        unique_together = ("questionnaire", "question_code")

    def __str__(self):
        return f"{self.question_code} = {self.answer_value}"


class ClinicalScore(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    anesthesia_case = models.ForeignKey(
        AnesthesiaCase,
        on_delete=models.CASCADE,
        related_name="clinical_scores",
    )
    score_type = models.CharField(
        max_length=30,
        choices=ScoreType.choices,
    )
    score_value = models.CharField(max_length=100)
    score_details = models.JSONField(default=dict, blank=True)
    computed_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "clinical_scores"
        ordering = ["score_type"]
        unique_together = ("anesthesia_case", "score_type")

    def __str__(self):
        return f"{self.score_type}: {self.score_value}"
