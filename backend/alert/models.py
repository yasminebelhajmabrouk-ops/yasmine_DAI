from django.db import models
import uuid

from casefile.models import AnesthesiaCase


class AlertType(models.TextChoices):
    HYPOTENSION = "HYPOTENSION", "Hypotension"
    DESATURATION = "DESATURATION", "Desaturation"
    BRADYCARDIA = "BRADYCARDIA", "Bradycardia"
    TACHYCARDIA = "TACHYCARDIA", "Tachycardia"
    OTHER = "OTHER", "Other"


class AlertSeverity(models.TextChoices):
    LOW = "LOW", "Low"
    MEDIUM = "MEDIUM", "Medium"
    HIGH = "HIGH", "High"
    CRITICAL = "CRITICAL", "Critical"


class AlertStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Active"
    ACKNOWLEDGED = "ACKNOWLEDGED", "Acknowledged"
    RESOLVED = "RESOLVED", "Resolved"


class Alert(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    anesthesia_case = models.ForeignKey(
        AnesthesiaCase,
        on_delete=models.CASCADE,
        related_name="alerts",
    )
    alert_type = models.CharField(
        max_length=30,
        choices=AlertType.choices,
        default=AlertType.OTHER,
    )
    severity = models.CharField(
        max_length=20,
        choices=AlertSeverity.choices,
        default=AlertSeverity.MEDIUM,
    )
    status = models.CharField(
        max_length=20,
        choices=AlertStatus.choices,
        default=AlertStatus.ACTIVE,
    )
    title = models.CharField(max_length=255)
    message = models.TextField(blank=True)
    source = models.CharField(max_length=100, blank=True)
    raised_at = models.DateTimeField()
    acknowledged_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    acknowledgment_comment = models.TextField(blank=True)
    resolution_comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "alerts"
        ordering = ["-raised_at"]
        indexes = [
            models.Index(fields=["anesthesia_case", "status"]),
            models.Index(fields=["alert_type", "raised_at"]),
        ]

    def __str__(self):
        return f"{self.alert_type} - {self.status} - {self.title}"