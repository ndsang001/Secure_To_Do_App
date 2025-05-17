from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from .models import Todo
from .serializers import TodoSerializer
from django_ratelimit.decorators import ratelimit
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken

@ensure_csrf_cookie
@api_view(['GET'])
def get_csrf_token(request):
    """
    Sets a CSRF cookie for the client.
    Returns:
        JsonResponse: A response indicating that the CSRF cookie has been set.
    """
    return JsonResponse({'message': 'CSRF cookie set'})

# Generate JWT token
def get_tokens_for_user(user):
    """
    Generates JWT access and refresh tokens for a given user.
    Args:
        user: The user instance for whom the tokens are generated.
    Returns:
        dict: A dictionary containing the refresh and access tokens.
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# Register User
# Rate limit registration: 10 per hour per IP
@ratelimit(key='ip', rate='10/h', block=True)
@csrf_protect
@api_view(['POST'])
def register_user(request):
    """
    Registers a new user with the provided username, email, and password.
    Args:
        request: The HTTP request containing user registration data.
    Returns:
        Response: A response indicating success or failure of the registration.
    """
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate password using Django's built-in validators
    try:
        validate_password(password)
    except ValidationError as e:
        return Response({'error': e.messages}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    user.save()
    return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)

# Login User
# Rate limit login: 5 attempts per minute per IP
@ratelimit(key='ip', rate='5/m', block=True)
@csrf_protect
@api_view(['POST'])
def login_user(request):
    """
    Authenticates a user and sets JWT tokens in cookies upon successful login.
    Args:
        request: The HTTP request containing login credentials.
    Returns:
        JsonResponse: A response indicating success or failure of the login.
    """
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({'error': 'Invalid username or password'}, status=401)
    user = authenticate(username=user.username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        response = JsonResponse({'message': 'Login successful'})
        response.set_cookie(
            key='access',
            value=str(refresh.access_token),
            httponly=True,
            secure=False,  # Need to be True in production
            samesite='Lax',
        )
        response.set_cookie(
            key='refresh',
            value=str(refresh),
            httponly=True,
            secure=False, # Need to be True in production
            samesite='Lax',
        )
        return response
    return JsonResponse({'error': 'Invalid username or password'}, status=401)

@csrf_protect
@api_view(['POST'])
def logout_view(request):
    """
    Logs out the user by deleting the access and refresh tokens from cookies.
    Args:
        request: The HTTP request containing the logout request.
    Returns:
        JsonResponse: A response indicating the user has been logged out.
    """
    response = JsonResponse({'message': 'Logged out'})

    refresh_token = request.COOKIES.get('refresh')
    if refresh_token:
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist this refresh token
        except Exception as e:
            pass # Token may already be expired or invalid

    response.delete_cookie('access')
    response.delete_cookie('refresh')
    return response

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def todo_list_create(request):
    """
    Handles retrieving and creating to-do items for the authenticated user.
    Args:
        request: The HTTP request containing the to-do data.
    Returns:
        Response: A response with the list of to-dos or the created to-do item.
    """
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
    """
    Toggles the completion status of a to-do item.
    Args:
        request: The HTTP request containing the toggle request.
        todo_id: The ID of the to-do item to be toggled.
    Returns:
        Response: A response with the updated to-do item or an error message.
    """
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
    """
    Deletes all completed to-do items for the authenticated user.
    Args:
        request: The HTTP request containing the delete request.
    Returns:
        Response: A response indicating the number of deleted to-do items.
    """
    deleted, _ = Todo.objects.filter(user=request.user, completed=True).delete()
    return Response({'deleted': deleted}, status=204)

# Custom Token Refresh View to handle refresh token from cookies
class CustomTokenRefreshView(TokenRefreshView):
    """
    CustomTokenRefreshView extends the TokenRefreshView to handle token refresh functionality
    using cookies for storing the refresh and access tokens.
    Methods:
        post(request, *args, **kwargs):
            Handles POST requests to refresh the access token using the refresh token stored in cookies.
            Args:
                request: The HTTP request object containing the cookies.
                *args: Additional positional arguments.
                **kwargs: Additional keyword arguments.
            Returns:
                Response: A Response object containing the status and any new tokens if successful.
            Comments:
                - If the refresh token is not found in cookies, a 400 Bad Request response is returned.
                - If the refresh token is invalid or expired, a 401 Unauthorized response is returned.
                - On success, a new access token is set in the cookies, and if token rotation is enabled,
                  a new refresh token is also set in the cookies.
                - The `secure` attribute for cookies should be set to True in production for security.
    """
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')
        if refresh_token is None:
            return Response({'error': 'Refresh token not found in cookies'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data={'refresh': refresh_token})
        try:
            serializer.is_valid(raise_exception=True)
        except InvalidToken as e:
            return Response({'error': 'Invalid or expired refresh token'}, status=status.HTTP_401_UNAUTHORIZED)

        access_token = serializer.validated_data['access']
        new_refresh_token = serializer.validated_data.get("refresh")  # Only present if rotation is on
        response = Response({'message': 'Access token refreshed'})

        # Set new access token
        response.set_cookie(
            key='access',
            value=access_token,
            httponly=True,
            secure=False,  # Set to True in production
            samesite='Lax'
        )

        # Set rotated refresh token
        if new_refresh_token:
            response.set_cookie(
                key="refresh",
                value=new_refresh_token,
                httponly=True,
                secure=False,
                samesite="Lax",
            )
        return response