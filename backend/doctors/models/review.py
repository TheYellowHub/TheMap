from django.db import models
from model_utils.fields import StatusField, MonitorField
from model_utils import Choices

from .doctor import Doctor


class DoctorReview(models.Model):
    """
    A doctor review.
    """

    STATUS = Choices("PENDING_APPROVAL", "APPROVED", "REJECTED")

    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    description = models.TextField()
    past_operation = models.BooleanField()
    future_operation = models.BooleanField()
    operation_month = models.DateField(blank=True, null=True)
    status = StatusField()
    added_by = models.ForeignKey(
        "users.User", blank=True, null=True, on_delete=models.SET_NULL
    )
    added_at = models.DateTimeField(auto_now_add=True, null=True)
    approved_at = MonitorField(monitor="status", when=["APPROVED"], null=True, blank=True, default=None)  # type: ignore
    rejected_at = MonitorField(monitor="status", when=["REJECTED"], null=True, blank=True, default=None)  # type: ignore
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self) -> str:
        return f"Review #{self.pk} - {self.doctor.full_name} / {self.added_by}"
