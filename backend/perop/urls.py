from django.urls import path

from .views import PerOpCaseViewSet

perop_summary = PerOpCaseViewSet.as_view({"get": "summary"})
perop_start_session = PerOpCaseViewSet.as_view({"post": "start_session"})
perop_end_session = PerOpCaseViewSet.as_view({"post": "end_session"})
perop_vitals = PerOpCaseViewSet.as_view({"get": "vitals", "post": "vitals"})
perop_events = PerOpCaseViewSet.as_view({"get": "events", "post": "events"})

urlpatterns = [
    path("cases/<uuid:pk>/perop/summary/", perop_summary, name="perop-summary"),
    path("cases/<uuid:pk>/perop/sessions/start/", perop_start_session, name="perop-session-start"),
    path("cases/<uuid:pk>/perop/sessions/end/", perop_end_session, name="perop-session-end"),
    path("cases/<uuid:pk>/perop/vitals/", perop_vitals, name="perop-vitals"),
    path("cases/<uuid:pk>/perop/events/", perop_events, name="perop-events"),
]