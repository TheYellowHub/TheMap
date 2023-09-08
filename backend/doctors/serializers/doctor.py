from rest_framework import serializers

from ..models.doctor import Doctor
from ..models.doctorCategory import DoctorCategory
from ..models.doctorSpeciality import DoctorSpeciality


class DoctorBasicSerializer(serializers.ModelSerializer):
    """Doctor basic serializer"""

    class Meta:
        model = Doctor
        fields = "__all__"

    categories = serializers.SlugRelatedField(
        many=True, queryset=DoctorCategory.objects.all(), slug_field="name"
    )

    specialities = serializers.SlugRelatedField(
        many=True, queryset=DoctorSpeciality.objects.all(), slug_field="name"
    )


class DoctorExtendedSerializer(DoctorBasicSerializer):
    """Doctor extended serializer, including his reviews and rating"""

    # TODO: Add reviews & rating
