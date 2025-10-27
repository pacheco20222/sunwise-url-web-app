from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    email = models.EmailField(
        unique=True,
        verbose_name='Email Address',
        help_text='Required. Enter a valid email address.', 
    )
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username'] 
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-date_joined']
        
    def __str__(self):
        return self.email