from django.urls import path

from .views import PostOpCaseViewSet

postop_summary = PostOpCaseViewSet.as_view({"get": "summary"})
postop_start_stay = PostOpCaseViewSet.as_view({"post": "start_stay"})
postop_end_stay = PostOpCaseViewSet.as_view({"post": "end_stay"})
postop_observations = PostOpCaseViewSet.as_view({"get": "observations", "post": "observations"})
postop_aldrete = PostOpCaseViewSet.as_view({"get": "aldrete"})

urlpatterns = [
    path("cases/<uuid:pk>/postop/summary/", postop_summary, name="postop-summary"),
    path("cases/<uuid:pk>/postop/stay/start/", postop_start_stay, name="postop-stay-start"),
    path("cases/<uuid:pk>/postop/stay/end/", postop_end_stay, name="postop-stay-end"),
    path("cases/<uuid:pk>/postop/observations/", postop_observations, name="postop-observations"),
    path("cases/<uuid:pk>/postop/scores/aldrete/", postop_aldrete, name="postop-aldrete"),
]