from drf_writable_nested.serializers import WritableNestedModelSerializer
import logging

from .models import User

logger = logging.getLogger(__name__)


class UserSerializer(WritableNestedModelSerializer):
    """User serializer"""

    class Meta:
        model = User
        fields = "__all__"
