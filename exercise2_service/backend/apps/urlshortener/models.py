from django.db import models
from django.conf import settings
from django.core.validators import URLValidator
import string
import random

class ShortURL(models.Model):
    id = models.BigAutoField(primary_key=True)
    short_code = models.CharField(
        max_length=10,
        unique=True,
        db_index=True,
        help_text="Unique short code for the URL",
    )
    
    target_url = models.URLField(
        max_length=2048,
        validators=[URLValidator()],
        help_text="The original URL to be shortened",
    )
    
    is_private = models.BooleandField(
        default=False,
        help_text="When true, requires authentication token to access",
    )
    
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='urls',
        help_text="Owner of the short URL"
    )
    
    views = models.PositiveIntegerField(
        default=0,
        help_text="Number of times the short URL has been accessed"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the short URL was created"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the short URL was last updated"
    )
    
    class Meta:
        verbose_name = "Short URL"
        verbose_name_plural = "Short URLs"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['short_code']),
            models.Index(fields=['owner', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.short_code} -> {self.target_url[:50]}"
    
    def get_short_url(self):
        from django.conf import settings
        base_url = settings.BASE_URL.rstrip('/')
        return f"{base_url}/{self.short_code}"
    
    def increment_views(self):
        from django.db.models import F
        ShortURL.objects.filter(pk=self.pk).update(views=F('views') + 1)
        self.refresh_from_db()
    
    @staticmethod
    def generate_short_code(length=6):
        characters = string.ascii_letters + string.digits
        while True:
            code = ''.join(random.choices(characters, k=length))
            if not ShortURL.objects.filter(short_code=code).exists():
                return code
     

            
class URLVisit(models.Model):
  
    # Which short URL was visited
    short_url = models.ForeignKey(
        ShortURL,
        on_delete=models.CASCADE,  
        related_name='visits',  
        help_text='The short URL that was visited'
    )
    
    # Who visited (if logged in)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,  
        null=True,
        blank=True,
        related_name='url_visits',
        help_text='User who accessed the URL (if authenticated)'
    )
    
    # IP address of visitor
    ip_address = models.GenericIPAddressField(
        help_text='IP address of the visitor'
    )
    
    # Browser/device info
    user_agent = models.TextField(
        blank=True,
        help_text='User agent string (browser/device info)'
    )
    
    # When the visit occurred
    accessed_at = models.DateTimeField(
        auto_now_add=True,
        help_text='Timestamp of when the URL was accessed'
    )
    
    class Meta:
        verbose_name = 'URL Visit'
        verbose_name_plural = 'URL Visits'
        ordering = ['-accessed_at']  
        indexes = [
            models.Index(fields=['short_url', '-accessed_at']),
            models.Index(fields=['user', '-accessed_at']),
        ]
    
    def __str__(self):
        """Display: "Visit to Ux26Yp by user@example.com" """
        user_info = self.user.email if self.user else self.ip_address
        return f"Visit to {self.short_url.short_code} by {user_info}"