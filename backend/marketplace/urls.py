from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, MarketplaceItemViewSet, WishlistViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'items', MarketplaceItemViewSet, basename='item')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')

urlpatterns = [
    path('', include(router.urls)),
]
