import logging
import importlib
import json
from django.contrib.auth import authenticate, login
from django.core.mail import send_mail
from django.middleware.csrf import get_token
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
    Article,
    Comment,
    Like
)
from .serializers import (
    CategorySerializer,
    TypeSerializer,
    SeriesSerializer,
    ProductFieldSerializer,
    StockSerializer,
    ArticleSerializer,
    CommentSerializer
)


logger = logging.getLogger(__name__)


def log_request_and_user_info(request, error_message=None):
    """Вспомогательная функция для логгирования данных запроса и пользователя."""
    try:
        username = request.user.username if request.user.is_authenticated else "Anonymous"
    except AttributeError:
        username = "Anonymous"

    try:
        body = json.loads(request.data) if request.data else {}
    except json.JSONDecodeError:
        body = {"error": "Invalid JSON in request body"}

    endpoint = request.path

    if error_message:
        logger.error(
            f"Endpoint: {endpoint}, User: {username}, Request Body: {body}, Error: {error_message}"
            )
    else:
        logger.info(f"Endpoint: {endpoint}, User: {username}, Request Body: {body}")


class CategoryListView(APIView):
    def get(self, request):
        cached_categories = cache.get("categories")
        if not cached_categories:
            try:
                categories = Category.objects.all()
                serializer = CategorySerializer(categories, many=True)
                cache.set("categories", serializer.data, timeout=1200)
                logger.info(
                    f"Endpoint: {request.path}, User: {request.user.username} "
                    "- Categories fetched successfully and cached."
                )
                return Response(serializer.data)
            except Exception as e:
                log_request_and_user_info(request, str(e))
                return Response({"error": "Internal server error"}, status=500)
        return Response(cached_categories)


class TypeListView(APIView):
    def get(self, request):
        category_id = request.GET.get("category_id")
        cache_key = f"types_{category_id}"
        cached_types = cache.get(cache_key)
        if not cached_types:
            try:
                types = Type.objects.filter(category_id=category_id)
                serializer = TypeSerializer(types, many=True)
                cache.set(cache_key, serializer.data, timeout=300)
                logger.info(
                    f"Endpoint: {request.path}, User: {request.user.username} "
                    f"- Types for category_id={category_id} fetched and cached."
                )
                return Response(serializer.data)
            except Exception as e:
                log_request_and_user_info(request, str(e))
                return Response({"error": "Internal server error"}, status=500)
        logger.info(
            f"Endpoint: {request.path}, User: {request.user.username} "
            f"- Types for category_id={category_id} retrieved from cache."
        )
        return Response(cached_types)


class SeriesListView(APIView):
    def get(self, request):
        type_id = request.GET.get("type_id")
        cache_key = f"series_{type_id}"
        cached_series = cache.get(cache_key)
        if not cached_series:
            try:
                series = Series.objects.filter(type_id=type_id)
                serializer = SeriesSerializer(series, many=True)
                cache.set(cache_key, serializer.data, timeout=300)
                logger.info(
                    f"Endpoint: {request.path}, User: {request.user.username} "
                    f"- Series for type_id={type_id} fetched and cached."
                )
                return Response(serializer.data)
            except Exception as e:
                log_request_and_user_info(request, str(e))
                return Response({"error": "Internal server error"}, status=500)
        logger.info(
            f"Endpoint: {request.path}, User: {request.user.username} "
            f"- Series for type_id={type_id} retrieved from cache."
        )
        return Response(cached_series)


class ProductFieldListView(APIView):
    def get(self, request):
        series_id = request.GET.get("series_id")
        fields = ProductField.objects.filter(series_id=series_id)
        serializer = ProductFieldSerializer(fields, many=True)
        logger.info(
            f"Endpoint: {request.path}, User: {request.user.username} "
            f"- All fields for series_id={series_id} fetched"
        )
        return Response(serializer.data)


class StockListView(APIView):
    def get(self, request):
        stock = Stock.objects.all()
        serializer = StockSerializer(stock, many=True)
        logger.info(
            f"Endpoint: {request.path}, User: {request.user.username} "
            "- All stock items fetched"
        )
        return Response(serializer.data)


class CalculateCostView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        series_id = request.data.get("series_id")
        data = request.data.get("data")
        if not series_id or not data:
            error_message = "Both 'series_id' and 'data' are required."
            log_request_and_user_info(request, error_message)
            return Response({"error": error_message}, status=400)

        try:
            module = Module.objects.get(series_id=series_id)
            module_path = module.module_path
            calculate_module = importlib.import_module(module_path)
            cost = calculate_module.calculate_cost(data)
            logger.info(
                f"Endpoint: {request.path} - User: {request.user.username}, "
                f"Request: {request.data}, Response: {{'cost': {cost}}}"
            )
            return Response({"cost": cost})
        except Exception as e:
            error_message = str(e)
            log_request_and_user_info(request, error_message)
            return Response({"error": str(e)}, status=400)


def user_login(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            username = body.get("username")
            password = body.get("password")
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse(
                    {"success": True, "message": "Вход выполнен успешно."}
                )
            else:
                return JsonResponse(
                    {"success": False, "message": "Неверный логин или пароль."}
                )
        except json.JSONDecodeError:
            return JsonResponse(
                {"success": False, "message": "Неверный формат данных."}, status=400
            )
    return JsonResponse(
        {"success": False, "message": "Метод не поддерживается."}, status=405
    )


def register_user(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            company_name = body.get("company_name")
            inn = body.get("inn")
            region = body.get("region")
            phone = body.get("phone")
            email = body.get("email")
            message = (
                f"Данные указанные при регистрации:\n\n"
                f"Компания: {company_name}\n"
                f"ИНН: {inn}\n"
                f"Регион: {region}\n"
                f"Телефон: {phone}\n"
                f"Email: {email}"
            )
            try:
                send_mail(
                    "Запрос на регистрацию",
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [settings.EMAIL_ADMIN],
                    fail_silently=False,
                )
            except Exception as e:
                error_message = f"Ошибка отправки письма: {str(e)}"
                log_request_and_user_info(request, error_message)
                return JsonResponse(
                    {"success": False, "message": error_message}, status=500
                )
            logger.info(
                f"Endpoint: {request.path} - Registration successful "
                f"for company='{company_name}'."
            )
            return JsonResponse(
                {"success": True, "message": "Регистрация прошла успешно."}
            )
        except json.JSONDecodeError:
            error_message = "Invalid JSON format in registration request."
            log_request_and_user_info(request, error_message)
            return JsonResponse(
                {"success": False, "message": "Неверный формат данных. Ожидался JSON."},
                status=400,
            )
        except Exception as e:
            error_message = f"Server error during registration: {str(e)}"
            log_request_and_user_info(request, error_message)
            return JsonResponse(
                {"success": False, "message": error_message}, status=500
            )
    error_message = "Unsupported method used for registration."
    log_request_and_user_info(request, error_message)
    return JsonResponse(
        {"success": False, "message": "Метод не поддерживается."}, status=405
    )


def support_user(request):
    if request.method == "POST":
        try:
            # Получаем данные из тела запроса в формате JSON
            body = json.loads(request.body)
            username = body.get("username")
            contact_info= body.get("contact_info")
            subject = body.get("subject")
            user_message = body.get("message")

            # Формируем сообщение для администратора
            message = (
                f"Запрос в тех.поддержку:\n\n"
                f"Имя: {username}\n"
                f"Контактная информация: {contact_info}\n\n"
                f"Тема сообщения: {subject}\n"
                f"Содержание сообщения: {user_message}\n"
            )

            # Отправляем письмо администратору
            try:
                send_mail(
                    "СЛУЧИЛАСЬ БЕДА!",
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [settings.SUPPORT_EMAIL],
                    fail_silently=False,
                )
            except Exception as e:
                return JsonResponse(
                    {"success": False, "message": f"Ошибка отправки письма: {str(e)}"},
                    status=500,
                )

            return JsonResponse(
                {"success": True, "message": "Запрос успешно отправлен."}
            )

        except json.JSONDecodeError:
            return JsonResponse(
                {"success": False, "message": "Неверный формат данных. Ожидался JSON."},
                status=400,
            )
        except Exception as e:
            return JsonResponse(
                {"success": False, "message": f"Ошибка сервера: {str(e)}"}, status=500
            )

    return JsonResponse(
        {"success": False, "message": "Метод не поддерживается."}, status=405
    )


def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({"csrfToken": token})


@api_view(["POST"])
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
        article = (
            Article.objects.filter(is_published=True)
            .order_by("-created_at")
            .first()
        )
        if not article:
            return Response({"detail": "Статья не найдена"}, status=404)
        serializer = ArticleSerializer(article, context={"request": request})
        return Response(serializer.data)

class AddCommentView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, article_id):
        try:
            article = Article.objects.get(id=article_id)
            text = request.data.get("text")
            if not text:
                return Response({"error": "Текст обязателен"}, status=400)

            # Получаем имя и фамилию из профиля пользователя
            full_name = f"{request.user.first_name} {request.user.last_name}"

            comment = Comment.objects.create(
                article=article,
                user=request.user,
                full_name=full_name,
                text=text
            )
            serializer = CommentSerializer(comment)
            return Response(serializer.data, status=201)
        except Article.DoesNotExist:
            return Response({"error": "Статья не найдена"}, status=404)


class ToggleLikeView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, article_id):
        try:
            article = Article.objects.get(id=article_id)
            like, created = Like.objects.get_or_create(article=article, user=request.user)
            if not created:
                like.delete()
                return Response({"message": "Лайк удален"}, status=200)
            return Response({"message": "Лайк добавлен"}, status=201)
        except Article.DoesNotExist:
            return Response({"error": "Статья не найдена"}, status=404)