import uuid
from django.db import models
from django.contrib.auth.models import User

class Role(models.TextChoices):
    DOCTOR = "DOCTOR", "Médecin"
    PATIENT = "PATIENT", "Patient"

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.PATIENT)
    specialty = models.CharField(max_length=100, blank=True, null=True)
    license_number = models.CharField(max_length=50, blank=True, null=True)
    # Lien vers le Patient créé automatiquement à l'inscription (null pour les médecins)
    patient_id = models.UUIDField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"
