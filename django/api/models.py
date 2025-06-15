from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to="categories/", blank=True, null=True)

    def __str__(self):
        return self.name


class Type(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to="types/", blank=True, null=True)

    def __str__(self):
        return f"{self.category.name} - {self.name}"


class Series(models.Model):
    type = models.ForeignKey(Type, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to="series/", blank=True, null=True)

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
    custom_true = models.CharField(
        max_length=50, blank=True, null=True
    )  # Кастомное значение True
    custom_false = models.CharField(
        max_length=50, blank=True, null=True
    )  # Кастомное значение False

    def __str__(self):
        return f"{self.series.name} - {self.field_name}"


class Stock(models.Model):
    name = models.CharField(max_length=100, default="Unnamed Stock")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.name} - {self.price} ({self.quantity})"


class Module(models.Model):
    series = models.OneToOneField(Series, on_delete=models.CASCADE)
    module_path = models.CharField(max_length=255)

    def __str__(self):
        return f"Module for {self.series.name}"


class Article(models.Model):
    title = models.CharField(max_length=200, verbose_name="Заголовок")
    content = models.TextField(verbose_name="Содержание")
    image_url = models.URLField(
        blank=True, null=True, verbose_name="Ссылка на изображение (из интернета)"
    )
    image_file = models.ImageField(
        upload_to="articles/",
        blank=True,
        null=True,
        verbose_name="Изображение (локальное)",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    is_published = models.BooleanField(default=True, verbose_name="Опубликовано")

    def get_image(self):
        if self.image_file:
            return self.image_file.url
        elif self.image_url:
            return self.image_url
        return None

    def __str__(self):
        return self.title


class Comment(models.Model):
    article = models.ForeignKey(Article, related_name="comments", on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.full_name} on {self.article.title}"


class Like(models.Model):
    article = models.ForeignKey(Article, related_name="likes", on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('article', 'user')