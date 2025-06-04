FROM python:3.11.9-slim

# Установка рабочей директории
WORKDIR /app
RUN mkdir -p $WORKDIR/static
RUN mkdir -p $WORKDIR/media

# Обновим pip
RUN pip install --upgrade pip

# Копирование требований в контейнер
COPY django/requirements.txt .

# Установка зависимостей
RUN pip install --no-cache-dir -r requirements.txt

# Копирование .env
COPY .env .env

# Копирование исходного кода приложения
COPY django/ .

# Сборка статических файлов
#RUN python manage.py collectstatic --noinput

# Выполняем entrypoint
#ENTRYPOINT ["/app/entrypoint.sh"]

# Открытие порта для Django-сервера
#EXPOSE 8000

# Команда для запуска сервера
#CMD ["gunicorn", "CalculationWebSite.wsgi:application", "--bind", "0.0.0.0:8000"]