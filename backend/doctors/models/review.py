from decimal import Decimal
from django.db import models
from model_utils.fields import StatusField, MonitorField
from model_utils import Choices, choices


class DoctorReview(models.Model):
    """
    A doctor review.
    """

    STATUS = Choices("DRAFT", "PENDING_APPROVAL", "APPROVED", "REJECTED", "DELETED")

    MIN_RATING = 0
    MAX_RATING = 5
    RATING_CHOICES = [
        (Decimal(i), str(i))
        for i in [float(x) / 2 for x in range(MIN_RATING, MAX_RATING * 2 + 1)]
    ]

    doctor = models.ForeignKey("doctors.Doctor", on_delete=models.CASCADE)
    description = models.TextField()
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
    status = StatusField()
    added_by = models.ForeignKey(
        "users.User", blank=True, null=True, on_delete=models.SET_NULL
    )
    added_at = models.DateTimeField(auto_now_add=True, null=True)
    approved_at = MonitorField(monitor="status", when=["APPROVED"], null=True, blank=True, default=None)  # type: ignore
    rejected_at = MonitorField(monitor="status", when=["REJECTED"], null=True, blank=True, default=None)  # type: ignore
    deleted_at = MonitorField(monitor="status", when=["DELETED"], null=True, blank=True, default=None)  # type: ignore
    updated_at = models.DateTimeField(auto_now=True, null=True)
    rejection_reason = models.TextField(blank=True, null=True)

    def __str__(self) -> str:
        return f"Review #{self.pk} - {self.doctor.full_name} / {self.added_by}"
