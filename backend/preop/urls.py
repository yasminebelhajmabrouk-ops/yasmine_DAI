from rest_framework.routers import DefaultRouter

from .views import (
    PreOpQuestionnaireViewSet,
    PreOpQuestionnaireResponseViewSet,
    ClinicalScoreViewSet,
)

router = DefaultRouter()
router.register(r"preop-questionnaires", PreOpQuestionnaireViewSet, basename="preop-questionnaire")
router.register(r"preop-responses", PreOpQuestionnaireResponseViewSet, basename="preop-response")
router.register(r"clinical-scores", ClinicalScoreViewSet, basename="clinical-score")

urlpatterns = router.urls