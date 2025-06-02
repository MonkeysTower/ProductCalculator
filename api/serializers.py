from rest_framework import serializers
from .models import (
    Category,
    Type,
    Series,
    ProductField,
    Stock,
    Article
)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name","image"]


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = ["id", "name", "image", "category"]


class SeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Series
        fields = ["id", "name", "image", "type"]


class ProductFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductField
        fields = [
            "id",
            "field_name",
            "field_type",
            "options",
            "custom_true",
            "custom_false",
        ]

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ["id", "name", "price", "quantity"]

class ArticleSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = ['title', 'content', 'image', 'created_at']

    def get_image(self, obj):
        # Используем метод модели для получения изображения
        return obj.get_image()