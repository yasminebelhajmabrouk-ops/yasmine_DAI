from rest_framework import serializers

from .models import (
    PerOpSession,
    VitalSignMeasurement,
    PerOpEvent,
    MedicationAdministration,
    PerOpEventType,
    PerOpSessionStatus,
)
from casefile.models import AnesthesiaCase, CaseStatus


class MedicationAdministrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicationAdministration
        fields = [
            "id",
            "event",
            "drug_name",
            "dose",
            "route",
            "administered_at",
        ]
        read_only_fields = ["id"]


class PerOpEventSerializer(serializers.ModelSerializer):
    medication_administration = MedicationAdministrationSerializer(
        required=False,
        allow_null=True,
    )

    class Meta:
        model = PerOpEvent
        fields = [
            "id",
            "anesthesia_case",
            "session",
            "event_type",
            "title",
            "description",
            "timestamp",
            "created_at",
            "medication_administration",
        ]
        read_only_fields = ["id", "created_at"]

    def validate(self, attrs):
        event_type = attrs.get("event_type")
        medication_data = attrs.get("medication_administration")

        if event_type == PerOpEventType.MEDICATION and not medication_data:
            raise serializers.ValidationError(
                {"medication_administration": "This field is required for MEDICATION events."}
            )

        if event_type != PerOpEventType.MEDICATION and medication_data:
            raise serializers.ValidationError(
                {"medication_administration": "Only MEDICATION events can include medication details."}
            )

        return attrs

    def create(self, validated_data):
        medication_data = validated_data.pop("medication_administration", None)
        event = super().create(validated_data)

        if medication_data:
            MedicationAdministration.objects.create(
                event=event,
                **medication_data,
            )

        return event


class VitalSignMeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = VitalSignMeasurement
        fields = [
            "id",
            "session",
            "vital_type",
            "value",
            "unit",
            "recorded_at",
            "source_device",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class PerOpSessionSerializer(serializers.ModelSerializer):
    case_id = serializers.UUIDField(source="anesthesia_case.id", read_only=True)

    class Meta:
        model = PerOpSession
        fields = [
            "id",
            "anesthesia_case",
            "case_id",
            "status",
            "started_at",
            "ended_at",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "case_id", "created_at", "updated_at"]


class StartPerOpSessionSerializer(serializers.Serializer):
    started_at = serializers.DateTimeField(required=False)
    notes = serializers.CharField(required=False, allow_blank=True, default="")

    def validate(self, attrs):
        case = self.context["case"]

        if case.status != CaseStatus.PER_OP:
            raise serializers.ValidationError(
                {"detail": "Case must be in PER_OP status before starting a per-op session."}
            )

        if hasattr(case, "perop_session"):
            session = case.perop_session
            if session.status == PerOpSessionStatus.ACTIVE:
                raise serializers.ValidationError(
                    {"detail": "An active per-op session already exists for this case."}
                )

        return attrs


class EndPerOpSessionSerializer(serializers.Serializer):
    ended_at = serializers.DateTimeField(required=False)
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        case = self.context["case"]

        if not hasattr(case, "perop_session"):
            raise serializers.ValidationError(
                {"detail": "No per-op session exists for this case."}
            )

        session = case.perop_session
        if session.status != PerOpSessionStatus.ACTIVE:
            raise serializers.ValidationError(
                {"detail": "Per-op session is not active."}
            )

        return attrs


class PerOpSummarySerializer(serializers.Serializer):
    case_id = serializers.UUIDField()
    case_status = serializers.CharField()
    session = PerOpSessionSerializer(allow_null=True)
    latest_vitals = VitalSignMeasurementSerializer(many=True)
    latest_events = PerOpEventSerializer(many=True)