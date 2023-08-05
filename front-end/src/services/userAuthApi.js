import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userAuthApi = createApi({
  reducerPath: "userAuthApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/user/" }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (user) => {
        return {
          url: "register/",
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    loginUser: builder.mutation({
      query: (user) => {
        return {
          url: "login/",
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    getLoggedUser: builder.query({
      query: ({access_token}) => {
        return {
          url: "profile/",
          method: "GET",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    changeUserPassword: builder.mutation({
      query: ({ actualData, access_token }) => {
        return {
          url: "changepassword/",
          method: "POST",
          body: actualData,
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    sendPasswordResetEmail: builder.mutation({
      query: (user) => {
        return {
          url: "send-password-reset-email/",
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    resetPassword: builder.mutation({
      query: ({ actualData, id, token }) => {
        return {
          url: `/reset-password/${id}/${token}`,
          method: "POST",
          body: actualData,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    udpateUser: builder.mutation({
      query: ({ actualData, access_token }) => {
        return {
          url: "update-information/",
          method: "PUT",
          body: actualData,
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    addToCart: builder.mutation({
      query: ({ actualData, access_token, slug }) => {
        
        return {
          url: `cart/${slug}`,
          method: "POST",
          body: actualData,
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    getCartItems: builder.query({
      query: (access_token) => {
        
        return {
          url: 'get-cart-items/',
          method: "GET",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    deleteCartItems: builder.mutation({
      query: ({access_token, uid}) => {
        
        return {
          url: `delete-cart-item/${uid}`,
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    deleteAllCartItems: builder.mutation({
      query: (access_token) => {
        
        return {
          url: 'delete-cart-item/',
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    updateCartItems: builder.mutation({
      query: ({access_token, uid, actualData}) => {
        
        return {
          url: `update-cart-item/${uid}`,
          method: "PUT",
          body: actualData,
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    applyCouponToCart: builder.mutation({
      query: ({access_token, actualData}) => {
        
        return {
          url: "cart/",
          method: "PUT",
          body: actualData,
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    getUserAddresses: builder.query({
      query: (access_token) => {
        
        return {
          url: 'address/',
          method: "GET",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    getSingleUserAddresses: builder.query({
      query: ({uid ,access_token}) => {
        
        return {
          url: `address/${uid}`,
          method: "GET",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    addUserAddresses: builder.mutation({
      query: ({ actualData, access_token}) => {
        
        return {
          url: 'address/',
          method: "POST",
          body: actualData,
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    deleteUserAddresses: builder.mutation({
      query: ({ access_token, uid }) => {
        
        return {
          url: `address/${uid}`,
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    updateUserAddresses: builder.mutation({
      query: ({ access_token, uid, actualData }) => {
        
        return {
          url: `address/${uid}`,
          method: "PUT",
          body: actualData,
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    addOrder: builder.mutation({
      query: ({ access_token, orderData }) => {
        
        return {
          url: 'order/',
          method: "POST",
          body: orderData,
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    getSingleOrder: builder.query({
      query: ({ access_token, uid }) => {
        
        return {
          url: `order/${uid}`,
          method: "GET",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    cancelOrder: builder.mutation({
      query: ({ access_token, uid, actualData }) => {
        
        return {
          url: `update-order/${uid}`,
          method: "PUT",
          body: actualData,
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    refundAmount: builder.mutation({
      query: ({ access_token, uid, actualData }) => {
        // console.log(uid)
        // console.log(actualData)
        return {
          url: `order/${uid}`,
          method: "PUT",
          body: actualData,
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    addBank: builder.mutation({
      query: ({ access_token, actualData }) => {
        
        return {
          url: "bank-details/",
          method: "POST",
          body: actualData,
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    deleteBank: builder.mutation({
      query: ({ access_token, uid}) => {
        
        return {
          url: `bank-details/${uid}`,
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    addTestimonial: builder.mutation({
      query: ({ access_token, actualData }) => {
        
        return {
          url: "testimonial/",
          method: "POST",
          body: actualData,
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    addReturnOrder: builder.mutation({
      query: ({ access_token, actualData }) => {
        
        return {
          url: "return-order/",
          method: "POST",
          body: actualData,
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    addCancelOrder: builder.mutation({
      query: ({ access_token, actualData }) => {
        
        return {
          url: "cancel-order/",
          method: "POST",
          body: actualData,
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetLoggedUserQuery,
  useChangeUserPasswordMutation,
  useSendPasswordResetEmailMutation,
  useResetPasswordMutation,
  useUdpateUserMutation,
  useAddToCartMutation,
  useGetCartItemsQuery,
  useDeleteCartItemsMutation,
  useGetUserAddressesQuery,
  useAddUserAddressesMutation,
  useDeleteUserAddressesMutation,
  useUpdateUserAddressesMutation,
  useGetSingleUserAddressesQuery,
  useUpdateCartItemsMutation,
  useAddOrderMutation,
  useGetSingleOrderQuery,
  useDeleteAllCartItemsMutation,
  useCancelOrderMutation,
  useRefundAmountMutation,
  useAddBankMutation,
  useDeleteBankMutation,
  useApplyCouponToCartMutation,
  useAddTestimonialMutation,
  useAddReturnOrderMutation,
  useAddCancelOrderMutation
} = userAuthApi;
