from django.urls import path
from .views import (
    ShortenURLView,
    URLListView,
    URLDetailView,
    URLUpdateView,
    URLDeleteView,
)

app_name = 'urlshortener'

urlpatterns = [
    path('shorten/', ShortenURLView.as_view(), name='shorten'),
    path('', URLListView.as_view(), name='list'),
    path('<int:pk>/', URLDetailView.as_view(), name='detail'),
    path('<int:pk>/update/', URLUpdateView.as_view(), name='update'),
    path('<int:pk>/delete/', URLDeleteView.as_view(), name='delete'),
]
