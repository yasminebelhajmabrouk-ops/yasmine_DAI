from rest_framework import serializers

from .models import (
    PreOpQuestionnaire,
    PreOpQuestionnaireResponse,
    ClinicalScore,
)


class PreOpQuestionnaireResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreOpQuestionnaireResponse
        fields = [
            "id",
            "questionnaire",
            "section",
            "question_code",
            "question_label_fr",
            "question_label_ar",
            "answer_type",
            "answer_value",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class ClinicalScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClinicalScore
        fields = [
            "id",
            "anesthesia_case",
            "score_type",
            "score_value",
            "score_details",
            "computed_at",
        ]
        read_only_fields = ["id", "computed_at"]


class PreOpQuestionnaireSerializer(serializers.ModelSerializer):
    case_id = serializers.UUIDField(source="anesthesia_case.id", read_only=True)
    responses = PreOpQuestionnaireResponseSerializer(many=True, read_only=True)

    class Meta:
        model = PreOpQuestionnaire
        fields = [
            "id",
            "anesthesia_case",
            "case_id",
            "language",
            "validation_status",
            "submitted_at",
            "validated_at",
            "created_at",
            "updated_at",
            "responses",
        ]
        read_only_fields = ["id", "case_id", "created_at", "updated_at"]