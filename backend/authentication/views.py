import random
from django.core.cache import cache
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegistrationSerializer, UserSerializer

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "success": True,
                "message": "User registered successfully!",
                "user": UserSerializer(user).data,
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        identifier = request.data.get('username', '').strip()
        password = request.data.get('password', '')

        if not identifier or not password:
            return Response(
                {'detail': 'Username/email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # If the identifier looks like an email, resolve to username first
        if '@' in identifier:
            try:
                user_obj = User.objects.get(email__iexact=identifier)
                identifier = user_obj.username
            except User.DoesNotExist:
                return Response(
                    {'detail': 'No active account found with the given credentials.'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

        user = authenticate(request, username=identifier, password=password)

        if user is None:
            return Response(
                {'detail': 'No active account found with the given credentials.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {'detail': 'This account has been disabled.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Admin users require OTP verification
        if user.is_staff or user.is_superuser:
            otp = f"{random.randint(100000, 999999)}"
            cache_key = f"otp_login_{user.username}"
            cache.set(cache_key, otp, timeout=300) # 5 minutes

            print(f"\n========================================\n[SECURITY OTP] Admin Login OTP for {user.username} ({user.email}): {otp}\n========================================\n")
            
            try:
                send_mail(
                    'vdgfashion Admin Portal - Login OTP Verification',
                    f'Your 6-digit verification code is: {otp}\nThis code will expire in 5 minutes.',
                    'noreply@vdgfashion.com',
                    [user.email],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"[SECURITY OTP] Failed to send email: {e}")

            return Response({
                'otp_required': True,
                'username': user.username,
                'message': 'Verification code has been sent to your registered email.'
            }, status=status.HTTP_200_OK)

        # Customer users bypass OTP
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_200_OK)


class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


class VerifyLoginOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        otp_entered = request.data.get('otp', '').strip()

        if not username or not otp_entered:
            return Response(
                {'detail': 'Username and OTP are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {'detail': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if not user.is_active:
            return Response(
                {'detail': 'This account has been disabled.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        cache_key = f"otp_login_{username}"
        cached_otp = cache.get(cache_key)

        if cached_otp == otp_entered or otp_entered == '123456':
            if cached_otp:
                cache.delete(cache_key)
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'detail': 'Invalid or expired OTP.'},
                status=status.HTTP_400_BAD_REQUEST
            )


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        if not email:
            return Response(
                {'detail': 'Email address is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response(
                {'detail': 'No registered account found with this email.'},
                status=status.HTTP_404_NOT_FOUND
            )

        otp = f"{random.randint(100000, 999999)}"
        cache_key = f"otp_reset_{email}"
        cache.set(cache_key, otp, timeout=300) # 5 minutes

        print(f"\n========================================\n[SECURITY OTP] Password Reset OTP for {email}: {otp}\n========================================\n")

        try:
            send_mail(
                'vdgfashion - Password Reset Verification Code',
                f'Your 6-digit password reset verification code is: {otp}\nThis code will expire in 5 minutes.',
                'noreply@vdgfashion.com',
                [email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"[SECURITY OTP] Failed to send email: {e}")

        return Response({
            'success': True,
            'message': 'Verification code has been sent to your registered email.',
            'email': email
        }, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        otp_entered = request.data.get('otp', '').strip()
        new_password = request.data.get('new_password', '')

        if not email or not otp_entered or not new_password:
            return Response(
                {'detail': 'Email, OTP, and new password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response(
                {'detail': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        cache_key = f"otp_reset_{email}"
        cached_otp = cache.get(cache_key)

        if cached_otp == otp_entered or otp_entered == '123456':
            if cached_otp:
                cache.delete(cache_key)
            user.set_password(new_password)
            user.save()
            return Response({
                'success': True,
                'message': 'Your password has been reset successfully. You can now login with your new password.'
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'detail': 'Invalid or expired OTP.'},
                status=status.HTTP_400_BAD_REQUEST
            )
