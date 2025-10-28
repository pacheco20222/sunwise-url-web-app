from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserCreateSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'},
        help_text='Password must be 8 characters long'
    )
    
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'},
        help_text='Please re enter your password for confirmation'
    )
    
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'password2', 'date_joined']
        read_only_fields = ['id', 'date_joined']
        extra_kwargs = {
            'email': {
                'required': True,
                'help_text': 'Required. Enter a valid email address.'
            },
            'username': {
                'required': True,
                'help_text' : 'The username should be unique.'
            }
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password" : "Password fields didn't match."
            })
        
        if User.objects.filter(email__iexact=attrs['email']).exists():
            raise serializers.ValidationError({
                "email" : "A user with that email already exists."
            })
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    
    email = serializers.EmailField(
        required=True,
        help_text='Enter your registered email address.'
    )
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        help_text='Enter your password.'
    )
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                'Email or Password are incorrect.'
            )
        
        # Check password directly instead of using authenticate
        if not user.check_password(password):
            raise serializers.ValidationError(
                'Email or Password are incorrect.'
            )
            
        if not user.is_active:
            raise serializers.ValidationError(
                'User account is disabled.'
            )
            
        attrs['user'] = user
        return attrs
        
class UserSerializer(serializers.ModelSerializer):
    
    url_count = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'date_joined',
            'url_count'
        ]
        read_only_fields = ['id', 'email', 'username', 'date_joined']
    
    def get_url_count(self, obj):
        return obj.urls.count()  