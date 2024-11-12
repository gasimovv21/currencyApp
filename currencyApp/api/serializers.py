from rest_framework import serializers
from .models import User, UserCurrencyAccount

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class UserCurrencyAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCurrencyAccount
        fields = '__all__'
