from django.contrib import admin
from .models import Category, Type, Series, ProductField, Stock, Module

admin.site.register(Category)
admin.site.register(Type)
admin.site.register(Series)
admin.site.register(ProductField)
admin.site.register(Stock)
admin.site.register(Module)

# Register your models here.
