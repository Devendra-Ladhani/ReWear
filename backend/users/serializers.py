from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_uuid'] = str(user.user_uuid)
        token['name'] = user.name
        token['is_admin'] = user.is_admin
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user_uuid'] = str(self.user.user_uuid)
        data['name'] = self.user.name
        data['is_admin'] = self.user.is_admin
        return data
