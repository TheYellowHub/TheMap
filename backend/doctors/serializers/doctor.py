from rest_framework import serializers
from drf_writable_nested.serializers import WritableNestedModelSerializer

from ..models.doctor import Doctor, DoctorLocation
from ..models.doctorCategory import DoctorCategory
from ..models.doctorSpeciality import DoctorSpeciality


class DoctorLocationSerializer(serializers.ModelSerializer):
    """Doctor single location serializer"""

    class Meta:
        model = DoctorLocation
        exclude = ("doctor",)


class DoctorBasicSerializer(WritableNestedModelSerializer):
    """Doctor basic serializer"""

    class Meta:
        model = Doctor
        fields = "__all__"

    locations = DoctorLocationSerializer(
        source="doctorlocation_set",
        many=True,
    )

    categories = serializers.SlugRelatedField(
        many=True, queryset=DoctorCategory.objects.all(), slug_field="name"
    )

    specialities = serializers.SlugRelatedField(
        many=True, queryset=DoctorSpeciality.objects.all(), slug_field="name"
    )


class DoctorExtendedSerializer(DoctorBasicSerializer):
    """Doctor extended serializer, including his reviews and rating"""

    # TODO: Add reviews & rating
