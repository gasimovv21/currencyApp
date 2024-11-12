from django.urls import path
from .views import getUsers, getUser, getCurrencyAccountsView, getCurrencyAccountView

urlpatterns = [
    path('users/', getUsers, name='user-list'),
    path('users/<int:pk>/', getUser, name='user-detail'),
    path('currency-accounts/', getCurrencyAccountsView, name='currency-account-list'),
    path('currency-accounts/<int:pk>/', getCurrencyAccountView, name='currency-account-detail'), 
]
