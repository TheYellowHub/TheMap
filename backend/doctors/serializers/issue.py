from rest_framework import serializers
import logging

from ..models.issue import DoctorIssue
from doctors.serializers.doctor import DoctorNameSerializer
from users.serializers import UserBasicSerializer


logger = logging.getLogger(__name__)


class DoctorIssueReadSerializer(serializers.ModelSerializer):
    """Doctor issue serializer"""

    class Meta:
        model = DoctorIssue
        fields = "__all__"

    doctor = DoctorNameSerializer(many=False, read_only=True)
    added_by = UserBasicSerializer(many=False, read_only=True)


class DoctorIssueCreateSerializer(serializers.ModelSerializer):
    """Doctor issue serializer for adding issues"""

    class Meta:
        model = DoctorIssue
        fields = [
            "id",
            "doctor",
            "added_by",
            "description",
            "status",
        ]


class DoctorIssueUpdateSerializer(serializers.ModelSerializer):
    """Doctor issue serializer for updating issues"""

    class Meta:
        model = DoctorIssue
        fields = [
            "id",
            "description",
            "status",
            "rejection_reason",
            "internal_notes"
        ]
