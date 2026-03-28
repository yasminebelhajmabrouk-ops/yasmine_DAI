from rest_framework.routers import DefaultRouter

from .views import AnesthesiaCaseViewSet

router = DefaultRouter()
router.register(r"cases", AnesthesiaCaseViewSet, basename="case")

urlpatterns = router.urls
