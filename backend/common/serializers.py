from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, Role
from patient.models import Patient


class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(source='profile.role', read_only=True)
    patient_id = serializers.SerializerMethodField(read_only=True)

    # Components for profile data
    specialty = serializers.CharField(source='profile.specialty', required=False, allow_blank=True)
    license_number = serializers.CharField(source='profile.license_number', required=False, allow_blank=True)
    
    # Still need write_role for registration
    write_role = serializers.ChoiceField(choices=Role.choices, write_only=True, required=False)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "first_name", "last_name",
                  "role", "patient_id", "write_role", "specialty", "license_number")

    def get_patient_id(self, obj):
        """Retourne l'UUID du Patient lié à cet utilisateur (si role=PATIENT)."""
        try:
            profile = obj.profile
            if profile.patient_id:
                return str(profile.patient_id)
            
            if profile.role == Role.PATIENT:
                # Récupération ou création de sécurité
                from patient.models import Patient as PModel
                patient, _ = PModel.objects.get_or_create(
                    first_name=obj.first_name or obj.username,
                    last_name=obj.last_name or "",
                    defaults={'birth_date': "2000-01-01", 'gender': "unknown"}
                )
                profile.patient_id = patient.id
                profile.save()
                return str(patient.id)
            return None
        except Exception:
            return None

    def create(self, validated_data):
        role = validated_data.pop("write_role", Role.PATIENT)
        profile_data = validated_data.pop("profile", {})
        specialty = profile_data.get("specialty", "")
        license_number = profile_data.get("license_number", "")

        email = validated_data.get("email")
        username = validated_data.get("username", email)

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

        if role == Role.PATIENT:
            from patient.models import Patient as PModel
            patient = PModel.objects.create(
                first_name=user.first_name or user.username,
                last_name=user.last_name or "",
                birth_date="2000-01-01",
                gender="unknown",
            )
            profile.patient_id = patient.id
            profile.save()

        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        password = validated_data.pop('password', None)

        # Update User fields
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        if password:
            instance.set_password(password)
        instance.save()

        # Update Profile fields
        profile = instance.profile
        if profile_data:
            profile.specialty = profile_data.get('specialty', profile.specialty)
            profile.license_number = profile_data.get('license_number', profile.license_number)
            profile.save()

        return instance
