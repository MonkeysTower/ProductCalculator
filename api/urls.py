from django.urls import path
from .views import (
    CategoryListView,
    TypeListView,
    SeriesListView,
    ProductFieldListView,
    StockListView,
    CalculateCostView,
    login_view,
)

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("types/", TypeListView.as_view(), name="type-list"),
    path("series/", SeriesListView.as_view(), name="series-list"),
    path("product-fields/", ProductFieldListView.as_view(), name="product-field-list"),
    path("stock/", StockListView.as_view(), name="stock-list"),
    path("calculate-cost/", CalculateCostView.as_view(), name="calculate-cost"),
    path('login/', login_view, name='login'),
]