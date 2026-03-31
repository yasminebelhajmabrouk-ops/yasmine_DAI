from django.db import models
import uuid

from casefile.models import AnesthesiaCase


class PostOpStayStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Active"
    ENDED = "ENDED", "Ended"


class PostOpStay(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    anesthesia_case = models.OneToOneField(
        AnesthesiaCase,
        on_delete=models.CASCADE,
        related_name="postop_stay",
    )
    status = models.CharField(
        max_length=20,
        choices=PostOpStayStatus.choices,
        default=PostOpStayStatus.ACTIVE,
    )
    started_at = models.DateTimeField()
    ended_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "postop_stays"
        ordering = ["-started_at"]

    def __str__(self):
        return f"PostOpStay {self.id} - {self.anesthesia_case_id}"


class PostOpObservation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    stay = models.ForeignKey(
        PostOpStay,
        on_delete=models.CASCADE,
        related_name="observations",
    )
    observation_time = models.DateTimeField()
    pain_score = models.PositiveSmallIntegerField(null=True, blank=True)
    activity_score = models.PositiveSmallIntegerField(default=0)
    respiration_score = models.PositiveSmallIntegerField(default=0)
    circulation_score = models.PositiveSmallIntegerField(default=0)
    consciousness_score = models.PositiveSmallIntegerField(default=0)
    oxygenation_score = models.PositiveSmallIntegerField(default=0)
    systolic_bp = models.PositiveSmallIntegerField(null=True, blank=True)
    spo2 = models.PositiveSmallIntegerField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "postop_observations"
        ordering = ["-observation_time"]
        indexes = [
            models.Index(fields=["stay", "observation_time"]),
        ]

    def __str__(self):
        return f"PostOpObservation {self.id} @ {self.observation_time}"

    @property
    def aldrete_score(self):
        return (
            self.activity_score
            + self.respiration_score
            + self.circulation_score
            + self.consciousness_score
            + self.oxygenation_score
        )