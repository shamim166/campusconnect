from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, MarketplaceItem, Wishlist
from .serializers import CategorySerializer, MarketplaceItemSerializer, WishlistSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class MarketplaceItemViewSet(viewsets.ModelViewSet):
    queryset = MarketplaceItem.objects.filter(status='active').order_by('-created_at')
    serializer_class = MarketplaceItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'condition', 'department', 'semester', 'course_code']
    search_fields = ['title', 'description', 'course_code']
    ordering_fields = ['price', 'created_at']

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_items(self, request):
        items = MarketplaceItem.objects.filter(seller=request.user).order_by('-created_at')
        serializer = self.get_serializer(items, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def mark_sold(self, request, pk=None):
        item = self.get_object()
        if item.seller != request.user and request.user.role != 'admin':
            return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        item.status = 'sold'
        item.save()
        return Response({'status': 'Item marked as sold'})

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).order_by('-added_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
