from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import UserRegistrationView, UserProfileView, UserListView, UserDetailView, LoginView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='auth_profile'),
    path('users/', UserListView.as_view(), name='auth_users_list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='auth_user_detail'),
]
