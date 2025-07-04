from django.contrib import admin
from .models import (
    Category,
    Type,
    Series,
    ProductField,
    Stock,
    Module,
    Article,
    Comment,
    Like
    )

admin.site.register(Category)
admin.site.register(Type)
admin.site.register(Series)
admin.site.register(ProductField)
admin.site.register(Stock)
admin.site.register(Module)
admin.site.register(Comment)
admin.site.register(Like)

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_published', 'created_at')
    list_filter = ('is_published',)
    search_fields = ('title',)
