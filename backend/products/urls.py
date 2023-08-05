from django.urls import path, include
from products.views import getProductsView, getSingleProductView, getCategoriesView, UpdateProductSizeStockView, ReviewView, BrandsView, ProductSearch, BillboardView, CouponView, ProductColorsView

urlpatterns = [
    path('', getProductsView, name='getProduct'),
    path('categories/', getCategoriesView, name='getCategoriesView'),
    path('<slug>', getSingleProductView, name='getSingleProduct'),
    path('update-product/<uid>', UpdateProductSizeStockView.as_view(), name='update-product'),
    path('review/', ReviewView.as_view(), name='review'),
    path('brands/', BrandsView.as_view(), name='brands'),
    path('billboards/', BillboardView.as_view(), name='billboards'),
    path('coupons/', CouponView.as_view(), name='coupons'),
    path('colors/', ProductColorsView.as_view(), name='colors'),
    path('search/', ProductSearch.as_view(), name='search'),
]
 