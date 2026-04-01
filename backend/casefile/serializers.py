from rest_framework import serializers

from .models import AnesthesiaCase


class AnesthesiaCaseSerializer(serializers.ModelSerializer):
    patient_full_name = serializers.CharField(source="patient.__str__", read_only=True)

    class Meta:
        model = AnesthesiaCase
        fields = [
            "id",
            "patient",
            "patient_full_name",
            "status",
            "surgery_type",
            "decision",
            "decision_notes",
            "scheduled_at",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "patient_full_name"]