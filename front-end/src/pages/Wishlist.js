import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Collapse,
  Grid,
  IconButton,
  Rating,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getToken,
  getUserWishlistMapping,
  storeUserWishlistMapping,
} from "../services/localStorageServices";
import { v4 as uuidv4 } from "uuid";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllProductsQuery } from "../services/productsApi";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useAddToCartMutation } from "../services/userAuthApi";
import { fetchCartData } from "../features/cartSlice";
import { motion } from 'framer-motion'
import React from 'react';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import StarIcon from '@mui/icons-material/Star';

const Wishlist = () => {
  const [allWishlistProducts, setAllWishlistProducts] = useState([]);
  const userWishlistMapping = getUserWishlistMapping();
  const loggedinUser = useSelector((state) => state.user);
  const { data, isLoading, isSuccess } = useGetAllProductsQuery();
  const [allProducts, setAllProducts] = useState([]);
  const [isRemoved, setIsRemoved] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    if (isLoading) {
      // console.log("Loading...");
    } else {
      setAllProducts(data);
    }
  }, [data, isLoading]);

  useEffect(() => {
    // getting loggedin user products
    const userProductIds = userWishlistMapping[loggedinUser.email];

    let filteredProducts = [];
    if (userProductIds) {
      filteredProducts = allProducts.filter((product) =>
        userProductIds.includes(product.uid)
      );
    }
    setAllWishlistProducts(filteredProducts);
  }, [loggedinUser, allProducts, isRemoved]);

  const removeFromWishlist = (productId) => {
    const userMappedProducts = userWishlistMapping[loggedinUser.email];
    const updatedUserMappedArray = userMappedProducts.filter(
      (pId) => pId != productId
    );

    userWishlistMapping[loggedinUser.email] = updatedUserMappedArray;
    storeUserWishlistMapping(userWishlistMapping);

    setIsRemoved(isRemoved + 1);
  };

  // handeling add to cart
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeAlert, setSizeAlert] = useState(false);
  const [serverError, setServerError] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  // Add a new state variable to keep track of open dialogs
  const [openDialogs, setOpenDialogs] = useState({});
  const { access_token } = getToken();
  const [
    addToCart,
    { isLoading: isAddToCartLoading, isSuccess: isAddToCartSuccess },
  ] = useAddToCartMutation();

  useEffect(() => {
    if (!access_token) {
      setIsLoggedIn(false);
    }
  }, [access_token]);

  // Function to handle opening and closing of a specific dialog
  const handleDialogOpen = (productId) => {
    setOpenDialogs((prevState) => ({
      ...prevState,
      [productId]: true,
    }));
  };

  const handleDialogClose = (productId) => {
    setOpenDialogs((prevState) => ({
      ...prevState,
      [productId]: false,
    }));
  };

  const handleAddToCartClick = async (produtId) => {
    if (selectedSize == null) {
      setSizeAlert(true);
    } else {
      const actualData = {
        quantity: 1,
        size_variant: selectedSize,
      };

      const slug = produtId;
      const res = await addToCart({ actualData, access_token, slug });
      if (res.error) {
        setServerError(res.error.data.errors);
      }
      if (res.data) {
        dispatch(fetchCartData());

        removeFromWishlist(produtId);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <ThemeProvider theme={theme}>
        <Box bgcolor="#F9F9F9" textAlign="center" py={3}>
          <Typography variant="h1" fontSize={32} fontWeight={600}>
            My Wishlist
          </Typography>
        </Box>
        <Grid container justifyContent="center" alignItems="center" py={5}>
          <Grid item xs={12} md={11}>
            <Grid
              container
              justifyContent={
                allWishlistProducts.length > 0 ? "flex-start" : "center"
              }
            >
              {allWishlistProducts.length > 0 ? (
                allWishlistProducts.map((product) => {
                  const backendBaseUrl = "http://127.0.0.1:8000";
                  const cardThumbUrl = `${backendBaseUrl}${product.card_thumb_image}`;

                  const disocuntPercentage = parseInt(
                    ((product.maximum_retail_price - product.price) /
                      product.maximum_retail_price) *
                    100
                  );

                  const uniqueId = uuidv4();

                  return (
                    <Grid item xs={6} sm={6} md={3} key={product.uid}>
                      <Card
                        sx={{
                          mx: "5px !important",
                          borderRadius: "0px",
                          margin: { xs: "0 0", md: "0 12px !important" },
                          transition: "all 0.3s",
                          boxShadow: "none",
                          "&:hover .productImg": { transform: "scale(1.1)" },
                          "&:hover .productCardImageOverlay:before": {
                            opacity: 0.3,
                          },
                          "&:hover .addToCartIcon": { right: 0 },
                          "&:hover .addToWishlistIcon": { right: 0 },
                          "&:hover .btnOverlay": {
                            opacity: 1,
                            visibility: "visible",
                          },
                        }}
                      >
                        <Box
                          component="div"
                          sx={{ overflow: "hidden", position: "relative", mb: 2 }}
                        >
                          <Box bgcolor="lavenderblush" zIndex={1}>
                            <CardActionArea
                              component={NavLink}
                              to={`/singleproduct/${product.slug}`}
                            >
                              <Box
                                overflow="hidden"
                                className="productCardImageOverlay"
                                sx={{
                                  transition: "all 0.3s",
                                  position: "relative",
                                  "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    transition: "all 0.3s",
                                    height: "100%",
                                    backgroundImage:
                                      "linear-gradient(to left, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))",
                                    opacity: 0,
                                    zIndex: 2,
                                  },
                                }}
                              >
                                <CardMedia
                                  className="productImg"
                                  component="img"
                                  sx={{
                                    margin: "0 auto",
                                    bgcolor: "#E3E9EF",
                                    transition: "all 0.3s",
                                  }}
                                  image={cardThumbUrl}
                                  alt="green iguana"
                                />
                              </Box>
                              <Box
                                sx={{
                                  position: "absolute",
                                  bottom: 0,
                                  bgcolor: "#ffffff7a",
                                  backdropFilter: "blur(8px)",
                                  px: 1,
                                  py: "0px !important",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: 'center'
                                }}
                                className="btnOverlay">
                                <Typography sx={{ fontSize: { xs: "10px", md: "12px !important" } }} color="#2B3947" variant="subtitle1">{product.overall_rating}</Typography>
                                <StarIcon sx={{ ml: 0.2, fontSize: { xs: "12px", md: "14px !important" }, color: "#2B3947" }} />
                              </Box>
                            </CardActionArea>
                            <IconButton
                              onClick={() => removeFromWishlist(product.uid)}
                              color="primary"
                              aria-label="add to shopping cart"
                              sx={{ position: "absolute", top: 0, right: 0, zIndex: 99 }}
                            >
                              <CancelTwoToneIcon sx={{ fontSize: { xs: "18px", md: "24px !important" } }} />
                            </IconButton>
                          </Box>
                          <CardContent sx={{ border: "1px solid #2b394717", borderTop: "none", borderBottom: "none", textAlign: { md: "center", xs: "start" }, p: { xs: "8px", md: "16px" } }}>
                            <Typography
                              gutterBottom
                              variant="subtitle2"
                              sx={{ fontSize: { xs: 10, md: 12 } }}
                              color="#4f5362"
                              lineHeight="1.5"
                              component="div"
                              mb={0}
                            >
                              {product.brand_name}
                            </Typography>
                            <Typography
                              gutterBottom
                              variant="subtitle1"
                              sx={{
                                fontSize: { xs: 12, md: 14 },
                                mt: { xs: 0.8, md: 0 },
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '100%',
                              }}
                              fontWeight={700}
                              component="div"
                            >
                              {product.product_name}
                            </Typography>
                            <Stack
                              spacing={0.5}
                              direction="row"
                              sx={{ justifyContent: { md: "center", xs: "start" } }}
                              alignItems="center"
                            >
                              <Typography
                                gutterBottom
                                sx={{ fontSize: { xs: 12, md: 16 } }}
                                lineHeight="1.5"
                                my={0}
                                py="4px"
                                variant="h4"
                                fontWeight={800}
                                component="h4"
                                id="salePrice"
                              >
                                ₹{product.price}
                              </Typography>
                              {
                                disocuntPercentage > 0 ? (
                                  <>
                                    <Typography
                                      gutterBottom
                                      lineHeight="1.5"
                                      my={0}
                                      py="4px"
                                      variant="h4"
                                      fontWeight={200}
                                      component="h4"
                                      id="regularPrice"
                                      sx={{
                                        textDecoration: "line-through",
                                        color: "#000000cf",
                                        textDecorationColor: "#000000cf",
                                        fontSize: { xs: 10, md: 14 }
                                      }}
                                    >
                                      ₹{product.maximum_retail_price}
                                    </Typography>
                                    <Typography
                                      gutterBottom
                                      sx={{ fontSize: { xs: 10, md: 14 } }}
                                      lineHeight="1.5"
                                      my={0}
                                      py="4px"
                                      variant="h4"
                                      fontWeight={200}
                                      component="h4"
                                      id="discountPercent"
                                      color="#00b852 !important"
                                    >
                                      ({disocuntPercentage}% off)
                                    </Typography>
                                  </>
                                ) : null
                              }
                            </Stack>
                          </CardContent>
                          <Stack>
                            <Button variant="outlined"
                              sx={{
                                fontSize: { md: 12, xs: 10 },
                                borderRadius: 0,
                                border: "1px solid #2b394717",
                                "&:hover": { border: "1px solid #2b394717 !important" }
                              }}
                              onClick={() => handleDialogOpen(product.uid)}
                              startIcon={<AddShoppingCartIcon sx={{ fontSize: { md: "16px !important", xs: "14px !important" } }} />}>
                              Add to Cart
                            </Button>
                          </Stack>
                        </Box>
                      </Card>

                      <Dialog
                        open={openDialogs[product.uid] || false}
                        onClose={() => handleDialogClose(product.uid)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          Select Size
                        </DialogTitle>
                        <DialogContent>
                          <Stack spacing={1.3}>
                            <ToggleButtonGroup
                              value={selectedSize}
                              exclusive
                              onChange={(event, newSize) =>
                                setSelectedSize(newSize)
                              }
                              sx={{ gap: 2, flexWrap: "wrap" }}
                            >
                              {product.size_variant.map((size) => {
                                return (
                                  <ToggleButton
                                    key={size.uid}
                                    disabled={size.stock < 1 ? true : false}
                                    sx={{
                                      border: "1px solid black !important",
                                      borderRadius: "5px !important",
                                      color: "black",
                                      width: { xs: "21%", md: "50px" },
                                      marginBottom: { xs: 1, md: 0 },
                                    }}
                                    value={size.uid}
                                  >
                                    {size.size_name}
                                  </ToggleButton>
                                );
                              })}
                            </ToggleButtonGroup>
                            <Collapse in={sizeAlert}>
                              <Alert severity="warning" sx={{ mb: 2 }}>
                                Please Select a Size!
                              </Alert>
                            </Collapse>
                          </Stack>
                        </DialogContent>
                        <DialogActions>
                          {isLoggedIn ? (
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={() => handleAddToCartClick(product.uid)}
                              autoFocus
                            >
                              Continue
                            </Button>
                          ) : (
                            <Button
                              component={NavLink}
                              to={"/login"}
                              variant="contained"
                              fullWidth
                              autoFocus
                            >
                              Login
                            </Button>
                          )}
                        </DialogActions>
                      </Dialog>
                    </Grid>
                  );
                })
              ) : (
                <Stack justifyContent="center" alignItems="center" spacing={1}>
                  <img src="images/empltyWishlist.png" alt="empltyWishlist" />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Hey! Your wishlist is empty.
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" px={0}>
                    Save your favourites here and make them yours soon!
                  </Typography>
                </Stack>
              )}
            </Grid>
          </Grid>
        </Grid>
      </ThemeProvider>
    </motion.div>
  );
};

export default Wishlist;
