"""
URL Configuration for URL Shortener project.

This is the main URL routing file that connects URLs to views.
Think of it like a router that directs traffic to the right place.

Structure:
- /admin/           -> Django admin panel
- /api/schema/      -> Swagger/OpenAPI documentation
- /api/auth/        -> User registration, login, logout
- /api/urls/        -> URL shortening operations
- /<short_code>     -> Redirect to original URL
"""
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [
    # Django Admin Panel
    # Access at: http://localhost:8000/admin/
    path('admin/', admin.site.urls),
    
    # API Documentation (Swagger/OpenAPI)
    # - Schema (JSON): http://localhost:8000/api/schema/
    # - Swagger UI: http://localhost:8000/api/docs/
    # - ReDoc UI: http://localhost:8000/api/redoc/
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # Authentication endpoints will be added here later
    # path('api/auth/', include('apps.accounts.urls')),
    
    # URL Shortener endpoints will be added here later
    # path('api/urls/', include('apps.urlshortener.urls')),
    
    # Short URL redirect will be added here later
    # path('<str:short_code>/', RedirectView, name='redirect'),
]
