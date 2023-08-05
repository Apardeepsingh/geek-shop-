import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import { useEffect, useState } from "react";
import { useGetCouponsQuery } from "../services/productsApi";
import { useApplyCouponToCartMutation } from "../services/userAuthApi";
import { getToken } from "../services/localStorageServices";
import { fetchCartData } from "../features/cartSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import React from 'react';

const Coupon = (props) => {
  const {
    totalSellingCost,
    setTotalSellingCost,
    setIsOpenCoupons,
    setIsCouponApplied,
    setCouponDiscount,
    setCouponApplied,
    isCouponApplied,
  } = props;
  const { data: couponsData, isLoading: isCouponsLoading } =
    useGetCouponsQuery();
  const [applyCoupon, { isLoading }] = useApplyCouponToCartMutation();
  const [allCoupons, setAllCoupons] = useState([]);
  const dispatch = useDispatch();
  const { access_token } = getToken();
  const [allOrders, setAllOrders] = useState([]);
  const [couponUsageCount, setCouponUsageCount] = useState({});

  useEffect(() => {
    if (couponsData) {
      const fetchData = async () => {
        const headers = {
          Authorization: `Bearer ${access_token}`,
        };

        try {
          const response = await axios.get(
            "http://127.0.0.1:8000/api/user/order/",
            { headers }
          );

          setAllCoupons(couponsData);
          if (response.data.length > 0) {
            const couponCountMap = {};
            response.data.forEach((order) => {
              const couponUID = order.couponApplied;
              if (couponUID) {
                couponCountMap[couponUID] = (couponCountMap[couponUID] || 0) + 1;
              }
            });
            setCouponUsageCount(couponCountMap);
          }
        } catch (error) {
          console.error("Error occurred while fetching data:", error);
        }
      };

      fetchData();
    }
  }, [couponsData, isCouponsLoading]);


  // handeling coupon
  const handleCoupon = async (coupon) => {
    const actualData = {
      coupon: coupon.uid,
    };

    const res = await applyCoupon({ access_token, actualData });
    if (res.error) {
      console.log(res.error);
    }
    if (res.data) {
      dispatch(fetchCartData());
    }
  };

  useEffect(() => {
    if (isCouponApplied && !isLoading) {
      setIsOpenCoupons(false);
    }
  }, [isCouponApplied]);

  return (
    <>
      <Typography
        sx={{ fontSize: 14, fontWeight: 600, mb: 3, px: "24px" }}
        color="#00000091"
      >
        COUPONS
      </Typography>
      {
        allCoupons.length==0 ? <Box textAlign='center'> <CircularProgress /> </Box> : (

          allCoupons.map((coupon, index) => {

            return (
              <span key={coupon.uid}>
                {!coupon.is_expired && // Added parentheses for better readability
                  (!couponUsageCount[coupon.uid] || // Check if the coupon UID doesn't exist in the couponUsageCount object
                    couponUsageCount[coupon.uid] < coupon.coupon_count_peruser) ? (
                  <span>
                    <Box px={3}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          fontWeight={600}
                          fontSize={14}
                          py={1}
                          px={2}
                          border="1px dashed #2B3947"
                          borderRadius="3px"
                          color="primary"
                          textTransform="uppercase"
                        >
                          {coupon.coupon_code}
                        </Typography>
                        {isLoading ? (
                          <CircularProgress />
                        ) : (
                          <Button
                            onClick={() => handleCoupon(coupon)}
                            sx={{ fontSize: "14px", fontWeight: 600 }}
                            variant="outlined"
                            size="small"
                            disabled={totalSellingCost < coupon.minimum_amount}
                          >
                            Apply
                          </Button>
                        )}
                      </Stack>
                      <Typography
                        mt={2}
                        fontSize={14}
                        textTransform="capitalize"
                        fontWeight={600}
                        color="text.secondary"
                      >
                        Save upto RS. {coupon.maximum_discount}
                      </Typography>
                      <Typography
                        mt={0.7}
                        fontSize={14}
                        textTransform="capitalize"
                        color="text.secondary"
                      >
                        {coupon.coupon_type == "percentage"
                          ? `${coupon.discount_percent}% off on minimum purchase of Rs. ${coupon.minimum_amount}`
                          : `Flat Rs. ${coupon.discount_flat} off on minimum purchase of Rs. ${coupon.minimum_amount}`}
                      </Typography>
                      {totalSellingCost < coupon.minimum_amount ? (
                        <>
                          <Divider sx={{ my: 1.5 }} light />
                          <Typography
                            mt={0.7}
                            fontSize={14}
                            textTransform="capitalize"
                          >
                            Shop for Rs. {coupon.minimum_amount - totalSellingCost}{" "}
                            more to apply.
                          </Typography>
                        </>
                      ) : null}
                    </Box>
                    <Divider
                      sx={{
                        my: 3,
                        display: index == allCoupons.length - 1 && "none",
                      }}
                    />
                  </span>
                ) : null}
              </span>
            );
          })

        )
      }

    </>
  );
};

export default Coupon;
