import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from 'react';
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useGetSingleOrderQuery } from "../services/userAuthApi";
import { useEffect, useState } from "react";
import {
  getOrdersPlaced,
  getToken,
  storeOrdersPlaced,
} from "../services/localStorageServices";
import { CssBaseline } from "@mui/material";
import { motion } from "framer-motion";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { uid } = useParams();
  const { access_token } = getToken();
  const [isOrderAlreadyPlace, setIsOrderAlreadyPlace] = useState(false);

  const { data, isLoading, isSuccess } = useGetSingleOrderQuery({
    access_token,
    uid,
  });
  const [orderData, setOrderData] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    if (isLoading) {
      console.log("loading..");
    } else {
      setOrderData(data);
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (orderData) {
      const existingOrderIds = getOrdersPlaced();

      if (existingOrderIds.includes(orderData.uid)) {
        setIsOrderAlreadyPlace(true);
      } else {
        existingOrderIds.push(orderData.uid);

        storeOrdersPlaced(existingOrderIds);
      }
    }
  }, [orderData]);

  useEffect(() => {
    if (isOrderAlreadyPlace) {
      navigate("/");
    }
  });

  
  useEffect(() => {
    document.title = "Order Placed";
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <CssBaseline />
      <ThemeProvider theme={theme}>
        {isOrderAlreadyPlace ? null : (
          <Grid
            container
            justifyContent="center"
            alignItems="top"
            sx={{ bgcolor: "#ECECEC", height: {xs: "100vh", md: "auto"}, pt: {xs:"100px", md: "auto"} }}
            py={6}
          >
            <Grid xs={11} md={6.5} item>
              <Paper sx={{ py: "50px" }}>
                <Stack justifyContent="center" alignItems="center" spacing={2}>
                  <VerifiedRoundedIcon
                    sx={{ fontSize: { md: "71px !important", xs: "50px" } }}
                    color="success"
                  />
                  <Typography variant="h1" sx={{ fontSize: { md: "28px !important", xs: "22px" } }} fontWeight={600}>
                    Thank you for shopping!
                  </Typography>
                  <Typography sx={{ fontSize: { md: "16px !important", xs: "14px" } }} color="text.secondary" textAlign='center' px="12px !important">
                    We are pleased to confirm your order&nbsp;
                    <Box component="span" color="#000000 !important">
                      #{orderData.uid}
                    </Box>
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={3}
                    sx={{ marginTop: "35px !important", display: {xs: "none", md: "flex"} }}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{ borderRadius: 0 }}
                      component={NavLink}
                      to="/"
                    >
                      Continue Shopping
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{ borderRadius: 0 }}
                      component={NavLink}
                      to="/my-orders"
                    >
                      View Orders
                    </Button>
                  </Stack>
                  {/* buttons for small screen  */}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ marginTop: "35px !important", display: {xs: "flex", md: "none"} }}
                  >
                    <Button
                      variant="outlined"
                      size="medium"
                      sx={{ borderRadius: 0 }}
                      component={NavLink}
                      to="/"
                    >
                      Continue Shopping
                    </Button>
                    <Button
                      variant="contained"
                      size="medium"
                      sx={{ borderRadius: 0 }}
                      component={NavLink}
                      to="/my-orders"
                    >
                      View Orders
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
              <Paper className="receipt" sx={{ mt: "40px", display: {xs: "none", md: "block"} }}>
                <Grid
                  container
                  justifyContent="center"
                  bgcolor="#2B3947"
                  py={2}
                  px={3}
                >
                  <Grid
                    item
                    md={2.5}
                    xs={2.5}
                    display="flex"
                    justifyContent="left"
                    alignItems="center"
                  >
                    <Typography
                      variant="subtitle1"
                      color="secondary"
                      fontSize="25px"
                    >
                      Geek-Shop
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    md={7}
                    xs={7}
                    textAlign="center"
                    display="flex"
                    justifyContent="center"
                    alignItems="end"
                  >
                    <Typography variant="subtitle1" color="#ffffffb8">
                      Order ID: {orderData.uid}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    md={2.5}
                    xs={2.5}
                    display="flex"
                    justifyContent="center"
                    alignItems="end"
                    flexDirection="column"
                  >
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <CurrencyRupeeIcon
                        color="secondary"
                        sx={{ fontSize: "25px !important" }}
                      />
                      <Typography
                        variant="subtitle1"
                        color="secondary"
                        fontSize="25px"
                      >
                        {orderData.totalPrice}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      spacing={1}
                      mt={0}
                    >
                      <CalendarMonthIcon
                        sx={{ fontSize: "18px !important", color: "#ffffffb8" }}
                      />
                      <Typography
                        variant="subtitle1"
                        color="#ffffffb8"
                        fontSize="15px"
                      >
                        {new Date(orderData.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
                <Box px={3}>
                  <TableContainer>
                    <Table aria-label="spanning table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center" colSpan={3}>
                            Details
                          </TableCell>
                          <TableCell align="right">Price</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Desc</TableCell>
                          <TableCell align="right">Qty.</TableCell>
                          <TableCell align="right">Unit</TableCell>
                          <TableCell align="right">Sum</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderData.order_items
                          ? orderData.order_items.map((row) => {
                            const imgUrl = `https://apardeepsingh.pythonanywhere.com${row.product.card_thumb_image}`;
                            return (
                              <TableRow key={row.uid}>
                                <TableCell width="45%">
                                  <Grid container>
                                    <Grid
                                      item
                                      md={3}
                                      xs={3}
                                      display="flex"
                                      justifyContent="center"
                                      alignItems="center"
                                    >
                                      <img width="100%" src={imgUrl} alt="" />
                                    </Grid>
                                    <Grid md={9} xs={9} item py={1} pl={1}>
                                      <Stack spacing={1}>
                                        <Typography
                                          fontWeight={600}
                                          fontSize="13px"
                                          color="#000000de"
                                        >
                                          {row.product.product_name.slice(
                                            0,
                                            48
                                          )}
                                          ...
                                        </Typography>
                                        <Typography fontSize="14px">
                                          Size: {row.size_variant.size_name}
                                        </Typography>
                                      </Stack>
                                    </Grid>
                                  </Grid>
                                </TableCell>
                                <TableCell align="right">
                                  {row.quantity}
                                </TableCell>
                                <TableCell align="right">
                                  {row.product.price + row.size_variant.price}
                                </TableCell>
                                <TableCell align="right">
                                  {row.quantity *
                                    (row.product.price +
                                      row.size_variant.price)}
                                </TableCell>
                              </TableRow>
                            );
                          })
                          : null}
                        <TableRow>
                          <TableCell
                            rowSpan={3}
                            align="left"
                            sx={{ verticalAlign: "top" }}
                          >
                            <Typography variant="subtitle1" fontWeight={600}>
                              Shipping To:
                            </Typography>
                            {orderData.shippingAddress ? (
                              <Stack>
                                <Typography
                                  variant="subtitle1"
                                  color="#000000de"
                                  fontSize="14px"
                                >
                                  {orderData.shippingAddress.first_name}{" "}
                                  {orderData.shippingAddress.last_name},
                                </Typography>
                                <Typography
                                  variant="subtitle1"
                                  color="#000000de"
                                  fontSize="14px"
                                >
                                  {orderData.shippingAddress.house_no},
                                  {orderData.shippingAddress.street_name},
                                </Typography>
                                <Typography
                                  variant="subtitle1"
                                  color="#000000de"
                                  fontSize="14px"
                                >
                                  {orderData.shippingAddress.city},
                                  {orderData.shippingAddress.country}-
                                  {orderData.shippingAddress.postal_code}
                                </Typography>
                              </Stack>
                            ) : (
                              ""
                            )}
                          </TableCell>
                          <TableCell colSpan={2}>Subtotal</TableCell>
                          <TableCell align="right">
                            {orderData.totalPrice - orderData.shippingPrice}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2}>Shipping</TableCell>
                          <TableCell align="right">
                            {orderData.shippingPrice}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2}>Total</TableCell>
                          <TableCell align="right">
                            {orderData.totalPrice}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </ThemeProvider>
    </motion.div>
  );
};

export default OrderSuccess;
