from django.contrib import admin
from .models import ShortURL, URLVisit


@admin.register(ShortURL)
class ShortURLAdmin(admin.ModelAdmin):
    list_display = ['short_code', 'target_url_preview', 'is_private', 'owner', 'views', 'created_at']
    list_filter = ['is_private', 'created_at']
    search_fields = ['short_code', 'target_url', 'owner__email']
    readonly_fields = ['short_code', 'views', 'created_at', 'updated_at']
    date_hierarchy = 'created_at'
    
    def target_url_preview(self, obj):
        return obj.target_url[:50] + '...' if len(obj.target_url) > 50 else obj.target_url
    target_url_preview.short_description = 'Target URL'


@admin.register(URLVisit)
class URLVisitAdmin(admin.ModelAdmin):
    list_display = ['short_url', 'user', 'ip_address', 'accessed_at']
    list_filter = ['accessed_at']
    search_fields = ['short_url__short_code', 'user__email', 'ip_address']
    readonly_fields = ['short_url', 'user', 'ip_address', 'user_agent', 'accessed_at']
    date_hierarchy = 'accessed_at'
