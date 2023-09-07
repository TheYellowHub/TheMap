"""
Doctors app serializers
"""

from rest_framework import serializers

from . import models


class DoctorSerializer(serializers.ModelSerializer):
    """Doctor serializer"""

    class Meta:
        model = models.Doctor
        fields = "__all__"

    categories = serializers.SerializerMethodField()
    specialities = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    def get_categories(self, instance: models.Doctor):
        """Rreturns doctor's categories as a str[]"""
        return [str(category) for category in instance.categories.all()]

    def get_specialities(self, instance: models.Doctor):
        """Rreturns doctor's specialities as a str[]"""
        return [str(speciality) for speciality in instance.specialities.all()]

    def get_status(self, instance: models.Doctor):
        """Rreturns the doctor's status as a str"""
        return instance.status.name
