from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from audit.services import create_audit_log
from .models import QuestionTemplate, PreOpQuestionnaire, PreOpQuestionnaireResponse, ClinicalScore
from .serializers import (
    QuestionTemplateSerializer,
    PreOpQuestionnaireSerializer,
    PreOpQuestionnaireResponseSerializer,
    ClinicalScoreSerializer,
    PreOpQuestionnaireFormSerializer,
)
from .scoring_engine import compute_all_scores

class QuestionTemplateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = QuestionTemplate.objects.filter(is_active=True).all()
    serializer_class = QuestionTemplateSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        questionnaire = serializer.save()
        create_audit_log(
            action="CREATE",
            entity_type="PreOpQuestionnaire",
            entity_id=str(questionnaire.id),
            details={
                "anesthesia_case_id": str(questionnaire.anesthesia_case.id),
                "language": questionnaire.language,
            },
        )

    @action(detail=True, methods=["post"], url_path="compute-scores")
    def compute_scores(self, request, pk=None):
        questionnaire = self.get_object()
        scores = compute_all_scores(questionnaire)

        created_scores = []
        for score_data in scores:
            score, _ = ClinicalScore.objects.update_or_create(
                anesthesia_case=questionnaire.anesthesia_case,
                score_type=score_data["score_type"],
                defaults={
                    "score_value": score_data["score_value"],
                    "score_details": score_data["score_details"],
                },
            )
            created_scores.append(score)

        create_audit_log(
            action="COMPUTE_SCORES",
            entity_type="PreOpQuestionnaire",
            entity_id=str(questionnaire.id),
            details={
                "anesthesia_case_id": str(questionnaire.anesthesia_case.id),
                "score_count": len(created_scores),
            },
        )

        serializer = ClinicalScoreSerializer(created_scores, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PreOpQuestionnaireViewSet(viewsets.ModelViewSet):
    queryset = PreOpQuestionnaire.objects.select_related("anesthesia_case").prefetch_related("responses")
    serializer_class = PreOpQuestionnaireSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        questionnaire = serializer.save()
        create_audit_log(
            action="CREATE",
            entity_type="PreOpQuestionnaire",
            entity_id=str(questionnaire.id),
            details={
                "anesthesia_case_id": str(questionnaire.anesthesia_case.id),
                "language": questionnaire.language,
            },
        )

    @action(detail=True, methods=["post"], url_path="compute-scores")
    def compute_scores(self, request, pk=None):
        questionnaire = self.get_object()
        scores = compute_all_scores(questionnaire)

        created_scores = []
        for score_data in scores:
            score, _ = ClinicalScore.objects.update_or_create(
                anesthesia_case=questionnaire.anesthesia_case,
                score_type=score_data["score_type"],
                defaults={
                    "score_value": score_data["score_value"],
                    "score_details": score_data["score_details"],
                },
            )
            created_scores.append(score)

        create_audit_log(
            action="COMPUTE_SCORES",
            entity_type="PreOpQuestionnaire",
            entity_id=str(questionnaire.id),
            details={
                "anesthesia_case_id": str(questionnaire.anesthesia_case.id),
                "score_count": len(created_scores),
            },
        )

        serializer = ClinicalScoreSerializer(created_scores, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="form")
    def form(self, request, pk=None):
        questionnaire = self.get_object()

        questions = QuestionTemplate.objects.filter(is_active=True).order_by("section", "question_code")
        responses = questionnaire.responses.all()

        serializer = PreOpQuestionnaireFormSerializer({
            "questionnaire": questionnaire,
            "questions": questions,
            "responses": responses,
        })
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class PreOpQuestionnaireResponseViewSet(viewsets.ModelViewSet):
    queryset = PreOpQuestionnaireResponse.objects.select_related("questionnaire").all()
    serializer_class = PreOpQuestionnaireResponseSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        response = serializer.save()
        create_audit_log(
            action="CREATE",
            entity_type="PreOpQuestionnaireResponse",
            entity_id=str(response.id),
            details={
                "questionnaire_id": str(response.questionnaire.id),
                "question_code": response.question_code,
            },
        )


class ClinicalScoreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ClinicalScore.objects.select_related("anesthesia_case").all()
    serializer_class = ClinicalScoreSerializer
    permission_classes = [AllowAny]