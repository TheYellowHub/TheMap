from rest_framework import serializers

from ..models.doctorCategory import DoctorCategory


class DoctorCategorySerializer(serializers.ModelSerializer):
    """Doctor category serializer"""

    class Meta:
        model = DoctorCategory
        fields = "__all__"
