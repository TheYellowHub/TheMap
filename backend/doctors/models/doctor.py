from django.db import models
from model_utils.fields import StatusField, MonitorField
from model_utils import Choices
from phonenumber_field.modelfields import PhoneNumberField

from .abstractCacheRelatedClass import AbstractCacheRelatedClass
from .doctorCategory import DoctorCategory
from .doctorSpeciality import DoctorSpeciality
from .review import DoctorReview


class Doctor(AbstractCacheRelatedClass):
    """
    A doctor info.
    """

    GENDER_CHOICES = (
        ("M", "Male"),
        ("F", "Female"),
    )

    STATUS = Choices("PENDING_APPROVAL", "APPROVED", "REJECTED", "DELETED", "RETIRED", "PASSED AWAY")

    full_name = models.CharField(max_length=100)
    gender = models.CharField(
        max_length=1, choices=GENDER_CHOICES, default=GENDER_CHOICES[0][0]
    )
    category = models.ForeignKey(
        DoctorCategory, blank=True, null=True, on_delete=models.SET_NULL
    )
    specialities = models.ManyToManyField(DoctorSpeciality, blank=True)
    i_care_better = models.URLField(blank=True)
    nancys_nook = models.BooleanField(default=False)
    image = models.ImageField(blank=True, null=True, upload_to="images")
    status = StatusField()
    added_by = models.ForeignKey(
        "users.User", blank=True, null=True, on_delete=models.SET_NULL
    )
    added_at = models.DateTimeField(auto_now_add=True, null=True)
    approved_at = MonitorField(monitor="status", when=["APPROVED"], null=True, blank=True, default=None)  # type: ignore
    rejected_at = MonitorField(monitor="status", when=["REJECTED"], null=True, blank=True, default=None)  # type: ignore
    updated_at = models.DateTimeField(auto_now=True, null=True)
    internal_notes = models.CharField(max_length=100, blank=True, null=True)


    def __str__(self) -> str:
        return str(self.full_name)

    @property
    def reviews(self) -> list[DoctorReview]:
        return list(DoctorReview.objects.filter(doctor=self, status="APPROVED"))

    @property
    def num_of_reviews(self) -> int:
        return len(self.reviews)

    @property
    def avg_rating(self) -> float | None:
        ratings = [review.rating for review in self.reviews if review.rating]
        return (float(sum(ratings)) / len(ratings)) if ratings else None
    

class DoctorLocation(models.Model):
    """
    A doctor location.
    Doctor might have multiple locations.
    """

    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    hospital_name = models.CharField(
        max_length=200, blank=True, null=True
    )
    long_address = models.CharField(max_length=200, blank=True)
    short_address = models.CharField(max_length=200, blank=True)
    lat = models.DecimalField(max_digits=22, decimal_places=16, blank=True, null=True)
    lng = models.DecimalField(max_digits=22, decimal_places=16, blank=True, null=True)
    phone = PhoneNumberField(null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    private_only = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"{self.long_address} / {self.hospital_name}"
