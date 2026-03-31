from django.utils import timezone
from rest_framework import serializers

from casefile.models import CaseStatus
from preop.models import ClinicalScore, ScoreType
from .models import PostOpStay, PostOpStayStatus, PostOpObservation


class PostOpStaySerializer(serializers.ModelSerializer):
    case_id = serializers.UUIDField(source="anesthesia_case.id", read_only=True)

    class Meta:
        model = PostOpStay
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


class StartPostOpStaySerializer(serializers.Serializer):
    started_at = serializers.DateTimeField(required=False)
    notes = serializers.CharField(required=False, allow_blank=True, default="")

    def validate(self, attrs):
        case = self.context["case"]

        if case.status != CaseStatus.POST_OP:
            raise serializers.ValidationError(
                {"detail": "Case must be in POST_OP status before starting a post-op stay."}
            )

        if hasattr(case, "postop_stay"):
            stay = case.postop_stay
            if stay.status == PostOpStayStatus.ACTIVE:
                raise serializers.ValidationError(
                    {"detail": "An active post-op stay already exists for this case."}
                )

        return attrs


class EndPostOpStaySerializer(serializers.Serializer):
    ended_at = serializers.DateTimeField(required=False)
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        case = self.context["case"]

        if not hasattr(case, "postop_stay"):
            raise serializers.ValidationError(
                {"detail": "No post-op stay exists for this case."}
            )

        stay = case.postop_stay
        if stay.status != PostOpStayStatus.ACTIVE:
            raise serializers.ValidationError(
                {"detail": "Post-op stay is not active."}
            )

        return attrs


class PostOpObservationSerializer(serializers.ModelSerializer):
    aldrete_score = serializers.IntegerField(read_only=True)

    class Meta:
        model = PostOpObservation
        fields = [
            "id",
            "stay",
            "observation_time",
            "pain_score",
            "activity_score",
            "respiration_score",
            "circulation_score",
            "consciousness_score",
            "oxygenation_score",
            "systolic_bp",
            "spo2",
            "notes",
            "created_at",
            "aldrete_score",
        ]
        read_only_fields = ["id", "created_at", "aldrete_score"]

    def validate(self, attrs):
        score_fields = [
            "activity_score",
            "respiration_score",
            "circulation_score",
            "consciousness_score",
            "oxygenation_score",
        ]

        for field in score_fields:
            value = attrs.get(field, 0)
            if value not in [0, 1, 2]:
                raise serializers.ValidationError(
                    {field: "Aldrete component score must be 0, 1, or 2."}
                )

        pain_score = attrs.get("pain_score")
        if pain_score is not None and not (0 <= pain_score <= 10):
            raise serializers.ValidationError(
                {"pain_score": "Pain score must be between 0 and 10."}
            )

        return attrs


class AldreteScoreSerializer(serializers.Serializer):
    case_id = serializers.UUIDField()
    stay_id = serializers.UUIDField(allow_null=True)
    latest_observation = PostOpObservationSerializer(allow_null=True)
    aldrete_score = serializers.IntegerField()
    readiness = serializers.CharField()
    clinical_score = serializers.DictField()


class PostOpSummarySerializer(serializers.Serializer):
    case_id = serializers.UUIDField()
    case_status = serializers.CharField()
    stay = PostOpStaySerializer(allow_null=True)
    latest_observations = PostOpObservationSerializer(many=True)