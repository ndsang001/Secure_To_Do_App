from django.urls import path
from .views import register_user, login_user, logout_view, todo_list_create, toggle_todo, clear_completed, get_csrf_token, CustomTokenRefreshView

urlpatterns = [
    path('csrf/', get_csrf_token, name='get_csrf_token'),
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('todos/', todo_list_create, name='todo_list_create'),
    path('todos/<int:todo_id>/toggle/', toggle_todo, name='toggle_todo'),
    path('todos/clear_completed/', clear_completed, name='clear_completed'),
    path('logout/', logout_view, name='logout'),
]
