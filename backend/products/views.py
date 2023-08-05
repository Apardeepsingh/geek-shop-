from products.models import Product, Category, SizeVariant, Brand, Billboard, Coupon, ProductColor
from django.http import HttpResponse, JsonResponse
from products.serializers import getProductsSerializer, CategorySerializer, SizeVariantSerializer, ProductReviewSerializer, BrandSerializer, BillboardSerializer, CouponSerializer, colorSerializer
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.views import APIView, View
from rest_framework.permissions import IsAuthenticated
from account.renderers import UserRenderer
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter
# Create your views here.


def getProductsView(request):
    if request.method == "GET":
        products = Product.objects.all()
        serializer = getProductsSerializer(products, many=True)
        

        # print(serializer.data[0].product_images.first)
        # res = {'msg': 'products are fetched'}
        return JsonResponse(serializer.data, safe=False)


def getSingleProductView(request, slug):
    if request.method == "GET":

        try:
            product = Product.objects.get(slug=slug)

            serializer = getProductsSerializer(product)

            return JsonResponse(serializer.data, safe=False)
        except :
            return JsonResponse({'res': 'no product found'}, safe=False)


def getCategoriesView(request):
    if request.method == "GET": 
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        
        return JsonResponse(serializer.data, safe=False)
    


class UpdateProductSizeStockView(APIView):

    def put(self, request, uid):
        sizeVariant = SizeVariant.objects.get(uid = uid)
        serializer = SizeVariantSerializer(sizeVariant, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            
            return Response({'msg': 'Your product Stock has been updated'}, status=200) 

        return Response(serializer.errors, status=400)
    

class ReviewView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.data['user'] = request.user.id

        serializer = ProductReviewSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({'msg': 'Your Review has been Added'}, status=200) 
        
        return Response(serializer.errors, status=400)


class BrandsView(APIView):
    def get(self, request):
        brands = Brand.objects.all()
        serializer = BrandSerializer(brands, many=True)

        return Response(serializer.data, status=200) 
    

class BillboardView(APIView):
    def get(self, request):
        billboards = Billboard.objects.all()
        serializer = BillboardSerializer(billboards, many=True)

        return Response(serializer.data, status=200)

class CouponView(APIView):
    def get(self, request):
        coupons = Coupon.objects.all()
        serializer = CouponSerializer(coupons, many=True)

        return Response(serializer.data, status=200)
    


class ProductSearch(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = getProductsSerializer
    filter_backends = [SearchFilter]
    search_fields = ['product_name', 'brand_name__brand_name', 'price', 'color', 'product_description', 'material', 'material', 'fit_type', 'product_specifications', 'category__category_name']


class ProductColorsView(APIView):
    def get(self, request):
        colorObjs = ProductColor.objects.all()
        serializer = colorSerializer(colorObjs, many=True)

        return Response(serializer.data, status=200) 
