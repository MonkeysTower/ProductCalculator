'''from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)

class ProductType(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

class Series(models.Model):
    product_type = models.ForeignKey(ProductType, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    calculation_module = models.FileField(upload_to='calculation_modules/')

class StorageItem(models.Model):
    series = models.ForeignKey(Series, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()

class UserRequest(models.Model):
    user_name = models.CharField(max_length=200)
    contact_info = models.CharField(max_length=200)
    subject = models.CharField(max_length=200)
    message = models.TextField()
'''
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)

    def __str__(self):
        return self.name


class Type(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='types/', blank=True, null=True)

    def __str__(self):
        return f"{self.category.name} - {self.name}"


class Series(models.Model):
    type = models.ForeignKey(Type, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='series/', blank=True, null=True)

    def __str__(self):
        return f"{self.type.name} - {self.name}"


class ProductField(models.Model):
    series = models.ForeignKey(Series, on_delete=models.CASCADE, related_name="fields")
    field_name = models.CharField(max_length=100)
    field_type = models.CharField(
        max_length=20,
        choices=[
            ("number", "Number"),
            ("text", "Text"),
            ("boolean", "Boolean"),
            ("select", "Select"),
        ],
    )
    options = models.JSONField(blank=True, null=True)  # Для выпадающих списков
    custom_true = models.CharField(max_length=50, blank=True, null=True)  # Кастомное значение True
    custom_false = models.CharField(max_length=50, blank=True, null=True)  # Кастомное значение False

    def __str__(self):
        return f"{self.series.name} - {self.field_name}"


class Stock(models.Model):
    series = models.ForeignKey(Series, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.series.name} - {self.price} ({self.quantity})"


class Module(models.Model):
    series = models.OneToOneField(Series, on_delete=models.CASCADE)
    module_path = models.CharField(max_length=255)

    def __str__(self):
        return f"Module for {self.series.name}"