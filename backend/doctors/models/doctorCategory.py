from django.db import models


class DoctorCategory(models.Model):
    """Doctor category, such as: surgeon"""

    name = models.CharField(max_length=30, unique=True)
    active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return str(self.name)
