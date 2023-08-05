import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import {
  Grid,
  Typography,
  Container,
  Paper,
  CardActionArea,
  Card,
  Divider,
  Button,
  CircularProgress,
  Pagination,
  IconButton,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { motion } from "framer-motion";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CircleIcon from "@mui/icons-material/Circle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../services/localStorageServices";
import { NavLink } from "react-router-dom";
import moment from "moment";
import PreLoader from "../components/PreLoader";
import React from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Orders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [sortedOrders, setsortedOrders] = useState([]);
  const { access_token } = getToken();
  const [totalOrders, setTotalOrders] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/order/",
          { headers }
        );
        setAllOrders(response.data);
      } catch (error) {
        console.error("Error occurred while fetching data:", error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [page]);

  useEffect(() => {
    if (allOrders && !isLoading) {
      setTotalOrders(allOrders.length);

      const sortedOrder = [...allOrders].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setsortedOrders(sortedOrder);
    }
  }, [allOrders]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {isLoading ? (
        <PreLoader />
      ) : (
        <ThemeProvider theme={theme}>
          <Box bgcolor="#F9F9F9" textAlign="center" py={3}>
            <Typography
              variant="h1"
              sx={{ fontSize: { md: 32, xs: 24 } }}
              fontWeight={600}
            >
              My Orders
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ fontSize: { md: 16, xs: 15 }, px: { md: 0, xs: 3 } }}
            >
              Track your open orders & view the summary of your past orders
            </Typography>
          </Box>
          {isLoading ? (
            <Box textAlign="center">
              <CircularProgress />
            </Box>
          ) : (
            <Grid container justifyContent="center" alignItems="center" py={6}>
              <Grid item md={6} xs={11}>
                {/* {sortedOrders.map((order) => { */}
                {sortedOrders.length > 0 ? (
                  sortedOrders.slice(startIndex, endIndex).map((order) => {
                    return (
                      <Card key={order.uid} sx={{ mt: "30px" }}>
                        <Grid
                          container
                          sx={{ p: { md: 2, xs: 1 } }}
                          bgcolor="#F7F7F7"
                          justifyContent='center'
                          alignItems="center"
                        >
                          <Grid item xs={9} md={9}>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontSize: { md: "16px", xs: "12px" } }}
                            >
                              Order ID: {order.uid}
                            </Typography>
                          </Grid>
                          <Grid item xs={3} md={3} >
                            <Typography
                              variant="subtitle1"
                              textAlign='end'
                              sx={{ fontSize: { md: "16px", xs: "12px" } }}
                            >
                              {new Date(order.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </Typography>
                          </Grid>
                        </Grid>
                        {order.order_items.map((orderItem, index) => {
                          const thumbImgUrl = `http://127.0.0.1:8000${orderItem.product.card_thumb_image}`;

                          return (
                            <span key={orderItem.uid}>
                              <Grid
                                container
                                sx={{
                                  p: { md: 2, xs: 1 },
                                  position: "relative",
                                }}
                              >
                                <Grid item xs={4} md={3}>
                                  <CardActionArea
                                    component={NavLink}
                                    to={`/singleproduct/${orderItem.product.slug}`}
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
                                        src={thumbImgUrl}
                                        alt=""
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
                                  <Stack spacing={0.7} mt={0.5}>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontSize: { xs: "13px", md: "16px" },
                                      }}
                                    >
                                      {orderItem.product.product_name}
                                    </Typography>
                                    <Typography
                                      color="text.secondary"
                                      variant="subtitle2"
                                      sx={{
                                        fontSize: {
                                          xs: "13px",
                                          md: "0.875rem",
                                        },
                                      }}
                                    >
                                      Size: {orderItem.size_variant.size_name} |
                                      Qty: {orderItem.quantity}
                                    </Typography>
                                  </Stack>
                                  <Stack
                                    spacing={0.7}
                                    sx={{ mt: { md: 3, xs: 1 } }}
                                    direction="row"
                                    justifyItems="center"
                                    alignItems="center"
                                  >
                                    {orderItem.isCancel ? (
                                      <>
                                        {" "}
                                        <CircleIcon
                                          sx={{
                                            fontSize: {
                                              md: "14px",
                                              xs: "12px",
                                            },
                                          }}
                                          color="error"
                                        />
                                        <Typography
                                          variant="subtitle1"
                                          color="success"
                                          fontWeight={600}
                                          sx={{
                                            fontSize: {
                                              md: "14px",
                                              xs: "12px",
                                            },
                                          }}
                                        >
                                          ORDER CANCELLED
                                        </Typography>{" "}
                                      </>
                                    ) : orderItem.isDeliver &&
                                      !orderItem.isReturn ? (
                                      <>
                                        {" "}
                                        <CircleIcon
                                          sx={{
                                            fontSize: {
                                              md: "14px",
                                              xs: "12px",
                                            },
                                          }}
                                          color="success"
                                        />
                                        <Typography
                                          variant="subtitle1"
                                          color="success"
                                          fontWeight={600}
                                          sx={{
                                            fontSize: {
                                              md: "14px",
                                              xs: "12px",
                                            },
                                          }}
                                        >
                                          DELIVERED
                                        </Typography>{" "}
                                      </>
                                    ) : orderItem.isRefundComplete ? (
                                      <>
                                        {" "}
                                        <CircleIcon
                                          sx={{
                                            fontSize: {
                                              md: "14px",
                                              xs: "12px",
                                            },
                                          }}
                                          color="success"
                                        />
                                        <Typography
                                          variant="subtitle1"
                                          color="success"
                                          fontWeight={600}
                                          sx={{
                                            fontSize: {
                                              md: "14px",
                                              xs: "12px",
                                            },
                                          }}
                                        >
                                          REFUND COMPLETED
                                        </Typography>{" "}
                                      </>
                                    ) : (
                                      <>
                                        <RadioButtonUncheckedIcon
                                          sx={{
                                            fontSize: {
                                              md: "16px",
                                              xs: "14px",
                                            },
                                          }}
                                          color="success"
                                        />
                                        <Typography
                                          variant="subtitle1"
                                          color="success"
                                          fontWeight={600}
                                          sx={{
                                            fontSize: {
                                              md: "14px",
                                              xs: "12px",
                                            },
                                          }}
                                        >
                                          {orderItem.isPreparing &&
                                          !orderItem.isReturn
                                            ? orderItem.isShipped
                                              ? orderItem.isOutForDelivery
                                                ? "OUT FOR DELIVERY"
                                                : "SHIPPED"
                                              : "PREPARING ORDER"
                                            : orderItem.isReturn
                                            ? orderItem.isRefundInitiated
                                              ? orderItem.isRefundApproved
                                                ? "REFUND APPROVED"
                                                : "REFUND INITIATED"
                                              : "RETURN REQUESTED"
                                            : "CONFIRMED"}
                                        </Typography>
                                      </>
                                    )}
                                  </Stack>
                                  {!orderItem.isCancel ? (
                                    <Stack
                                      spacing={0.5}
                                      sx={{ mt: { md: 2, xs: 1 } }}
                                      direction="row"
                                      display="flex"
                                      justifyItems="center"
                                      alignItems="center"
                                    >
                                      <LocalShippingIcon
                                        sx={{
                                          fontSize: { md: "16px", xs: "14px" },
                                        }}
                                        color="primary"
                                      />
                                      <Typography
                                        variant="subtitle1"
                                        color="text.secondary"
                                        sx={{
                                          fontSize: { md: "14px", xs: "12px" },
                                        }}
                                      >
                                        {orderItem.isDeliver
                                          ? `Delivered on: ${moment(
                                              new Date(orderItem.deliveredAt)
                                            ).format("D MMM, YYYY ")}`
                                          : orderItem.isOutForDelivery
                                          ? `Delivery by Today`
                                          : orderItem.estimateDeliveryDate
                                          ? moment(
                                              new Date(
                                                orderItem.estimateDeliveryDate
                                              )
                                            ).format("D MMM, YYYY ")
                                          : "Delivery by: Will let you know"}
                                      </Typography>
                                    </Stack>
                                  ) : null}

                                  <Box
                                    textAlign="right"
                                    sx={{
                                      marginTop: "auto",
                                      display: { xs: "none", md: "block" },
                                    }}
                                  >
                                    <Button
                                      sx={{ textTransform: "capitalize" }}
                                      variant="outlined"
                                      size="large"
                                      component={NavLink}
                                      to={`/my-orders/${order.uid}/${orderItem.uid}`}
                                    >
                                      Order Details
                                    </Button>
                                  </Box>
                                  <IconButton
                                    component={NavLink}
                                    to={`/my-orders/${order.uid}/${orderItem.uid}`}
                                    sx={{
                                      position: "absolute",
                                      top: "50%",
                                      right: "-18px",
                                      transform: "translate(-50%, -50%)",
                                      display: {
                                        md: "none",
                                        xs: "inline-flex",
                                      },
                                    }}
                                  >
                                    <ArrowForwardIosIcon
                                      sx={{ fontSize: "18px" }}
                                    />
                                  </IconButton>
                                </Grid>
                              </Grid>
                              {index == order.order_items.length - 1 ? null : (
                                <Divider light />
                              )}
                            </span>
                          );
                        })}
                      </Card>
                    );
                  })
                ) : (
                  <Grid container justifyContent="center" alignItems="center">
                    <Grid item md={5}>
                      <Stack>
                        <Box>
                          <img width="100%" src="images/noOrder.png" alt="" />
                        </Box>
                        <Typography
                          fontSize="15px"
                          textAlign="center"
                          variant="subtitle1"
                        >
                          You haven't placed any orders yet!
                        </Typography>
                        <Typography
                          fontSize="15px"
                          textAlign="center"
                          variant="subtitle1"
                        >
                          We can't wait to have you as a customer.
                        </Typography>
                      </Stack>
                      <Typography
                        mt={2}
                        fontWeight={600}
                        textAlign="center"
                        variant="subtitle1"
                      >
                        Take a look at our products here
                      </Typography>
                      <Box textAlign="center" mt={4}>
                        <Button
                          variant="contained"
                          sx={{ borderRadius: 0 }}
                          size="large"
                        >
                          View Products
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
          )}

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={3}
          >
            {totalOrders > 0 ? (
              <Pagination
                count={Math.ceil(totalOrders / pageSize)}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                shape="rounded"
              />
            ) : null}
          </Box>
        </ThemeProvider>
      )}
    </motion.div>
  );
};

export default Orders;
