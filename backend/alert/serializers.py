from django.utils import timezone
from rest_framework import serializers

from .models import Alert, AlertStatus


class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = [
            "id",
            "anesthesia_case",
            "alert_type",
            "severity",
            "status",
            "title",
            "message",
            "source",
            "raised_at",
            "acknowledged_at",
            "resolved_at",
            "acknowledgment_comment",
            "resolution_comment",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "acknowledged_at",
            "resolved_at",
            "created_at",
            "updated_at",
        ]


class AlertAcknowledgeSerializer(serializers.Serializer):
    acknowledgment_comment = serializers.CharField(
        required=False,
        allow_blank=True,
        default="",
    )

    def validate(self, attrs):
        alert = self.context["alert"]
        if alert.status != AlertStatus.ACTIVE:
            raise serializers.ValidationError(
                {"detail": "Only ACTIVE alerts can be acknowledged."}
            )
        return attrs


class AlertResolveSerializer(serializers.Serializer):
    resolution_comment = serializers.CharField(
        required=False,
        allow_blank=True,
        default="",
    )

    def validate(self, attrs):
        alert = self.context["alert"]
        if alert.status == AlertStatus.RESOLVED:
            raise serializers.ValidationError(
                {"detail": "Alert is already resolved."}
            )
        return attrs