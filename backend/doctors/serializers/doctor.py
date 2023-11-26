from rest_framework import serializers
from drf_writable_nested.serializers import WritableNestedModelSerializer
import logging

from ..models.doctor import Doctor, DoctorLocation
from ..models.doctorCategory import DoctorCategory
from ..models.doctorSpeciality import DoctorSpeciality
from users.serializers import UserNameSerializer


logger = logging.getLogger(__name__)


class DoctorLocationSerializer(serializers.ModelSerializer):
    """Doctor single location serializer"""

    class Meta:
        model = DoctorLocation
        exclude = ("doctor",)


class DoctorSerializer(WritableNestedModelSerializer):
    """Doctor serializer"""

    class Meta:
        model = Doctor
        fields = "__all__"

    locations = DoctorLocationSerializer(
        source="doctorlocation_set",
        many=True,
    )

    category = serializers.SlugRelatedField(
        many=False,
        queryset=DoctorCategory.objects.all(),
        slug_field="name",
        allow_null=True,
    )

    specialities = serializers.SlugRelatedField(
        many=True, queryset=DoctorSpeciality.objects.all(), slug_field="name"
    )

    added_by = UserNameSerializer(many=False, read_only=True)

    num_of_reviews = serializers.ReadOnlyField()

    avg_rating = serializers.ReadOnlyField()

    def update(self, instance, validated_data):
        logger.debug(f"Doctor update - validated data: {validated_data}")
        return super().update(instance, validated_data)


class DoctorNameSerializer(serializers.ModelSerializer):
    """Basic doctor serializer to shows only its remote ID"""

    class Meta:
        model = Doctor
        fields = ["id", "full_name"]
