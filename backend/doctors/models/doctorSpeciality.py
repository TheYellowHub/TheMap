from django.db import models


class DoctorSpeciality(models.Model):
    """Doctor specialities"""

    name = models.CharField(max_length=30)

    def __str__(self) -> str:
        return str(self.name)
