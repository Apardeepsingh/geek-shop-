from rest_framework import serializers
from products.models import Product, ProductImage, SizeVariant, Category, Reviews, Brand, Billboard, Coupon, ProductColor




class SizeVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = SizeVariant
        fields = ['uid', 'size_name', 'price', 'stock']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['image']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        exclude = ['created_at', 'updated_at']


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['brand_name', 'brand_description']


class BillboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Billboard
        fields = "__all__"

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = "__all__"

class colorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColor
        fields = "__all__"


class ProductReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)

    class Meta:
        model = Reviews
        fields = '__all__'

 
class getProductsSerializer(serializers.ModelSerializer):
    product_images = ProductImageSerializer(many=True, read_only=True) #variable name should be the related name that you given in foreign key or declare source
    size_variant = SizeVariantSerializer(many=True, source='size_variants')
    product_reviews = ProductReviewSerializer(many=True)
    brand_name = serializers.CharField(source='brand_name.brand_name', read_only=True)

    category = serializers.SerializerMethodField()
    
    def get_category(self, obj):
        category_ids = list(obj.category.values_list('uid', flat=True))
        category = Category.objects.filter(uid__in=category_ids)
        serializer = CategorySerializer(category, many=True)

        return serializer.data


    class Meta:
        model = Product
        fields = '__all__'


