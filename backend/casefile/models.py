from django.db import models
import uuid

from patient.models import Patient


class CaseStatus(models.TextChoices):
    PRE_OP = "PRE_OP", "Pre-op"
    PER_OP = "PER_OP", "Per-op"
    POST_OP = "POST_OP", "Post-op"
    CLOSED = "CLOSED", "Closed"


class AnesthesiaDecision(models.TextChoices):
    AUTHORIZED = "AUTHORIZED", "Autoriser l’anesthésie"
    EXAMS_REQUIRED = "EXAMS_REQUIRED", "Demander des examens complémentaires"
    SPECIALIST_OPINION = "SPECIALIST_OPINION", "Demander un avis spécialisé"
    REFUSED = "REFUSED", "Récuser l’anesthésie"


class AnesthesiaCase(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="anesthesia_cases",
    )
    status = models.CharField(
        max_length=20,
        choices=CaseStatus.choices,
        default=CaseStatus.PRE_OP,
    )
    surgery_type = models.CharField(max_length=255)
    decision = models.CharField(
        max_length=30,
        choices=AnesthesiaDecision.choices,
        null=True,
        blank=True,
    )
    decision_notes = models.TextField(blank=True)
    scheduled_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "anesthesia_cases"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Case {self.id} - {self.patient} - {self.status}"