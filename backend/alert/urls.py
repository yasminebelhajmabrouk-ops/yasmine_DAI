from django.urls import path

from .views import CaseAlertViewSet, AlertLifecycleViewSet

case_alerts = CaseAlertViewSet.as_view({"get": "alerts", "post": "alerts"})
alert_ack = AlertLifecycleViewSet.as_view({"post": "acknowledge"})
alert_resolve = AlertLifecycleViewSet.as_view({"post": "resolve"})

urlpatterns = [
    path("cases/<uuid:pk>/alerts/", case_alerts, name="case-alerts"),
    path("alerts/<uuid:pk>/ack/", alert_ack, name="alert-ack"),
    path("alerts/<uuid:pk>/resolve/", alert_resolve, name="alert-resolve"),
]