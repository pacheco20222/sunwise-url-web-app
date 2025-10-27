from rest_framework import serializers
from django.conf import settings
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import ShortURL, URLVisit
import re


class ShortURLCreateSerializer(serializers.ModelSerializer):
    short_url = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = ShortURL
        fields = [
            'id',
            'short_code',
            'short_url',
            'target_url',
            'is_private',
            'views',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'short_code',
            'views',
            'created_at',
            'updated_at'
        ]
    
    def validate_target_url(self, value):
        validator = URLValidator()
        
        try:
            validator(value)
        except DjangoValidationError:
            raise serializers.ValidationError(
                'Please provide a valid URL (e.g., https://example.com)'
            )
        
        if not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError(
                'URL must start with http:// or https://'
            )
        

        if len(value) > 2048:
            raise serializers.ValidationError(
                'URL is too long (max 2048 characters)'
            )
        
        return value
    
    def get_short_url(self, obj):

        return obj.get_short_url()
    
    def create(self, validated_data):
        validated_data['short_code'] = ShortURL.generate_short_code(
            length=settings.SHORT_CODE_LENGTH
        )

        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['owner'] = request.user
        
        return super().create(validated_data)


class ShortURLSerializer(serializers.ModelSerializer):
    short_url = serializers.SerializerMethodField()
    owner_email = serializers.CharField(source='owner.email', read_only=True)
    last_visit = serializers.SerializerMethodField()
    
    class Meta:
        model = ShortURL
        fields = [
            'id',
            'short_code',
            'short_url',
            'target_url',
            'is_private',
            'owner_email',
            'views',
            'created_at',
            'updated_at',
            'last_visit'
        ]
    
    def get_short_url(self, obj):
        return obj.get_short_url()
    
    def get_last_visit(self, obj):
        last_visit = obj.visits.order_by('-accessed_at').first()
        return last_visit.accessed_at if last_visit else None


class ShortURLUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortURL
        fields = ['target_url', 'is_private']
    
    def validate_target_url(self, value):
        """Same validation as create"""
        validator = URLValidator()
        try:
            validator(value)
        except DjangoValidationError:
            raise serializers.ValidationError(
                'Please provide a valid URL'
            )
        return value


class BulkURLSerializer(serializers.Serializer):
    file = serializers.FileField(
        required=True,
        help_text='Text file containing URLs (one per line)'
    )
    
    def validate_file(self, value):
        
        if not value.name.endswith('.txt'):
            raise serializers.ValidationError(
                'Only .txt files are allowed.'
            )
        
        if value.size > settings.MAX_FILE_SIZE:
            max_mb = settings.MAX_FILE_SIZE / (1024 * 1024)
            raise serializers.ValidationError(
                f'File size must not exceed {max_mb}MB.'
            )
        
    
        if value.size == 0:
            raise serializers.ValidationError(
                'The uploaded file is empty.'
            )
        
        return value
    
    def process_file(self, file, user=None):
        """
        Process uploaded file and create shortened URLs.
        
        Args:
            file: Validated file object
            user: Authenticated user (or None for anonymous)
            
        Returns:
            dict: Results summary with success/failure counts
        """
        results = []
        success_count = 0
        failed_count = 0
        

        try:
            content = file.read().decode('utf-8')
        except UnicodeDecodeError:
            raise serializers.ValidationError(
                'File must be UTF-8 encoded text.'
            )
        

        urls = [
            line.strip() 
            for line in content.splitlines() 
            if line.strip()  # Skip empty lines
        ]
        

        if len(urls) > settings.MAX_URLS_PER_UPLOAD:
            raise serializers.ValidationError(
                f'Maximum {settings.MAX_URLS_PER_UPLOAD} URLs allowed per upload. '
                f'Your file contains {len(urls)} URLs.'
            )
        
        for url in urls:
            try:
                # Validate URL
                serializer = ShortURLCreateSerializer(
                    data={'target_url': url, 'is_private': False},
                    context={'request': self.context.get('request')}
                )
                
                if serializer.is_valid(raise_exception=True):
                    # Create shortened URL
                    short_url_obj = serializer.save()
                    
                    results.append({
                        'original_url': url,
                        'short_url': short_url_obj.get_short_url(),
                        'short_code': short_url_obj.short_code,
                        'status': 'success'
                    })
                    success_count += 1
                    
            except Exception as e:
                results.append({
                    'original_url': url,
                    'error': str(e),
                    'status': 'failed'
                })
                failed_count += 1
        
        return {
            'total': len(urls),
            'success': success_count,
            'failed': failed_count,
            'results': results
        }


class URLVisitSerializer(serializers.ModelSerializer):
    short_code = serializers.CharField(source='short_url.short_code', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = URLVisit
        fields = [
            'id',
            'short_code',
            'user_email',
            'ip_address',
            'user_agent',
            'accessed_at'
        ]
        read_only_fields = fields