from django.core.cache import cache
from rest_framework.throttling import BaseThrottle
from rest_framework.exceptions import Throttled
import logging

logger = logging.getLogger(__name__)

class IPBasedThrottle(BaseThrottle):
    """
    Кастомный throttle, который применяет ограничения по IP для всех пользователей,
    разделяя лимиты для неавторизованных и авторизованных пользователей.
    """
    def allow_request(self, request, view):
        # Исключаем эндпоинты авторизации из правил throttle
        if ( 
            request.path.startswith('/api/token/') 
            or request.path.startswith('/api/token/refresh/')
            or request.path.startswith('/api/token/verify/')
            or request.path.startswith('/api/get-csrf-token/')
            or request.path.startswith('/api/logout/')
        ):
            return True


        ip_address = self.get_ident(request)
        is_authenticated = request.user and request.user.is_authenticated
        cache_key = f'throttle_ip_{ip_address}_{"auth" if is_authenticated else "anon"}'

        limit = 1000 if is_authenticated else 100

        num_requests = cache.get(cache_key, 0)
        if num_requests >= limit:
            logger.warning(f"IP {ip_address} ({'auth' if is_authenticated else 'anon'}) exceeded the request limit.")
            raise Throttled(detail="Превышен лимит запросов для вашего IP.")

        cache.set(cache_key, num_requests + 1, timeout=43200)
        return True

    def get_ident(self, request):
        """
        Получаем IP-адрес из заголовков запроса.
        """
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR', '')
        return ip