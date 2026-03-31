from rest_framework import serializers

from .models import AnesthesiaCase, CaseStatus


class AnesthesiaCaseSerializer(serializers.ModelSerializer):
    patient_full_name = serializers.SerializerMethodField()

    class Meta:
        model = AnesthesiaCase
        fields = [
            "id",
            "patient",
            "patient_full_name",
            "status",
            "surgery_type",
            "scheduled_at",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "patient_full_name"]

    def get_patient_full_name(self, obj):
        return str(obj.patient)


class CaseStateTransitionSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=CaseStatus.choices)