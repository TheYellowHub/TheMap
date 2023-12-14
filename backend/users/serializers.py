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


class UserBasicSerializer(serializers.ModelSerializer):
    """Basic user serializer to shows only its remote ID and username"""

    class Meta:
        model = User
        fields = ["id", "remote_id", "username"]
