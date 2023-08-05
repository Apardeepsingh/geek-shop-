from django.db import models
from base.models import BaseModel
from django.utils.text import slugify
# from account.models import User
from django.conf import settings

User = settings.AUTH_USER_MODEL

# Create your models here.


def get_category_image_upload_path(instance, filename):
    # Assuming 'name' is a field in your model
    slug = slugify(instance.category_name)
    # return f"products/images/{slug}/{filename}"
    return '/'.join(['categories', slug, filename])


class Category(BaseModel):
    MEN = 'men'
    WOMEN = 'women'
    BOTH = 'both'

    CATEGORY_CHOICES = (
        (MEN, 'Men'),
        (WOMEN, 'Women'),
        (BOTH, 'Both'),
    )

    category_name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, null=True, blank=True)
    category_image = models.ImageField(
        upload_to=get_category_image_upload_path, default="")
    is_featured = models.BooleanField(default=False)
    is_for = models.CharField(
        max_length=20, choices=CATEGORY_CHOICES, blank=True, null=True)
    is_for_men = models.BooleanField(default=False, blank=True, null=True)
    men_image = models.ImageField(
        upload_to=get_category_image_upload_path, default="", blank=True, null=True)
    is_for_women = models.BooleanField(default=False, blank=True, null=True)
    women_image = models.ImageField(
        upload_to=get_category_image_upload_path, default="", blank=True, null=True)

    # this function always invoked whenever we make an object of this.
    def save(self, *args, **kwargs):
        self.slug = slugify(self.category_name)

        super(Category, self).save(*args, **kwargs)

    def __str__(self):
        return self.category_name


class Brand(BaseModel):
    brand_name = models.CharField(max_length=255, blank=True, null=True)
    brand_description = models.TextField()

    def __str__(self):
        return self.brand_name


def get_product_image_upload_path(instance, filename):
    # Assuming 'name' is a field in your model
    slug = slugify(instance.product_name)
    # return f"products/images/{slug}/{filename}"
    return '/'.join(['products', slug, filename])


class Product(BaseModel):
    brand_name = models.ForeignKey(
        Brand, on_delete=models.CASCADE, related_name="product_brand", blank=True, null=True)
    product_name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, null=True, blank=True, max_length=100)
    price = models.IntegerField()
    color = models.CharField(max_length=100, blank=True, null=True, default="")
    maximum_retail_price = models.IntegerField(default=0)
    card_thumb_image = models.ImageField(
        upload_to=get_product_image_upload_path, default="")
    product_description = models.TextField()
    stock = models.IntegerField(default=0)
    material = models.CharField(max_length=100, default="")
    fit_type = models.CharField(max_length=100, default="")
    is_cash_on_delivery = models.BooleanField(default=True)
    no_of_days_for_return_exchange = models.IntegerField(default=0)
    product_specifications = models.TextField(default="")
    manufacturer_name_address = models.CharField(max_length=100, default="")
    country_of_origin = models.CharField(max_length=100, default="")
    return_policy = models.CharField(max_length=255, default="")
    overall_rating = models.FloatField(default=0)
    category = models.ManyToManyField(
        Category, related_name="products", blank=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.product_name)
        super().save(*args, **kwargs)

    def __str__(self):
        if self.brand_name:
            return f"{self.product_name} - {self.brand_name.brand_name}"
        else:
            return self.product_name


class SizeVariant(BaseModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE,
                                related_name='size_variants', default=None, null=True, blank=True)
    size_name = models.CharField(max_length=100)
    price = models.IntegerField(default=0)
    stock = models.IntegerField(default=0)

    def __str__(self):
        return self.size_name


class ProductImage(BaseModel):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="product_images")
    image = models.ImageField(upload_to=get_product_image_upload_path)

    @property
    def product_name(self):
        return self.product.product_name


class Reviews(BaseModel):
    review_title = models.CharField(max_length=255)
    review_description = models.TextField()
    rating = models.FloatField(default=0)
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="product_reviews")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    isVerified = models.BooleanField(default=False, blank=True, null=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.update_product_rating()

    def update_product_rating(self):
        product = self.product
        reviews = Reviews.objects.filter(product=product)
        average_rating = reviews.aggregate(models.Avg('rating'))['rating__avg']
        product.overall_rating = average_rating
        product.save()

class ProductColor(BaseModel):
    color_name = models.CharField(max_length=55, blank=True, null=True)
    color_code = models.CharField(max_length=55, blank=True, null=True)

    def __str__(self):
        return self.color_name 


def get_billboard_image_upload_path(instance, filename):
    # Assuming 'name' is a field in your model
    slug = slugify(instance.billboard_title)
    # return f"products/images/{slug}/{filename}"
    return '/'.join(['billboards', slug, filename])
    
class Billboard(BaseModel):
    MEN = 'men'
    WOMEN = 'women'
    HOME = 'home'

    CATEGORY_CHOICES = (
        (MEN, 'men'),
        (WOMEN, 'women'),
        (HOME, 'home'),
    )

    billboard_title = models.CharField(max_length=255, blank=True, null=True)
    billboard_image = models.ImageField(upload_to=get_billboard_image_upload_path, default="")
    billboard_description = models.CharField(max_length=255, blank=True, null=True)
    billboard_url = models.CharField(max_length=255)
    billboard_for = models.CharField(max_length=255, blank=True, null=True)
    billboard_page = models.CharField(max_length=255, choices=CATEGORY_CHOICES, blank=True, null=True)



class Coupon(BaseModel):
    PERCENTAGE = 'percentage'
    FLAT = 'flat'

    DISCOUNT_CHOICES = (
        (PERCENTAGE, 'percentage'),
        (FLAT, 'flat'),
    )

    coupon_code = models.CharField(max_length=50)
    is_expired = models.BooleanField(default=False)
    coupon_type = models.CharField(max_length=255, choices=DISCOUNT_CHOICES, blank=True, null=True)
    discount_percent = models.IntegerField(default=0, blank=True, null=True)
    discount_flat = models.IntegerField(default=0, blank=True, null=True)
    minimum_amount = models.IntegerField(default=0)
    maximum_discount = models.IntegerField(default=0, blank=True, null=True)
    coupon_count_peruser = models.IntegerField(default=0, blank=True, null=True)

    def __str__(self):
        return self.coupon_code