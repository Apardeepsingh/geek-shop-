from django.contrib import admin
from account.models import User, CartItems, Cart, Address, Order, OrderItem, Bank, Transaction, Testimonial, ReturnOrder, CancelOrder
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# Register your models here.


class UserModelAdmin(BaseUserAdmin):

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserModelAdmin
    # that reference specific fields on auth.User.
    list_display = ["id", "email", "name", "mobile", "address", "tc", "is_admin"]
    list_filter = ["is_admin"]
    fieldsets = [
        ("User Credentials", {"fields": ["email", "password"]}),
        ("Personal info", {"fields": ('name', 'mobile', 'address', 'tc')}),
        ("Permissions", {"fields": ["is_admin"]}),
    ]
    # add_fieldsets is not a standard ModelAdmin attribute. UserModelAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["email", "name", "mobile", "address", "tc", "password1", "password2"],
            },
        ),
    ]
    search_fields = ["email"]
    ordering = ["email", "id"]
    filter_horizontal = []


# Now register the new UserModelAdmin...
admin.site.register(User, UserModelAdmin)




@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'is_paid']
    model = Cart

@admin.register(CartItems)
class CartItemsAdmin(admin.ModelAdmin): 
    list_display = ['uid' ,'cart', 'product', 'size_variant', 'quantity']
    model = CartItems


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin): 
    list_display = ['uid', 'user', 'first_name', 'house_no', 'street_name', 'postal_code', 'city', 'state', 'phone_no']
    model = Address

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin): 
    list_display = ['uid', 'payment_id', 'order_id', 'signature', 'amount', 'datetime']
    model = Transaction


@admin.register(Bank)
class BankAdmin(admin.ModelAdmin): 
    list_display = ['uid', 'user', 'account_holder_name', 'bank_name', 'account_number', 'ifsc_code', 'swift_code', 'iban']
    model = Bank



@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin): 
    list_display = ['uid', 'user', 'rating', 'testimonial_description']
    model = Testimonial



@admin.register(ReturnOrder)
class ReturnOrderAdmin(admin.ModelAdmin): 
    list_display = ['uid', 'user', 'order', 'orderItem', 'totalRefundAmount']
    model = ReturnOrder
    ordering = ['-created_at']
    search_fields = ['uid'] 

@admin.register(CancelOrder)
class CancelOrderAdmin(admin.ModelAdmin): 
    list_display = ['uid', 'user', 'order', 'orderItem', 'totalRefundAmount']
    model = CancelOrder
    ordering = ['-created_at']
    search_fields = ['uid'] 




class OrderItemAdmin(admin.StackedInline): 
    list_display = ['uid', 'order', 'product', 'size_variant', 'quantity', 'isDeliver', 'deliveredAt', 'isCancel',  'isReturn']
    model = OrderItem
    extra = 0
admin.site.register(OrderItem)

 
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin): 
    list_display = ['uid', 'user', 'paymentMethod', 'couponApplied', 'shippingPrice', 'totalPrice', 'isPaid', 'paidAt', 'shippingAddress',  'created_at']
    inlines = [OrderItemAdmin]
    model = Order
    ordering = ['-created_at']
    search_fields = ['uid'] 