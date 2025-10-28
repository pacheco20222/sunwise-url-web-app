# URL Shortener API - Backend

Django REST Framework backend for URL shortening service with user authentication and analytics.

## Features

- 🔗 URL shortening with custom codes
- 🔐 User authentication (JWT)
- 🔒 Public and private URLs
- 📊 Visit analytics tracking
- 📤 Bulk URL upload (.txt files)
- 👑 Django admin panel
- 📖 Swagger API documentation

## Tech Stack

- Python 3.12+
- Django 4.2
- Django REST Framework
- PostgreSQL
- JWT Authentication
- Docker (PostgreSQL)

## Quick Start

### 1. Setup Environment

```bash
cd exercise2_service/backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements/dev.txt
```

### 2. Configure Environment Variables

Create `.env` file:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=urlshortener
DB_USER=postgres
DB_PASSWORD=postgres123
DB_HOST=localhost
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

SHORT_CODE_LENGTH=6
BASE_URL=http://localhost:8000
```

### 3. Start PostgreSQL (Docker)

```bash
cd ..
docker-compose up -d
```

### 4. Run Migrations

```bash
cd backend
python manage.py migrate
```

### 5. Create Superuser

```bash
python create_superuser.py
# Or manually: python manage.py createsuperuser
```

### 6. Start Server

```bash
python manage.py runserver
```

Server runs at: http://localhost:8000

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login and get tokens |
| POST | `/api/auth/logout/` | Logout (blacklist token) |
| GET | `/api/auth/me/` | Get current user |
| POST | `/api/auth/token/refresh/` | Refresh access token |

### URL Shortening

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/urls/shorten/` | Shorten single URL |
| POST | `/api/urls/bulk/` | Bulk upload (.txt file) |
| GET | `/api/urls/` | List user's URLs |
| GET | `/api/urls/{id}/` | Get URL details |
| PATCH | `/api/urls/{id}/update/` | Update URL |
| DELETE | `/api/urls/{id}/delete/` | Delete URL |
| GET | `/{short_code}/` | Redirect to target URL |

### Documentation

| Endpoint | Description |
|----------|-------------|
| `/api/docs/` | Swagger UI |
| `/api/redoc/` | ReDoc UI |
| `/api/schema/` | OpenAPI schema (JSON) |

### Admin Panel

Access at: http://localhost:8000/admin/
- Default credentials: `admin@urlshortener.com` / `admin123`

## API Examples

### Register User

```bash
POST /api/auth/register/
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "password2": "SecurePass123!"
}
```

### Shorten URL

```bash
POST /api/urls/shorten/
Authorization: Bearer <access_token>
{
  "target_url": "https://www.google.com",
  "is_private": false
}
```

### Bulk Upload

```bash
POST /api/urls/bulk/
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

file: urls.txt
```

## Project Structure

```
backend/
├── apps/
│   ├── accounts/          # User authentication
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   └── urlshortener/      # URL shortening
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       └── urls.py
├── project/
│   ├── settings.py
│   └── urls.py
├── requirements/
│   ├── base.txt
│   ├── dev.txt
│   └── prod.txt
└── manage.py
```

## Security Features

- JWT token authentication
- Token blacklisting on logout
- Password validation
- CORS configuration
- Rate limiting (throttling)
- Owner-only URL editing
- Private URL access control

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=apps

# Run specific tests
pytest apps/accounts/tests.py
```

## Development

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver

# Django shell
python manage.py shell
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DEBUG` | Debug mode | `True` |
| `SECRET_KEY` | Django secret key | - |
| `DB_NAME` | Database name | `urlshortener` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | - |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `SHORT_CODE_LENGTH` | Short code length | `6` |
| `BASE_URL` | Base URL for short links | `http://localhost:8000` |
| `MAX_FILE_SIZE` | Max upload size (bytes) | `5242880` (5MB) |
| `MAX_URLS_PER_UPLOAD` | Max URLs per bulk upload | `1000` |

## License

MIT
