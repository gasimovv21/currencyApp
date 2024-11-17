from rest_framework import serializers
from .models import User, UserCurrencyAccount, Transaction, DepositHistory, AccountHistory

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class UserCurrencyAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCurrencyAccount
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = ['transaction_id', 'from_currency', 'to_currency', 'amount', 'user', 'created_at']


    def get_created_at(self, obj):
        return obj.created_at.strftime('%d-%m-%Y')


class DepositHistorySerializer(serializers.ModelSerializer):
    currency_code = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = DepositHistory
        fields = ['deposit_id', 'amount', 'created_at', 'user', 'currency_code']

    def get_currency_code(self, obj):
        return obj.user_currency_account.currency_code

    def get_created_at(self, obj):
        return obj.created_at.strftime('%d-%m-%Y')


class AccountHistorySerializer(serializers.ModelSerializer):
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = AccountHistory
        fields = ['history_id', 'currency', 'action', 'amount', 'user', 'created_at']
    
    def get_created_at(self, obj):
        return obj.created_at.strftime('%d-%m-%Y')