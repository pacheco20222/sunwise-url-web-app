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
    
    # Authentication endpoints
    path('api/auth/', include('apps.accounts.urls')),
    
    # URL Shortener endpoints will be added in next phase
    # path('api/urls/', include('apps.urlshortener.urls')),
    
    # Short URL redirect will be added in next phase
    # path('<str:short_code>/', RedirectView, name='redirect'),
]