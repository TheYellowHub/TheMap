from rest_framework import serializers
import logging

from ..models.review import DoctorReview
from doctors.serializers.doctor import DoctorNameSerializer
from users.serializers import UserNameSerializer


logger = logging.getLogger(__name__)


class DoctorReviewSerializer(serializers.ModelSerializer):
    """Doctor single location serializer"""

    class Meta:
        model = DoctorReview
        fields = "__all__"

    doctor = DoctorNameSerializer(many=False, read_only=True)
    added_by = UserNameSerializer(many=False, read_only=True)
