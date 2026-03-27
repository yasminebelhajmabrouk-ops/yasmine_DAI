from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import PreOpQuestionnaire, PreOpQuestionnaireResponse, ClinicalScore
from .serializers import (
    PreOpQuestionnaireSerializer,
    PreOpQuestionnaireResponseSerializer,
    ClinicalScoreSerializer,
)
from .scoring_engine import compute_all_scores


class PreOpQuestionnaireViewSet(viewsets.ModelViewSet):
    queryset = PreOpQuestionnaire.objects.select_related("anesthesia_case").prefetch_related("responses")
    serializer_class = PreOpQuestionnaireSerializer
    permission_classes = [AllowAny]

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

        serializer = ClinicalScoreSerializer(created_scores, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PreOpQuestionnaireResponseViewSet(viewsets.ModelViewSet):
    queryset = PreOpQuestionnaireResponse.objects.select_related("questionnaire").all()
    serializer_class = PreOpQuestionnaireResponseSerializer
    permission_classes = [AllowAny]


class ClinicalScoreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ClinicalScore.objects.select_related("anesthesia_case").all()
    serializer_class = ClinicalScoreSerializer
    permission_classes = [AllowAny]