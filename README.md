# Подготовка к запуску
Предварительно установите Docker и Docker Compose, затем:
```bash
git clone https://github.com/darterss/Backend-Test-Artem-Demchuk.git
cd Backend-Test-Artem-Demchuk
```
настройте окружение
```bash
cp .env.example .env
```

# Запуск

```bash
docker-compose up -d
```

### Приложение работает на: http://localhost:3000

### Swagger-документация доступна по: http://localhost:3000/api
    Для ручного тестирование зарегестрируйтесь (в ответе будет токен), в правом верхнем углу нажмите кнопку Authorize и введите полученный токен

Test user
```
Email: demo@example.com
Password: password123
```

# Endpoints:

## Авторизация
```
POST /auth/register - Регистрация
POST /auth/login - Авторизация
```
## Заметки
```
GET /notes - список заметок
POST /notes - создать заметку
GET /notes/:id - получить заметку
PUT /notes/:id - отредактировать заметку
DELETE /notes/:id - удалить заметку
```
## Одноразовые ссылки
```
POST /notes/:id/share - создать одноразовую ссылку на заметку
GET /notes/:id/share - список одноразовых ссылок
DELETE /notes/:id/share/:tokenId - отозвать одноразовую ссылку
GET /public/notes/:token - открыть одноразовую ссылку на заметку
```
# Тестирование
Предварительно установите Node.js, затем:
```bash
npm i
npm run test
```

