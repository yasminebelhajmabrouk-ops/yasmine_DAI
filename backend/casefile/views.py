from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from audit.services import create_audit_log
from .models import AnesthesiaCase
from .serializers import AnesthesiaCaseSerializer


class AnesthesiaCaseViewSet(viewsets.ModelViewSet):
    queryset = AnesthesiaCase.objects.select_related("patient").all()
    serializer_class = AnesthesiaCaseSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = AnesthesiaCase.objects.select_related("patient").all()
        patient_id = self.request.query_params.get("patient")
        if patient_id:
            queryset = queryset.filter(patient__id=patient_id)
        return queryset


    def perform_create(self, serializer):
        case = serializer.save()
        create_audit_log(
            action="CREATE",
            entity_type="AnesthesiaCase",
            entity_id=str(case.id),
            details={
                "patient_id": str(case.patient.id),
                "status": case.status,
                "surgery_type": case.surgery_type,
            },
        )