from django.urls import path
from .views import (getUsers, getUser, getCurrencyAccountsView, 
                    getCurrencyAccountView, getUserCurrencyAccountsView, 
                    convertCurrency, depositToAccount, getAccountHistory,
                    register_user, login_user, logout_user,
)


urlpatterns = [


    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('logout/', logout_user, name='logout'),

    path('users/', getUsers, name='user-list'),
    path('users/<int:pk>/', getUser, name='user-detail'),
    path('currency-accounts/', getCurrencyAccountsView, name='currency-account-list'),
    path('currency-accounts/<int:pk>/', getCurrencyAccountView, name='currency-account-detail'),
    path('currency-accounts/user/<int:user_id>/', getUserCurrencyAccountsView, name='user-currency-accounts'),

    path('currency-accounts/convert/<int:user_id>/', convertCurrency, name='convert-currency'),
    path('currency-accounts/deposit/<int:user_id>/', depositToAccount, name='deposit-to-account'),
    path('currency-accounts/history/<int:user_id>/', getAccountHistory, name='account-history'),


]
