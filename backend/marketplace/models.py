from django.db import models
from accounts.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50, blank=True, null=True) # e.g., 'Book', 'Laptop'
    
    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class MarketplaceItem(models.Model):
    CONDITION_CHOICES = (
        ('new', 'New'),
        ('like_new', 'Like New'),
        ('good', 'Good'),
        ('used', 'Used'),
        ('damaged', 'Damaged'),
    )
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('sold', 'Sold'),
        ('hidden', 'Hidden'),
    )
    LISTING_TYPE_CHOICES = (
        ('sell', 'Selling'),
        ('buy', 'Looking to Buy'),
    )

    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='marketplace_items')
    listing_type = models.CharField(max_length=10, choices=LISTING_TYPE_CHOICES, default='sell')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='items')
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_negotiable = models.BooleanField(default=True)
    
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='good')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Optional fields for academic specifics
    course_code = models.CharField(max_length=50, blank=True, null=True) # e.g. CSE220
    semester = models.CharField(max_length=50, blank=True, null=True) # e.g. Semester-4
    department = models.CharField(max_length=100, blank=True, null=True) # e.g. CSE
    
    image = models.ImageField(upload_to='marketplace/items/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.price} Tk"

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    item = models.ForeignKey(MarketplaceItem, on_delete=models.CASCADE, related_name='wishlisted_by')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'item')

    def __str__(self):
        return f"{self.user.username} - {self.item.title}"
