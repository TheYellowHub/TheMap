from rest_framework import serializers
import logging

from ..models.review import DoctorReview
from doctors.serializers.doctor import DoctorNameSerializer
from users.serializers import UserNameSerializer


logger = logging.getLogger(__name__)


class DoctorReviewReadSerializer(serializers.ModelSerializer):
    """Doctor review serializer"""

    class Meta:
        model = DoctorReview
        fields = "__all__"

    doctor = DoctorNameSerializer(many=False, read_only=True)
    added_by = UserNameSerializer(many=False, read_only=True)


class DoctorReviewWriteSerializer(serializers.ModelSerializer):
    """Doctor review serializer for adding / updating reviews"""

    class Meta:
        model = DoctorReview
        fields = [
            "doctor",
            "added_by",
            "description",
            "past_operation",
            "future_operation",
            "operation_month",
            "status",
        ]
