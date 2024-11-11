from django.urls import path
from .views import getUsers, getUser

urlpatterns = [
    path('users/', getUsers, name='user-list'),
    path('users/<int:pk>/', getUser, name='user-detail'),
]
