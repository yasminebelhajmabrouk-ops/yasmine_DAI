from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("common.urls")),
    path("api/", include("patient.urls")),
    path("api/", include("casefile.urls")),
    path("api/", include("preop.urls")),
]