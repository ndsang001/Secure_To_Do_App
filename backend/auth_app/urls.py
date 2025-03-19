from django.urls import path
from .views import register_user, login_user, protected_route

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('protected/', protected_route, name='protected'),
]
