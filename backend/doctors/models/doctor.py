from django.db import models
from model_utils.fields import StatusField, MonitorField
from model_utils import Choices
from django.contrib.postgres.fields import ArrayField
from phonenumber_field.modelfields import PhoneNumberField

from .doctorCategory import DoctorCategory
from .doctorSpeciality import DoctorSpeciality


class Doctor(models.Model):
    """Doctor info"""

    STATUS = Choices("PENDING_APPROVAL", "APPROVED", "REJECTED", "DELETED")

    full_name = models.CharField(max_length=100)
    categories = models.ManyToManyField(DoctorCategory, blank=True)
    specialities = models.ManyToManyField(DoctorSpeciality, blank=True)
    address = models.CharField(max_length=200, blank=True)
    phones = ArrayField(PhoneNumberField(), default=list, null=True, blank=True)
    websites = ArrayField(models.URLField(), default=list, null=True, blank=True)
    status = StatusField()
    # added_by  # TODO
    added_at = models.DateTimeField(auto_now_add=True)
    approved_at = MonitorField(monitor="status", when=["APPROVED"])  # type: ignore
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return str(self.full_name)
