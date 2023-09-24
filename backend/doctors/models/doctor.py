from django.db import models
from django.contrib.postgres.fields import ArrayField
from model_utils.fields import StatusField, MonitorField
from model_utils import Choices
from phonenumber_field.modelfields import PhoneNumberField

from .doctorCategory import DoctorCategory
from .doctorSpeciality import DoctorSpeciality


class Doctor(models.Model):
    """
    A doctor info.
    """

    GENDER_CHOICES = (
        ("M", "Male"),
        ("F", "Female"),
    )

    STATUS = Choices("PENDING_APPROVAL", "APPROVED", "REJECTED")

    full_name = models.CharField(max_length=100, unique=True)
    gender = models.CharField(
        max_length=1, choices=GENDER_CHOICES, default=GENDER_CHOICES[0][0]
    )
    categories = models.ManyToManyField(DoctorCategory, blank=True)
    specialities = models.ManyToManyField(DoctorSpeciality, blank=True)
    websites = ArrayField(models.URLField(), default=list, null=True, blank=True)
    i_care_better = models.URLField(blank=True)
    nancys_nook = models.BooleanField(default=False)
    image = models.ImageField(blank=True, null=True, upload_to="images")
    status = StatusField()
    # added_by  # TODO
    added_at = models.DateTimeField(auto_now_add=True, null=True)
    approved_at = MonitorField(monitor="status", when=["APPROVED"], null=True)  # type: ignore
    rejected_at = MonitorField(monitor="status", when=["REJECTED"], null=True)  # type: ignore
    updated_at = models.DateTimeField(auto_now=True, null=True)
    # reviews - one-to-many
    # average rating - calculated

    def __str__(self) -> str:
        return str(self.full_name)


class DoctorLocation(models.Model):
    """
    A doctor location.
    Doctor might have multiple locations.
    """

    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    hospital_name = models.CharField(max_length=200, blank=True)
    address = models.CharField(max_length=200, blank=True)
    phone = PhoneNumberField(null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    private_only = models.BooleanField(default=False)

    class Meta:
        unique_together = ["doctor", "hospital_name"]

    def __str__(self) -> str:
        return f"{self.address} / {self.hospital_name}"
