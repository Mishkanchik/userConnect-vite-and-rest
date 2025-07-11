from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
import requests

from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator as token_generator

from .models import Category, Product, ProductImage
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    ProductImageSerializer,
    RegisterSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)   
from .tokens import CustomTokenObtainPairSerializer


User = get_user_model()
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"




class CategoryViewSet(ModelViewSet):


    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


# Продукти з фільтром по категорії
class ProductViewSet(ModelViewSet):



    queryset = Product.objects.prefetch_related('images').select_related('category')
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):

        queryset = self.queryset
        category_id = self.request.query_params.get("category")



        if category_id:
            queryset = queryset.filter(category_id=category_id)

        return queryset



# Фото продуктів (для адмінки або окремого керування)
class ProductImageViewSet(ModelViewSet):
    queryset = ProductImage.objects.select_related('product')
    serializer_class = ProductImageSerializer
    permission_classes = [AllowAny]


# Реєстрація
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Користувач успішно зареєстрований!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Стандартний логін
class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# Google авторизація
class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        access_token = request.data.get("access_token")
        if not access_token:
            return Response({"detail": "Access token required"}, status=status.HTTP_400_BAD_REQUEST)

        resp = requests.get(GOOGLE_USERINFO_URL, headers={"Authorization": f"Bearer {access_token}"})
        if resp.status_code != 200:
            return Response({"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        userinfo = resp.json()
        google_id = userinfo.get("sub")
        email = userinfo.get("email")
        phone = userinfo.get("phone_number")
        avatar_url = userinfo.get("picture")
        username = userinfo.get("name") or email.split("@")[0]

        if not email:
            return Response({"detail": "Email not provided by Google"}, status=status.HTTP_400_BAD_REQUEST)

        user, _ = User.objects.get_or_create(email=email, defaults={"username": username, "isGoogle": True})

        if phone and not user.phone:
            user.phone = phone
            user.save(update_fields=["phone"])

        refresh = RefreshToken.for_user(user)

        return Response({
            "id": google_id,
            "email": email,
            "phone": phone,
            "avatar": avatar_url,
            "username": user.username,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })


# Відновлення паролю (запит)
class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(email=serializer.validated_data["email"])
        except User.DoesNotExist:
            return Response({"error": "Користувача з таким email не знайдено."}, status=status.HTTP_404_NOT_FOUND)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = token_generator.make_token(user)

        frontend_url = request.data.get("frontend_url", "http://localhost:5173")
        reset_link = f"{frontend_url}/password-reset-confirm/{uid}/{token}"

        send_mail(
            subject="Відновлення паролю",
            message=f"Для відновлення паролю перейдіть за посиланням: {reset_link}",
            from_email="mishkanchik@ukr.net",
            recipient_list=[user.email],
            fail_silently=False,
            html_message=f"""
                <html>
                <body>
                    <h2>Відновлення паролю</h2>
                    <p>Щоб змінити пароль, перейдіть за посиланням:</p>
                    <a href="{reset_link}">Змінити пароль</a>
                </body>
                </html>
            """,
        )
        return Response({"message": "Лист для відновлення паролю відправлено."}, status=status.HTTP_200_OK)


# Відновлення паролю (підтвердження)
class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            uid = force_str(urlsafe_base64_decode(serializer.validated_data["uid"]))
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError):
            return Response({"error": "Недійсний код користувача."}, status=status.HTTP_400_BAD_REQUEST)

        if not token_generator.check_token(user, serializer.validated_data["token"]):
            return Response({"error": "Недійсний або протермінований токен."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data["new_password"])
        user.save()

        return Response({"message": "Пароль успішно змінено."}, status=status.HTTP_200_OK)
