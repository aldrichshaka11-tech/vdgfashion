from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    UserRegistrationView, UserProfileView, UserListView, UserDetailView, LoginView,
    VerifyLoginOTPView, ForgotPasswordView, ResetPasswordView
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('verify-login-otp/', VerifyLoginOTPView.as_view(), name='verify_login_otp'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='auth_profile'),
    path('users/', UserListView.as_view(), name='auth_users_list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='auth_user_detail'),
]
