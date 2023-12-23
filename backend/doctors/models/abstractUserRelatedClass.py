from django.db import models
from model_utils.fields import StatusField, MonitorField
from model_utils import Choices
from rest_framework import permissions

from users.models import User


class AbstractUserRelatedClass(models.Model):
    """
    An abstarct class for doctor-related objects created and owned by users.
    """ 
    class Meta: 
        abstract = True

    REJECTED = "REJECTED"
    DELETED = "DELETED"

    CLASS_TITLE = None
    STATUS = Choices(REJECTED, DELETED)
    USER_ALLOWED_STATUSES = [DELETED]

    doctor = models.ForeignKey("doctors.Doctor", on_delete=models.CASCADE)
    description = models.TextField()
    status = StatusField()
    added_by = models.ForeignKey(User, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True, null=True)
    rejected_at = MonitorField(monitor="status", when=[REJECTED], null=True, blank=True, default=None)  # type: ignore
    deleted_at = MonitorField(monitor="status", when=[DELETED], null=True, blank=True, default=None)  # type: ignore
    updated_at = models.DateTimeField(auto_now=True, null=True)
    rejection_reason = models.TextField(blank=True, null=True)
    internal_notes = models.TextField(blank=True, null=True)

    def __str__(self) -> str:
        return f"{self.CLASS_TITLE} #{self.pk} - {self.doctor.full_name} / {self.added_by}"

    @classmethod
    def getPermissionClasses(cls):
        class PermissionClasses:
            class IsStatusAllowed(permissions.BasePermission):
                """
                Allow user to use only specific statuses.
                """

                def has_permission(_, request, view):
                    new_status = request.data.get("status")
                    permission = not new_status or new_status in cls.USER_ALLOWED_STATUSES
                    print("IsStatusAllowed", "has_permission", permission)
                    return permission

                def has_object_permission(_, request, view, object):
                    assert isinstance(object, cls)
                    new_status = request.data.get("status")
                    current_status = object.status
                    permission = (
                        not new_status and current_status in object.USER_ALLOWED_STATUSES
                    ) or (new_status and new_status in object.USER_ALLOWED_STATUSES)
                    print("IsStatusAllowed", "has_object_permission", permission)
                    return permission
                

            class IsCurrentUser(permissions.BasePermission):
                """
                Object-level permission to only allow only the relevant user to edit its details.
                """

                def has_permission(self, request, view):
                    new_user_id = request.data.get("added_by")
                    new_user = User.objects.filter(id=new_user_id).first()
                    permission = new_user == request.user
                    print(
                        "IsCurrentUser", "has_permission", permission, new_user, str(request.user)
                    )
                    return permission

                def has_object_permission(self, request, view, object):
                    assert isinstance(object, cls)
                    object_user: User = object.added_by
                    permission = object_user == request.user
                    print("IsCurrentUser", "has_object_permission", permission)
                    return permission
            
        return PermissionClasses