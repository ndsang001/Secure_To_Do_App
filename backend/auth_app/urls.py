from django.urls import path
from .views import register_user, login_user, protected_route, logout_view, todo_list_create, toggle_todo, clear_completed

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('protected/', protected_route, name='protected'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('todos/', todo_list_create, name='todo_list_create'),
    path('todos/<int:todo_id>/toggle/', toggle_todo, name='toggle_todo'),
    path('todos/clear_completed/', clear_completed, name='clear_completed'),
    path('logout/', logout_view, name='logout'),

]
