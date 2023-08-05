from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from base.models import BaseModel
from products.models import Product, SizeVariant, Coupon

# Create your models here.


# custom user manager
class UserManager(BaseUserManager):
    def create_user(self, email, name, mobile, address, tc, password=None, password2=None):
        """
        Creates and saves a User with the given email, name, mobile, tc and password
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            name=name,
            mobile=mobile,
            address=address,
            tc=tc
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, mobile, address, tc, password=None):
        """
        Creates and saves a User with the given email, name, mobile, tc and password
        """
        user = self.create_user(
            email,
            password=password,
            name=name,
            mobile=mobile,
            address=address,
            tc=tc
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


# custom user model
class User(AbstractBaseUser):
    email = models.EmailField(
        verbose_name="Email",
        max_length=255,
        unique=True,
    )
    name = models.CharField(max_length=255)
    mobile = models.CharField(max_length=20, unique=True)
    address = models.CharField(max_length=255)
    tc = models.BooleanField()
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['name', 'mobile', 'tc', 'address']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin


class Cart(BaseModel):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='carts')
    is_paid = models.BooleanField(default=False)
    coupon = models.ForeignKey(Coupon, on_delete=models.SET_NULL, null=True, blank=True )

    def __str__(self):
        return self.user.email


class CartItems(BaseModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    size_variant = models.ForeignKey(SizeVariant, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.IntegerField(default=1)


class Address(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_address')
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    house_no = models.CharField(max_length=255)
    street_name = models.CharField(max_length=255)
    landmark = models.CharField(max_length=255, null=True, blank=True)
    postal_code = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    phone_no = models.CharField(max_length=20)

    class Meta:
        verbose_name_plural = 'Addresses'

    def __str__(self):
        return self.house_no+ ", " + self.street_name+ ", " + self.city+ ", " + self.state+ ", " + self.postal_code
    

class Bank(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_bank_details')
    account_holder_name = models.CharField(max_length=255)
    bank_name = models.CharField(max_length=255)
    account_number = models.CharField(max_length=255)
    ifsc_code = models.CharField(max_length=255)
    swift_code = models.CharField(max_length=255, blank=True, null=True)
    iban = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        verbose_name_plural = 'Bank Details'

    def __str__(self):
        return "IFSC Code: " + self.ifsc_code + " | " + "account_number: " + self.account_number+ " | " + "account_holder_name: " + self.account_holder_name+ " | " + "bank_name: " + self.bank_name+ " | " + "swift_code: " + self.swift_code


class Order(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_order')
    paymentMethod = models.CharField(max_length=200)
    # taxPrice = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    shippingPrice = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    totalPrice = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    couponApplied = models.ForeignKey(Coupon, on_delete=models.SET_NULL, null=True, blank=True)
    couponDicount = models.DecimalField(default=0, max_digits=12, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    shippingAddress = models.ForeignKey(Address, on_delete=models.SET_NULL, related_name='shipping_address', null=True, blank=True)
    refundBankDetails = models.ForeignKey(Bank, on_delete=models.SET_NULL, related_name='refund_bank_details', blank=True, null=True)
    totalRefundAmount = models.DecimalField(default=0, max_digits=12, decimal_places=2, null=True, blank=True)


class OrderItem(BaseModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    size_variant = models.ForeignKey(SizeVariant, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.IntegerField(default=1)
    estimateDeliveryDate =  models.DateTimeField(auto_now_add=False, null=True, blank=True)
    isPreparing = models.BooleanField(default=False)
    isDelayed = models.BooleanField(default=False, null=True, blank=True)
    isShipped = models.BooleanField(default=False)
    isOutForDelivery = models.BooleanField(default=False)
    isDeliver = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    isCancel = models.BooleanField(default=False)
    isReturn = models.BooleanField(default=False, null=True, blank=True)
    isOutForPickup = models.BooleanField(default=False)
    isRefundInitiated = models.BooleanField(default=False)
    refundInitiatedAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    isRefundApproved = models.BooleanField(default=False)
    isRefundComplete = models.BooleanField(default=False)
    refundCompletedAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)

from .signals import order_delivered    

class Transaction(BaseModel):
    payment_id = models.CharField(max_length=100, verbose_name="Payment Id")
    order_id = models.CharField(max_length=100, verbose_name="Order Id")
    signature = models.CharField(max_length=200, verbose_name="Signature")
    amount = models.IntegerField(verbose_name="Amount")
    datetime = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.uid)
    

class ReturnOrder(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_return_order')
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='return_order')
    orderItem = models.ForeignKey(OrderItem, on_delete=models.CASCADE, related_name='return_order_item', blank=True, null=True)
    totalRefundAmount = models.DecimalField(default=0, max_digits=12, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        return str(self.order.uid)

class CancelOrder(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_cancel_order')
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='cancel_order')
    orderItem = models.ForeignKey(OrderItem, on_delete=models.CASCADE, related_name='cancel_order_item', blank=True, null=True)
    totalRefundAmount = models.DecimalField(default=0, max_digits=12, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        return str(self.order.uid)

class Testimonial(BaseModel):
    rating = models.FloatField(default=0)
    testimonial_description = models.TextField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.name + " " + self.rating + " " + self.review_description