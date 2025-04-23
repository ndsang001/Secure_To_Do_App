from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from .models import Todo
from .serializers import TodoSerializer

# Generate JWT token
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# Register User
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    user.save()
    return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)

# Login User
@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({'error': 'Invalid credentials'}, status=401)
    user = authenticate(username=user.username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        response = JsonResponse({'message': 'Login successful'})
        response.set_cookie(
            key='access',
            value=str(refresh.access_token),
            httponly=True,
            secure=False,  # Set to True in production
            samesite='Lax',
        )
        response.set_cookie(
            key='refresh',
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite='Lax',
        )
        return response
    return JsonResponse({'error': 'Invalid credentials'}, status=401)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_route(request):
    return Response({'message': f'Welcome, {request.user.username}!'})


@api_view(['POST'])
def logout_view(request):
    response = JsonResponse({'message': 'Logged out'})
    response.delete_cookie('access')
    response.delete_cookie('refresh')
    return response

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def todo_list_create(request):
    if request.method == 'GET':
        todos = Todo.objects.filter(user=request.user).order_by('-created_at')
        serializer = TodoSerializer(todos, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = TodoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def toggle_todo(request, todo_id):
    try:
        todo = Todo.objects.get(id=todo_id, user=request.user)
    except Todo.DoesNotExist:
        return Response({'error': 'Todo not found'}, status=404)

    todo.completed = not todo.completed
    todo.save()
    return Response(TodoSerializer(todo).data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_completed(request):
    deleted, _ = Todo.objects.filter(user=request.user, completed=True).delete()
    return Response({'deleted': deleted}, status=204)
