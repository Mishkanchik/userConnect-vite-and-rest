from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from product.views import CategoryViewSet
from product.views import RegisterView, LoginView, GoogleLoginView
from product.views import PasswordResetRequestView, PasswordResetConfirmView

from django.conf import settings
from django.conf.urls.static import static


router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/auth/google/', GoogleLoginView.as_view(), name='google-login'),
    path('api/password-reset-request/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('api/password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
