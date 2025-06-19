import sys
import os
import shutil
import tempfile
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Category, Type, Series, Module


class APITests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.category = Category.objects.create(
            name="Test Category", image=""
        )
        self.type = Type.objects.create(
            name="Test Type", category=self.category, image=""
        )
        self.series = Series.objects.create(
            name="Test Series", type=self.type, image=""
        )

        # Создаем временный файл для модуля расчета
        self.temp_module_dir = tempfile.mkdtemp()
        self.module_path = os.path.join(self.temp_module_dir, "calculate_test.py")
        with open(self.module_path, "w") as f:
            f.write("""
def calculate_cost(data):
    if data == "крашен./некраш.":
        return 1000
    return 0
""")

        sys.path.append(self.temp_module_dir)

        # Создаем запись в базе данных для модуля
        self.module = Module.objects.create(
            series=self.series,
            module_path=f"calculate_test"
        )

        self.series.fields.create(
            field_name="Test Field",
            field_type="number",
            options=[1, 2, 3],
            custom_true="Yes",
            custom_false="No"
        )

        self.user = User.objects.create_user(
            username="testuser", password="testpassword"
        )
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)

    def tearDown(self):
        # Remove the temporary directory from sys.path
        if self.temp_module_dir in sys.path:
            sys.path.remove(self.temp_module_dir)

        # Delete the temporary files and directory
        if os.path.exists(self.module_path):
            os.remove(self.module_path)
        if os.path.exists(self.temp_module_dir):
            shutil.rmtree(self.temp_module_dir)

    def test_category_list(self):
        """Тестирование получения списка категорий."""
        url = reverse('category-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Test Category")

    def test_type_list(self):
        """Тестирование получения списка типов для конкретной категории."""
        url = reverse('type-list')
        response = self.client.get(url, {'category_id': self.category.id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Test Type")

    def test_series_list(self):
        """Тестирование получения списка серий для конкретного типа."""
        url = reverse('series-list')  # URL для списка серий
        response = self.client.get(url, {'type_id': self.type.id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Test Series")

    def test_product_fields_list(self):
        """Тестирование получения полей для расчета себестоимости."""
        url = reverse('product-field-list')
        response = self.client.get(url, {'series_id': self.series.id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['field_name'], "Test Field")
        self.assertEqual(response.data[0]['field_type'], "number")

    def test_calculate_cost(self):
        url = reverse('calculate-cost')
        data = {
            'series_id': self.series.id,
            'data': "крашен./некраш."
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertIn('cost', response.data)
        self.assertEqual(response.data['cost'], 1000)