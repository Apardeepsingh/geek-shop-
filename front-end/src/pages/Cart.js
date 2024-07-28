import {
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import ShoppingCartCheckoutOutlinedIcon from "@mui/icons-material/ShoppingCartCheckoutOutlined";
import {
  useAddOrderMutation,
  useApplyCouponToCartMutation,
  useDeleteAllCartItemsMutation,
  useDeleteCartItemsMutation,
  useDeleteUserAddressesMutation,
  useGetCartItemsQuery,
  useGetUserAddressesQuery,
  useUpdateCartItemsMutation,
} from "../services/userAuthApi";
import { getToken } from "../services/localStorageServices";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartData } from "../features/cartSlice";
import {
  decrementCartCount,
  incrementCartCount,
} from "../features/cartCountSlice";
import { NavLink, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import PaymentsIcon from "@mui/icons-material/Payments";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EditIcon from "@mui/icons-material/Edit";
import AddLocationRoundedIcon from "@mui/icons-material/AddLocationRounded";
import AddAddress from "./auth/AddAddress";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import axios from "axios";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import { styled } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import {
  useGetCouponsQuery,
  useUpdateProductMutation,
} from "../services/productsApi";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { incrementStateCount } from "../features/changeStateToGetProductsSlice";
import { motion } from "framer-motion";
import PreLoader from "../components/PreLoader";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import Coupon from "./Coupon";
import useRazorpay from "react-razorpay";
import React from "react";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
import LoadingButton from '@mui/lab/LoadingButton';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  borderLeft: "none", // Remove left border
  borderRight: "none", // Remove right border
  borderBottom: `1px solid ${theme.palette.divider}`,
  ":last-child": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));



const Cart = () => {
  const dispatch = useDispatch();
  const [isCartAvailableForCod, setisCartAvailableForCod] = useState(true)
  const [isRazorPayLoading, setIsRazorPayLoading] = useState(false)
  const [Razorpay] = useRazorpay();
  const userData = useSelector((state) => state.user);
  const [quantity, setQuantity] = useState(0);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  // const [stockValue, setstockValue] = useState(10);
  const { access_token } = getToken();
  const [cartData, setCartData] = useState({});
  const [cartItemsData, setCartItemsData] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [cartRemoveItemId, setCartRemoveItemId] = useState("")
  const [totalMRPCost, setTotalMRPCost] = useState(0);
  const [shippingCost, setTotalShippingCost] = useState(0);
  const [totalSellingCost, setTotalSellingCost] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [deleteItem, { isLoading, isSuccess }] = useDeleteCartItemsMutation();
  const [
    deleteAllItems,
    { isLoading: isdeleteAllItemsLoading, isSuccess: isdeleteAllItemsSuccess },
  ] = useDeleteAllCartItemsMutation();
  const cartdatastate = useSelector((state) => state.cart);
  const cartCount = useSelector((state) => state.cartCount.cartCount);
  const [itemIncrementId, setitemIncrementId] = useState();
  const [isAllProductsAvailabe, setisAllProductsAvailabe] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [
    updateCart,
    { isLoading: isCartupdateLoading, isSuccess: isCartupdateSuccess },
  ] = useUpdateCartItemsMutation();

  const [updateProduct, { isLoading: isupdateProductLoading }] =
    useUpdateProductMutation();

  // coupon state
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isOpenCoupons, setIsOpenCoupons] = useState(false);
  const [couponApplied, setCouponApplied] = useState({});
  const [applyCoupon, { isLoading: isApplyCouponLoading }] = useApplyCouponToCartMutation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [activeStep]);

  useEffect(() => {
    if (cartCount <= 1) {
      setTotalMRPCost(0);
      setTotalSellingCost(0);
      setSubTotal(0);
      setTotalShippingCost(0);
    }
  }, [cartdatastate]);

  useEffect(() => {
    if (Object.keys(cartdatastate.cartData).length === 0) {
      console.log("Loading...");
    } else {
      setCartData(cartdatastate.cartData);
      setCartItemsData(cartdatastate.cartData.cart_items);
    }
  }, [cartdatastate]);

  // setting each product quantity
  useEffect(() => {
    if (Object.keys(cartdatastate.cartData).length === 0) {
      console.log("Loading...");
    } else {
      const initialCartItems = {};
      cartdatastate.cartData.cart_items.forEach((item) => {
        initialCartItems[item.uid] = item.quantity;
      });
      setCartItems(initialCartItems);
    }
  }, [cartdatastate]);

  // checking if all products in cart are still available
  useEffect(() => {
    let isAvail = true;

    // Check if any product has 0 stock
    for (const item of cartItemsData) {
      if (item.size_variant.stock === 0) {
        isAvail = false;
        break;
      }
    }

    // Set the outOfStock flag
    setisAllProductsAvailabe(isAvail);
  }, [cartItemsData]);

  // handeling all cart calculations
  useEffect(() => {
    let total = 0;
    let totalSellingCost = 0;
    cartItemsData.forEach((cartItem) => {
      const singleMRP =
        cartItem.product.maximum_retail_price * cartItems[cartItem.uid];
      total += singleMRP;

      const singleSellingCost =
        (cartItem.product.price + cartItem.size_variant.price) *
        cartItems[cartItem.uid];
      totalSellingCost += singleSellingCost;
    });

    setTotalMRPCost(total);

    if (totalSellingCost < 1000) {
      setTotalShippingCost(100);
      totalSellingCost += 100;
    } else {
      setTotalShippingCost(0);
      totalSellingCost += 0;
    }

    setSubTotal(totalSellingCost);

    if (cartData.coupon != null) {
      if (totalSellingCost < cartData.coupon.minimum_amount) {
        removeCoupon();
      } else {
        setIsCouponApplied(true);
        setCouponApplied(cartData.coupon);
        let dicountedPrice = 0;
        let couponDiscount = 0;

        if (cartData.coupon.coupon_type == "flat") {
          couponDiscount = cartData.coupon.discount_flat;
          dicountedPrice = totalSellingCost - couponDiscount;

          setTotalSellingCost(dicountedPrice);
          setCouponDiscount(couponDiscount);
        }
        if (cartData.coupon.coupon_type == "percentage") {
          const discount_percent = cartData.coupon.discount_percent;

          couponDiscount = (totalSellingCost * discount_percent) / 100;

          if (couponDiscount > cartData.coupon.maximum_discount) {
            couponDiscount = cartData.coupon.maximum_discount;
          }

          dicountedPrice = totalSellingCost - couponDiscount;

          setTotalSellingCost(dicountedPrice);
          setCouponDiscount(couponDiscount);
        }
      }
    } else {
      setTotalSellingCost(totalSellingCost);
      setCouponDiscount(0);
      setIsCouponApplied(false);
      setCouponApplied({});
    }
  }, [cartItems, cartItemsData]);

  // handeling removing coupon
  const removeCoupon = async () => {
    const actualData = {
      coupon: "",
    };

    const res = await applyCoupon({ access_token, actualData });
    if (res.error) {
      console.log(res.error);
    }
    if (res.data) {
      dispatch(fetchCartData());
    }
  };


  // checking if cart is available for cod 
  useEffect(() => {
    if (cartItemsData) {
      const isCODAvailable = !cartItemsData.some((cartItem) => cartItem.product.is_cash_on_delivery === false);

      setisCartAvailableForCod(isCODAvailable)
    }
  }, [cartItemsData])


  const handleIncrease = async (itemId) => {
    setitemIncrementId(itemId);
    const actualData = {
      quantity: cartItems[itemId] + 1,
    };
    const res = await updateCart({ access_token, uid: itemId, actualData });
    if (res.error) {
      console.log(res.error);
    }
    if (res.data) {
      // console.log(res.data);
    }

    setCartItems((prevItems) => {
      const updatedItems = { ...prevItems };
      updatedItems[itemId] = (updatedItems[itemId] || 0) + 1;
      return updatedItems;
    });

    dispatch(fetchCartData());
    dispatch(incrementCartCount());
  };

  const handleDecrease = async (itemId) => {
    setitemIncrementId(itemId);
    const actualData = {
      quantity: cartItems[itemId] - 1,
    };
    const res = await updateCart({ access_token, uid: itemId, actualData });
    if (res.error) {
      console.log(res.error);
    }
    if (res.data) {
      // console.log(res.data);
    }

    setCartItems((prevItems) => {
      const updatedItems = { ...prevItems };
      if (updatedItems[itemId] > 1) {
        updatedItems[itemId] -= 1;
      } else if (updatedItems[itemId] === 1) {
        delete updatedItems[itemId];
      }
      return updatedItems;
    });

    dispatch(fetchCartData());
    dispatch(decrementCartCount());
  };

  const removeCartItem = async (uid) => {
    setCartRemoveItemId(uid)
    const res = await deleteItem({ access_token, uid });

    if (res.error) {
      console.log(res.error.data.errors);
    }
    if (res.data) {
      dispatch(fetchCartData());
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // opening and closing address form
  const [isOpenAddressForm, setIsOpenAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedAddressData, setSelectedAddressData] = useState({});
  const [formType, setFormType] = useState();
  const [userAddresses, setUserAddresses] = useState([]);
  const [isAddressesLoading, setIsAddressesLoading] = useState(false);
  const [changeState, setChangeState] = useState(0);
  const [openFormId, setOpenFormId] = useState("");
  const navigate = useNavigate();
  const [
    deleteUserAddress,
    { isLoading: isDeleteAddressLoading, isSuccess: isDeleteAddressSuccess },
  ] = useDeleteUserAddressesMutation();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [placeOrder, { isLoading: isOrderLoading, isSuccess: isOrderSuccess }] =
    useAddOrderMutation();

  useEffect(() => {
    const fetchData = async () => {
      setIsAddressesLoading(true);

      try {
        const headers = {
          Authorization: `Bearer ${access_token}`,
        };
        const response = await axios.get(
          "https://apardeepsingh.pythonanywhere.com/api/user/address/",
          { headers }
        );
        setUserAddresses(response.data);
      } catch (error) {
        console.error("Error occurred while fetching data:", error);
      }

      setIsAddressesLoading(false);
    };

    fetchData();
  }, [changeState]);

  const deleteAddress = async (uid) => {
    const res = await deleteUserAddress({ access_token, uid });

    if (res.error) {
      console.log(res.error.data.errors);
    }
    if (res.data) {
      // console.log(res.data);
      setChangeState((prev) => prev + 1);
      setSelectedAddress("");
    }
  };

  // handeling address selection
  const handleAddressChange = (addressId, address) => {
    setSelectedAddress(addressId);

    setSelectedAddressData(address);
  };

  const openAddressForm = (addressId, openFormType) => {
    setIsOpenAddressForm(true);
    setOpenFormId(addressId);
    setFormType(openFormType);
  };

  const closeAddressDialog = () => {
    setIsOpenAddressForm(false);
  };

  // handeling payment method

  const handlePaymentMethodChange = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
  };

  useEffect(() => {
    document.title = 'My Cart';
  }, []);

  // regarding stepper
  const steps = ["My Cart", "Shipping Address", "Payment"];

  const renderContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Stack spacing={2}>
            {cartItemsData.map((cartItem, index) => {
              const imgUrl = `https://apardeepsingh.pythonanywhere.com${cartItem.product.card_thumb_image}`;

              const discountPercentage = parseInt(
                ((cartItem.product.maximum_retail_price -
                  (cartItem.product.price + cartItem.size_variant.price)) /
                  cartItem.product.maximum_retail_price) *
                100
              );

              const uniqueId = uuidv4();

              return (
                <Box key={index} position="relative">
                  <Card sx={{ p: 2, height: "230px", px: { xs: 1, md: 2 } }}>
                    <Grid container height="100%">
                      <Grid
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        md={3}
                        xs={4}
                        item
                        height="100%"
                        overflow="hidden"
                      // bgcolor="red"
                      >
                        <CardActionArea
                          component={NavLink}
                          to={`/singleproduct/${cartItem.product.slug}`}
                        >
                          <img width="100%" src={imgUrl} alt="" />
                        </CardActionArea>
                      </Grid>
                      <Grid
                        md={9}
                        xs={8}
                        item
                        sx={{ pl: { xs: 2, md: 3 }, pt: { xs: 2, md: 0 } }}
                        height="100%"
                      >
                        <Stack
                          spacing={0.8}
                          sx={{ pb: { xs: "10px", md: "20px" } }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontSize: {
                                xs: "15px", md: "16px",
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '100%',
                              }
                            }}
                          >
                            {cartItem.product.product_name}
                          </Typography>

                          <Stack
                            spacing={1}
                            direction="row"
                            justifyContent="left"
                            alignItems="center"
                            sx={{ mt: { xs: "3px !important", md: "10px" } }}
                          >
                            <Typography
                              gutterBottom
                              sx={{ fontSize: { xs: 17, md: 21 } }}
                              lineHeight="24px"
                              my={0}
                              py="4px"
                              variant="h4"
                              fontWeight={600}
                              component="h4"
                              id="salePrice"
                            >
                              ₹
                              {(cartItem.product.price +
                                cartItem.size_variant.price) *
                                cartItems[cartItem.uid]}
                            </Typography>

                            {
                              discountPercentage > 0 ? (
                                <>
                                  <Typography
                                    gutterBottom
                                    lineHeight="18px"
                                    my={0}
                                    py="4px"
                                    variant="h4"
                                    fontWeight={200}
                                    component="h4"
                                    id="regularPrice"
                                    sx={{
                                      textDecoration: "line-through",
                                      color: "#949494",
                                      textDecorationColor: "#949494",
                                      fontSize: { xs: 12, md: 14 },
                                    }}
                                  >
                                    ₹
                                    {cartItem.product.maximum_retail_price *
                                      cartItems[cartItem.uid]}
                                  </Typography>
                                  <Typography
                                    gutterBottom
                                    lineHeight="19px"
                                    my={0}
                                    py="4px"
                                    variant="h4"
                                    fontWeight={200}
                                    component="h4"
                                    id="discountPercent"
                                    color="#00b852"
                                    sx={{
                                      fontSize: { xs: 12, md: 14 },
                                    }}
                                  >
                                    ({discountPercentage}% off)
                                  </Typography>
                                </>
                              ) : null
                            }
                          </Stack>
                          <Typography
                            sx={{
                              mt: {
                                xs: "2px !important",
                                md: "4px !important",
                              },
                              fontSize: { xs: "15px", md: "16px" },
                            }}
                            variant="subtitle1"
                          >
                            Size: {cartItem.size_variant.size_name}
                          </Typography>
                        </Stack>
                        <Divider />
                        <Grid
                          sx={{ pt: { xs: "3px", md: "7px" } }}
                          container
                          alignItems="end"
                        >
                          <Grid
                            item
                            alignItems="end"
                            width="100%"
                            md={9}
                            xs={12}
                          >
                            {cartItem.size_variant.stock > 0 ? (
                              <Stack spacing={1}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{ fontSize: { xs: "15px", md: "16px" } }}
                                >
                                  Quantity
                                </Typography>
                                {isCartupdateLoading &&
                                  itemIncrementId == cartItem.uid ? (
                                  <CircularProgress />
                                ) : (
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={2}
                                  >
                                    <IconButton
                                      onClick={() =>
                                        handleDecrease(cartItem.uid)
                                      }
                                      size="small"
                                      disabled={cartItems[cartItem.uid] == 1}
                                    >
                                      <RemoveIcon />
                                    </IconButton>
                                    <TextField
                                      aria-readonly
                                      id={`quantity-${uniqueId}`}
                                      className="quantityField"
                                      variant="outlined"
                                      // value={cartItems[cartItem.uid] || 1}
                                      value={cartItem.quantity}
                                      size="small"
                                      inputProps={{
                                        style: {
                                          textAlign: "center",
                                          padding: " 4.5px",
                                          fontSize: "15px",
                                        },
                                      }}
                                      sx={{ width: "60px" }}
                                      onChange={(event) => {
                                        const newQuantity = Number(
                                          event.target.value
                                        );
                                        if (
                                          newQuantity > 0 &&
                                          newQuantity <= cartItem.product.stock
                                        ) {
                                          setCartItems((prevItems) => ({
                                            ...prevItems,
                                            [cartItem.uid]: newQuantity,
                                          }));
                                        }
                                      }}
                                      InputProps={{
                                        readOnly: true,
                                      }}
                                    />
                                    <IconButton
                                      onClick={() =>
                                        handleIncrease(cartItem.uid)
                                      }
                                      disabled={
                                        cartItems[cartItem.uid] >=
                                        cartItem.size_variant.stock
                                      }
                                      size="small"
                                    >
                                      <AddIcon />
                                    </IconButton>
                                    {cartItem.size_variant.stock < 5 ? (
                                      <Typography
                                        variant="subtitle1"
                                        color="error"
                                        sx={{ ml: { xs: "4px !important", md: "16px !important" }, fontSize: { xs: "14px", md: "16px" } }}
                                      >
                                        *Only {cartItem.size_variant.stock} left
                                      </Typography>
                                    ) : (
                                      " "
                                    )}
                                  </Stack>
                                )}
                              </Stack>
                            ) : (
                              <Typography
                                color="error"
                                variant="subtitle1"
                                fontSize="18px"
                                mt={5}
                              >
                                *Out of Stock
                              </Typography>
                            )}
                          </Grid>
                          <Grid
                            item
                            md={3}
                            sx={{ display: { xs: "none", md: "flex" } }}
                            justifyContent="center"
                          >
                            {
                              isLoading && cartRemoveItemId == cartItem.uid ? <CircularProgress color="error" /> : (
                                <span
                                  className="removeFromCart"
                                  onClick={() => {
                                    removeCartItem(cartItem.uid);
                                  }}
                                >
                                  <Button color="primary" sx={{ width: "100%" }}>
                                    <svg
                                      viewBox="0 0 448 512"
                                      className="removeIcon"
                                    >
                                      <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                                    </svg>
                                  </Button>
                                </span>
                              )
                            }

                          </Grid>

                          {/* remove button for small screens  */}
                          {
                            isLoading && cartRemoveItemId == cartItem.uid ? <CircularProgress sx={{
                              display: { xs: "block", md: "none" },
                              position: "absolute",
                              top: 10,
                              right: 10,
                              width: "20px !important",
                              height: "20px !important"
                            }} color="error" /> : (
                              <IconButton
                                onClick={() => {
                                  removeCartItem(cartItem.uid);
                                }}
                                sx={{
                                  display: { xs: "block", md: "none" },
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                }}
                              >
                                <CloseIcon />
                              </IconButton>
                            )
                          }
                        </Grid>
                      </Grid>
                    </Grid>
                  </Card>
                </Box>
              );
            })}
          </Stack>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            {userAddresses.map((address) => {
              return (
                <Grid item xs={12} md={6} key={address.uid} height="280px">
                  <Card
                    variant="outlined"
                    sx={{
                      p: 3,
                      position: "relative",
                      height: "100%",
                      bgcolor: selectedAddress === address.uid && "#2b39471a",
                    }}
                  >
                    <Radio
                      sx={{ position: "absolute", top: 10, right: 10 }}
                      checked={selectedAddress === address.uid}
                      onChange={() => handleAddressChange(address.uid, address)}
                      value="address1"
                      name="address"
                    // inputProps={{ "aria-label": "A" }}
                    />
                    <Stack spacing={0.5}>
                      <Typography fontWeight={600} fontFamily="15px">
                        {address.first_name} {address.last_name}
                      </Typography>
                      <Typography fontFamily="15px">
                        {address.house_no}
                      </Typography>
                      <Typography fontFamily="15px">
                        {address.street_name}
                      </Typography>
                      <Typography fontFamily="15px">
                        {address.landmark}
                      </Typography>
                      <Typography fontFamily="15px">
                        {address.city} - {address.postal_code}
                      </Typography>
                      <Typography fontFamily="15px">
                        Mobile: <b> {address.phone_no} </b>
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={0}
                        sx={{ marginTop: "8px !important" }}
                      >
                        <IconButton
                          aria-label="delete"
                          onClick={() => openAddressForm(address.uid, "update")}
                        >
                          <EditIcon sx={{ color: "#1976d2" }} />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => deleteAddress(address.uid)}
                        >
                          <DeleteIcon sx={{ color: "red" }} />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Card>
                </Grid>
              );
            })}

            <Grid item xs={12} md={6} height="280px">
              <Card
                variant="outlined"
                sx={{
                  p: 3,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <IconButton
                  size="large"
                  aria-label="add"
                  onClick={() => openAddressForm(null, "add")}
                >
                  <AddLocationRoundedIcon sx={{ fontSize: "3rem" }} />
                </IconButton>
                <Typography fontFamily="15px">Add New Address</Typography>
              </Card>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <>
            <Typography
              variant="subtitle1"
              mb={0}
              fontWeight={600}
              fontSize="16.5px"
              color="primary"
              mt={3}
            >
              Payment Options
            </Typography>
            <Typography
              variant="subtitle2"
              mb={2}
              fontSize="15px"
              color="text.secondary"
            >
              All transactions are secure and encrypted.
            </Typography>
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Stack direction="row" spacing={2} width="100%" overflow="hidden">
                  <PaymentIcon />
                  <Typography sx={{ flexShrink: 0, display: { xs: "none", md: "block" } }}>
                    Razorpay Secure (UPI, Cards, Wallets, NetBanking)
                  </Typography>
                  <Typography sx={{ flexShrink: 0, display: { xs: "block", md: "none" } }}>
                    Razorpay Secure
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack
                  direction="row"
                  justifyContent="start"
                  alignItems="center"
                  sx={{ px: { md: 5, xs: 2 } }}
                >
                  <FormControlLabel
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      ml: 0,
                    }}
                    control={
                      <Radio
                        // sx={{ position: "absolute", top: 10, right: 10 }}
                        checked={selectedPaymentMethod === "razorpay"}
                        onChange={() => handlePaymentMethodChange("razorpay")}
                        value="razorpay"
                        name="razorpay"
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: 26,
                          },
                        }}
                      // inputProps={{ "aria-label": "A" }}
                      />
                    }
                    label={
                      <Typography color="text.secondary" sx={{ mr: { md: "50px", xs: "10px" } }}>
                        After clicking “Pay now”, you will be redirected to
                        Razorpay Secure (UPI, Cards, Wallets, NetBanking) to
                        complete your purchase securely.
                      </Typography>
                    }
                    labelPlacement="start"
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Stack direction="row" spacing={2}>
                  <CurrencyRupeeIcon />
                  <Typography sx={{ flexShrink: 0 }}>
                    Cash on Delivery (COD)
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                {
                  isCartAvailableForCod ? <Stack
                    direction="row"
                    justifyContent="start"
                    alignItems="center"
                    px={5}
                    sx={{ px: { md: 5, xs: 2 } }}
                  >
                    <FormControlLabel
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        ml: 0,
                      }}
                      control={
                        <Radio
                          // sx={{ position: "absolute", top: 10, right: 10 }}
                          checked={selectedPaymentMethod === "cod"}
                          onChange={() => handlePaymentMethodChange("cod")}
                          value="cod"
                          name="cod"
                          sx={{
                            "& .MuiSvgIcon-root": {
                              fontSize: 26,
                            },
                          }}
                        // inputProps={{ "aria-label": "A" }}
                        />
                      }
                      label={
                        <Typography color="text.secondary" sx={{ mr: { md: "50px", xs: "10px" } }}>
                          Pay with Cash when your order is delivered.
                        </Typography>
                      }
                      labelPlacement="start"
                    />
                  </Stack> : <Typography color="text.secondary" sx={{ mr: { md: "50px", xs: "10px" } }}>COD not available on one of your cart item.</Typography>
                }

              </AccordionDetails>
            </Accordion>
          </>
        );
      default:
        return <div>Render default content</div>;
    }
  };

  const [animate, setAnimate] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // handeling order placing
  const handleOrderSubmit = async (isPaid) => {
    if (selectedPaymentMethod == "") {
      setOpenSnackbar(true);
    } else {
      // preparing order data
      const currentDate = new Date();
      const orderData = {
        paymentMethod: selectedPaymentMethod,
        shippingPrice: shippingCost,
        totalPrice: totalSellingCost,
        shippingAddress: selectedAddress,
        couponApplied: cartData.coupon ? cartData.coupon.uid : "",
        couponDicount: couponDiscount,
        isPaid: isPaid,
        paidAt: isPaid ? currentDate.toISOString() : null,
        orderItems: cartItemsData,
      };
      const res = await placeOrder({ access_token, orderData });
      if (res.error) {
        console.log(res.error);
      }
      if (res.data) {
        console.log(res.data);

        dispatch(incrementStateCount()); //changing state to refetch products in slider
        for (let i = 0; i < cartItemsData.length; i++) {
          let updatedStock =
            cartItemsData[i].size_variant.stock - cartItemsData[i].quantity;

          const updatedProductData = {
            stock: updatedStock,
          };
          const uid = cartItemsData[i].size_variant.uid;

          // updating product stock
          const res = await updateProduct({ uid, updatedProductData });
          if (res.error) {
            // console.log(res.error)
          }
          if (res.data) {
            // console.log(res.data)
          }
        }
        navigate(`/order-success/${res.data.uid}`);
        const delRes = await deleteAllItems(access_token);
        if (delRes.error) {
          // console.log(delRes.error);
        }
        if (delRes.data) {
          removeCoupon();
          dispatch(fetchCartData());
        }
        dispatch(fetchCartData());
      }
    }
  };


  useEffect(() => {
    if (isOrderLoading) {
      if (!animate) {
        setAnimate(true);
        setTimeout(() => {
          setAnimate(false);
        }, 9000);
      }
    }
  }, [isOrderLoading])

  const completePayment = (
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature
  ) => {
    axios
      .post("https://apardeepsingh.pythonanywhere.com/api/user/razorpay-order-complete/", {
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        signature: razorpay_signature,
        amount: parseInt(totalSellingCost),
      })
      .then((response) => {
        console.log(response.data);

        handleOrderSubmit(true);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const razorpayPayment = () => {
    setIsRazorPayLoading(true)

    axios
      .post("https://apardeepsingh.pythonanywhere.com/api/user/razorpay-order/", {
        amount: parseInt(totalSellingCost),
        currency: "INR",
      })
      .then(function (response) {
        console.log(response.data.data);
        const order_id = response.data.data.id;

        const options = {
          key: "rzp_test_88W0ADbeNBHPC8",
          name: "Geek Shop",
          description: "Test Transaction",
          image: "",
          order_id: order_id,
          handler: function (response) {
            completePayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );
          },
          prefill: {
            name: userData.name,
            email: userData.email,
            contact: userData.mobile,
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#2B3947",
          },
        };

        const rzp1 = new Razorpay(options);

        rzp1.on("payment.failed", function (response) {
          // alert(response.error.code);
          // alert(response.error.description);
          // alert(response.error.source);
          // alert(response.error.step);
          // alert(response.error.reason);
          // alert(response.error.metadata.order_id);
          // alert(response.error.metadata.payment_id);
        });

        rzp1.open();
        setIsRazorPayLoading(false)
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {isAddressesLoading ? (
        <PreLoader />
      ) : (
        <ThemeProvider theme={theme}>
          <Box bgcolor="#F9F9F9" textAlign="center" py={4}>
            <Box sx={{ width: { xs: "90%", md: "70%" } }} margin="0 auto">
              <Stepper alternativeLabel activeStep={activeStep}>
                {steps.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};

                  return (
                    <Step
                      className="mystepper"
                      sx={{ fontSize: "14px !important" }}
                      key={label}
                      {...stepProps}
                    >
                      <StepLabel
                        sx={{ fontSize: "14px !important" }}
                        {...labelProps}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </Box>
          </Box>
          <Box py={5} component="div" bgcolor="#ECECEC">
            {cartItemsData.length > 0 > 0 ? (
              <>
                <Grid container justifyContent="center" alignItems="center">
                  <Grid
                    item
                    xs={11.5}
                    md={7}
                    display="flex"
                    alignItems="center"
                  >
                    {activeStep == 0 ? (
                      <>
                        <SellOutlinedIcon color="primary" />
                        <Typography variant="subtitle1" ml={0.5}>
                          Your cart contains {cartCount} items
                        </Typography>
                      </>
                    ) : null}
                    {activeStep == 1 ? (
                      <>
                        <LocalShippingIcon color="primary" />
                        <Typography variant="subtitle1" ml={0.5}>
                          Delivery To
                        </Typography>
                      </>
                    ) : null}
                    {activeStep == 2 ? (
                      <>
                        <Box border="1px solid #00000021" sx={{ width: { md: "94%", xs: "100%" } }} p={1}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box>
                              <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                color="primary"
                                fontSize="15px"
                              >
                                Delivery To: {selectedAddressData.first_name}
                                {selectedAddressData.last_name},
                                {selectedAddressData.postal_code}
                              </Typography>
                              <Typography variant="subtitle2" fontSize="12px">
                                {selectedAddressData.house_no},
                                {selectedAddressData.street_name},
                                {selectedAddressData.city}
                              </Typography>
                            </Box>
                            <Button
                              sx={{ fontWeight: 600 }}
                              onClick={() => setActiveStep(1)}
                            >
                              Change
                            </Button>
                          </Stack>
                        </Box>
                      </>
                    ) : null}
                  </Grid>
                  <Grid
                    item
                    xs={11}
                    md={4}
                    sx={{ display: { xs: "none", md: "block" } }}
                  >
                    <Paper sx={{ px: 2, py: 3 }}>
                      <Typography
                        variant="h2"
                        fontSize={16}
                        textTransform="uppercase"
                        color="#0000007d"
                        fontWeight={600}
                      >
                        Coupons
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={0}
                        justifyContent="space-between"
                        alignItems="center"
                        mt={2}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <LocalOfferOutlinedIcon sx={{ fontWeight: 100 }} />
                          {isCouponApplied ? (
                            <Stack>
                              <Typography
                                fontSize={14}
                                color="primary"
                                fontWeight={600}
                                textTransform="uppercase"
                              >
                                {" "}
                                {couponApplied.coupon_code} Applied
                              </Typography>
                              <Typography fontSize={12} color="#4caf50">
                                You saved additional ₹{couponDiscount}
                              </Typography>
                            </Stack>
                          ) : (
                            <Typography fontSize={14} fontWeight={600}>
                              {" "}
                              Apply Coupons
                            </Typography>
                          )}
                        </Stack>
                        {isCouponApplied ? (
                          // <Button
                          //   variant="outlined"
                          //   sx={{
                          //     borderRadius: "0px",
                          //     width: "30% !important",
                          //     fontWeight: 600,
                          //   }}
                          //   disableElevation
                          //   color="primary"
                          //   onClick={removeCoupon}
                          // >
                          //   Remove
                          // </Button>
                          <LoadingButton
                            sx={{
                              borderRadius: "0px",
                              width: "30% !important",
                              fontWeight: 600,
                            }}
                            disableElevation
                            color="primary"
                            onClick={removeCoupon}
                            loading={isApplyCouponLoading}
                            variant="outlined"
                          >
                            <span>Remove</span>
                          </LoadingButton>
                        ) : (
                          <Button
                            variant="outlined"
                            sx={{
                              borderRadius: "0px",
                              width: "30% !important",
                              fontWeight: 600,
                            }}
                            disableElevation
                            color="primary"
                            onClick={() => setIsOpenCoupons(true)}
                          >
                            Apply
                          </Button>
                        )}
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
                <Grid
                  container
                  justifyContent="center"
                  alignItems="start"
                  sx={{ mt: { xs: "10px", md: 0 } }}
                >
                  <Grid
                    item
                    xs={11.5}
                    md={7}
                    sx={{ paddingRight: { md: "20px", lg: "50px" } }}
                  >
                    {renderContent()}
                  </Grid>
                  <Grid
                    item
                    xs={11.5}
                    md={4}
                    sx={{ display: { xs: "block", md: "none" }, mt: "20px" }}
                  >
                    <Paper sx={{ px: 2, py: 3 }}>
                      <Typography
                        variant="h2"
                        fontSize={16}
                        textTransform="uppercase"
                        color="#0000007d"
                        fontWeight={600}
                      >
                        Coupons
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={0}
                        justifyContent="space-between"
                        alignItems="center"
                        mt={2}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <LocalOfferOutlinedIcon sx={{ fontWeight: 100 }} />
                          {isCouponApplied ? (
                            <Stack>
                              <Typography
                                fontSize={14}
                                color="primary"
                                fontWeight={600}
                                textTransform="uppercase"
                              >
                                {" "}
                                {couponApplied.coupon_code} Applied
                              </Typography>
                              <Typography fontSize={12} color="#4caf50">
                                You saved additional ₹{couponDiscount}
                              </Typography>
                            </Stack>
                          ) : (
                            <Typography fontSize={14} fontWeight={600}>
                              {" "}
                              Apply Coupons
                            </Typography>
                          )}
                        </Stack>
                        {isCouponApplied ? (
                          <LoadingButton
                            sx={{
                              borderRadius: "0px",
                              width: "30% !important",
                              fontWeight: 600,
                            }}
                            disableElevation
                            color="primary"
                            onClick={removeCoupon}
                            loading={isApplyCouponLoading}
                            variant="outlined"
                          >
                            <span>Remove</span>
                          </LoadingButton>

                        ) : (
                          <Button
                            variant="outlined"
                            sx={{
                              borderRadius: "0px",
                              width: "30% !important",
                              fontWeight: 600,
                            }}
                            disableElevation
                            color="primary"
                            onClick={() => setIsOpenCoupons(true)}
                          >
                            Apply
                          </Button>
                        )}
                      </Stack>
                    </Paper>
                  </Grid>
                  <Grid item xs={11.5} md={4}>
                    <Card sx={{ mt: "20px" }}>
                      <Box className="recieptTitle" py={2} px={2}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Billing Details
                        </Typography>
                      </Box>
                      <Stack spacing={2} px={3}>
                        <Box
                          component="span"
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography sx={{ color: "#4a4a4a" }} fontSize="16px">
                            Total MRP (Incl. of taxes)
                          </Typography>
                          <Typography sx={{ color: "#4a4a4a" }} fontSize="16px">
                            ₹{totalMRPCost}
                          </Typography>
                        </Box>
                        <Box
                          component="span"
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography sx={{ color: "#4a4a4a" }} fontSize="16px">
                            Shipping Charges
                          </Typography>
                          <Typography sx={{ color: "#4a4a4a" }} fontSize="16px">
                            ₹{shippingCost}
                          </Typography>
                        </Box>
                        <Box
                          component="span"
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography sx={{ color: "#4a4a4a" }} fontSize="16px">
                            Product Discount(s)
                          </Typography>
                          <Typography sx={{ color: "#4a4a4a" }} fontSize="16px">
                            - ₹{totalMRPCost - subTotal + shippingCost}
                          </Typography>
                        </Box>
                        <Box
                          component="span"
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography
                            sx={{ color: "#4a4a4a" }}
                            fontSize="16px"
                            fontWeight={600}
                          >
                            Subtotal
                          </Typography>
                          <Typography
                            sx={{ color: "#4a4a4a" }}
                            fontSize="16px"
                            fontWeight={600}
                          >
                            ₹{subTotal}
                          </Typography>
                        </Box>
                        <Box
                          component="span"
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography sx={{ color: "#4a4a4a" }} fontSize="16px">
                            Coupon Discount
                          </Typography>
                          <Typography sx={{ color: "#4a4a4a" }} fontSize="16px">
                            - ₹{couponDiscount}
                          </Typography>
                        </Box>
                      </Stack>
                      <Divider sx={{ mt: "36px" }} />
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        px={3}
                        py={5}
                      >
                        <Box>
                          <Typography fontSize="21px" fontWeight={600}>
                            Total
                          </Typography>
                          <Typography fontSize="21px" fontWeight={500}>
                            ₹{totalSellingCost}
                          </Typography>
                        </Box>

                        {activeStep == 0 ? (
                          isAllProductsAvailabe ? (
                            <Button
                              startIcon={<ShoppingCartCheckoutOutlinedIcon />}
                              disableElevation
                              sx={{
                                width: "60%",
                                py: "12px",
                                letterSpacing: "1px",
                                fontWeight: 500,
                                height: "63px",
                              }}
                              size="large"
                              variant="contained"
                              disabled={cartItemsData.length > 0 ? false : true}
                              onClick={() => setActiveStep(1)}
                            >
                              Checkout
                            </Button>
                          ) : (
                            <Button
                              startIcon={<RemoveShoppingCartIcon />}
                              disableElevation
                              sx={{
                                width: "60%",
                                py: "12px",
                                letterSpacing: "1px",
                                fontWeight: 500,
                                height: "63px",
                              }}
                              size="large"
                              variant="contained"
                              disabled
                            >
                              Out of Stock
                            </Button>
                          )
                        ) : null}
                        {activeStep == 1 ? (
                          <Button
                            startIcon={
                              selectedAddress == "" ? (
                                <LocationOnRoundedIcon />
                              ) : (
                                <PaymentsIcon />
                              )
                            }
                            disableElevation
                            sx={{
                              width: { xs: "70%", md: "60%" },
                              py: "12px",
                              letterSpacing: "1px",
                              fontWeight: 500,
                              fontSize: "14px",
                              height: "63px",
                            }}
                            size="large"
                            variant="contained"
                            disabled={selectedAddress == "" ? true : false}
                            onClick={() => setActiveStep(2)}
                          >
                            {selectedAddress == ""
                              ? "Please Add Address"
                              : "continue to payment"}
                          </Button>
                        ) : null}
                        {activeStep == 2 ? (
                          selectedPaymentMethod == "razorpay" ? (
                            <>

                              {/* <Button
                                startIcon={<AccountBalanceWalletIcon />}
                                disableElevation
                                sx={{
                                  width: "60%",
                                  py: "12px",
                                  letterSpacing: "1px",
                                  fontWeight: 500,
                                  fontSize: "15px",
                                  height: "63px",
                                }}
                                size="large"
                                variant="contained"
                                onClick={razorpayPayment}
                              >
                                Pay Now
                              </Button> */}
                              <button
                                className={`order ${animate ? "animate" : ""}`}
                                onClick={razorpayPayment}
                              >
                                {
                                  isRazorPayLoading ? <Box width='100%' height='100%' display='flex' justifyContent='center' alignItems='center'> <CircularProgress sx={{ position: "static !important" }} /> </Box> : (
                                    <span
                                      className="default"
                                      style={{ textTransform: "uppercase" }}
                                    >

                                      Pay Now

                                    </span>
                                  )
                                }

                                <span
                                  className="success"
                                  style={{ textTransform: "uppercase" }}
                                >
                                  Order Placed
                                </span>
                                <div className="box"></div>
                                <div className="truck">
                                  <div className="back"></div>
                                  <div className="front">
                                    <div className="window"></div>
                                  </div>
                                  <div className="light top"></div>
                                  <div className="light bottom"></div>
                                </div>
                                <div className="lines"></div>
                              </button>

                            </>
                          ) : (
                            <button
                              className={`order ${animate ? "animate" : ""}`}
                              onClick={() => handleOrderSubmit(false)}
                            >
                              <span
                                className="default"
                                style={{ textTransform: "uppercase" }}
                              >
                                Place Order
                              </span>
                              <span
                                className="success"
                                style={{ textTransform: "uppercase" }}
                              >
                                Order Placed
                              </span>
                              <div className="box"></div>
                              <div className="truck">
                                <div className="back"></div>
                                <div className="front">
                                  <div className="window"></div>
                                </div>
                                <div className="light top"></div>
                                <div className="light bottom"></div>
                              </div>
                              <div className="lines"></div>
                            </button>
                          )
                        ) : null}
                      </Stack>
                    </Card>
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  py={8}
                >
                  <Grid item md={8}>
                    <Stack
                      spacing={4}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <img
                        src="images/empltyCart.png"
                        width="50%"
                        alt="empty cart"
                      />
                      <Typography
                        variant="h4"
                        textAlign="center"
                        color="text.secondary"
                        sx={{ display: { xs: "none", lg: "block" } }}
                      >
                        Oops! No Product in your Cart
                      </Typography>
                      <Typography
                        variant="h5"
                        textAlign="center"
                        color="text.secondary"
                        sx={{ display: { xs: "black", lg: "none" } }}
                      >
                        Oops! No Product in your Cart
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>

          {/* dialog box for add address  */}
          <Dialog
            fullScreen={fullScreen}
            open={isOpenAddressForm}
            aria-labelledby="responsive-dialog-title"
            fullWidth
            sx={{ backdropFilter: "blur(2px)" }}
          >
            <DialogTitle
              fontSize={22}
              textTransform="none"
              fontWeight={700}
              textAlign="center"
              letterSpacing={0}
              id="alert-dialog-title"
            >
              {formType == "add" ? "Add New Address" : "Update Address"}
            </DialogTitle>
            <DialogContent>
              <AddAddress
                uid={openFormId}
                formType={formType}
                closeModal={closeAddressDialog}
                setChangeState={setChangeState}
              />
            </DialogContent>
            <DialogActions>
              <IconButton
                aria-label="delete"
                sx={{ position: "absolute", top: 10, right: 10 }}
                onClick={closeAddressDialog}
              >
                <CancelRoundedIcon sx={{ fontSize: "28px" }} />
              </IconButton>
            </DialogActions>
          </Dialog>

          {/* dialog box for coupon */}
          <Dialog
            // fullScreen={fullScreen}
            open={isOpenCoupons}
            onClose={() => setIsOpenCoupons(false)}
            aria-labelledby="responsive-dialog-title"
            fullWidth
            maxWidth="xs"
            sx={{ backdropFilter: "blur(2px)" }}
          >
            <DialogTitle
              fontSize={19}
              textTransform="uppercase"
              fontWeight={700}
              textAlign="left"
              letterSpacing={0}
              mt={1}
              id="alert-dialog-title"
            >
              Apply Coupon
            </DialogTitle>
            <Divider my={2} />
            <DialogContent sx={{ px: 0 }}>
              <Coupon
                totalSellingCost={totalSellingCost}
                setTotalSellingCost={setTotalSellingCost}
                setIsOpenCoupons={setIsOpenCoupons}
                setIsCouponApplied={setIsCouponApplied}
                setCouponDiscount={setCouponDiscount}
                setCouponApplied={setCouponApplied}
                isCouponApplied={isCouponApplied}
              />
            </DialogContent>
            <DialogActions>
              <IconButton
                aria-label="delete"
                sx={{ position: "absolute", top: 10, right: 10 }}
                onClick={() => setIsOpenCoupons(false)}
              >
                <CancelRoundedIcon sx={{ fontSize: "28px" }} />
              </IconButton>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          // message="Please Select Payment Method!"
          >
            <Alert severity="error" variant="filled">
              Please Select Payment Method!
            </Alert>
          </Snackbar>
        </ThemeProvider>
      )}
    </motion.div>
  );
};

export default Cart;
