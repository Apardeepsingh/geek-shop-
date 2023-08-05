from rest_framework import serializers
from account.models import User, Cart, CartItems, Address, OrderItem, Order, Bank, Transaction, Testimonial, ReturnOrder, CancelOrder
from xml.dom import ValidationErr
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from account.utils import Util
from rest_framework.exceptions import ValidationError
from products.models import Product, SizeVariant, Coupon
from uuid import UUID
import json

class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(
        style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        # fields that this serializer goining to use
        fields = ['email', 'name', 'mobile',
                  'address', 'password', 'password2', 'tc']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    # validating password and confirm password
    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password != password2:
            raise serializers.ValidationError(
                'Password and Confirm Password does not matched.')
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)

    class Meta:
        model = User
        # fields that this serializer goining to use
        fields = ['email', 'password']


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'mobile', 'address', 'is_admin']


class UserChangePassowrdSerializer(serializers.Serializer):
    password = serializers.CharField(
        max_length=255, style={'input_type': 'password'}, write_only=True)
    password2 = serializers.CharField(
        max_length=255, style={'input_type': 'password'}, write_only=True)

    class Meta:
        fields = ['password', 'password2']

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        user = self.context.get('user')

        if password != password2:
            raise serializers.ValidationError(
                'Password and Confirm Password does not matched.')

        user.set_password(password)
        user.save()
        return attrs


class SendPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)

    class Meta:
        fields = ['email']

    def validate(self, attrs):
        email = attrs.get('email')

        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uid =  urlsafe_base64_encode( force_bytes(user.id))
            #urlsafe_base64_encode() does not accept arg in interger, it takes argument in bytes thats why we ne force_bytes()

            token = PasswordResetTokenGenerator().make_token(user)
            
            link = 'http://localhost:3000/api/user/reset/'+uid+'/'+token

            # print(link)
            #send email
            body = f"Click this link to reset your password {link}"
            data = {
                'subject': 'Reset Your Password',
                'body': body,
                'to': user.email 
            }
            Util.send_email(data)

            return attrs
        else:
            raise ValidationError('No User Found With this Email')



class UserPasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(
        max_length=255, style={'input_type': 'password'}, write_only=True)
    password2 = serializers.CharField(
        max_length=255, style={'input_type': 'password'}, write_only=True)

    class Meta:
        fields = ['password', 'password2']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            password2 = attrs.get('password2')
            uid = self.context.get('uid')
            token = self.context.get('token')

            if password != password2:
                raise serializers.ValidationError(
                    'Password and Confirm Password does not matched.')
            
            id = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                raise ValidationError('Link is not valid or expired.')

            user.set_password(password)
            user.save()
            return attrs
        except DjangoUnicodeDecodeError as identifier:
            PasswordResetTokenGenerator().check_token(user,token)
            raise ValidationError('Link is not valid or expired.')




class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'name', 'mobile', 'address')


 

class CartItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItems
        fields = '__all__'


    def create(self, validated_data):
        cart = validated_data.get('cart')
        product = validated_data.get('product')
        size_variant = validated_data.get('size_variant')
        quantity = validated_data.get('quantity', 1)
        
        # Check if the same product with the same size variant already exists in the cart
        existing_item = CartItems.objects.filter(cart=cart, product=product, size_variant=size_variant).first()

        if existing_item:
            # Calculate the new quantity by adding the existing quantity and the requested quantity
            new_quantity = existing_item.quantity + quantity

            # Check if the new quantity exceeds the stock of the size variant
            if new_quantity > size_variant.stock:
                # Set the quantity to the available stock
                existing_item.quantity = size_variant.stock
            else:
                # Set the quantity to the new quantity
                existing_item.quantity = new_quantity
                
            existing_item.save()
            return existing_item 

        # Create a new cart item if it doesn't exist
        return super().create(validated_data)
 



# for getting cart items: need to make custom JSON encoder
class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            return str(obj)
        return super().default(obj)

class UUIDField(serializers.Field):
    def to_representation(self, value):
        if isinstance(value, UUID):
            return str(value)
        return super().to_representation(value)


class ProductsSerializer(serializers.ModelSerializer):
    uid = UUIDField()
    
    class Meta:
        model = Product
        fields = '__all__'
        

class SizeVariantSerializer(serializers.ModelSerializer):
    uid = UUIDField()

    class Meta:
        model = SizeVariant
        fields = '__all__'

class CouponSerializer(serializers.ModelSerializer):
    uid = UUIDField()

    class Meta:
        model = Coupon
        fields = '__all__'

class GetCartItemsSerializer(serializers.ModelSerializer):
    product = ProductsSerializer( read_only=True)
    size_variant = SizeVariantSerializer(read_only=True)

    class Meta:
        model = CartItems
        fields = ['uid', 'product', 'size_variant' ,'quantity']



class CartSerializer(serializers.ModelSerializer):
    cart_items = GetCartItemsSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return json.loads(json.dumps(representation, cls=UUIDEncoder))


class GetCartSerializer(serializers.ModelSerializer):
    cart_items = GetCartItemsSerializer(many=True, read_only=True)
    coupon = CouponSerializer()

    class Meta:
        model = Cart
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return json.loads(json.dumps(representation, cls=UUIDEncoder))
    

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'


class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = '__all__'


# for saving order items with order 
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

# for getting order items with order 
class GetOrderItemSerializer(serializers.ModelSerializer):
    product = ProductsSerializer( read_only=True)
    size_variant = SizeVariantSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = '__all__'

class GetOrderSerializer(serializers.ModelSerializer):
    order_items = GetOrderItemSerializer(many=True, read_only=True)
    shippingAddress = AddressSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return json.loads(json.dumps(representation, cls=UUIDEncoder))


class OrderSerializer(serializers.ModelSerializer):
    order_items = GetOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return json.loads(json.dumps(representation, cls=UUIDEncoder))
    


# razorpay serializer
class CreateOrderSerializer(serializers.Serializer):
    amount = serializers.IntegerField()
    currency = serializers.CharField()

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ["payment_id", "order_id", "signature", "amount"]


############################################################################################


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ["rating", "testimonial_description", "user"]



class ReturnOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReturnOrder
        fields = ["user", "order", "orderItem", "totalRefundAmount"]


class CancelOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = CancelOrder
        fields = ["user", "order", "orderItem", "totalRefundAmount"]