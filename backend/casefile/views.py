from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from audit.services import create_audit_log
from .models import AnesthesiaCase, CaseStatus
from .serializers import AnesthesiaCaseSerializer, CaseStateTransitionSerializer


class AnesthesiaCaseViewSet(viewsets.ModelViewSet):
    queryset = AnesthesiaCase.objects.select_related("patient").all()
    serializer_class = AnesthesiaCaseSerializer
    permission_classes = [AllowAny]

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

    def perform_update(self, serializer):
        case = serializer.save()
        create_audit_log(
            action="UPDATE",
            entity_type="AnesthesiaCase",
            entity_id=str(case.id),
            details={
                "patient_id": str(case.patient.id),
                "status": case.status,
                "surgery_type": case.surgery_type,
            },
        )

    @action(detail=True, methods=["post"], url_path="state")
    def change_state(self, request, pk=None):
        case = self.get_object()
        serializer = CaseStateTransitionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_status = serializer.validated_data["status"]
        old_status = case.status

        allowed_transitions = {
            CaseStatus.PRE_OP: [CaseStatus.PER_OP],
            CaseStatus.PER_OP: [CaseStatus.POST_OP],
            CaseStatus.POST_OP: [CaseStatus.CLOSED],
            CaseStatus.CLOSED: [],
        }

        if new_status == old_status:
            return Response(
                {"detail": "Case is already in this status."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_status not in allowed_transitions.get(old_status, []):
            return Response(
                {
                    "detail": f"Invalid transition from {old_status} to {new_status}."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        case.status = new_status
        case.save(update_fields=["status", "updated_at"])

        create_audit_log(
            action="STATE_TRANSITION",
            entity_type="AnesthesiaCase",
            entity_id=str(case.id),
            details={
                "patient_id": str(case.patient.id),
                "from_status": old_status,
                "to_status": new_status,
            },
        )

        output_serializer = self.get_serializer(case)
        return Response(output_serializer.data, status=status.HTTP_200_OK)