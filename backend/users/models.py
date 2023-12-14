from django.db import models

from doctors.models.doctor import Doctor


class User(models.Model):
    """
    An auth0 user.
    """

    remote_id = models.CharField(max_length=200, unique=True)
    username = models.CharField(max_length=50, unique=True, blank=True, null=True)
    saved_doctors = models.ManyToManyField(Doctor, blank=True)

    def __str__(self) -> str:
        return self.remote_id.replace("|", ".")

    def __eq__(self, __value: object) -> bool:
        return str(self) == str(__value)
