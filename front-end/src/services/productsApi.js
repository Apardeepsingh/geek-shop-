import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'



export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://127.0.0.1:8000/product/'}),
    endpoints: (builder) => ({
        getAllProducts: builder.query({
            query: () => {
                return{
                    url: '',
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                    }
                }
            }
        }),
        getSingleProducts: builder.query({
            query: (slug) => {

                return{
                    url: `${slug}`,
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                    }
                }
            }
        }),
        getCategories: builder.query({
            query: () => {

                return{
                    url: "categories/",
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                    }
                }
            }
        }),
        getBrands: builder.query({
            query: () => {

                return{
                    url: "brands/",
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                    }
                }
            }
        }),
        getBillboards: builder.query({
            query: () => {

                return{
                    url: "billboards/",
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                    }
                }
            }
        }),
        getCoupons: builder.query({
            query: () => {

                return{
                    url: "coupons/",
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                    }
                }
            }
        }),
        getColors: builder.query({
            query: () => {

                return{
                    url: "colors/",
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                    }
                }
            }
        }),
        updateProduct: builder.mutation({
            query: ({uid, updatedProductData}) => {

                return{
                    url: `update-product/${uid}`,
                    method: "PUT",
                    body: updatedProductData,
                    headers: {
                        "Content-type": "application/json",
                    }
                }
            }
        }),
        addReview: builder.mutation({
            query: ({access_token, actual_Data}) => {

                return{
                    url: 'review/',
                    method: "POST",
                    body: actual_Data,
                    headers: {
                        "Content-type": "application/json",
                        authorization: `Bearer ${access_token}`,
                    }
                }
            }
        }),
    })
})



export const {useGetAllProductsQuery, useGetSingleProductsQuery, useGetCategoriesQuery, useUpdateProductMutation, useAddReviewMutation, useGetBrandsQuery, useGetBillboardsQuery, useGetCouponsQuery, useGetColorsQuery} = productsApi