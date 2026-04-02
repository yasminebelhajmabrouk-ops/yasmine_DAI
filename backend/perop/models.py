from django.db import models
import uuid

from casefile.models import AnesthesiaCase


class PerOpSessionStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Active"
    ENDED = "ENDED", "Ended"


class VitalType(models.TextChoices):
    HEART_RATE = "HEART_RATE", "Heart Rate"
    SYSTOLIC_BP = "SYSTOLIC_BP", "Systolic BP"
    DIASTOLIC_BP = "DIASTOLIC_BP", "Diastolic BP"
    MEAN_ARTERIAL_PRESSURE = "MAP", "Mean Arterial Pressure"
    SPO2 = "SPO2", "SpO2"
    ETCO2 = "ETCO2", "EtCO2"
    RESPIRATORY_RATE = "RESPIRATORY_RATE", "Respiratory Rate"
    TEMPERATURE = "TEMPERATURE", "Temperature"


class PerOpEventType(models.TextChoices):
    MEDICATION = "MEDICATION", "Medication"
    PROCEDURE = "PROCEDURE", "Procedure"
    INCIDENT = "INCIDENT", "Incident"
    TECHNICAL = "TECHNICAL", "Technical"


class PerOpSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    anesthesia_case = models.OneToOneField(
        AnesthesiaCase,
        on_delete=models.CASCADE,
        related_name="perop_session",
    )
    status = models.CharField(
        max_length=20,
        choices=PerOpSessionStatus.choices,
        default=PerOpSessionStatus.ACTIVE,
    )
    started_at = models.DateTimeField()
    ended_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "perop_sessions"
        ordering = ["-started_at"]

    def __str__(self):
        return f"PerOpSession {self.id} - {self.anesthesia_case_id}"


class VitalSignMeasurement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(
        PerOpSession,
        on_delete=models.CASCADE,
        related_name="vital_measurements",
    )
    vital_type = models.CharField(
        max_length=40,
        choices=VitalType.choices,
    )
    value = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20, blank=True)
    recorded_at = models.DateTimeField()
    source_device = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "vital_sign_measurements"
        ordering = ["-recorded_at"]
        indexes = [
            models.Index(fields=["session", "recorded_at"]),
            models.Index(fields=["vital_type", "recorded_at"]),
        ]

    def __str__(self):
        return f"{self.vital_type}={self.value} {self.unit} @ {self.recorded_at}"


class PerOpEvent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    anesthesia_case = models.ForeignKey(
        AnesthesiaCase,
        on_delete=models.CASCADE,
        related_name="perop_events",
    )
    session = models.ForeignKey(
        PerOpSession,
        on_delete=models.CASCADE,
        related_name="events",
    )
    event_type = models.CharField(
        max_length=20,
        choices=PerOpEventType.choices,
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    timestamp = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "perop_events"
        ordering = ["-timestamp"]
        indexes = [
            models.Index(fields=["anesthesia_case", "timestamp"]),
            models.Index(fields=["event_type", "timestamp"]),
        ]

    def __str__(self):
        return f"{self.event_type} - {self.title}"


class MedicationAdministration(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.OneToOneField(
        PerOpEvent,
        on_delete=models.CASCADE,
        related_name="medication_administration",
    )
    drug_name = models.CharField(max_length=255)
    dose = models.CharField(max_length=100)
    route = models.CharField(max_length=100, blank=True)
    administered_at = models.DateTimeField()

    class Meta:
        db_table = "medication_administrations"
        ordering = ["-administered_at"]

    def __str__(self):
        return f"{self.drug_name} {self.dose} via {self.route}"