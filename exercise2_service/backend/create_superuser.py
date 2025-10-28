#!/usr/bin/env python
"""
Quick test script to create a superuser for Django admin
Run: python create_superuser.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Create superuser if doesn't exist
if not User.objects.filter(email='admin@urlshortener.com').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@urlshortener.com',
        password='admin123'
    )
    print('✅ Superuser created successfully!')
    print('Email: admin@urlshortener.com')
    print('Password: admin123')
else:
    print('⚠️  Superuser already exists')
