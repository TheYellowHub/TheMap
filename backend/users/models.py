from django.db import models
from django.db.models.signals import pre_delete
from django.dispatch import receiver


class User(models.Model):
    """
    An auth0 user.
    """

    remote_id = models.CharField(max_length=200, unique=True)
    username = models.CharField(max_length=50, unique=True, blank=True, null=True)
    saved_doctors = models.ManyToManyField("doctors.Doctor", blank=True)

    def __str__(self) -> str:
        return self.remote_id.replace("|", ".")
    
    def __hash__(self):
        return hash(str(self))

    def __eq__(self, __value: object) -> bool:
        return str(self) == str(__value)
        
    def delete_remote_user(self):
        print("delete_remote_user...")


@receiver(pre_delete, sender=User)
def delete_remote_user(sender, instance: User, using, **kwargs):
    instance.delete_remote_user()
