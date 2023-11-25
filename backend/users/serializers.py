from drf_writable_nested.serializers import WritableNestedModelSerializer
import logging

from rest_framework import serializers

from .models import User

logger = logging.getLogger(__name__)


class UserSerializer(WritableNestedModelSerializer):
    """User serializer"""

    class Meta:
        model = User
        fields = "__all__"


class UserNameSerializer(serializers.ModelSerializer):
    """Basic user serializer to shows only its remote ID"""

    class Meta:
        model = User
        fields = ["remote_id"]
