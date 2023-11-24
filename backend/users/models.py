from django.db import models

from doctors.models.doctor import Doctor


class User(models.Model):
    """
    An auth0 user.
    """

    remote_id = models.CharField(max_length=200, blank=True)
    saved_doctors = models.ManyToManyField(Doctor, blank=True)

    def __str__(self) -> str:
        return self.remote_id
