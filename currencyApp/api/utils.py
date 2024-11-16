from django.db import IntegrityError
from rest_framework.response import Response
from rest_framework import status
from .models import User, UserCurrencyAccount, Transaction, AccountHistory, DepositHistory
from .serializers import UserSerializer, UserCurrencyAccountSerializer
from django.db import transaction as db_transaction
from decimal import Decimal


def getUsersList(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

def createUser(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def getUserDetail(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)

def updateUser(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def deleteUser(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    user.delete()
    return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


def getCurrencyAccounts(request):
    accounts = UserCurrencyAccount.objects.all()
    serializer = UserCurrencyAccountSerializer(accounts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

def createCurrencyAccount(request):
    serializer = UserCurrencyAccountSerializer(data=request.data)
    if serializer.is_valid():
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response({"error": "Account with this currency already exists for this user."}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def getCurrencyAccountDetail(request, pk):
    try:
        account = UserCurrencyAccount.objects.get(pk=pk)
    except UserCurrencyAccount.DoesNotExist:
        return Response({"error": "Currency account not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserCurrencyAccountSerializer(account)
    return Response(serializer.data, status=status.HTTP_200_OK)

def updateCurrencyAccount(request, pk):
    try:
        account = UserCurrencyAccount.objects.get(pk=pk)
    except UserCurrencyAccount.DoesNotExist:
        return Response({"error": "Currency account not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserCurrencyAccountSerializer(account, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def deleteCurrencyAccount(request, pk):
    try:
        account = UserCurrencyAccount.objects.get(pk=pk)
    except UserCurrencyAccount.DoesNotExist:
        return Response({"error": "Currency account not found"}, status=status.HTTP_404_NOT_FOUND)

    account.delete()
    return Response({"message": "Currency account deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


def getUserCurrencyAccounts(request, user_id):
    try:
        accounts = UserCurrencyAccount.objects.filter(user_id=user_id)
        if not accounts.exists():
            return Response({"error": "No accounts found for this user"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserCurrencyAccountSerializer(accounts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)



def convert_currency(user, from_currency, to_currency, amount):
    try:
        from_account = UserCurrencyAccount.objects.get(user=user, currency_code=from_currency)
        to_account = UserCurrencyAccount.objects.get(user=user, currency_code=to_currency)
    except UserCurrencyAccount.DoesNotExist:
        return Response({"error": "One or both currency accounts do not exist for this user."}, status=status.HTTP_400_BAD_REQUEST)

    amount = Decimal(amount)

    if from_account.balance < amount:
        return Response({"error": f"Insufficient balance in {from_currency} account."}, status=status.HTTP_400_BAD_REQUEST)

    with db_transaction.atomic():
        from_account.balance -= amount
        from_account.save()

        to_account.balance += amount
        to_account.save()

        transaction = Transaction.objects.create(
            user=user,
            from_currency=from_currency,
            to_currency=to_currency,
            amount=amount
        )

        AccountHistory.objects.create(user=user, currency=from_currency, amount=amount, action='withdraw')
        AccountHistory.objects.create(user=user, currency=to_currency, amount=amount, action='deposit')

    return Response({"message": "Conversion successful.", "transaction_id": transaction.transaction_id}, status=status.HTTP_201_CREATED)


def deposit_to_account(user, user_currency_account_code, amount):
    try:
        account = UserCurrencyAccount.objects.get(currency_code=user_currency_account_code, user=user)
    except UserCurrencyAccount.DoesNotExist:
        return Response({"error": f"Account with currency {user_currency_account_code} not found for this user."}, status=status.HTTP_404_NOT_FOUND)

    amount = Decimal(amount)

    if amount <= 0:
        return Response({"error": "Deposit amount must be greater than zero."}, status=status.HTTP_400_BAD_REQUEST)

    with db_transaction.atomic():
        account.balance += amount
        account.save()

        deposit = DepositHistory.objects.create(
            user=user,
            user_currency_account=account,
            amount=amount
        )

    return Response({"message": "Deposit successful.", "deposit_id": deposit.deposit_id}, status=status.HTTP_201_CREATED)