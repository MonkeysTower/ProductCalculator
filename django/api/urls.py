from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import (
    CategoryListView,
    TypeListView,
    SeriesListView,
    ProductFieldListView,
    StockListView,
    CalculateCostView,
    LatestArticleView,
    register_user,
    support_user,
    get_csrf_token,
    user_logout,
)

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("types/", TypeListView.as_view(), name="type-list"),
    path("series/", SeriesListView.as_view(), name="series-list"),
    path("product-fields/", ProductFieldListView.as_view(), name="product-field-list"),
    path("stock/", StockListView.as_view(), name="stock-list"),
    path("calculate-cost/", CalculateCostView.as_view(), name="calculate-cost"),
    path("register/", register_user, name="register_user"),
    path("support/", support_user, name="support_user"),
    path("get-csrf-token/", get_csrf_token, name="get_csrf_token"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("logout/", user_logout, name="user_logout"),
    path("latest-article/", LatestArticleView.as_view(), name="latest_article"),
]
