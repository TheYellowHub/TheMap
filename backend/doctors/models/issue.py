from django.db import models
from model_utils.fields import StatusField, MonitorField
from model_utils import Choices

from .abstractUserRelatedClass import AbstractUserRelatedClass


class DoctorIssue(AbstractUserRelatedClass):
    """
    A doctor issue that was reported by a user.
    """

    PENDING = "PENDING"
    MODIFICATION_NEEDED = "MODIFICATION_NEEDED"
    PUBLISHED = "PUBLISHED"

    CLASS_TITLE = "Issue"
    STATUS = Choices(PENDING, MODIFICATION_NEEDED, PUBLISHED, AbstractUserRelatedClass.REJECTED, AbstractUserRelatedClass.DELETED)
    USER_ALLOWED_STATUSES = [PENDING]

    published_at = MonitorField(monitor="status", when=[PUBLISHED], null=True, blank=True, default=None)  # type: ignore

