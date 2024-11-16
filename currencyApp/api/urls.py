from django.urls import path
from .views import getUsers, getUser, getCurrencyAccountsView, getCurrencyAccountView, getUserCurrencyAccountsView, convertCurrency

urlpatterns = [
    path('users/', getUsers, name='user-list'),
    path('users/<int:pk>/', getUser, name='user-detail'),
    path('currency-accounts/', getCurrencyAccountsView, name='currency-account-list'),
    path('currency-accounts/<int:pk>/', getCurrencyAccountView, name='currency-account-detail'),
    path('currency-accounts/user/<int:user_id>/', getUserCurrencyAccountsView, name='user-currency-accounts'),

    path('currency-accounts/convert/<int:user_id>/', convertCurrency, name='convert-currency'),
]
