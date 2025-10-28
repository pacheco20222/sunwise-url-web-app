from django.shortcuts import get_object_or_404, redirect
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import F
from .models import ShortURL, URLVisit
from .serializers import (
    ShortURLCreateSerializer,
    ShortURLSerializer,
    ShortURLUpdateSerializer,
)


def get_client_ip(request):
    """Extract client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Custom permission: only owner can edit/delete"""
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user


class ShortenURLView(generics.CreateAPIView):
    """Create shortened URL"""
    serializer_class = ShortURLCreateSerializer
    permission_classes = [permissions.AllowAny]
    
    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(owner=self.request.user)
        else:
            serializer.save()


class URLListView(generics.ListAPIView):
    """List URLs with pagination"""
    serializer_class = ShortURLSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.is_staff:
                return ShortURL.objects.all().order_by('-created_at')
            return ShortURL.objects.filter(owner=user).order_by('-created_at')
        return ShortURL.objects.none()


class URLDetailView(generics.RetrieveAPIView):
    """Get single URL details"""
    serializer_class = ShortURLSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = ShortURL.objects.all()


class URLUpdateView(generics.UpdateAPIView):
    """Update URL (owner only)"""
    serializer_class = ShortURLUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    queryset = ShortURL.objects.all()


class URLDeleteView(generics.DestroyAPIView):
    """Delete URL (owner only)"""
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    queryset = ShortURL.objects.all()


class RedirectView(APIView):
    """Redirect short URL to target with analytics tracking"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, short_code):
        short_url = get_object_or_404(ShortURL, short_code=short_code)
        
        # Check if private URL requires authentication
        if short_url.is_private:
            token = request.query_params.get('token')
            if not token or not request.user.is_authenticated:
                return Response(
                    {'error': 'Authentication required for private URL'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        
        # Track visit
        URLVisit.objects.create(
            short_url=short_url,
            user=request.user if request.user.is_authenticated else None,
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:500]
        )
        
        # Increment view count
        short_url.increment_views()
        
        return redirect(short_url.target_url)


class BulkUploadView(APIView):
    """Bulk URL upload from .txt file"""
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    throttle_scope = 'bulk_upload'
    
    def post(self, request):
        from .serializers import BulkURLSerializer
        
        serializer = BulkURLSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        # Process the file
        results = serializer.process_file(
            serializer.validated_data['file'],
            user=request.user if request.user.is_authenticated else None
        )
        
        return Response(results, status=status.HTTP_200_OK)
