from rest_framework import serializers
from .models import Category, MarketplaceItem, Wishlist

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class MarketplaceItemSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    seller_phone = serializers.CharField(source='seller.phone', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = MarketplaceItem
        fields = ['id', 'seller', 'seller_name', 'seller_phone', 'category', 'category_name', 'title', 'description', 'price', 'is_negotiable', 'condition', 'status', 'course_code', 'semester', 'department', 'image', 'listing_type', 'is_saved']
        read_only_fields = ('seller', 'created_at', 'updated_at')

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Wishlist.objects.filter(user=request.user, item=obj).exists()
        return False

class WishlistSerializer(serializers.ModelSerializer):
    item = MarketplaceItemSerializer(read_only=True)
    item_id = serializers.PrimaryKeyRelatedField(
        queryset=MarketplaceItem.objects.all(), source='item', write_only=True
    )

    class Meta:
        model = Wishlist
        fields = ['id', 'item', 'item_id', 'added_at']
        read_only_fields = ('user', 'added_at')
