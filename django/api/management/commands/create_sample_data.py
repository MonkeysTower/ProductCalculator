from django.core.management.base import BaseCommand
from api.utils import create_sample_data

class Command(BaseCommand):
    help = "Создает пример данных для пользователя и генерирует модуль расчета"

    def handle(self, *args, **kwargs):
        try:
            self.stdout.write("Начинаем создание примера данных...")
            create_sample_data()
            self.stdout.write(self.style.SUCCESS("Пример данных успешно создан!"))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Ошибка: {str(e)}"))