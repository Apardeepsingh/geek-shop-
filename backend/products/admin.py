from django.contrib import admin
from .models import *
from ckeditor.widgets import CKEditorWidget
from django import forms
# Register your models here.

admin.site.register(Category)


class ProductImageAdmin(admin.StackedInline):
    model = ProductImage


admin.site.register(ProductImage)


class SizeVariantAdmin(admin.StackedInline):
    # list_display = ['uid', 'size_name', 'price']
    model = SizeVariant


admin.site.register(SizeVariant)


class ProductAdminForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = '__all__'
        widgets = {
            'product_description': CKEditorWidget(),  
        }

    color = forms.CharField(
        help_text='Add multiple colors separated with commas.' 
    )
    product_specifications = forms.CharField(
        widget=forms.Textarea,
        help_text='Add multiple specifications separated with pipe"|".' 
    )


class ProductAdmin(admin.ModelAdmin):
    list_display = ['uid', 'product_name', 'price', 'product_description']
    inlines = [ProductImageAdmin, SizeVariantAdmin]
    form = ProductAdminForm


admin.site.register(Product, ProductAdmin)



@admin.register(Reviews)
class ReviewsAdmin(admin.ModelAdmin):
    list_display = ['review_title', 'review_description',
                    'rating', 'product', 'user', 'isVerified']
    model = Reviews


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['brand_name', 'brand_description']
    model = Brand


@admin.register(Billboard)
class BillboardAdmin(admin.ModelAdmin):
    list_display = ['billboard_page', 'billboard_image',
                    'billboard_title', 'billboard_description']
    model = Billboard


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['uid', 'coupon_code',
                    'discount_percent', 'minimum_amount', 'is_expired']
    model = Coupon


@admin.register(ProductColor)
class ProductColorAdmin(admin.ModelAdmin):
    list_display = ['uid', 'color_name', 'color_code']
    model = ProductColor
