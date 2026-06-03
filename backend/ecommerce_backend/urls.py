from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from shop.views import (
    ProductViewSet, CategoryViewSet, OrderViewSet, PaymentViewSet,
    HeroBannerViewSet, CategoryItemViewSet, MarketingBannerViewSet, ReviewViewSet,
    SiteSettingsViewSet
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'hero-banners', HeroBannerViewSet, basename='hero-banner')
router.register(r'category-items', CategoryItemViewSet, basename='category-item')
router.register(r'marketing-banners', MarketingBannerViewSet, basename='marketing-banner')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'settings', SiteSettingsViewSet, basename='settings')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('authentication.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

