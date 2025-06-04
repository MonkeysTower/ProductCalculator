# Базовый образ Node.js 18
FROM node:18 AS frontend

# Установка рабочей директории
WORKDIR /app

# Копирование package.json и package-lock.json
COPY react/package*.json ./

# Установка зависимостей
RUN npm install

# Копирование остальных файлов
COPY react/ .

# Сборка фронтенда
RUN npm run build

# Копирование .env
COPY .env .env

# Публикация порта
EXPOSE 3000

# Запуск
CMD ["npm", "start"]