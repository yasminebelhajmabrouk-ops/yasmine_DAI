from django.urls import path
from .views import health_check, RegisterView, MeView

urlpatterns = [
    path("health/", health_check, name="health_check"),
    path("register/", RegisterView.as_view(), name="register"),
    path("me/", MeView.as_view(), name="me"),
]