from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from audit.services import create_audit_log
from .models import Patient
from .serializers import PatientSerializer


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        patient = serializer.save()
        create_audit_log(
            action="CREATE",
            entity_type="Patient",
            entity_id=str(patient.id),
            details={
                "first_name": patient.first_name,
                "last_name": patient.last_name,
            },
        )