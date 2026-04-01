from rest_framework import serializers

from .models import (
    QuestionTemplate,
    PreOpQuestionnaire,
    PreOpQuestionnaireResponse,
    ClinicalScore,
)


class QuestionTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionTemplate
        fields = [
            "id",
            "section",
            "question_code",
            "label_fr",
            "label_ar",
            "answer_type",
            "is_required",
            "used_for_scores",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


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
        read_only_fields = [
            "id",
            "section",
            "question_label_fr",
            "question_label_ar",
            "answer_type",
            "created_at",
            "updated_at",
        ]

    def validate_question_code(self, value):
        if not QuestionTemplate.objects.filter(
            question_code=value,
            is_active=True,
        ).exists():
            raise serializers.ValidationError("Invalid or inactive question_code.")
        return value

    def create(self, validated_data):
        question_code = validated_data["question_code"]
        template = QuestionTemplate.objects.get(
            question_code=question_code,
            is_active=True,
        )

        validated_data["section"] = template.section
        validated_data["question_label_fr"] = template.label_fr
        validated_data["question_label_ar"] = template.label_ar
        validated_data["answer_type"] = template.answer_type

        return super().create(validated_data)

    def update(self, instance, validated_data):
        question_code = validated_data.get("question_code", instance.question_code)
        template = QuestionTemplate.objects.get(
            question_code=question_code,
            is_active=True,
        )

        validated_data["section"] = template.section
        validated_data["question_label_fr"] = template.label_fr
        validated_data["question_label_ar"] = template.label_ar
        validated_data["answer_type"] = template.answer_type

        return super().update(instance, validated_data)


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


class PreOpQuestionnaireFormSerializer(serializers.Serializer):
    questionnaire = PreOpQuestionnaireSerializer()
    questions = QuestionTemplateSerializer(many=True)
    responses = PreOpQuestionnaireResponseSerializer(many=True)

class BulkQuestionnaireResponseItemSerializer(serializers.Serializer):
    question_code = serializers.CharField(max_length=100)
    answer_value = serializers.CharField(allow_blank=True, required=False, default="")

    def validate_question_code(self, value):
        if not QuestionTemplate.objects.filter(
            question_code=value,
            is_active=True,
        ).exists():
            raise serializers.ValidationError("Invalid or inactive question_code.")
        return value


class BulkQuestionnaireResponseSaveSerializer(serializers.Serializer):
    responses = BulkQuestionnaireResponseItemSerializer(many=True)

    def validate_responses(self, value):
        if not value:
            raise serializers.ValidationError("responses list cannot be empty.")
        return value