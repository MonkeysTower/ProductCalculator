import logging
import importlib
import json
from django.contrib.auth import authenticate, login
from django.core.mail import send_mail
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
from django.core.cache import cache
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import (
    Category, 
    Type, 
    Series, 
    ProductField, 
    Stock, 
    Module,
    Article
)
from .serializers import (
    CategorySerializer,
    TypeSerializer,
    SeriesSerializer,
    ProductFieldSerializer,
    StockSerializer,
    ArticleSerializer
    )

logger = logging.getLogger(__name__)

class CategoryListView(APIView):
    def get(self, request):
        cached_categories = cache.get('categories')
        if not cached_categories:
            try:
                categories = Category.objects.all()
                serializer = CategorySerializer(categories, many=True)
                cache.set('categories', serializer.data, timeout=1200)
                logger.info("Categories fetched successfully.")
                return Response(serializer.data)
            except Exception as e:
                logger.error(f"Error fetching categories: {str(e)}")
                return Response({"error": "Internal server error"}, status=500)
        return Response(cached_categories)


class TypeListView(APIView):
    def get(self, request):
        category_id = request.GET.get("category_id")
        cache_key = f'types_{category_id}'
        cached_types = cache.get(cache_key)
        if not cached_types:
            types = Type.objects.filter(category_id=category_id)
            serializer = TypeSerializer(types, many=True)
            cache.set(cache_key, serializer.data, timeout=300)
            return Response(serializer.data)
        return Response(cached_types)


class SeriesListView(APIView):
    def get(self, request):
        type_id = request.GET.get("type_id")
        cache_key = f'series_{type_id}'
        cached_series = cache.get(cache_key)
        if not cached_series:
            series = Series.objects.filter(type_id=type_id)
            serializer = SeriesSerializer(series, many=True)
            cache.set(cache_key, serializer.data, timeout=300)
            return Response(serializer.data)
        return Response(cached_series)


class ProductFieldListView(APIView):
    def get(self, request):
        series_id = request.GET.get("series_id")
        fields = ProductField.objects.filter(series_id=series_id)
        serializer = ProductFieldSerializer(fields, many=True)
        return Response(serializer.data)


class StockListView(APIView):
    def get(self, request):
        stock = Stock.objects.all()
        serializer = StockSerializer(stock, many=True)
        return Response(serializer.data)


class CalculateCostView(APIView):
    authentication_classes = [JWTAuthentication]  # Используем JWT для аутентификации
    permission_classes = [IsAuthenticated]

    def post(self, request):
        series_id = request.data.get("series_id")
        data = request.data.get("data")
        if not series_id or not data:
            return Response(
                {"error": "Both 'series_id' and 'data' are required."},
                status=400
            )
        try:
            module = Module.objects.get(series_id=series_id)
            module_path = module.module_path
            calculate_module = importlib.import_module(module_path)
            cost = calculate_module.calculate_cost(data)
            return Response({"cost": cost})
        except Exception as e:
            return Response({"error": str(e)}, status=400)

def user_login(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)  # Парсим JSON из тела запроса
            username = body.get("username")
            password = body.get("password")
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({"success": True, "message": "Вход выполнен успешно."})
            else:
                return JsonResponse({"success": False, "message": "Неверный логин или пароль."})
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Неверный формат данных."}, status=400)
    return JsonResponse({"success": False, "message": "Метод не поддерживается."}, status=405)

def register_user(request):
    if request.method == "POST":
        try:
            # Получаем данные из тела запроса в формате JSON
            body = json.loads(request.body)
            company_name = body.get("company_name")
            inn = body.get("inn")
            region = body.get("region")
            phone = body.get("phone")
            email = body.get("email")

            # Проверяем, что все обязательные поля переданы
            if not all([company_name, inn, region, phone, email]):
                return JsonResponse(
                    {"success": False, "message": "Необходимо заполнить все обязательные поля."},
                    status=400,
                )

            # Формируем сообщение для администратора
            message = (
                f"Данные указанные при регистрации:\n\n"
                f"Компания: {company_name}\n"
                f"ИНН: {inn}\n"
                f"Регион: {region}\n"
                f"Телефон: {phone}\n"
                f"Email: {email}"
            )
            
            # Отправляем письмо администратору
            try:
                send_mail(
                    "Запрос на регистрацию",
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [settings.REACT_APP_ADMIN_EMAIL],
                    fail_silently=False,
                )
            except Exception as e:
                return JsonResponse(
                    {"success": False, "message": f"Ошибка отправки письма: {str(e)}"},
                    status=500,
                )

            return JsonResponse({"success": True, "message": "Регистрация прошла успешно."})

        except json.JSONDecodeError:
            return JsonResponse(
                {"success": False, "message": "Неверный формат данных. Ожидался JSON."},
                status=400,
            )
        except Exception as e:
            return JsonResponse(
                {"success": False, "message": f"Ошибка сервера: {str(e)}"},
                status=500,
            )

    return JsonResponse({"success": False, "message": "Метод не поддерживается."}, status=405)

def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({"csrfToken": token})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(request):
    try:
        refresh_token = request.data.get("refresh_token")
        token = RefreshToken(refresh_token)
        token.blacklist()
        return JsonResponse({"success": True, "message": "Выход выполнен успешно."})
    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)}, status=400)
    
class LatestArticleView(APIView):
    def get(self, request):
        cached_article = cache.get('latest_article')
        if not cached_article:
            article = Article.objects.filter(is_published=True).order_by('-created_at').first()
            if article:
                serializer = ArticleSerializer(article)
                cached_article = serializer.data
                cache.set('latest_article', cached_article, timeout=3600)  # Кэширование на 1 час
            else:
                return Response({"detail": "Статья не найдена"}, status=404)
        return Response(cached_article)