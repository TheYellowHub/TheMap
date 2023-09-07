"""
Doctor's card related modules
"""

from django.db import models
from django.contrib.postgres.fields import ArrayField
from phonenumber_field.modelfields import PhoneNumberField
from django_enumfield import enum


class DoctorCategory(models.Model):
    """Doctor category, such as: surgeon"""

    name = models.CharField(max_length=30)

    def __str__(self) -> str:
        return str(self.name)


class DoctorSpeciality(models.Model):
    """Doctor specialities"""

    name = models.CharField(max_length=30)

    def __str__(self) -> str:
        return str(self.name)


class DoctorStatus(enum.Enum):
    """Doctor approval status"""

    PENDING_APPROVAL = 0
    REJECTED = 1
    APPROVED = 2
    DELETED = 3


class Doctor(models.Model):
    """Doctor info"""

    full_name = models.CharField(max_length=100)
    categories = models.ManyToManyField(DoctorCategory, blank=True)
    specialities = models.ManyToManyField(DoctorSpeciality, blank=True)
    address = models.CharField(max_length=200)
    phones = ArrayField(PhoneNumberField(), default=list, null=True, blank=True)
    websites = ArrayField(models.URLField(), default=list, null=True, blank=True)
    # added_by  # TODO
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = enum.EnumField(DoctorStatus, default=DoctorStatus.PENDING_APPROVAL)

    def __str__(self) -> str:
        return str(self.full_name)
