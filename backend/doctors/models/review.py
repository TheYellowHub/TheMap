from decimal import Decimal
from django.db import models
from model_utils.fields import MonitorField
from model_utils import Choices

from .abstractUserRelatedClass import AbstractUserRelatedClass


class DoctorReview(AbstractUserRelatedClass):
    """
    A doctor review.
    """

    DRAFT = "DRAFT"
    APPROVED = "APPROVED"
    PENDING_APPROVAL = "PENDING_APPROVAL"

    CLASS_TITLE = "Review"
    STATUS = Choices(DRAFT, PENDING_APPROVAL, APPROVED, AbstractUserRelatedClass.REJECTED, AbstractUserRelatedClass.DELETED)
    USER_ALLOWED_STATUSES = [DRAFT, PENDING_APPROVAL, AbstractUserRelatedClass.DELETED]

    MIN_RATING = 0
    MAX_RATING = 5
    RATING_CHOICES = [
        (Decimal(i), str(i))
        for i in [float(x) / 2 for x in range(MIN_RATING, MAX_RATING * 2 + 1)]
    ]

    rating = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        choices=RATING_CHOICES,
        null=True,
        blank=True,
        default=None,
    )
    past_operation = models.BooleanField(default=False)
    future_operation = models.BooleanField(default=False)
    operation_month = models.DateField(blank=True, null=True)
    anonymous = models.BooleanField(default=False)
    approved_at = MonitorField(monitor="status", when=[APPROVED], null=True, blank=True, default=None)  # type: ignore
