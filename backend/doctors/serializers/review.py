from rest_framework import serializers
import logging

from ..models.review import DoctorReview
from doctors.serializers.doctor import DoctorNameSerializer
from users.serializers import UserBasicSerializer


logger = logging.getLogger(__name__)


class DoctorReviewReadSerializer(serializers.ModelSerializer):
    """Doctor review serializer"""

    class Meta:
        model = DoctorReview
        fields = "__all__"

    doctor = DoctorNameSerializer(many=False, read_only=True)
    added_by = UserBasicSerializer(many=False, read_only=True)


class DoctorReviewCreateSerializer(serializers.ModelSerializer):
    """Doctor review serializer for adding reviews"""

    class Meta:
        model = DoctorReview
        fields = [
            "id",
            "doctor",
            "added_by",
            "anonymous",
            "rating",
            "description",
            "past_operation",
            "future_operation",
            "operation_month",
            "status",
        ]


class DoctorReviewUpdateSerializer(serializers.ModelSerializer):
    """Doctor review serializer for updating reviews"""

    class Meta:
        model = DoctorReview
        fields = [
            "id",
            "anonymous",
            "rating",
            "description",
            "past_operation",
            "future_operation",
            "operation_month",
            "status",
        ]
