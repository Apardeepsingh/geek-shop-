from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView, View
from django.contrib.auth import authenticate
from account.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from products.models import Product, SizeVariant
from account.models import Cart, CartItems, Address, OrderItem, Order, Bank
import io
from rest_framework.parsers import JSONParser
from django.http import HttpResponse, JsonResponse
from account.serializers import UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer, UserChangePassowrdSerializer, SendPasswordResetEmailSerializer, UserPasswordResetSerializer, UserUpdateSerializer, CartItemsSerializer, CartSerializer, AddressSerializer, OrderSerializer, OrderItemSerializer, GetOrderSerializer, BankSerializer, GetCartSerializer, CreateOrderSerializer, TransactionSerializer, TestimonialSerializer, ReturnOrderSerializer, CancelOrderSerializer
from account.main import RazorpayClient
import threading
from account.tasks import send_order_confirmation_email, send_order_cancel_email
# Create your views here.


# generating token manually


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            token = get_tokens_for_user(user)
            return Response({'token': token, 'msg': 'Registraion Successful'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            email = serializer.data.get('email')
            password = serializer.data.get('password')

            user = authenticate(email=email, password=password)

            if user is not None:
                token = get_tokens_for_user(user)
                return Response({'token': token, 'msg': 'Login Successful'}, status=status.HTTP_200_OK)
            else:
                return Response({'errors': {'non_field_errors': ['Invalid Credentials']}}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):

        serializer = UserProfileSerializer(request.user)

        return Response(serializer.data, status=status.HTTP_200_OK)


class UserChangePassowrdView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = UserChangePassowrdSerializer(
            data=request.data, context={'user': request.user})

        if serializer.is_valid(raise_exception=True):
            return Response({'msg': 'Password Changed'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SendPasswordResetEmailView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = SendPasswordResetEmailSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            return Response({'msg': 'link sent to your email.'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserPasswordResetView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, uid, token, format=None):
        serializer = UserPasswordResetSerializer(
            data=request.data, context={'uid': uid, 'token': token})

        if serializer.is_valid(raise_exception=True):
            return Response({'msg': 'Password Reset Successful.'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserUpdateView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        serializer = UserUpdateSerializer(user, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Your Profile has been Updated Successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class CartView(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]

#     def post(self, request, uid):
#         # json_data = request.body
#         # stream = io.BytesIO(json_data)
#         # python_data = JSONParser().parse(stream)

#         #no need for steps above
#         python_data = request.data #request.data returns the parsed content of the request body

#         qty = python_data.get('qty')
#         size_variant = python_data.get('size_variant')

#         size_variant_obj = SizeVariant.objects.get(size_name=size_variant)
#         product = Product.objects.get(uid=uid)
#         user = request.user

#         cart, _ = Cart.objects.get_or_create(user=user, is_paid = False)

#         cart_item = CartItems.objects.create(cart=cart, product=product, size_variant=size_variant_obj, quantity=qty)
#         cart_item.save()

#         return Response({'res': 'added to cart'})


# class CartView(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]

#     def post(self, request, uid):
#         serializer = CartItemsSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         validated_data = serializer.validated_data
#         quantity = validated_data['quantity']
#         size_variant = validated_data['size_variant']

#         size_variant_obj = SizeVariant.objects.get(size_name=size_variant)
#         product = Product.objects.get(uid=uid)
#         user = request.user

#         cart, _ = Cart.objects.get_or_create(user=user, is_paid=False)

#         cart_item = CartItems.objects.create(cart=cart, product=product, size_variant=size_variant_obj, quantity=quantity)
#         cart_item.save()

#         return Response({'res': 'added to cart'})


# this is automated version with serializer
class CartView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, uid):

        product = Product.objects.get(uid=uid)
        user = request.user

        cart, _ = Cart.objects.get_or_create(user=user, is_paid=False)

        python_data = {
            'cart': cart.uid,
            'product': product.uid,
            'size_variant': request.data['size_variant'],
            'quantity': request.data['quantity']
        }

        serializer = CartItemsSerializer(data=python_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({'res': 'added to cart'})

    def put(self, request):
        cart = Cart.objects.get(user=request.user)
        serializer = CartSerializer(cart, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            return Response({'msg': 'Coupon is Applied'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class updateCartView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def put(self, request, uid):
        cart_item = CartItems.objects.get(uid=uid)

        serializer = CartItemsSerializer(
            cart_item, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            return Response({'msg': 'Your cart has been updated'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetCartItemsView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = Cart.objects.get(user=request.user)
        serializer = GetCartSerializer(cart)

        return Response(serializer.data, status=status.HTTP_200_OK)


class DeleteCartItemView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def delete(self, request, uid=None):

        cart = Cart.objects.get(user=request.user)

        if uid is not None:
            cartItem = CartItems.objects.get(uid=uid)
            cartItem.delete()

            return Response({'msg': 'Cart Item Deleted'}, status=status.HTTP_200_OK)

        cart_Items = CartItems.objects.filter(cart=cart)
        cart_Items.delete()
        return Response({'msg': 'Cart Item Deleted'}, status=status.HTTP_200_OK)


class AddressView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, uid=None):

        if uid is not None:
            address = Address.objects.get(uid=uid)
            serializer = AddressSerializer(address)

            return Response(serializer.data, status=status.HTTP_200_OK)

        addresses = Address.objects.filter(user=request.user)
        serializer = AddressSerializer(addresses, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):

        request.data['user'] = request.user.id

        serializer = AddressSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({'msg': 'Your address has been added'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, uid):

        adrs = Address.objects.get(uid=uid)

        adrs.delete()

        return Response({'msg': 'Your Address has been Deleted'}, status=status.HTTP_200_OK)

    def put(self, request, uid):
        adrs = Address.objects.get(uid=uid)

        serializer = AddressSerializer(adrs, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            return Response({'msg': 'Your address has been updated'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BankViews(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bankAccounts = Bank.objects.filter(user=request.user)
        serializer = BankSerializer(bankAccounts, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        request.data['user'] = request.user.id

        serializer = BankSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({'msg': 'Your Bank has been added'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, uid):
        bankAccount = Bank.objects.get(uid=uid)

        bankAccount.delete()

        return Response({'msg': 'Your Bank has been deleted'}, status=status.HTTP_200_OK)



class OrderView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        combine_data = request.data

        order_items = combine_data.pop('orderItems')

        order_data = combine_data
        order_actualdata = {
            'user': request.user.id,
            'paymentMethod': order_data['paymentMethod'],
            'shippingPrice': order_data['shippingPrice'],
            'totalPrice': order_data['totalPrice'],
            'shippingAddress': order_data['shippingAddress'],
            'couponApplied': order_data['couponApplied'],
            'couponDicount': order_data['couponDicount'],
            'isPaid': order_data['isPaid'],
            'paidAt': order_data['paidAt']
        }
        order_serializer = OrderSerializer(data=order_actualdata)

        if order_serializer.is_valid():
            order = order_serializer.save()

            for order_item_data in order_items:
                order_items_actual = {
                    'order': order.uid,
                    'product': order_item_data['product'].get('uid'),
                    'size_variant': order_item_data['size_variant'].get('uid'),
                    'quantity': order_item_data['quantity']
                }
                order_item_serializer = OrderItemSerializer(
                    data=order_items_actual)

                if order_item_serializer.is_valid(raise_exception=True):
                    order_item = order_item_serializer.save()

            # Send the email asynchronously using a thread
            email_thread = threading.Thread(target=send_order_confirmation_email, args=(order, order_items, request.user))
            email_thread.start()

            return Response(order_serializer.data)

            # return Response(order_item_serializer.errors)

        return Response(order_serializer.errors)

    def get(self, request, uid=None):

        if uid is not None:
            orders = Order.objects.get(uid=uid)
            serializer = GetOrderSerializer(orders)

            return Response(serializer.data, status=status.HTTP_200_OK)

        orders = Order.objects.filter(user=request.user)
        serializer = GetOrderSerializer(orders, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, uid):
        orderObj = Order.objects.get(uid=uid)
        serializer = OrderSerializer(orderObj, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            return Response({'msg': 'Your Refund has been updated'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderItemView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def put(self, request, uid):
        order_product = OrderItem.objects.get(uid=uid)
        serializer = OrderItemSerializer(
            order_product, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            # Send the email asynchronously using a thread
            email_thread = threading.Thread(target=send_order_cancel_email, args=(order_product, request.user, request.data))
            email_thread.start()

            return Response({'msg': 'Your order has been updated'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# rezorpay view
rz_client = RazorpayClient()


class CreateOrderApiView(APIView):
    def post(self, request):
        create_order_serializer = CreateOrderSerializer(data=request.data)

        if create_order_serializer.is_valid():
            order_response = rz_client.create_order(
                amount=create_order_serializer.validated_data.get("amount"),
                currency=create_order_serializer.validated_data.get(
                    "currency"),
            )

            response = {
                "status_code": status.HTTP_201_CREATED,
                "message": "order_created",
                "data": order_response
            }
            return Response(response, status=status.HTTP_201_CREATED)
        else:
            response = {
                "status_code": status.HTTP_400_BAD_REQUEST,
                "message": "bad request",
                "error": create_order_serializer.errors
            }

            return Response(response, status=status.HTTP_400_BAD_REQUEST)


class TransactionApiView(APIView):

    def post(self, request):
        transaction_serializer = TransactionSerializer(data=request.data)

        if transaction_serializer.is_valid():
            rz_client.verify_payment(
                razorpay_order_id=transaction_serializer.validated_data.get(
                    "order_id"),
                razorpay_payment_id=transaction_serializer.validated_data.get(
                    "payment_id"),
                razorpay_signature=transaction_serializer.validated_data.get(
                    "signature")
            )
            transaction_serializer.save()

            response = {
                "status_code": status.HTTP_201_CREATED,
                "message": "transaction created"
            }
            return Response(response, status=status.HTTP_201_CREATED)
        else:
            response = {
                "status_code": status.HTTP_400_BAD_REQUEST,
                "message": "bad request",
                "error": transaction_serializer.errors
            }
            return Response(response, status=status.HTTP_400_BAD_REQUEST)



class TestmonialView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]


    def post(self, request):
        request.data['user'] = request.user.id
        
        serializer = TestimonialSerializer(data= request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({'msg': 'Your testimonial has been added'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReturnOrderView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.data['user'] = request.user.id

        serializer = ReturnOrderSerializer(data= request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({'msg': 'return order has been added'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CancelOrderView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.data['user'] = request.user.id

        serializer = CancelOrderSerializer(data= request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({'msg': 'cancel order has been added'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)