from django.urls import reverse
from rest_framework.fields import json
from rest_framework.test import APITransactionTestCase
from rest_framework import status

from ..models.doctorSpeciality import DoctorSpeciality


class DoctorSpecialityTests(APITransactionTestCase):
    """
    Doctor speciality model related test
    """

    reset_sequences = True

    def list_specialities(self):
        """
        List all specialities.
        """
        url = reverse("list-specialities")
        response = self.client.get(url)
        return response.status_code, json.loads(response.content)

    def create_speciality(self, name):
        """
        Create a speciality.
        """
        url = reverse("create-speciality")
        data = {"name": name}
        response = self.client.post(url, data, format="json")
        return response.status_code, json.loads(response.content)

    def update_speciality(self, pk, name, active):
        """
        Update an existing speciality.
        """
        url = reverse("update-speciality", kwargs={"pk": pk})
        data = {"name": name, "active": active}
        response = self.client.patch(url, data, format="json")
        return response.status_code, json.loads(response.content)

    def test_list_specialities(self):
        """
        Ensure we can list the speciality objects
        """
        names = ("item-1", "item-2", "item-3")
        for name in names:
            self.create_speciality(name=name)
        self.assertEqual(DoctorSpeciality.objects.count(), len(names))

        status_code, data = self.list_specialities()
        self.assertEqual(status_code, status.HTTP_200_OK)
        self.assertEqual(
            data,
            [
                {"id": i + 1, "name": name, "active": True}
                for (i, name) in enumerate(names)
            ],
        )

    def test_create_speciality(self):
        """
        Ensure we can create a new speciality object.
        """
        names = ("new-1", "new-2")
        for i, name in enumerate(names):
            pk = i + 1
            status_code, data = self.create_speciality(name=name)
            self.assertEqual(status_code, status.HTTP_201_CREATED)
            self.assertEqual(data, {"id": pk, "name": name, "active": True})
            self.assertEqual(DoctorSpeciality.objects.latest("id").name, name)
            self.assertEqual(DoctorSpeciality.objects.latest("id").pk, pk)
            self.assertEqual(DoctorSpeciality.objects.count(), pk)

    def test_update_speciality(self):
        """
        Ensure we can update an existing speciality object.
        """
        names = ("initial-name", "new-name")
        self.create_speciality(name=names[0])
        pk = DoctorSpeciality.objects.latest("id").pk
        counts = DoctorSpeciality.objects.count()
        status_code, data = self.update_speciality(pk=pk, name=names[1], active=False)
        self.assertEqual(status_code, status.HTTP_200_OK)
        self.assertEqual(data, {"id": pk, "name": names[1], "active": False})
        self.assertEqual(DoctorSpeciality.objects.latest("id").name, names[1])
        self.assertEqual(DoctorSpeciality.objects.latest("id").pk, pk)
        self.assertEqual(DoctorSpeciality.objects.count(), counts)
