from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import AnesthesiaCase
from .serializers import AnesthesiaCaseSerializer


class AnesthesiaCaseViewSet(viewsets.ModelViewSet):
    queryset = AnesthesiaCase.objects.select_related("patient").all()
    serializer_class = AnesthesiaCaseSerializer
    permission_classes = [AllowAny]
    