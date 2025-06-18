from rest_framework import serializers
from .models import (
    Category,
    Type,
    Series,
    ProductField,
    Stock,
    Article,
    Comment,
    Like
)
import logging

logger = logging.getLogger(__name__)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "image"]


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


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "full_name", "text", "created_at"]


class ArticleSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "content",
            "image",
            "created_at",
            "updated_at",
            "comments",
            "likes_count",
            "is_liked"
        ]

    def get_image(self, obj):
        return obj.get_image()

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        user = self.context["request"].user
        if user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False
