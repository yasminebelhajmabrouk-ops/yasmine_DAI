from django.utils import timezone
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from audit.services import create_audit_log
from casefile.models import AnesthesiaCase
from .models import Alert, AlertStatus
from .serializers import (
    AlertSerializer,
    AlertAcknowledgeSerializer,
    AlertResolveSerializer,
)


class CaseAlertViewSet(viewsets.GenericViewSet):
    queryset = AnesthesiaCase.objects.select_related("patient").all()
    permission_classes = [AllowAny]
    serializer_class = serializers.Serializer

    @action(detail=True, methods=["get", "post"], url_path="alerts")
    def alerts(self, request, pk=None):
        case = self.get_object()

        if request.method == "GET":
            queryset = case.alerts.all().order_by("-raised_at")
            serializer = AlertSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        payload = request.data.copy()
        payload["anesthesia_case"] = str(case.id)

        serializer = AlertSerializer(data=payload)
        serializer.is_valid(raise_exception=True)
        alert = serializer.save()

        create_audit_log(
            action="CREATE_ALERT",
            entity_type="Alert",
            entity_id=str(alert.id),
            actor=request.user.username if request.user.is_authenticated else "system",
            details={
                "case_id": str(case.id),
                "patient_id": str(case.patient.id),
                "alert_type": alert.alert_type,
                "severity": alert.severity,
                "status": alert.status,
                "raised_at": alert.raised_at.isoformat(),
            },
        )

        return Response(AlertSerializer(alert).data, status=status.HTTP_201_CREATED)


class AlertLifecycleViewSet(viewsets.GenericViewSet):
    queryset = Alert.objects.select_related("anesthesia_case", "anesthesia_case__patient").all()
    permission_classes = [AllowAny]
    serializer_class = serializers.Serializer

    @action(detail=True, methods=["post"], url_path="ack")
    def acknowledge(self, request, pk=None):
        alert = self.get_object()

        serializer = AlertAcknowledgeSerializer(
            data=request.data,
            context={"alert": alert},
        )
        serializer.is_valid(raise_exception=True)

        alert.status = AlertStatus.ACKNOWLEDGED
        alert.acknowledged_at = timezone.now()
        alert.acknowledgment_comment = serializer.validated_data["acknowledgment_comment"]
        alert.save()

        create_audit_log(
            action="ACK_ALERT",
            entity_type="Alert",
            entity_id=str(alert.id),
            actor=request.user.username if request.user.is_authenticated else "system",
            details={
                "case_id": str(alert.anesthesia_case.id),
                "patient_id": str(alert.anesthesia_case.patient.id),
                "from_status": "ACTIVE",
                "to_status": "ACKNOWLEDGED",
                "acknowledged_at": alert.acknowledged_at.isoformat(),
            },
        )

        return Response(AlertSerializer(alert).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="resolve")
    def resolve(self, request, pk=None):
        alert = self.get_object()

        serializer = AlertResolveSerializer(
            data=request.data,
            context={"alert": alert},
        )
        serializer.is_valid(raise_exception=True)

        previous_status = alert.status
        alert.status = AlertStatus.RESOLVED
        alert.resolved_at = timezone.now()
        alert.resolution_comment = serializer.validated_data["resolution_comment"]
        alert.save()

        create_audit_log(
            action="RESOLVE_ALERT",
            entity_type="Alert",
            entity_id=str(alert.id),
            actor=request.user.username if request.user.is_authenticated else "system",
            details={
                "case_id": str(alert.anesthesia_case.id),
                "patient_id": str(alert.anesthesia_case.patient.id),
                "from_status": previous_status,
                "to_status": "RESOLVED",
                "resolved_at": alert.resolved_at.isoformat(),
            },
        )

        return Response(AlertSerializer(alert).data, status=status.HTTP_200_OK)