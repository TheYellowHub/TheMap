from django.urls import reverse
from rest_framework.fields import json
from rest_framework.test import APITransactionTestCase
from rest_framework import status

from ..models.doctorCategory import DoctorCategory


class DoctorCategoryTests(APITransactionTestCase):
    """
    Doctor catory model related test
    """

    reset_sequences = True

    def list_categories(self):
        """
        List all categories.
        """
        url = reverse("list-categories")
        response = self.client.get(url)
        return response.status_code, json.loads(response.content)

    def create_category(self, name):
        """
        Create a category.
        """
        url = reverse("create-category")
        data = {"name": name}
        response = self.client.post(url, data, format="json")
        return response.status_code, json.loads(response.content)

    def update_category(self, pk, name, active):
        """
        Update an existing category.
        """
        url = reverse("update-category", kwargs={"pk": pk})
        data = {"name": name, "active": active}
        response = self.client.patch(url, data, format="json")
        return response.status_code, json.loads(response.content)

    def test_list_categories(self):
        """
        Ensure we can list the category objects
        """
        names = ("item-1", "item-2", "item-3")
        for name in names:
            self.create_category(name=name)
        self.assertEqual(DoctorCategory.objects.count(), len(names))

        status_code, data = self.list_categories()
        self.assertEqual(status_code, status.HTTP_200_OK)
        self.assertEqual(
            data,
            [
                {"id": i + 1, "name": name, "active": True}
                for (i, name) in enumerate(names)
            ],
        )

    def test_create_category(self):
        """
        Ensure we can create a new category object.
        """
        names = ("new-1", "new-2")
        for i, name in enumerate(names):
            pk = i + 1
            status_code, data = self.create_category(name=name)
            self.assertEqual(status_code, status.HTTP_201_CREATED)
            self.assertEqual(data, {"id": pk, "name": name, "active": True})
            self.assertEqual(DoctorCategory.objects.latest("id").name, name)
            self.assertEqual(DoctorCategory.objects.latest("id").pk, pk)
            self.assertEqual(DoctorCategory.objects.count(), pk)

    def test_update_category(self):
        """
        Ensure we can update an existing category object.
        """
        names = ("initial-name", "new-name")
        self.create_category(name=names[0])
        pk = DoctorCategory.objects.latest("id").pk
        counts = DoctorCategory.objects.count()
        status_code, data = self.update_category(pk=pk, name=names[1], active=False)
        self.assertEqual(status_code, status.HTTP_200_OK)
        self.assertEqual(data, {"id": pk, "name": names[1], "active": False})
        self.assertEqual(DoctorCategory.objects.latest("id").name, names[1])
        self.assertEqual(DoctorCategory.objects.latest("id").pk, pk)
        self.assertEqual(DoctorCategory.objects.count(), counts)
