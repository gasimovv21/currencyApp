from rest_framework.decorators import api_view
from .utils import getUsersList, createUser, getUserDetail, updateUser, deleteUser

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
