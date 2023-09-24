from rest_framework import serializers

from ..models.doctorSpeciality import DoctorSpeciality


class DoctorSpecialitySerializer(serializers.ModelSerializer):
    """Doctor speciality serializer"""

    class Meta:
        model = DoctorSpeciality
        fields = "__all__"
