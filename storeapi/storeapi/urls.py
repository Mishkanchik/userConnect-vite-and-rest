from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from product.views import (
    CategoryViewSet,
    ProductViewSet,
    ProductImageViewSet,
    RegisterView,
    LoginView,
    GoogleLoginView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
)

from django.conf import settings
from django.conf.urls.static import static


router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('products', ProductViewSet, basename='product')
router.register('product-images', ProductImageViewSet, basename='product-image')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/auth/google/', GoogleLoginView.as_view(), name='google-login'),
    path('api/password-reset-request/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('api/password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    # Це зло
    # path('api/categories/products/', ProductViewSet.as_view({'get': 'list'})),
]

# Для зображень
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
 