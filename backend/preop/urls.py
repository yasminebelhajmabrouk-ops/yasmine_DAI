from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    QuestionTemplateViewSet,
    PreOpQuestionnaireViewSet,
    PreOpQuestionnaireResponseViewSet,
    ClinicalScoreViewSet,
    ComputeScoresStandaloneView,
    DicomView
)

router = DefaultRouter()
router.register(r"question-templates", QuestionTemplateViewSet, basename="question-template")
router.register(r"preop-questionnaires", PreOpQuestionnaireViewSet, basename="preop-questionnaire")
router.register(r"preop-responses", PreOpQuestionnaireResponseViewSet, basename="preop-response")
router.register(r"clinical-scores", ClinicalScoreViewSet, basename="clinical-score")

urlpatterns = [
    path("compute-scores-standalone/", ComputeScoresStandaloneView.as_view(), name="compute-scores-standalone"),
    path("dicom-view/", DicomView.as_view(), name="dicom-view"),
    path("", include(router.urls)),
]