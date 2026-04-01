from rest_framework import serializers

from .models import AnesthesiaCase, CaseStatus
from patient.serializers import PatientSerializer
from preop.serializers import (
    PreOpQuestionnaireSerializer,
    ClinicalScoreSerializer,
)
from perop.serializers import (
    PerOpSessionSerializer,
    VitalSignMeasurementSerializer,
    PerOpEventSerializer,
)
from postop.serializers import (
    PostOpStaySerializer,
    PostOpObservationSerializer,
)
from alert.serializers import AlertSerializer


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


class CaseFullSummarySerializer(serializers.Serializer):
    case = AnesthesiaCaseSerializer()
    patient = PatientSerializer()
    preop_questionnaire = PreOpQuestionnaireSerializer(allow_null=True)
    clinical_scores = ClinicalScoreSerializer(many=True)
    perop_session = PerOpSessionSerializer(allow_null=True)
    perop_vitals = VitalSignMeasurementSerializer(many=True)
    perop_events = PerOpEventSerializer(many=True)
    postop_stay = PostOpStaySerializer(allow_null=True)
    postop_observations = PostOpObservationSerializer(many=True)
    alerts = AlertSerializer(many=True)