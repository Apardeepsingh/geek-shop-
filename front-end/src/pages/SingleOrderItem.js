import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  Grid,
  Stack,
  Typography,
  CardHeader,
  Avatar,
  IconButton,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
  CircularProgress,
  DialogContent,
} from "@mui/material";
import { NavLink, useParams } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import ArrowBackIosNewSharpIcon from "@mui/icons-material/ArrowBackIosNewSharp";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import RadioButtonCheckedTwoToneIcon from "@mui/icons-material/RadioButtonCheckedTwoTone";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import axios from "axios";
import { useEffect, useState } from "react";
import { getToken } from "../services/localStorageServices";
import moment from "moment";
import {
  useAddCancelOrderMutation,
  useAddReturnOrderMutation,
  useCancelOrderMutation,
  useRefundAmountMutation,
} from "../services/userAuthApi";
import { useUpdateProductMutation } from "../services/productsApi";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CircleIcon from "@mui/icons-material/Circle";
import RefundBankInformation from "./auth/RefundBankInformation";
import PreLoader from "../components/PreLoader";
import React from "react";

const SingleOrderItem = () => {
  const { orderId, orderItemId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState({});
  const [OrderItemData, setOrderItemData] = useState({});
  const [remainigItems, setremainigItems] = useState([]);
  const [openOrderCancelConfirmation, setopenOrderCancelConfirmation] =
    useState(false);
  const [openOrderReturnConfirmation, setopenOrderReturnConfirmation] =
    useState(false);
  const { access_token } = getToken();
  const [refetchState, setRefetchState] = useState(0);
  const [cancellingOrder, { isLoading: isOrderCancellingLoading, isSuccess }] =
    useCancelOrderMutation();
  const [updateProduct, { isLoading: isupdateProductLoading }] =
    useUpdateProductMutation();
  const [returnWindow, setrRturnWindow] = useState();
  const [lastDateForReturn, setLastDateForReturn] = useState();
  const [addRefundAmount, { }] = useRefundAmountMutation();
  const [isRefund, setIsRefund] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState("");
  const [addReturnOrder, { isLoading: isReturnOrderLoading }] = useAddReturnOrderMutation()
  const [addCancelOrder] = useAddCancelOrderMutation()

  // fetching order data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/user/order/${orderId}`,
          { headers }
        );
        setOrderData(response.data);
      } catch (error) {
        console.error("Error occurred while fetch ing data:", error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [orderItemId, refetchState]);

  // getting order item
  useEffect(() => {
    if (orderData.order_items) {
      const orderItem = orderData.order_items.filter((item) => {
        return item.uid == orderItemId;
      });
      setOrderItemData(orderItem[0]);
    }
  }, [orderData]);

  // getting remainigItems in order
  useEffect(() => {
    if (orderData.order_items) {
      const remainingItems = orderData.order_items.filter((item) => {
        return item.uid != orderItemId;
      });
      setremainigItems(remainingItems);

      // for setting state to show refund amount
      const hasCancellProduct = orderData.order_items.some(
        (product) =>
          (product.isCancel == true && orderData.paymentMethod != "cod") ||
          product.isReturn == true
      );

      setIsRefund(hasCancellProduct);
    }
  }, [orderData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [orderItemId]);

  // getting return window
  useEffect(() => {
    if (OrderItemData.deliveredAt) {
      const currentDate = new Date();

      // Parse the delivered date into a Date object
      const parsedDeliveredDate = new Date(OrderItemData.deliveredAt);

      // Calculate the difference in days between the current date and the delivered date
      const timeDiff = currentDate.getTime() - parsedDeliveredDate.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

      setrRturnWindow(daysDiff);

      // getting last day for return
      const deliveryDateTime = new Date(OrderItemData.deliveredAt); // Parse the delivery date string into a Date object

      const laterDate = new Date(OrderItemData.deliveredAt); // Create a new Date object with the delivery date
      laterDate.setDate(
        laterDate.getDate() +
        OrderItemData.product.no_of_days_for_return_exchange
      ); // Add return window days days to the later date

      const laterDateString = moment(laterDate).format("Do MMM YYYY ");
      setLastDateForReturn(laterDateString);
    }
  }, [OrderItemData]);

  // to cancel order
  const cancelOrder = async () => {
    if (
      orderData.isPaid &&
      orderData.paymentMethod != "cod" &&
      selectedBankAccount == "" &&
      orderData.refundBankDetails == null
    ) {
    } else {
      const actualData = {
        isCancel: true,
      };

      const res = await cancellingOrder({
        access_token,
        uid: orderItemId,
        actualData,
      });
      if (res.error) {
        console.log(res.error);
      }
      if (res.data) {
        // updating stock after cancelling item
        const updatedProductData = {
          stock: OrderItemData.size_variant.stock + OrderItemData.quantity,
        };
        const SizeVar_uid = OrderItemData.size_variant.uid;

        const updres = await updateProduct({
          uid: SizeVar_uid,
          updatedProductData,
        });
        if (updres.error) {
        }
        if (updres.data) {
          console.log(updres.data);
        }

        // updating refund amount
        const refundAmount = {
          totalRefundAmount: orderData.isPaid
            ? orderData.couponApplied
              ? parseInt(orderData.totalRefundAmount) +
              parseInt(
                (OrderItemData.product.price +
                  OrderItemData.size_variant.price) *
                OrderItemData.quantity -
                orderData.couponDicount / orderData.order_items.length
              ) +
              parseInt(orderData.shippingPrice)
              : parseInt(orderData.totalRefundAmount) +
              parseInt(
                (OrderItemData.product.price +
                  OrderItemData.size_variant.price) *
                OrderItemData.quantity
              ) +
              parseInt(orderData.shippingPrice)
            : 0,
          refundBankDetails: orderData.isPaid
            ? selectedBankAccount == ""
              ? orderData.refundBankDetails
              : selectedBankAccount
            : "",
        };

        const refundRes = addRefundAmount({
          access_token,
          uid: orderId,
          actualData: refundAmount,
        });
        if (refundRes.error) {
          console.log(refundRes.error);
        }
        if (refundRes.data) {
          console.log(refundRes.data);
        }

        const cancelOrderData = {
          order: orderId,
          orderItem: orderItemId,
          totalRefundAmount: orderData.isPaid
            ? orderData.couponApplied
              ? parseInt(
                (OrderItemData.product.price +
                  OrderItemData.size_variant.price) *
                OrderItemData.quantity -
                orderData.couponDicount / orderData.order_items.length
              ) +
              parseInt(orderData.shippingPrice)
              : parseInt(
                (OrderItemData.product.price +
                  OrderItemData.size_variant.price) *
                OrderItemData.quantity
              ) +
              parseInt(orderData.shippingPrice) : 0
        }
        const cancelOrderRes = await addCancelOrder({ access_token, actualData: cancelOrderData })
        if (cancelOrderRes.error) {
          console.log(cancelOrderRes.error)
        }
        if (cancelOrderRes.data) {
          console.log(cancelOrderRes.data)
        }

        setRefetchState((prev) => prev + 1);
        closeConfirmation();
      }
    }
  };

  // handeling return order
  const returnOrder = async () => {
    if (selectedBankAccount == "" && orderData.refundBankDetails == null) {
    } else {
      const actualData = {
        isReturn: true,
      };

      const res = await cancellingOrder({
        access_token,
        uid: orderItemId,
        actualData,
      });
      if (res.error) {
        console.log(res.error);
      }
      if (res.data) {
        // updating stock after cancelling item
        const updatedProductData = {
          stock: OrderItemData.size_variant.stock + OrderItemData.quantity,
        };
        const SizeVar_uid = OrderItemData.size_variant.uid;

        const updres = await updateProduct({
          uid: SizeVar_uid,
          updatedProductData,
        });
        if (updres.error) {
        }
        if (updres.data) {
          console.log(updres.data);
        }

        // updating refund amount
        const refundAmount = {
          totalRefundAmount: orderData.couponApplied
            ? parseInt(orderData.totalRefundAmount) +
            parseInt(
              (OrderItemData.product.price +
                OrderItemData.size_variant.price) *
              OrderItemData.quantity -
              orderData.couponDicount / orderData.order_items.length
            ) +
            parseInt(orderData.shippingPrice)
            : parseInt(orderData.totalRefundAmount) +
            parseInt(
              (OrderItemData.product.price +
                OrderItemData.size_variant.price) *
              OrderItemData.quantity
            ) +
            parseInt(orderData.shippingPrice),
          refundBankDetails:
            selectedBankAccount == ""
              ? orderData.refundBankDetails
              : selectedBankAccount,
        };

        const refundRes = addRefundAmount({
          access_token,
          uid: orderId,
          actualData: refundAmount,
        });
        if (refundRes.error) {
          console.log(refundRes.error);
        }
        if (refundRes.data) {
          console.log(refundRes.data);
        }

        const returnOrderData = {
          order: orderId,
          orderItem: orderItemId,
          totalRefundAmount: orderData.couponApplied
            ? parseInt(
              (OrderItemData.product.price +
                OrderItemData.size_variant.price) *
              OrderItemData.quantity -
              orderData.couponDicount / orderData.order_items.length
            ) +
            parseInt(orderData.shippingPrice)
            : parseInt(
              (OrderItemData.product.price +
                OrderItemData.size_variant.price) *
              OrderItemData.quantity
            ) +
            parseInt(orderData.shippingPrice)
        }
        const returnOrderRes = await addReturnOrder({ access_token, actualData: returnOrderData })
        if (returnOrderRes.error) {
          console.log(returnOrderRes.error)
        }
        if (returnOrderRes.data) {
          console.log(returnOrderRes.data)
        }

        setRefetchState((prev) => prev + 1);
      }
      closeReturnConfirmation();
    }
  };

  const closeConfirmation = () => {
    setopenOrderCancelConfirmation(false);
  };

  const closeReturnConfirmation = () => {
    setopenOrderReturnConfirmation(false);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        {isLoading ? (
          <PreLoader />
        ) : (
          <Grid
            container
            justifyContent="center"
            alignItems="top"
            bgcolor="#ECECEC"
            py={4}
            pb={6}
            spacing={2}
          >
            <Grid item md={6} xs={11}>
              <Button
                component={NavLink}
                to="/my-orders"
                startIcon={<ArrowBackIosNewSharpIcon />}
                disableRipple
                sx={{
                  px: 0,
                  textTransform: "none",
                  fontSize: "16px",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                Back to My Orders
              </Button>
              <Box mt={4} sx={{ display: { md: "flex", xs: "block" } }} justifyContent="space-between">
                <Typography variant="subtitle2" sx={{ fontSize: { xs: 12, md: 14 } }}>ORDER ID: {orderId}</Typography>
                <Typography variant="subtitle2" sx={{ fontSize: { xs: 12, md: 14 } }}>
                  ORDER PLACED{" "}
                  {moment(orderData.created_at)
                    .format("Do MMM YY h:mm A")
                    .toUpperCase()}
                </Typography>
              </Box>

              {/* order item starts here */}
              <Card sx={{ mt: "11px", pb: "25px" }}>
                <Grid
                  container
                  sx={{ p: { xs: 1, md: 2 }, py: { xs: 2, md: 2 } }}
                >
                  <Grid item md={3} xs={4}>
                    <CardActionArea
                      component={NavLink}
                      to={`/singleproduct/${OrderItemData.product ? OrderItemData.product.slug : ""
                        }`}
                    >
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <img
                          width="100%"
                          src={`http://127.0.0.1:8000${OrderItemData.product
                            ? OrderItemData.product.card_thumb_image
                            : ""
                            }`}
                          alt="product"
                        />
                      </Box>
                    </CardActionArea>
                  </Grid>
                  <Grid
                    item
                    md={9}
                    xs={8}
                    px={2}
                    display="flex"
                    flexDirection="column"
                  >
                    <Stack spacing={0.7} sx={{ mt: { md: 0.5, xs: 0 } }}>
                      <Box>
                        {OrderItemData.isCancel ? (
                          <Chip
                            size="small"
                            sx={{
                              fontSize: { xs: "10px", md: "12px" },
                              bgcolor: "#FFEFEF",
                              color: "#d24141",
                            }}
                            label="ORDER CANCELLED"
                          />
                        ) : (
                          <Chip
                            size="small"
                            sx={{
                              fontSize: { xs: "10px", md: "12px" },
                              bgcolor: "#E7FFEB",
                              color: "#2e7d32",
                            }}
                            label={
                              OrderItemData.isPreparing &&
                                !OrderItemData.isReturn
                                ? OrderItemData.isShipped
                                  ? OrderItemData.isOutForDelivery
                                    ? OrderItemData.isDeliver
                                      ? "DELIVERED"
                                      : "OUT FOR DELIVERY"
                                    : "SHIPPED"
                                  : "PREPARING"
                                : OrderItemData.isReturn
                                  ? OrderItemData.isRefundInitiated
                                    ? OrderItemData.isRefundApproved
                                      ? OrderItemData.isRefundComplete
                                        ? "REFUND COMPLETED"
                                        : "REFUND APPROVED"
                                      : "REFUND INITIATED"
                                    : "RETURN REQUESTED"
                                  : "CONFIRMED"
                            }
                          />
                        )}
                      </Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontSize: { xs: "12px", md: "16px" } }}
                      >
                        {OrderItemData.product
                          ? OrderItemData.product.product_name
                          : ""}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        variant="subtitle2"
                        sx={{
                          fontSize: { xs: "12px", md: "14px" },
                          mt: { xs: "0 !important", md: "5.6px !important" },
                        }}
                      >
                        Size:{" "}
                        {OrderItemData.size_variant
                          ? OrderItemData.size_variant.size_name
                          : ""}{" "}
                        | Qty: {OrderItemData.quantity}
                      </Typography>
                      <Typography fontWeight={600} variant="subtitle2">
                        ₹
                        {OrderItemData.product
                          ? OrderItemData.product.price +
                          OrderItemData.size_variant.price
                          : ""}
                      </Typography>
                    </Stack>
                    {!OrderItemData.isCancel ? (
                      <Stack
                        spacing={0.5}
                        mt="auto"
                        direction="row"
                        display="flex"
                        justifyItems="center"
                        alignItems="center"
                      >
                        <LocalShippingIcon
                          sx={{ fontSize: { xs: "14px", md: "16px" } }}
                          color="primary"
                        />
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          sx={{ fontSize: { xs: "12px", md: "14px" } }}
                        >
                          {OrderItemData.isDeliver
                            ? `Delivered on: ${moment(
                              new Date(OrderItemData.deliveredAt)
                            ).format("D MMM, YYYY ")}`
                            : OrderItemData.isOutForDelivery
                              ? `Delivery by Today`
                              : OrderItemData.estimateDeliveryDate
                                ? `Delivery by: ${moment(
                                  new Date(OrderItemData.estimateDeliveryDate)
                                ).format("D MMM, YYYY ")}`
                                : "Delivery by: Will let you know"}
                        </Typography>
                      </Stack>
                    ) : null}

                    <Box
                      component="span"
                      sx={{
                        marginTop: "auto",
                        display: { xs: "none", md: "block" },
                      }}
                    >
                      <Box
                        textAlign={
                          OrderItemData.isShipped && !OrderItemData.isDeliver
                            ? "start"
                            : "right"
                        }
                        sx={{ marginTop: "auto" }}
                      >
                        {!OrderItemData.isCancel && !OrderItemData.isShipped ? (
                          <Button
                            sx={{ textTransform: "capitalize" }}
                            variant="outlined"
                            size="medium"
                            onClick={() => setopenOrderCancelConfirmation(true)}
                          >
                            Cancel
                          </Button>
                        ) : null}

                        {OrderItemData.isShipped &&
                          !OrderItemData.isDeliver &&
                          !OrderItemData.isDelayed ? (
                          <Typography fontSize="14px" color="text.secondary">
                            Order cannot be cancelled once it's shipped.
                          </Typography>
                        ) : null}
                        {OrderItemData.isShipped &&
                          !OrderItemData.isDeliver &&
                          OrderItemData.isDelayed ? (
                          <Typography fontSize="14px" color="text.secondary">
                            Your order is delayed by a few days, we will get it
                            delivered at the earliest.
                          </Typography>
                        ) : null}
                      </Box>
                      {OrderItemData.isDeliver &&
                        !OrderItemData.isReturn &&
                        returnWindow <=
                        OrderItemData.product.no_of_days_for_return_exchange ? (
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="end"
                        >
                          <Typography variant="subtitle1" fontSize="14px">
                            Return is available till {lastDateForReturn}{" "}
                          </Typography>
                          <Button
                            sx={{ textTransform: "capitalize" }}
                            variant="outlined"
                            size="medium"
                            onClick={() => setopenOrderReturnConfirmation(true)}
                          >
                            Return
                          </Button>
                        </Box>
                      ) : null}
                      {OrderItemData.isDeliver &&
                        !OrderItemData.isReturn &&
                        returnWindow >
                        OrderItemData.product.no_of_days_for_return_exchange ? (
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="end"
                        >
                          <Typography variant="subtitle1" fontSize="14px">
                            Return window closed on {lastDateForReturn}
                          </Typography>
                        </Box>
                      ) : null}
                      {OrderItemData.isReturn &&
                        !OrderItemData.isRefundInitiated ? (
                        <Typography variant="subtitle1" fontSize="14px">
                          {" "}
                          Your Refund will be initiated once we recieved the
                          package.
                        </Typography>
                      ) : null}
                    </Box>
                  </Grid>
                </Grid>

                {/* order notification for small screens  */}
                <Box
                  component="span"
                  sx={{
                    marginTop: "auto",
                    display: { xs: "block", md: "none" },
                    px: 1,
                  }}
                >
                  <Box
                    textAlign={
                      OrderItemData.isShipped && !OrderItemData.isDeliver
                        ? "start"
                        : "right"
                    }
                    sx={{ marginTop: "auto" }}
                  >
                    {!OrderItemData.isCancel && !OrderItemData.isShipped ? (
                      <Button
                        sx={{ textTransform: "capitalize" }}
                        variant="outlined"
                        size="small"
                        onClick={() => setopenOrderCancelConfirmation(true)}
                      >
                        Cancel
                      </Button>
                    ) : null}

                    {OrderItemData.isShipped &&
                      !OrderItemData.isDeliver &&
                      !OrderItemData.isDelayed ? (
                      <Typography fontSize="12px" color="text.secondary">
                        Order cannot be cancelled once it's shipped.
                      </Typography>
                    ) : null}
                    {OrderItemData.isShipped &&
                      !OrderItemData.isDeliver &&
                      OrderItemData.isDelayed ? (
                      <Typography fontSize="12px" color="text.secondary">
                        Your order is delayed by a few days, we will get it
                        delivered at the earliest.
                      </Typography>
                    ) : null}
                  </Box>
                  {OrderItemData.isDeliver &&
                    !OrderItemData.isReturn &&
                    returnWindow <=
                    OrderItemData.product.no_of_days_for_return_exchange ? (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="end"
                    >
                      <Typography variant="subtitle1" fontSize="12px">
                        Return is available till {lastDateForReturn}{" "}
                      </Typography>
                      <Button
                        sx={{ textTransform: "capitalize" }}
                        variant="outlined"
                        size="small"
                        onClick={() => setopenOrderReturnConfirmation(true)}
                      >
                        Return
                      </Button>
                    </Box>
                  ) : null}
                  {OrderItemData.isDeliver &&
                    !OrderItemData.isReturn &&
                    returnWindow >
                    OrderItemData.product.no_of_days_for_return_exchange ? (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="end"
                    >
                      <Typography variant="subtitle1" fontSize="12px">
                        Return window closed on {lastDateForReturn}
                      </Typography>
                    </Box>
                  ) : null}
                  {OrderItemData.isReturn &&
                    !OrderItemData.isRefundInitiated ? (
                    <Typography variant="subtitle1" fontSize="12px">
                      {" "}
                      Your Refund will be initiated once we recieved the
                      package.
                    </Typography>
                  ) : null}
                </Box>

                {/* timeline starts here  */}
                <Box
                  component="span"
                  sx={{ display: { xs: "none", md: "block" } }}
                >
                  {!OrderItemData.isReturn ? (
                    OrderItemData.isCancel ? (
                      orderData.isPaid && orderData.paymentMethod != "cod" ? (
                        <Grid container justifyContent="center" mt={3}>
                          <Grid item xs={2.3}>
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              width="100%"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                                sx={{ opacity: 0, visibility: "hidden" }}
                              ></Box>
                              <CheckCircleTwoToneIcon
                                sx={{ color: "#2ca003", fontSize: "32px" }}
                              // color="#2ca003"
                              />
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                              ></Box>
                            </Box>
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Typography
                                sx={{ fontSize: "12px" }}
                                textTransform="uppercase"
                                color="#2ca003"
                                textAlign="center"
                              >
                                Confirmed
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={2.3}>
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              width="100%"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                              ></Box>
                              <RadioButtonCheckedTwoToneIcon
                                sx={{ color: "#ef5350", fontSize: "32px" }}
                              />
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                              // sx={{ opacity: 0, visibility: "hidden" }}
                              ></Box>
                            </Box>
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Typography
                                sx={{ fontSize: "12px" }}
                                textTransform="uppercase"
                                color="#d24141"
                                textAlign="center"
                              >
                                CANCELLED
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={2.3}>
                            {OrderItemData.isRefundInitiated ? (
                              <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                width="100%"
                              >
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#BFE2B3"
                                ></Box>
                                <CheckCircleTwoToneIcon
                                  sx={{ color: "#2ca003", fontSize: "32px" }}
                                // color="#2ca003"
                                />
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#BFE2B3"
                                ></Box>
                              </Box>
                            ) : (
                              <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                width="100%"
                              >
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#C7CBD4"
                                ></Box>
                                <RadioButtonCheckedTwoToneIcon
                                  sx={{ color: "#C7CBD4", fontSize: "32px" }}
                                />
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#C7CBD4"
                                ></Box>
                              </Box>
                            )}
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Typography
                                sx={{ fontSize: "12px" }}
                                textTransform="uppercase"
                                color={
                                  OrderItemData.isRefundInitiated
                                    ? "#2ca003"
                                    : "#0000009c"
                                }
                                textAlign="center"
                              >
                                REFUND <br /> INITIATED
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={2.3}>
                            {OrderItemData.isRefundApproved ? (
                              <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                width="100%"
                              >
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#BFE2B3"
                                ></Box>
                                <CheckCircleTwoToneIcon
                                  sx={{ color: "#2ca003", fontSize: "32px" }}
                                // color="#2ca003"
                                />
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#BFE2B3"
                                ></Box>
                              </Box>
                            ) : (
                              <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                width="100%"
                              >
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#C7CBD4"
                                ></Box>
                                <RadioButtonCheckedTwoToneIcon
                                  sx={{ color: "#C7CBD4", fontSize: "32px" }}
                                />
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#C7CBD4"
                                ></Box>
                              </Box>
                            )}
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Typography
                                sx={{ fontSize: "12px" }}
                                textTransform="uppercase"
                                color={
                                  OrderItemData.isRefundApproved
                                    ? "#2ca003"
                                    : "#0000009c"
                                }
                                textAlign="center"
                              >
                                REFUND <br /> APPROVED
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={2.3}>
                            {OrderItemData.isRefundComplete ? (
                              <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                width="100%"
                              >
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#BFE2B3"
                                ></Box>
                                <CheckCircleTwoToneIcon
                                  sx={{ color: "#2ca003", fontSize: "32px" }}
                                // color="#2ca003"
                                />
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#C7CBD4"
                                  sx={{ opacity: 0, visibility: "hidden" }}
                                ></Box>
                              </Box>
                            ) : (
                              <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                width="100%"
                              >
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#C7CBD4"
                                ></Box>
                                <RadioButtonCheckedTwoToneIcon
                                  sx={{ color: "#C7CBD4", fontSize: "32px" }}
                                />
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#C7CBD4"
                                  sx={{ opacity: 0, visibility: "hidden" }}
                                ></Box>
                              </Box>
                            )}

                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Typography
                                sx={{ fontSize: "12px" }}
                                textTransform="uppercase"
                                color={
                                  OrderItemData.isRefundComplete
                                    ? "#2ca003"
                                    : "#0000009c"
                                }
                                textAlign="center"
                              >
                                REFUND <br /> COMPLETED
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      ) : (
                        <Grid container justifyContent="center" mt={3}>
                          <Grid item xs={6}>
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              width="100%"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                                sx={{ opacity: 0, visibility: "hidden" }}
                              ></Box>
                              <CheckCircleTwoToneIcon
                                sx={{ color: "#2ca003", fontSize: "32px" }}
                              // color="#2ca003"
                              />
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                              ></Box>
                            </Box>
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Typography
                                sx={{ fontSize: "12px" }}
                                textTransform="uppercase"
                                color="#2ca003"
                                textAlign="center"
                              >
                                Confirmed
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              width="100%"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                              ></Box>
                              <RadioButtonCheckedTwoToneIcon
                                sx={{ color: "#ef5350", fontSize: "32px" }}
                              />
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                                sx={{ opacity: 0, visibility: "hidden" }}
                              ></Box>
                            </Box>
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Typography
                                sx={{ fontSize: "12px" }}
                                textTransform="uppercase"
                                color="#d24141"
                                textAlign="center"
                              >
                                CANCELLED
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      )
                    ) : (// timeline for simple order process
                      <Grid container justifyContent="center" mt={3}>
                        <Grid item xs={2.3}>
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            width="100%"
                          >
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#C7CBD4"
                              sx={{ opacity: 0, visibility: "hidden" }}
                            ></Box>
                            <CheckCircleTwoToneIcon
                              sx={{ color: "#2ca003", fontSize: "32px" }}
                            // color="#2ca003"
                            />
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#BFE2B3"
                            ></Box>
                          </Box>
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Typography
                              sx={{ fontSize: "12px" }}
                              textTransform="uppercase"
                              color="#2ca003"
                              textAlign="center"
                            >
                              Confirmed
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={2.3}>
                          {OrderItemData.isPreparing ? (
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              width="100%"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                              ></Box>
                              <CheckCircleTwoToneIcon
                                sx={{ color: "#2ca003", fontSize: "32px" }}
                              // color="#2ca003"
                              />
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                              ></Box>
                            </Box>
                          ) : (
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              width="100%"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                              ></Box>
                              <RadioButtonCheckedTwoToneIcon
                                sx={{ color: "#C7CBD4", fontSize: "32px" }}
                              />
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                              ></Box>
                            </Box>
                          )}

                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Typography
                              sx={{ fontSize: "12px" }}
                              textTransform="uppercase"
                              color={
                                OrderItemData.isPreparing
                                  ? "#2ca003"
                                  : "#0000009c"
                              }
                              textAlign="center"
                            >
                              PREPARING YOUR ORDER
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={2.3}>
                          {OrderItemData.isShipped ? (
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              width="100%"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                              ></Box>
                              <CheckCircleTwoToneIcon
                                sx={{ color: "#2ca003", fontSize: "32px" }}
                              // color="#2ca003"
                              />
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                              ></Box>
                            </Box>
                          ) : (
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              width="100%"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                              ></Box>
                              <RadioButtonCheckedTwoToneIcon
                                sx={{ color: "#C7CBD4", fontSize: "32px" }}
                              />
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                              ></Box>
                            </Box>
                          )}
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Typography
                              sx={{ fontSize: "12px" }}
                              textTransform="uppercase"
                              color={
                                OrderItemData.isShipped
                                  ? "#2ca003"
                                  : "#0000009c"
                              }
                              textAlign="center"
                            >
                              SHIPPED
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={2.3}>
                          {OrderItemData.isOutForDelivery ? (
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              width="100%"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                              ></Box>
                              <CheckCircleTwoToneIcon
                                sx={{ color: "#2ca003", fontSize: "32px" }}
                              // color="#2ca003"
                              />
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                              ></Box>
                            </Box>
                          ) : (
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              width="100%"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                              ></Box>
                              <RadioButtonCheckedTwoToneIcon
                                sx={{ color: "#C7CBD4", fontSize: "32px" }}
                              />
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                              ></Box>
                            </Box>
                          )}
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Typography
                              sx={{ fontSize: "12px" }}
                              textTransform="uppercase"
                              color={
                                OrderItemData.isOutForDelivery
                                  ? "#2ca003"
                                  : "#0000009c"
                              }
                              textAlign="center"
                            >
                              OUT FOR DELIVERY
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={2.3}>
                          {OrderItemData.isDeliver ? (
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              width="100%"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                              ></Box>
                              <CheckCircleTwoToneIcon
                                sx={{ color: "#2ca003", fontSize: "32px" }}
                              // color="#2ca003"
                              />
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                                sx={{ opacity: 0, visibility: "hidden" }}
                              ></Box>
                            </Box>
                          ) : (
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              width="100%"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                              ></Box>
                              <RadioButtonCheckedTwoToneIcon
                                sx={{ color: "#C7CBD4", fontSize: "32px" }}
                              />
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                                sx={{ opacity: 0, visibility: "hidden" }}
                              ></Box>
                            </Box>
                          )}

                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Typography
                              sx={{ fontSize: "12px" }}
                              textTransform="uppercase"
                              color={
                                OrderItemData.isDeliver
                                  ? "#2ca003"
                                  : "#0000009c"
                              }
                              textAlign="center"
                            >
                              DELIVERED
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    )
                  ) : null}
                  {OrderItemData.isReturn ? (// timeline for return order
                    <Grid container justifyContent="center" mt={3}>
                      <Grid item xs={2.3}>
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          width="100%"
                        >
                          <Box
                            component="span"
                            width="50%"
                            height="3px"
                            bgcolor="#C7CBD4"
                            sx={{ opacity: 0, visibility: "hidden" }}
                          ></Box>
                          <CheckCircleTwoToneIcon
                            sx={{ color: "#2ca003", fontSize: "32px" }}
                          // color="#2ca003"
                          />
                          <Box
                            component="span"
                            width="50%"
                            height="3px"
                            bgcolor="#BFE2B3"
                          ></Box>
                        </Box>
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Typography
                            sx={{ fontSize: "12px" }}
                            textTransform="uppercase"
                            color="#2ca003"
                            textAlign="center"
                          >
                            RETURN <br /> REQUESTED
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={2.3}>
                        {OrderItemData.isOutForPickup ? (
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            width="100%"
                          >
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#BFE2B3"
                            ></Box>
                            <CheckCircleTwoToneIcon
                              sx={{ color: "#2ca003", fontSize: "32px" }}
                            // color="#2ca003"
                            />
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#BFE2B3"
                            ></Box>
                          </Box>
                        ) : (
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            width="100%"
                          >
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#C7CBD4"
                            ></Box>
                            <RadioButtonCheckedTwoToneIcon
                              sx={{ color: "#C7CBD4", fontSize: "32px" }}
                            />
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#C7CBD4"
                            ></Box>
                          </Box>
                        )}
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Typography
                            sx={{ fontSize: "12px" }}
                            textTransform="uppercase"
                            color={
                              OrderItemData.isOutForPickup
                                ? "#2ca003"
                                : "#0000009c"
                            }
                            textAlign="center"
                          >
                            OUT FOR <br /> PICKUP
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={2.3}>
                        {OrderItemData.isRefundInitiated ? (
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            width="100%"
                          >
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#BFE2B3"
                            ></Box>
                            <CheckCircleTwoToneIcon
                              sx={{ color: "#2ca003", fontSize: "32px" }}
                            // color="#2ca003"
                            />
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#BFE2B3"
                            ></Box>
                          </Box>
                        ) : (
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            width="100%"
                          >
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#C7CBD4"
                            ></Box>
                            <RadioButtonCheckedTwoToneIcon
                              sx={{ color: "#C7CBD4", fontSize: "32px" }}
                            />
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#C7CBD4"
                            ></Box>
                          </Box>
                        )}
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Typography
                            sx={{ fontSize: "12px" }}
                            textTransform="uppercase"
                            color={
                              OrderItemData.isRefundInitiated
                                ? "#2ca003"
                                : "#0000009c"
                            }
                            textAlign="center"
                          >
                            REFUND <br /> INITIATED
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={2.3}>
                        {OrderItemData.isRefundApproved ? (
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            width="100%"
                          >
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#BFE2B3"
                            ></Box>
                            <CheckCircleTwoToneIcon
                              sx={{ color: "#2ca003", fontSize: "32px" }}
                            // color="#2ca003"
                            />
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#BFE2B3"
                            ></Box>
                          </Box>
                        ) : (
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            width="100%"
                          >
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#C7CBD4"
                            ></Box>
                            <RadioButtonCheckedTwoToneIcon
                              sx={{ color: "#C7CBD4", fontSize: "32px" }}
                            />
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#C7CBD4"
                            ></Box>
                          </Box>
                        )}
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Typography
                            sx={{ fontSize: "12px" }}
                            textTransform="uppercase"
                            color={
                              OrderItemData.isRefundApproved
                                ? "#2ca003"
                                : "#0000009c"
                            }
                            textAlign="center"
                          >
                            REFUND <br /> APPROVED
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={2.3}>
                        {OrderItemData.isRefundComplete ? (
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            width="100%"
                          >
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#BFE2B3"
                            ></Box>
                            <CheckCircleTwoToneIcon
                              sx={{ color: "#2ca003", fontSize: "32px" }}
                            // color="#2ca003"
                            />
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#C7CBD4"
                              sx={{ opacity: 0, visibility: "hidden" }}
                            ></Box>
                          </Box>
                        ) : (
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            width="100%"
                          >
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#C7CBD4"
                            ></Box>
                            <RadioButtonCheckedTwoToneIcon
                              sx={{ color: "#C7CBD4", fontSize: "32px" }}
                            />
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#C7CBD4"
                              sx={{ opacity: 0, visibility: "hidden" }}
                            ></Box>
                          </Box>
                        )}

                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Typography
                            sx={{ fontSize: "12px" }}
                            textTransform="uppercase"
                            color={
                              OrderItemData.isRefundComplete
                                ? "#2ca003"
                                : "#0000009c"
                            }
                            textAlign="center"
                          >
                            REFUND <br /> COMPLETED
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  ) : null}
                </Box>
              </Card>

              {/* timeline for small screens  */}
              <Paper sx={{ display: { xs: "block", md: "none" }, mt: 2, p: 2 }}>
                <Typography
                  variant="h2"
                  fontSize="13px"
                  sx={{ color: "#00000061" }}
                  fontWeight={600}
                  textTransform="uppercase"
                >
                  order status
                </Typography>
                <Divider sx={{ mt: 1 }} />
                <Box component="span">
                  {!OrderItemData.isReturn ? (
                    OrderItemData.isCancel ? (
                      orderData.isPaid && orderData.paymentMethod != "cod" ? ( // timeline for prepaid cancel
                        <Grid container justifyContent="center" mt={3}>
                          <Grid item xs={12} display="flex">
                            <Box
                              display="flex"
                              flexDirection="column"
                              justifyContent="center"
                              alignItems="center"
                            // width="100%"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                                mb={1}
                                sx={{
                                  opacity: 0,
                                  visibility: "hidden",
                                  transform: "rotate(90deg)",
                                }}
                              ></Box>
                              <CheckCircleTwoToneIcon
                                sx={{ color: "#2ca003", fontSize: "32px" }}
                              // color="#2ca003"
                              />
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                                sx={{ transform: "rotate(90deg)" }}
                                mt={1}
                              ></Box>
                            </Box>
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Typography
                                sx={{ fontSize: "12px" }}
                                textTransform="uppercase"
                                color="#2ca003"
                                textAlign="center"
                                ml={0.7}
                              >
                                Confirmed
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} display="flex" mt="13px">
                            <Box
                              display="flex"
                              flexDirection="column"
                              justifyContent="center"
                              alignItems="center"
                            // width="100%"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                                mb={1}
                                sx={{
                                  transform: "rotate(90deg)",
                                }}
                              ></Box>
                              <RadioButtonCheckedTwoToneIcon
                                sx={{ color: "#ef5350", fontSize: "32px" }}
                              />
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                                sx={{ transform: "rotate(90deg)" }}
                                mt={1}
                              ></Box>
                            </Box>
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Typography
                                sx={{ fontSize: "12px" }}
                                textTransform="uppercase"
                                color="#d24141"
                                textAlign="center"
                                ml={0.7}
                              >
                                CANCELLED
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} display="flex" mt="13px">
                            {OrderItemData.isRefundInitiated ? (
                              <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                              // width="100%"
                              >
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#BFE2B3"
                                  mb={1}
                                  sx={{ transform: "rotate(90deg)" }}
                                ></Box>
                                <CheckCircleTwoToneIcon
                                  sx={{ color: "#2ca003", fontSize: "32px" }}
                                // color="#2ca003"
                                />
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#BFE2B3"
                                  sx={{ transform: "rotate(90deg)" }}
                                  mt={1}
                                ></Box>
                              </Box>
                            ) : (
                              <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                              // width="100%"
                              >
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#C7CBD4"
                                  mb={1}
                                  sx={{ transform: "rotate(90deg)" }}
                                ></Box>
                                <RadioButtonCheckedTwoToneIcon
                                  sx={{ color: "#C7CBD4", fontSize: "32px" }}
                                />
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#C7CBD4"
                                  sx={{ transform: "rotate(90deg)" }}
                                  mt={1}
                                ></Box>
                              </Box>
                            )}
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              ml={0.7}
                            >
                              <Typography
                                sx={{ fontSize: "12px" }}
                                textTransform="uppercase"
                                color={
                                  OrderItemData.isRefundInitiated
                                    ? "#2ca003"
                                    : "#0000009c"
                                }
                                textAlign="center"
                              >
                                REFUND INITIATED
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} display="flex" mt="13px">
                            {OrderItemData.isRefundApproved ? (
                              <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                              >
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#BFE2B3"
                                  mb={1}
                                  sx={{ transform: "rotate(90deg)" }}
                                ></Box>
                                <CheckCircleTwoToneIcon
                                  sx={{ color: "#2ca003", fontSize: "32px" }}
                                // color="#2ca003"
                                />
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#BFE2B3"
                                  sx={{ transform: "rotate(90deg)" }}
                                  mt={1}
                                ></Box>
                              </Box>
                            ) : (
                              <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                              >
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#C7CBD4"
                                  mb={1}
                                  sx={{ transform: "rotate(90deg)" }}
                                ></Box>
                                <RadioButtonCheckedTwoToneIcon
                                  sx={{ color: "#C7CBD4", fontSize: "32px" }}
                                />
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#C7CBD4"
                                  sx={{ transform: "rotate(90deg)" }}
                                  mt={1}
                                ></Box>
                              </Box>
                            )}
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              ml={0.7}
                            >
                              <Typography
                                sx={{ fontSize: "12px" }}
                                textTransform="uppercase"
                                color={
                                  OrderItemData.isRefundApproved
                                    ? "#2ca003"
                                    : "#0000009c"
                                }
                                textAlign="center"
                              >
                                REFUND APPROVED
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} display="flex" mt="13px">
                            {OrderItemData.isRefundComplete ? (
                              <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                              // width="100%"
                              >
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#BFE2B3"
                                  mb={1}
                                  sx={{ transform: "rotate(90deg)" }}
                                ></Box>
                                <CheckCircleTwoToneIcon
                                  sx={{ color: "#2ca003", fontSize: "32px" }}
                                // color="#2ca003"
                                />
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#BFE2B3"
                                  sx={{ opacity: 0, visibility: "hidden", transform: "rotate(90deg)" }}
                                  mt={1}
                                ></Box>
                              </Box>
                            ) : (
                              <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                              // width="100%"
                              >
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#C7CBD4"
                                  mb={1}
                                  sx={{ transform: "rotate(90deg)" }}
                                ></Box>
                                <RadioButtonCheckedTwoToneIcon
                                  sx={{ color: "#C7CBD4", fontSize: "32px" }}
                                />
                                <Box
                                  component="span"
                                  width="50%"
                                  height="3px"
                                  bgcolor="#C7CBD4"
                                  sx={{ opacity: 0, visibility: "hidden", transform: "rotate(90deg)" }}
                                  mt={1}
                                ></Box>
                              </Box>
                            )}

                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              ml={0.7}
                            >
                              <Typography
                                sx={{ fontSize: "12px" }}
                                textTransform="uppercase"
                                color={
                                  OrderItemData.isRefundComplete
                                    ? "#2ca003"
                                    : "#0000009c"
                                }
                                textAlign="center"
                              >
                                REFUND  COMPLETED
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      ) : (
                        // timeline for pospaid cancel order
                        <Grid container justifyContent="center" mt={3}>
                          <Grid item xs={12} display="flex">
                            <Box
                              display="flex"
                              flexDirection="column"
                              justifyContent="center"
                              alignItems="center"
                            // width="100%"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                                mb={1}
                                sx={{
                                  opacity: 0,
                                  visibility: "hidden",
                                  transform: "rotate(90deg)",
                                }}
                              ></Box>
                              <CheckCircleTwoToneIcon
                                sx={{ color: "#2ca003", fontSize: "32px" }}
                              // color="#2ca003"
                              />
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                                sx={{ transform: "rotate(90deg)" }}
                                mt={1}
                              ></Box>
                            </Box>
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              ml={0.7}
                            >
                              <Typography
                                sx={{ fontSize: "12px" }}
                                textTransform="uppercase"
                                color="#2ca003"
                                textAlign="center"
                              >
                                Confirmed
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} display="flex" mt="13px">
                            <Box
                              display="flex"
                              flexDirection="column"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                                mb={1}
                                sx={{ transform: "rotate(90deg)" }}
                              ></Box>
                              <RadioButtonCheckedTwoToneIcon
                                sx={{ color: "#ef5350", fontSize: "32px" }}
                              />
                              <Box
                                mt={1}
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                                sx={{
                                  opacity: 0,
                                  visibility: "hidden",
                                  transform: "rotate(90deg)",
                                }}
                              ></Box>
                            </Box>
                            <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              ml={0.7}
                            >
                              <Typography
                                sx={{ fontSize: "12px" }}
                                textTransform="uppercase"
                                color="#d24141"
                                textAlign="center"
                              >
                                CANCELLED
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      )
                    ) : (
                      // timeline for simple order process
                      <Grid container justifyContent="start" mt={3}>
                        <Grid item xs={12} display="flex">
                          <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                          // width="100%"
                          >
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#C7CBD4"
                              mb={1}
                              sx={{
                                opacity: 0,
                                visibility: "hidden",
                                transform: "rotate(90deg)",
                              }}
                            ></Box>
                            <CheckCircleTwoToneIcon
                              sx={{ color: "#2ca003", fontSize: "32px" }}
                            // color="#2ca003"
                            />
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#BFE2B3"
                              sx={{ transform: "rotate(90deg)" }}
                              mt={1}
                            ></Box>
                          </Box>
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            ml={0.7}
                          >
                            <Typography
                              sx={{ fontSize: "12px" }}
                              textTransform="uppercase"
                              color="#2ca003"
                              textAlign="center"
                            >
                              Confirmed
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} display="flex" mt="13px">
                          {OrderItemData.isPreparing ? (
                            <Box
                              display="flex"
                              flexDirection="column"
                              justifyContent="center"
                              alignItems="center"
                            // width="100%"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                                mb={1}
                                sx={{ transform: "rotate(90deg)" }}
                              ></Box>
                              <CheckCircleTwoToneIcon
                                sx={{ color: "#2ca003", fontSize: "32px" }}
                              // color="#2ca003"
                              />
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                                sx={{ transform: "rotate(90deg)" }}
                                mt={1}
                              ></Box>
                            </Box>
                          ) : (
                            <Box
                              display="flex"
                              flexDirection="column"
                              justifyContent="center"
                              alignItems="center"
                            // width="100%"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                                mb={1}
                                sx={{ transform: "rotate(90deg)" }}
                              ></Box>
                              <RadioButtonCheckedTwoToneIcon
                                sx={{ color: "#C7CBD4", fontSize: "32px" }}
                              />
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                                sx={{ transform: "rotate(90deg)" }}
                                mt={1}
                              ></Box>
                            </Box>
                          )}

                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            ml={0.7}
                          >
                            <Typography
                              sx={{ fontSize: "12px" }}
                              textTransform="uppercase"
                              color={
                                OrderItemData.isPreparing
                                  ? "#2ca003"
                                  : "#0000009c"
                              }
                              textAlign="center"
                            >
                              PREPARING YOUR ORDER
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} display="flex" mt="13px">
                          {OrderItemData.isShipped ? (
                            <Box
                              display="flex"
                              flexDirection="column"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                                mb={1}
                                sx={{ transform: "rotate(90deg)" }}
                              ></Box>
                              <CheckCircleTwoToneIcon
                                sx={{ color: "#2ca003", fontSize: "32px" }}
                              // color="#2ca003"
                              />
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                                sx={{ transform: "rotate(90deg)" }}
                                mt={1}
                              ></Box>
                            </Box>
                          ) : (
                            <Box
                              display="flex"
                              flexDirection="column"
                              justifyContent="center"
                              alignItems="center"
                            // width="100%"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                                mb={1}
                                sx={{ transform: "rotate(90deg)" }}
                              ></Box>
                              <RadioButtonCheckedTwoToneIcon
                                sx={{ color: "#C7CBD4", fontSize: "32px" }}
                              />
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                                sx={{ transform: "rotate(90deg)" }}
                                mt={1}
                              ></Box>
                            </Box>
                          )}
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            ml={0.7}
                          >
                            <Typography
                              sx={{ fontSize: "12px" }}
                              textTransform="uppercase"
                              color={
                                OrderItemData.isShipped
                                  ? "#2ca003"
                                  : "#0000009c"
                              }
                              textAlign="center"
                            >
                              SHIPPED
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} display="flex" mt="13px">
                          {OrderItemData.isOutForDelivery ? (
                            <Box
                              display="flex"
                              flexDirection="column"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                                mb={1}
                                sx={{ transform: "rotate(90deg)" }}
                              ></Box>
                              <CheckCircleTwoToneIcon
                                sx={{ color: "#2ca003", fontSize: "32px" }}
                              // color="#2ca003"
                              />
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                                sx={{ transform: "rotate(90deg)" }}
                                mt={1}
                              ></Box>
                            </Box>
                          ) : (
                            <Box
                              display="flex"
                              flexDirection="column"
                              justifyContent="center"
                              alignItems="center"
                            // width="100%"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                                mb={1}
                                sx={{ transform: "rotate(90deg)" }}
                              ></Box>
                              <RadioButtonCheckedTwoToneIcon
                                sx={{ color: "#C7CBD4", fontSize: "32px" }}
                              />
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                                sx={{ transform: "rotate(90deg)" }}
                                mt={1}
                              ></Box>
                            </Box>
                          )}
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            ml={0.7}
                          >
                            <Typography
                              sx={{ fontSize: "12px" }}
                              textTransform="uppercase"
                              color={
                                OrderItemData.isOutForDelivery
                                  ? "#2ca003"
                                  : "#0000009c"
                              }
                              textAlign="center"
                            >
                              OUT FOR DELIVERY
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} display="flex" mt="13px">
                          {OrderItemData.isDeliver ? (
                            <Box
                              display="flex"
                              flexDirection="column"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#BFE2B3"
                                mb={1}
                                sx={{ transform: "rotate(90deg)" }}
                              ></Box>
                              <CheckCircleTwoToneIcon
                                sx={{ color: "#2ca003", fontSize: "32px" }}
                              // color="#2ca003"
                              />
                              <Box
                                mt={1}
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                                sx={{
                                  opacity: 0,
                                  visibility: "hidden",
                                  transform: "rotate(90deg)",
                                }}
                              ></Box>
                            </Box>
                          ) : (
                            <Box
                              display="flex"
                              flexDirection="column"
                              justifyContent="center"
                              alignItems="center"
                            // width="100%"
                            >
                              <Box
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                                mb={1}
                                sx={{ transform: "rotate(90deg)" }}
                              ></Box>
                              <RadioButtonCheckedTwoToneIcon
                                sx={{ color: "#C7CBD4", fontSize: "32px" }}
                              />
                              <Box
                                mt={1}
                                component="span"
                                width="50%"
                                height="3px"
                                bgcolor="#C7CBD4"
                                sx={{
                                  opacity: 0,
                                  visibility: "hidden",
                                  transform: "rotate(90deg)",
                                }}
                              ></Box>
                            </Box>
                          )}

                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            ml={0.7}
                          >
                            <Typography
                              sx={{ fontSize: "12px" }}
                              textTransform="uppercase"
                              color={
                                OrderItemData.isDeliver
                                  ? "#2ca003"
                                  : "#0000009c"
                              }
                              textAlign="center"
                            >
                              DELIVERED
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    )
                  ) : null}
                  {OrderItemData.isReturn ? ( // timeline for return order
                    <Grid container justifyContent="center" mt={3}>
                      <Grid item xs={12} display="flex">
                        <Box
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="center"
                        // width="100%"
                        >
                          <Box
                            component="span"
                            width="50%"
                            height="3px"
                            bgcolor="#C7CBD4"
                            mb={1}
                            sx={{
                              opacity: 0,
                              visibility: "hidden",
                              transform: "rotate(90deg)",
                            }}
                          ></Box>
                          <CheckCircleTwoToneIcon
                            sx={{ color: "#2ca003", fontSize: "32px" }}
                          // color="#2ca003"
                          />
                          <Box
                            component="span"
                            width="50%"
                            height="3px"
                            bgcolor="#BFE2B3"
                            sx={{ transform: "rotate(90deg)" }}
                            mt={1}
                          ></Box>
                        </Box>
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          ml={0.7}
                        >
                          <Typography
                            sx={{ fontSize: "12px" }}
                            textTransform="uppercase"
                            color="#2ca003"
                            textAlign="center"
                          >
                            RETURN REQUESTED
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} display="flex" mt="13px">
                        {OrderItemData.isOutForPickup ? (
                          <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                          // width="100%"
                          >
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#BFE2B3"
                              mb={1}
                              sx={{ transform: "rotate(90deg)" }}
                            ></Box>
                            <CheckCircleTwoToneIcon
                              sx={{ color: "#2ca003", fontSize: "32px" }}
                            // color="#2ca003"
                            />
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#BFE2B3"
                              sx={{ transform: "rotate(90deg)" }}
                              mt={1}
                            ></Box>
                          </Box>
                        ) : (
                          <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                          // width="100%"
                          >
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#C7CBD4"
                              mb={1}
                              sx={{ transform: "rotate(90deg)" }}
                            ></Box>
                            <RadioButtonCheckedTwoToneIcon
                              sx={{ color: "#C7CBD4", fontSize: "32px" }}
                            />
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#C7CBD4"
                              sx={{ transform: "rotate(90deg)" }}
                              mt={1}
                            ></Box>
                          </Box>
                        )}
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          ml={0.7}
                        >
                          <Typography
                            sx={{ fontSize: "12px" }}
                            textTransform="uppercase"
                            color={
                              OrderItemData.isOutForPickup
                                ? "#2ca003"
                                : "#0000009c"
                            }
                            textAlign="center"
                          >
                            OUT FOR PICKUP
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} display="flex" mt="13px">
                        {OrderItemData.isRefundInitiated ? (
                          <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#BFE2B3"
                              mb={1}
                              sx={{ transform: "rotate(90deg)" }}
                            ></Box>
                            <CheckCircleTwoToneIcon
                              sx={{ color: "#2ca003", fontSize: "32px" }}
                            // color="#2ca003"
                            />
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#BFE2B3"
                              sx={{ transform: "rotate(90deg)" }}
                              mt={1}
                            ></Box>
                          </Box>
                        ) : (
                          <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                          // width="100%"
                          >
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#C7CBD4"
                              mb={1}
                              sx={{ transform: "rotate(90deg)" }}
                            ></Box>
                            <RadioButtonCheckedTwoToneIcon
                              sx={{ color: "#C7CBD4", fontSize: "32px" }}
                            />
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#C7CBD4"
                              sx={{ transform: "rotate(90deg)" }}
                              mt={1}
                            ></Box>
                          </Box>
                        )}
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          ml={0.7}
                        >
                          <Typography
                            sx={{ fontSize: "12px" }}
                            textTransform="uppercase"
                            color={
                              OrderItemData.isRefundInitiated
                                ? "#2ca003"
                                : "#0000009c"
                            }
                            textAlign="center"
                          >
                            REFUND INITIATED
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} display="flex" mt="13px">
                        {OrderItemData.isRefundApproved ? (
                          <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#BFE2B3"
                              mb={1}
                              sx={{ transform: "rotate(90deg)" }}
                            ></Box>
                            <CheckCircleTwoToneIcon
                              sx={{ color: "#2ca003", fontSize: "32px" }}
                            // color="#2ca003"
                            />
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#BFE2B3"
                              sx={{ transform: "rotate(90deg)" }}
                              mt={1}
                            ></Box>
                          </Box>
                        ) : (
                          <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                          // width="100%"
                          >
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#C7CBD4"
                              mb={1}
                              sx={{ transform: "rotate(90deg)" }}
                            ></Box>
                            <RadioButtonCheckedTwoToneIcon
                              sx={{ color: "#C7CBD4", fontSize: "32px" }}
                            />
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#C7CBD4"
                              sx={{ transform: "rotate(90deg)" }}
                              mt={1}
                            ></Box>
                          </Box>
                        )}
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          ml={0.7}
                        >
                          <Typography
                            sx={{ fontSize: "12px" }}
                            textTransform="uppercase"
                            color={
                              OrderItemData.isRefundApproved
                                ? "#2ca003"
                                : "#0000009c"
                            }
                            textAlign="center"
                          >
                            REFUND APPROVED
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} display="flex" mt="13px">
                        {OrderItemData.isRefundComplete ? (
                          <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#BFE2B3"
                              mb={1}
                              sx={{ transform: "rotate(90deg)" }}
                            ></Box>
                            <CheckCircleTwoToneIcon
                              sx={{ color: "#2ca003", fontSize: "32px" }}
                            // color="#2ca003"
                            />
                            <Box
                              mt={1}
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#C7CBD4"
                              sx={{
                                opacity: 0,
                                visibility: "hidden",
                                transform: "rotate(90deg)",
                              }}
                            ></Box>
                          </Box>
                        ) : (
                          <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                          // width="100%"
                          >
                            <Box
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#C7CBD4"
                              mb={1}
                              sx={{ transform: "rotate(90deg)" }}
                            ></Box>
                            <RadioButtonCheckedTwoToneIcon
                              sx={{ color: "#C7CBD4", fontSize: "32px" }}
                            />
                            <Box
                              mt={1}
                              component="span"
                              width="50%"
                              height="3px"
                              bgcolor="#C7CBD4"
                              sx={{
                                opacity: 0,
                                visibility: "hidden",
                                transform: "rotate(90deg)",
                              }}
                            ></Box>
                          </Box>
                        )}

                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          ml={0.7}
                        >
                          <Typography
                            sx={{ fontSize: "12px" }}
                            textTransform="uppercase"
                            color={
                              OrderItemData.isRefundComplete
                                ? "#2ca003"
                                : "#0000009c"
                            }
                            textAlign="center"
                          >
                            REFUND COMPLETED
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  ) : null}
                </Box>
              </Paper>

              <Paper sx={{ mt: 2, p: 2 }}>
                {isRefund && orderData.isPaid ? (
                  <>
                    <Stack spacing={2}>
                      <Typography
                        variant="h2"
                        fontSize="13px"
                        sx={{ color: "#00000061" }}
                        fontWeight={600}
                        textTransform="uppercase"
                      >
                        Return Payment mode:
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={0.7}>
                        <AccountBalanceIcon
                          sx={{ fontSize: "18px !important", color: "#292d35" }}
                        />
                        <Typography sx={{ fontSize: "12px", color: "#292d35" }}>
                          BANK TRANSFER
                        </Typography>
                      </Stack>
                    </Stack>
                    <Divider sx={{ mb: 3, mt: 2 }} />
                  </>
                ) : null}

                <Stack spacing={2}>
                  <Typography
                    variant="h2"
                    fontSize="13px"
                    sx={{ color: "#00000061" }}
                    fontWeight={600}
                  >
                    NEED HELP WITH YOUR ORDER?
                  </Typography>
                  <Button
                    component={NavLink}
                    to="/contact"
                    disableRipple
                    endIcon={
                      <ArrowForwardIosSharpIcon
                        sx={{ fontSize: "14px !important" }}
                      />
                    }
                    sx={{
                      fontSize: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      p: 0,
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    HELP AND SUPPORT
                  </Button>
                </Stack>
              </Paper>

              {/* other items section  */}

              <Box sx={{ display: { xs: "none", md: "block" } }}>
                {remainigItems.length > 0 ? (
                  <Card sx={{ mt: 2, p: 2, pb: 0 }}>
                    <Typography
                      fontWeight={600}
                      color="primary"
                      textTransform="uppercase"
                      variant="h2"
                      fontSize="13px"
                      sx={{ color: "#00000061" }}
                    >
                      Other Items in this Order
                    </Typography>
                    <Divider light sx={{ m: 1 }} />

                    {remainigItems.map((remainingItem) => {
                      return (
                        <span key={remainingItem.uid}>
                          <Grid container py={2} px={2}>
                            <Grid item md={2.5}>
                              <CardActionArea
                                component={NavLink}
                                to={`/singleproduct/${remainingItem.product.slug}`}
                              >
                                <Box
                                  width="100%"
                                  display="flex"
                                  alignItems="center"
                                  borderRadius="4px"
                                  overflow="hidden"
                                >
                                  <img
                                    width="100%"
                                    src={`http://127.0.0.1:8000${remainingItem.product.card_thumb_image}`}
                                    alt=""
                                  />
                                </Box>
                              </CardActionArea>
                            </Grid>
                            <Grid
                              item
                              md={9.5}
                              px={2}
                              display="flex"
                              flexDirection="column"
                            >
                              <Stack spacing={0.7} mt={0.5}>
                                <Typography variant="subtitle1">
                                  {remainingItem.product.product_name}
                                </Typography>
                                <Typography
                                  color="text.secondary"
                                  variant="subtitle2"
                                >
                                  Size: {remainingItem.size_variant.size_name} |
                                  Qty: {remainingItem.quantity}
                                </Typography>
                              </Stack>
                              {!remainingItem.isCancel ? (
                                <Stack
                                  spacing={0.5}
                                  mt={2}
                                  direction="row"
                                  display="flex"
                                  justifyItems="center"
                                  alignItems="center"
                                >
                                  <LocalShippingIcon
                                    sx={{ fontSize: "16px" }}
                                    color="primary"
                                  />
                                  <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    fontSize="14px"
                                  >
                                    {remainingItem.isDeliver
                                      ? `Delivered On: ${moment(
                                        new Date(remainingItem.deliveredAt)
                                      ).format("D MMM, YYYY ")}`
                                      : remainingItem.isOutForDelivery
                                        ? `Delivery by Today`
                                        : moment(
                                          new Date(
                                            remainingItem.estimateDeliveryDate
                                          )
                                        ).format("D MMM, YYYY ")}
                                  </Typography>
                                </Stack>
                              ) : null}

                              {remainingItem.isCancel ? (
                                <Stack
                                  spacing={0.7}
                                  mt={3}
                                  direction="row"
                                  justifyItems="center"
                                  alignItems="center"
                                >
                                  <CircleIcon
                                    sx={{ fontSize: "14px" }}
                                    color="error"
                                  />
                                  <Typography
                                    variant="subtitle1"
                                    color="success"
                                    fontWeight={600}
                                    fontSize="14px"
                                  >
                                    ORDER CANCELLED
                                  </Typography>
                                </Stack>
                              ) : null}

                              <Box textAlign="right" sx={{ marginTop: "auto" }}>
                                <Button
                                  sx={{ textTransform: "capitalize" }}
                                  variant="outlined"
                                  size="medium"
                                  component={NavLink}
                                  to={`/my-orders/${orderId}/${remainingItem.uid}`}
                                >
                                  Order Details
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                          {/* {index == order.order_items.length - 1 ? null : (
                )} */}
                          <Divider light />
                        </span>
                      );
                    })}
                  </Card>
                ) : null}
              </Box>
            </Grid>
            <Grid
              item
              md={4}
              xs={11}
              sx={{ pt: { xs: 0, md: "120px !important" } }}
            >
              <Paper sx={{ p: 2 }}>
                <Typography
                  variant="h2"
                  fontSize="13px"
                  sx={{ color: "#00000061" }}
                  fontWeight={600}
                >
                  SHIPPING DETAILS
                </Typography>
                {orderData.shippingAddress ? (
                  <Stack spacing={0.3} mt={2}>
                    <Typography fontSize="14px" fontWeight={600}>
                      {orderData.shippingAddress.first_name}{" "}
                      {orderData.shippingAddress.last_name}
                    </Typography>
                    <Typography color="#000c" fontSize="14px">
                      {orderData.shippingAddress.house_no},{" "}
                      {orderData.shippingAddress.street_name},
                    </Typography>
                    <Typography color="#000c" fontSize="14px">
                      {orderData.shippingAddress.city.toUpperCase()},{" "}
                      {orderData.shippingAddress.state.toUpperCase()}
                    </Typography>
                    <Typography color="#000c" fontSize="14px">
                      {orderData.shippingAddress.country} -{" "}
                      {orderData.shippingAddress.postal_code}
                    </Typography>
                    <Typography color="#000c" fontSize="14px">
                      Phone :{" "}
                      <span style={{ fontWeight: 600, color: "black" }}>
                        {orderData.shippingAddress.phone_no}
                      </span>
                    </Typography>
                  </Stack>
                ) : (
                  " "
                )}
              </Paper>
              <Paper sx={{ mt: 2, p: 2 }}>
                <Typography
                  variant="h2"
                  fontSize="13px"
                  sx={{ color: "#00000061" }}
                  fontWeight={600}
                >
                  PAYMENT SUMMARY
                </Typography>
                <Stack mt={2} spacing={2}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontSize="14px">Cart Total</Typography>
                    <Typography fontSize="14px">
                      ₹ {orderData.totalPrice - orderData.shippingPrice}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontSize="14px">Shipping Fee</Typography>
                    <Typography fontSize="14px">
                      ₹ {orderData.shippingPrice}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontSize="14px">Order Total</Typography>
                    <Typography fontSize="14px">
                      ₹{" "}
                      {parseInt(orderData.totalPrice + orderData.shippingPrice)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontSize="14px" fontWeight={600}>
                      Payment Mode
                    </Typography>
                    <Typography fontSize="14px" fontWeight={600}>
                      {orderData.paymentMethod
                        ? orderData.paymentMethod.toUpperCase()
                        : ""}
                    </Typography>
                  </Box>
                </Stack>
                <Divider sx={{ mt: 3, mb: 2 }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography fontWeight={600} fontSize="16px">
                    {orderData.isPaid ? "Amount Paid" : "Amount To Be Paid"}
                  </Typography>
                  <Typography fontWeight={600} fontSize="16px">
                    ₹ {parseInt(orderData.totalPrice + orderData.shippingPrice)}
                  </Typography>
                </Box>
                {isRefund && orderData.isPaid ? (
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Typography fontWeight={600} fontSize="14px" color="error">
                      Refund Amount
                    </Typography>
                    <Typography fontWeight={600} fontSize="14px" color="error">
                      - ₹ {parseInt(orderData.totalRefundAmount)}
                    </Typography>
                  </Box>
                ) : null}
              </Paper>

              {/* order other items for small screens  */}
              <Box sx={{ display: { xs: "block", md: "none" } }}>
                {remainigItems.length > 0 ? (
                  <Card sx={{ mt: 2, p: 2, pb: 0 }}>
                    <Typography
                      fontWeight={600}
                      color="primary"
                      textTransform="uppercase"
                      variant="h2"
                      fontSize="13px"
                      sx={{ color: "#00000061" }}
                    >
                      Other Items in this Order
                    </Typography>
                    <Divider light sx={{ m: 1 }} />

                    {remainigItems.map((remainingItem) => {
                      return (
                        <span key={remainingItem.uid}>
                          <Grid container py={1} px={0}>
                            <Grid item xs={4} md={2.5}>
                              <CardActionArea
                                component={NavLink}
                                to={`/singleproduct/${remainingItem.product.slug}`}
                              >
                                <Box
                                  width="100%"
                                  display="flex"
                                  alignItems="center"
                                  borderRadius="4px"
                                  overflow="hidden"
                                >
                                  <img
                                    width="100%"
                                    src={`http://127.0.0.1:8000${remainingItem.product.card_thumb_image}`}
                                    alt=""
                                  />
                                </Box>
                              </CardActionArea>
                            </Grid>
                            <Grid
                              item
                              xs={8}
                              md={9.5}
                              px={2}
                              display="flex"
                              flexDirection="column"
                            >
                              <Stack spacing={0.7} mt={0.5}>
                                <Typography variant="subtitle1" fontSize={12}>
                                  {remainingItem.product.product_name}
                                </Typography>
                                <Typography
                                  color="text.secondary"
                                  variant="subtitle2"
                                  fontSize={12}
                                >
                                  Size: {remainingItem.size_variant.size_name} |
                                  Qty: {remainingItem.quantity}
                                </Typography>
                              </Stack>
                              {!remainingItem.isCancel ? (
                                <Stack
                                  spacing={0.5}
                                  mt={1}
                                  direction="row"
                                  display="flex"
                                  justifyItems="center"
                                  alignItems="center"
                                >
                                  <LocalShippingIcon
                                    sx={{ fontSize: "14px" }}
                                    color="primary"
                                  />
                                  <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    fontSize="12px"
                                  >
                                    {remainingItem.isDeliver
                                      ? `Delivered On: ${moment(
                                        new Date(remainingItem.deliveredAt)
                                      ).format("D MMM, YYYY ")}`
                                      : remainingItem.isOutForDelivery
                                        ? `Delivery by Today`
                                        : moment(
                                          new Date(
                                            remainingItem.estimateDeliveryDate
                                          )
                                        ).format("D MMM, YYYY ")}
                                  </Typography>
                                </Stack>
                              ) : null}

                              {remainingItem.isCancel ? (
                                <Stack
                                  spacing={0.7}
                                  mt={2}
                                  direction="row"
                                  justifyItems="center"
                                  alignItems="center"
                                >
                                  <CircleIcon
                                    sx={{ fontSize: "12px" }}
                                    color="error"
                                  />
                                  <Typography
                                    variant="subtitle1"
                                    color="success"
                                    fontWeight={600}
                                    fontSize="12px"
                                  >
                                    ORDER CANCELLED
                                  </Typography>
                                </Stack>
                              ) : null}

                              <Box textAlign="right" sx={{ marginTop: "auto" }}>
                                <Button
                                  sx={{ textTransform: "capitalize" }}
                                  variant="outlined"
                                  size="small"
                                  component={NavLink}
                                  to={`/my-orders/${orderId}/${remainingItem.uid}`}
                                >
                                  Order Details
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                          {/* {index == order.order_items.length - 1 ? null : (
                )} */}
                          <Divider light />
                        </span>
                      );
                    })}
                  </Card>
                ) : null}
              </Box>
            </Grid>
          </Grid>
        )}

        {/* cancel confirmation */}
        {!orderData.isPaid && orderData.paymentMethod == "cod" ? (
          <Dialog
            // fullScreen={fullScreen}
            open={openOrderCancelConfirmation}
            onClose={closeConfirmation}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle
              fontSize={16}
              textTransform="none"
              fontWeight={500}
              letterSpacing={0}
              id="alert-dialog-title"
            >
              {"Are you sure you want to cancel this item?"}
            </DialogTitle>
            <DialogActions>
              <Button onClick={closeConfirmation}>Cancel</Button>
              <Button onClick={cancelOrder} autoFocus>
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        ) : orderData.isPaid && orderData.refundBankDetails != null ? (
          <Dialog
            // fullScreen={fullScreen}
            open={openOrderCancelConfirmation}
            onClose={closeConfirmation}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle
              fontSize={16}
              textTransform="none"
              fontWeight={500}
              letterSpacing={0}
              id="alert-dialog-title"
            >
              {"Your Refund will be Initiated to the same Bank Account."}
            </DialogTitle>
            <DialogActions>
              <Button onClick={closeConfirmation}>Cancel</Button>
              <Button onClick={cancelOrder} autoFocus>
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        ) : (
          <Dialog
            // fullScreen={fullScreen}
            open={openOrderCancelConfirmation}
            onClose={closeConfirmation}
            aria-labelledby="responsive-dialog-title"
            fullWidth
            maxWidth="md"
          >
            <DialogTitle
              fontSize={16}
              textTransform="none"
              fontWeight={500}
              letterSpacing={0}
              id="alert-dialog-title"
            >
              {"Add Bank Account for Initiating Refund?"}
            </DialogTitle>
            <DialogContent>
              <RefundBankInformation
                setSelectedBankAccount={setSelectedBankAccount}
                selectedBankAccount={selectedBankAccount}
              />
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                size="large"
                onClick={cancelOrder}
                autoFocus
              >
                Cancel Order
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {/* return confirmation  */}
        {orderData.refundBankDetails == null ? (
          <Dialog
            // fullScreen={fullScreen}
            open={openOrderReturnConfirmation}
            onClose={closeReturnConfirmation}
            aria-labelledby="responsive-dialog-title"
            // sx={{width: "100%" }}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle
              fontSize={16}
              textTransform="none"
              fontWeight={600}
              letterSpacing={0}
              id="alert-dialog-title"
            >
              {"Select Bank to Recieve Refund Amount"}
            </DialogTitle>
            <DialogContent>
              <RefundBankInformation
                setSelectedBankAccount={setSelectedBankAccount}
                selectedBankAccount={selectedBankAccount}
              />
            </DialogContent>
            <DialogActions>
              {/* <Button onClick={closeReturnConfirmation}>Cancel</Button> */}
              <Button
                variant="contained"
                size="large"
                disableElevation
                onClick={returnOrder}
                autoFocus
              >
                Request Return
              </Button>
            </DialogActions>
          </Dialog>
        ) : (
          <Dialog
            // fullScreen={fullScreen}
            open={openOrderReturnConfirmation}
            onClose={closeReturnConfirmation}
            aria-labelledby="responsive-dialog-title"
          // sx={{width: "100%" }}
          >
            <DialogTitle
              fontSize={16}
              textTransform="none"
              fontWeight={500}
              letterSpacing={0}
              id="alert-dialog-title"
            >
              {"Your Refund will be Initiated to the same Bank Account"}
            </DialogTitle>
            <DialogActions>
              {/* <Button onClick={closeReturnConfirmation}>Cancel</Button> */}
              <Button disableElevation onClick={returnOrder} autoFocus>
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </ThemeProvider>
    </>
  );
};

export default SingleOrderItem;
