from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User

from .utils import (
    getUsersList, createUser, getUserDetail, updateUser, deleteUser,
    getCurrencyAccounts, createCurrencyAccount, getCurrencyAccountDetail,
    updateCurrencyAccount, deleteCurrencyAccount, getUserCurrencyAccounts,
    convert_currency
)


@api_view(['GET', 'POST'])
def getUsers(request):
    if request.method == 'GET':
        return getUsersList(request)
    elif request.method == 'POST':
        return createUser(request)

@api_view(['GET', 'PUT', 'DELETE'])
def getUser(request, pk):
    if request.method == 'GET':
        return getUserDetail(request, pk)
    elif request.method == 'PUT':
        return updateUser(request, pk)
    elif request.method == 'DELETE':
        return deleteUser(request, pk)

@api_view(['GET', 'POST'])
def getCurrencyAccountsView(request):
    if request.method == 'GET':
        return getCurrencyAccounts(request)
    elif request.method == 'POST':
        return createCurrencyAccount(request)

@api_view(['GET', 'PUT', 'DELETE'])
def getCurrencyAccountView(request, pk):
    if request.method == 'GET':
        return getCurrencyAccountDetail(request, pk)
    elif request.method == 'PUT':
        return updateCurrencyAccount(request, pk)
    elif request.method == 'DELETE':
        return deleteCurrencyAccount(request, pk)

@api_view(['GET'])
def getUserCurrencyAccountsView(request, user_id):
    return getUserCurrencyAccounts(request, user_id)


@api_view(['POST'])
def convertCurrency(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    from_currency = request.data.get('from_currency')
    to_currency = request.data.get('to_currency')
    amount = request.data.get('amount')

    if not all([from_currency, to_currency, amount]):
        return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        amount = float(amount)
    except ValueError:
        return Response({"error": "Invalid amount"}, status=status.HTTP_400_BAD_REQUEST)

    return convert_currency(user, from_currency, to_currency, amount)
