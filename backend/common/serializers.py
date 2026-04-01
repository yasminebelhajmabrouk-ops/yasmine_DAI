from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, Role
from patient.models import Patient


class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(source='profile.role', read_only=True)
    patient_id = serializers.SerializerMethodField(read_only=True)

    # Write components for registration
    write_role = serializers.ChoiceField(choices=Role.choices, write_only=True, required=False)
    specialty = serializers.CharField(write_only=True, required=False, allow_blank=True)
    license_number = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "first_name", "last_name",
                  "role", "patient_id", "write_role", "specialty", "license_number")

    def get_patient_id(self, obj):
        """Retourne l'UUID du Patient lié à cet utilisateur (si role=PATIENT). 
        Si manquant pour un Patient, on le crée à la volée (sécurité dev/migration)."""
        try:
            profile = obj.profile
            if profile.patient_id:
                return str(profile.patient_id)
            
            # Si c'est un patient mais sans ID patient, on le répare
            if profile.role == Role.PATIENT:
                patient = Patient.objects.create(
                    first_name=obj.first_name or obj.username,
                    last_name=obj.last_name or "",
                    birth_date="2000-01-01",
                    gender="unknown",
                )
                profile.patient_id = patient.id
                profile.save()
                return str(patient.id)
            return None
        except Exception:
            return None

    def create(self, validated_data):
        role = validated_data.pop("write_role", Role.PATIENT)
        specialty = validated_data.pop("specialty", "")
        license_number = validated_data.pop("license_number", "")

        email = validated_data.get("email")
        username = validated_data.get("username", email) # On favorise l'email comme username technique

        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )

        profile = Profile.objects.create(
            user=user,
            role=role,
            specialty=specialty,
            license_number=license_number
        )

        # Créer automatiquement un Patient lié si le rôle est PATIENT
        if role == Role.PATIENT:
            patient = Patient.objects.create(
                first_name=user.first_name or user.username,
                last_name=user.last_name or "",
                birth_date="2000-01-01",  # valeur par défaut, modifiable après
                gender="unknown",
            )
            profile.patient_id = patient.id
            profile.save()

        return user
