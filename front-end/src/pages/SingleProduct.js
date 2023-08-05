import {
  // Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Pagination,
  Rating,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Carousel from "react-gallery-carousel";
import "react-gallery-carousel/dist/index.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { useDebugValue, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SwapHorizontalCircleOutlinedIcon from "@mui/icons-material/SwapHorizontalCircleOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SubjectOutlinedIcon from "@mui/icons-material/SubjectOutlined";
import { styled } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faL, faShirt } from "@fortawesome/free-solid-svg-icons";
import "../css/catBtn.css";
import { NavLink, useParams } from "react-router-dom";
import {
  useAddReviewMutation,
  useGetSingleProductsQuery,
} from "../services/productsApi";
import FadeLoader from "react-spinners/FadeLoader";
import { useAddToCartMutation } from "../services/userAuthApi";
import {
  getToken,
  getUserWishlistMapping,
  storeUserWishlistMapping,
} from "../services/localStorageServices";
import Fade from "@mui/material/Fade";
import Slide from "@mui/material/Slide";
import Grow from "@mui/material/Grow";
import { useSelector, useDispatch } from "react-redux";
import { fetchCartData } from "../features/cartSlice";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import axios from "axios";
import { motion } from "framer-motion";
import ProductReviewFrom from "./ProductReviewFrom";
import React from 'react';
import SanitizedHtml from "../components/SanitizedHtml";

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

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}

// main component is starting here
const SingleProduct = () => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddToCart, setIsAddToCart] = useState(false);
  const { slug } = useParams();
  // const { data, isLoading, isSuccess } = useGetSingleProductsQuery(slug);
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState({});
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productSpecification, setProductSpecifications] = useState([]);
  const [sizeVariants, setSizeVariants] = useState([]);
  const [productPrice, setProductPrice] = useState();
  const [stockValue, setstockValue] = useState(100);
  const [sizeAlert, setSizeAlert] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const [totalReviews, setTotalReviews] = useState(0);
  const [displayReviews, setDisplayReviews] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [openReviewForm, setopenReviewForm] = useState(false);

  const userWishlistMapping = getUserWishlistMapping();
  const loggedinUser = useSelector((state) => state.user);

  const [
    addToCart,
    { isLoading: isAddToCartLoading, isSuccess: isAddToCartSuccess },
  ] = useAddToCartMutation();
  const { access_token } = getToken();
  const [serverError, setServerError] = useState({});

  const cartdatastate = useSelector((state) => state.cart);
  const refetchProducts = useSelector((state) => state.stateRefetchProducts);
  const [newReviewChangeState, setnewReviewChangeState] = useState(0);

  // fetching product data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/product/${slug}`
        );
        setProductData(response.data);
      } catch (error) {
        console.error("Error occurred while fetching data:", error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [refetchProducts, newReviewChangeState]);

  // for checking is product is already wishlisted
  const [isAlreadyWishlisted, setIsAlreadyWishlisted] = useState(false);
  useEffect(() => {
    const userProductIds = userWishlistMapping[loggedinUser.email];

    let isProductInWishlist = false;
    if (userProductIds) {
      isProductInWishlist = userProductIds.includes(productData.uid);
    }

    setIsAlreadyWishlisted(isProductInWishlist);
  }, [productData]);

  useEffect(() => {
    if (productData.maximum_retail_price) {
      const discount = parseInt(
        ((productData.maximum_retail_price - productData.price) /
          productData.maximum_retail_price) *
        100
      );
      setDisocuntPercentage(discount);
    }
  }, [productData]);
  const [disocuntPercentage, setDisocuntPercentage] = useState(0);

  // useEffect(() => {
  //   if (isLoading) {
  //     // console.log("Loading...");
  //   } else {
  //     setProductData(data);
  //   }
  // }, [data, isLoading]);

  useEffect(() => {
    if (productData.product_images !== undefined) {
      const baseUrl = "http://127.0.0.1:8000";

      const data = productData.product_images;

      const productImages = data.map((item) => ({
        src: baseUrl + item.image,
      }));

      setImages(productImages);
    }

    setProductPrice(productData.price);
  }, [productData]);

  useEffect(() => {
    if (productData && !isLoading) {
      if (productData.product_specifications) {
        const specifications = productData.product_specifications.split("|");
        setProductSpecifications(specifications);
      }
    }
  }, [productData]);

  useEffect(() => {
    if (productData && !isLoading) {
      if (productData.product_reviews) {
        setTotalReviews(productData.product_reviews.length);

        const diplayRev = [...productData.product_reviews].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setDisplayReviews(diplayRev);
      }
    }
  }, [productData]);

  useEffect(() => {
    if (productData && !isLoading) {
      if (productData.size_variant) {
        setSizeVariants(productData.size_variant);

        // setstockValue(productData.stock);
      }
    }
  }, [productData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  // for updating the price with size
  useEffect(() => {
    const originalPrice = productData.price;

    if (selectedSize == null) {
      setProductPrice(originalPrice);
      setDisocuntPercentage(
        parseInt(
          ((productData.maximum_retail_price - originalPrice) /
            productData.maximum_retail_price) *
          100
        )
      );

      setstockValue(100);
    } else if (productData.size_variant) {
      productData.size_variant.map((sizeVariant) => {
        if (sizeVariant.uid == selectedSize) {
          setProductPrice(originalPrice + sizeVariant.price);

          setDisocuntPercentage(
            parseInt(
              ((productData.maximum_retail_price -
                (originalPrice + sizeVariant.price)) /
                productData.maximum_retail_price) *
              100
            )
          );
          setstockValue(sizeVariant.stock);
        }
      });

      setSizeAlert(false);
    }

    setQuantity(1);
  }, [selectedSize]);

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (selectedSize == null) {
      setSizeAlert(true);
    } else {
      setQuantity(quantity + 1);
    }
  };

  // handeling wishlist actions
  const removeFromWishlist = (productId) => {
    // const updatedWishlist = wishlistProducts.filter(
    //   (product) => product.uid !== productId
    // );
    // setWishlistProducts(updatedWishlist);
    // storeWishlistItems(updatedWishlist);

    // updating userMapped object
    const userMappedProducts = userWishlistMapping[loggedinUser.email];
    const updatedUserMappedArray = userMappedProducts.filter(
      (pId) => pId != productId
    );

    userWishlistMapping[loggedinUser.email] = updatedUserMappedArray;
    storeUserWishlistMapping(userWishlistMapping);
  };

  const handleWishlistClick = (event) => {
    const checked = event.target.checked;

    if (checked) {
      // const updatedWishlist = [...wishlistProducts, productData];
      // setWishlistProducts(updatedWishlist);
      // storeWishlistItems(updatedWishlist);

      // add productId with user email for mapping
      if (!userWishlistMapping[loggedinUser.email]) {
        userWishlistMapping[loggedinUser.email] = [productData.uid];
        storeUserWishlistMapping(userWishlistMapping);
      } else {
        userWishlistMapping[loggedinUser.email].push(productData.uid);
        storeUserWishlistMapping(userWishlistMapping);
      }

      // setIsWishlisted(true);
    } else {
      removeFromWishlist(productData.uid);
      // setIsWishlisted(false);
    }

    setIsAlreadyWishlisted(checked);
  };

  // for snackbar
  const [open, setOpen] = useState(false);
  const [transition, setTransition] = useState(undefined);
  const [snackbarMsg, setsnackbarMsg] = useState();
  const [sbColor, setSbColor] = useState();

  const handleClick = (Transition, color, msg) => () => {
    setTransition(() => Transition);
    setOpen(true);
    setsnackbarMsg(msg);
    setSbColor(color);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddToCartClick = async () => {
    if (selectedSize == null) {
      setSizeAlert(true);
    } else {
      const actualData = {
        quantity: quantity,
        size_variant: selectedSize,
      };

      const slug = productData.uid;

      const res = await addToCart({ actualData, access_token, slug });
      if (res.error) {
        if (res.error.data.errors.code == "token_not_valid") {
          handleClick(
            TransitionLeft,
            "error",
            "Please login to your account!"
          )();
        }
        setServerError(res.error.data.errors);
      }
      if (res.data) {
        // console.log(res.data);
        setIsAddToCart(true);
        handleClick(TransitionLeft, "success", "Item is added to your cart")();

        dispatch(fetchCartData());
      }
    }
  };

  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  let Thumnailsize = 100 / images.length;
  if (Thumnailsize < 25) {
    Thumnailsize = "25%";
  } else {
    Thumnailsize = Thumnailsize + "%";
  }

  const closeReviewForm = () => {
    setopenReviewForm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {productData.res == undefined ? (
        <ThemeProvider theme={theme}>
          <Grid
            container
            spacing={0}
            justifyContent="center"
            // alignItems="center"
            sx={{ paddingTop: { md: "35px", xs: "0px" } }}
          >
            <Grid
              item
              xs={12}
              md={5}
              lg={5}
              sx={{ height: { md: "85vh", xs: "65vh" } }}
            >
              <Box
                className="galleryBox"
                sx={{
                  width: { xs: "100%", md: "94%", lg: "90%" },
                  height: "100%",
                  margin: "0 auto",
                  display: { xs: "none", md: "block" },
                }}
              >
                {isLoading ? (
                  <Skeleton
                    variant="rectangle"
                    width="100%"
                    height="100%"
                    animation="wave"
                  />
                ) : (
                  <>
                    <Carousel
                      images={images}
                      isAutoPlaying={true}
                      autoPlayInterval={10000}
                      style={{ background: "white" }}
                      hasMediaButton={false}
                      hasIndexBoard={false}
                      hasSizeButton="bottomRight"
                      shouldMaximizeOnClick={true}
                      hasThumbnailsAtMax={false}
                      zIndexAtMax={99999}
                      thumbnailWidth={Thumnailsize}
                      thumbnailHeight="15%"
                      leftIcon={
                        <Fab component="span" aria-label="arrow" size="small">
                          <ArrowBackIosNewIcon />
                        </Fab>
                      }
                      rightIcon={
                        <Fab component="span" aria-label="arrow" size="small">
                          <ArrowForwardIosIcon />
                        </Fab>
                      }
                      maxIcon={
                        <IconButton component="span" aria-label="fullscreen">
                          <FullscreenIcon sx={{ fontSize: "31px" }} />
                        </IconButton>
                      }
                      minIcon={
                        <IconButton
                          component="span"
                          aria-label="fullscreenExit"
                          size="large"
                          sx={{ color: "white" }}
                        >
                          <FullscreenExitIcon sx={{ fontSize: "34px" }} />
                        </IconButton>
                      }
                    />
                  </>
                )}
              </Box>

              {/* product gallery for small screens */}
              <Box
                className="galleryBox"
                sx={{
                  width: { md: "94%", lg: "90%" },
                  height: "100%",
                  margin: "0 auto",
                  display: { xs: "block", md: "none" },
                }}
              >
                {isLoading ? (
                  <Skeleton
                    variant="rectangle"
                    width="100%"
                    height="100%"
                    animation="wave"
                  />
                ) : (
                  <>
                    <Carousel
                      images={images}
                      isAutoPlaying={true}
                      autoPlayInterval={10000}
                      style={{ background: "white" }}
                      hasMediaButton={false}
                      hasIndexBoard={false}
                      hasSizeButton="topRight"
                      shouldMaximizeOnClick={true}
                      hasThumbnailsAtMax={true}
                      zIndexAtMax={99999}
                      thumbnailWidth={Thumnailsize}
                      hasThumbnails={false}
                      thumbnailHeight="15%"
                      leftIcon={
                        <Fab component="span" aria-label="arrow" size="small">
                          <ArrowBackIosNewIcon />
                        </Fab>
                      }
                      rightIcon={
                        <Fab component="span" aria-label="arrow" size="small">
                          <ArrowForwardIosIcon />
                        </Fab>
                      }
                      maxIcon={
                        <IconButton component="span" aria-label="fullscreen">
                          <FullscreenIcon sx={{ fontSize: "31px" }} />
                        </IconButton>
                      }
                      minIcon={
                        <IconButton
                          component="span"
                          aria-label="fullscreenExit"
                          size="large"
                          sx={{ color: "white" }}
                        >
                          <FullscreenExitIcon sx={{ fontSize: "34px" }} />
                        </IconButton>
                      }
                    />
                  </>
                )}
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              lg={6}
              sx={{
                paddingRight: { lg: "115px", md: "25px", xs: "0px" },
                paddingLeft: { lg: "0px", md: "0px", xs: "0px" },
                pt: "10px",
              }}
            >
              <Stack
                sx={{
                  paddingRight: { lg: "150px", md: "0px", xs: "20px" },
                  paddingLeft: { lg: "0px", md: "0px", xs: "20px" },
                }}
              >
                {isLoading ? (
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1.3rem" }}
                    animation="wave"
                  />
                ) : (
                  <Typography
                    sx={{
                      color: "#4f5362",
                      paddingTop: "8px",
                      fontSize: { xs: "14px", md: "18px" },
                    }}
                    lineHeight="21px"
                    variant="subtitle1"
                    fontWeight={700}
                  >
                    {productData.brand_name}
                  </Typography>
                )}

                {isLoading ? (
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    animation="wave"
                  />
                ) : (
                  <Typography
                    variant="subtitle2"
                    fontWeight={500}
                    lineHeight="20px"
                    sx={{
                      color: "#737373",
                      paddingTop: { md: "8px", xs: "2px" },
                      fontSize: { xs: "10px", md: "16px" },
                      paddingRight: { md: "0px", xs: "60px" },
                    }}
                  >
                    {productData.product_name}
                  </Typography>
                )}

                {isLoading ? (
                  <Skeleton
                    variant="rectangle"
                    width="100%"
                    height={100}
                    animation="wave"
                    sx={{ mt: "12px" }}
                  />
                ) : (
                  <>
                    <Rating
                      id="productRating"
                      //   size="medium"
                      name="half-rating-read"
                      value={
                        productData.overall_rating
                          ? productData.overall_rating
                          : 0
                      }
                      precision={0.1}
                      readOnly
                      sx={{ mt: "12px" }}
                    />

                    <Stack spacing={0}>
                      <Stack
                        spacing={0.5}
                        direction="row"
                        justifyContent="left"
                        alignItems="center"
                        mt="10px"
                      >
                        <Typography
                          gutterBottom
                          fontSize={24}
                          lineHeight="24px"
                          my={0}
                          py="4px"
                          variant="h4"
                          fontWeight={600}
                          component="h4"
                          id="salePrice"
                        >
                          ₹{productPrice}
                        </Typography>
                        {
                          disocuntPercentage > 0 ? (
                            <>
                              <Typography
                                gutterBottom
                                fontSize={16}
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
                                }}
                              >
                                ₹{productData.maximum_retail_price}
                              </Typography>
                              <Typography
                                gutterBottom
                                fontSize={16}
                                lineHeight="19px"
                                my={0}
                                py="4px"
                                variant="h4"
                                fontWeight={200}
                                component="h4"
                                id="discountPercent"
                                color="#00b852"
                              >
                                ({disocuntPercentage}% off)
                              </Typography>
                            </>
                          ) : null
                        }

                      </Stack>
                      <Typography
                        fontSize={13}
                        lineHeight="15px"
                        sx={{ color: "#949494" }}
                        variant="body1"
                      >
                        inclusive of all taxes
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={2}
                      mt={2}
                      sx={{ display: { md: "flex", xs: "none" } }}
                    >
                      <Chip
                        label={productData.fit_type}
                        sx={{
                          color: "white",
                          fontSize: "12px",
                          fontWeight: 600,
                          bgcolor: "rgba(82, 82, 82, 0.8)",
                          textTransform: "uppercase"
                        }}
                      />
                      <Chip
                        label={productData.material}
                        variant="outlined"
                        sx={{
                          color: "rgb(115, 115, 115)",
                          fontSize: "12px",
                          fontWeight: 600,
                          textTransform: "uppercase"
                        }}
                      />
                    </Stack>

                    {/* chips for small screens  */}
                    <Stack
                      direction="row"
                      spacing={2}
                      mt={2}
                      sx={{ display: { md: "none", xs: "flex" } }}
                    >
                      <Chip
                        label={productData.fit_type}
                        sx={{
                          color: "white",
                          bgcolor: "rgba(82, 82, 82, 0.8)",
                          textTransform: "uppercase"
                        }}
                        size="small"
                      />
                      <Chip
                        label={productData.material}
                        variant="outlined"
                        sx={{
                          color: "rgb(115, 115, 115)",
                          textTransform: "uppercase"
                        }}
                        size="small"
                      />
                    </Stack>
                  </>
                )}
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Stack spacing={3} sx={{ px: { xs: "20px", md: "0px" } }}>
                {isLoading ? (
                  <Skeleton
                    variant="rectangle"
                    width="100%"
                    height={250}
                    animation="wave"
                  />
                ) : (
                  <>
                    <Stack spacing={1.3}>
                      <Typography
                        fontWeight={600}
                        fontSize={18}
                        variant="subtitle1"
                      >
                        Select Size
                      </Typography>
                      <ToggleButtonGroup
                        value={selectedSize}
                        exclusive
                        onChange={(event, newSize) => setSelectedSize(newSize)}
                        sx={{ gap: 2, flexWrap: "wrap" }}
                      >
                        {productData.size_variant
                          ? productData.size_variant.map((size) => {
                            return (
                              <ToggleButton
                                key={size.uid}
                                disabled={size.stock < 1 ? true : false}
                                sx={{
                                  border: "1px solid black !important",
                                  borderRadius: "5px !important",
                                  color: "black",
                                  width: "50px",
                                  marginBottom: { xs: 1, md: 0 },
                                }}
                                value={size.uid}
                              >
                                {size.size_name}
                              </ToggleButton>
                            );
                          })
                          : null}
                      </ToggleButtonGroup>
                      <Collapse in={sizeAlert}>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                          Please Select a Size!
                        </Alert>
                      </Collapse>
                    </Stack>
                    <Stack spacing={1.3}>
                      <Typography
                        fontWeight={600}
                        fontSize={18}
                        variant="subtitle1"
                      >
                        Quantity
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <IconButton onClick={handleDecrement}>
                          <RemoveIcon />
                        </IconButton>
                        <TextField
                          id="quantity"
                          className="quantityField"
                          variant="outlined"
                          value={quantity}
                          size="small"
                          inputProps={{
                            style: { textAlign: "center" },
                          }}
                          sx={{ width: "60px" }}
                          onChange={(event) => {
                            const newQuantity = Number(event.target.value);
                            if (newQuantity > 0 && newQuantity <= stockValue) {
                              setQuantity(newQuantity);
                            }
                          }}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                        <IconButton
                          onClick={handleIncrement}
                          disabled={quantity >= stockValue}
                        >
                          <AddIcon />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </>
                )}
                {isLoading ? (
                  <Skeleton
                    variant="rectangle"
                    width="100%"
                    height={50}
                    animation="wave"
                  />
                ) : (
                  <>
                    {stockValue < 10 ? (
                      stockValue < 5 ? (
                        stockValue == 0 ? (
                          <Typography color="error" variant="subtitle1">
                            Out of Stock*
                          </Typography>
                        ) : (
                          <Typography color="error" variant="subtitle1">
                            Only {stockValue} left*
                          </Typography>
                        )
                      ) : (
                        <Typography color="error" variant="subtitle1">
                          Only few left*
                        </Typography>
                      )
                    ) : null}
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        display: { md: "flex", xs: "none" },
                      }}
                    >
                      <Button
                        sx={{
                          padding: "0px",
                          width: "40%",
                          borderRadius: "0px",
                        }}
                        variant="outlined"
                      >
                        <input
                          type="checkbox"
                          id="favorite"
                          name="favorite-checkbox"
                          value="favorite-button"
                          className="wishlistCheckboxBtn"
                          onChange={handleWishlistClick}
                          checked={isAlreadyWishlisted}
                        />
                        <label
                          htmlFor="favorite"
                          className="wishlistBtnContainer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-heart"
                          >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                          <div className="action">
                            <span className="option-1">Wishlist</span>
                            <span className="option-2">Wishlisted</span>
                          </div>
                        </label>
                      </Button>
                      {isAddToCart ? (
                        <Button
                          startIcon={<ShoppingBasketIcon />}
                          component={NavLink}
                          to="/cart"
                          variant="contained"
                          size="large"
                          disableElevation
                          color="primary"
                          sx={{ borderRadius: "0px", width: "60%" }}
                        >
                          View Cart
                        </Button>
                      ) : (
                        <Button
                          startIcon={
                            <>
                              <Stack position="relative">
                                <FontAwesomeIcon
                                  className="product"
                                  icon={faShirt}
                                />
                                <ShoppingCartIcon className="cart" />
                              </Stack>
                            </>
                          }
                          className="cartBtn "
                          variant="contained"
                          size="large"
                          disableElevation
                          color="primary"
                          sx={{ borderRadius: "0px", width: "60%" }}
                          onClick={handleAddToCartClick}
                          disabled={stockValue == 0 ? true : false}
                        >
                          Add to Cart
                        </Button>
                      )}
                    </Stack>
                  </>
                )}
              </Stack>

              {/* add to cart and wishlist buttons for small screens */}
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  mt: "20px",
                  display: { md: "none", xs: "flex" },
                  position: "sticky",
                  bottom: "0px",
                  bgcolor: "white",
                  py: "10px",
                  px: "12px",
                  boxShadow: " 0 -2px 10px rgba(0,0,0,.1)",
                  zIndex: 9999
                }}
              >
                <Button
                  startIcon={
                    isWishlisted ? (
                      <FavoriteIcon sx={{ color: "#D23F57" }} />
                    ) : (
                      <FavoriteBorderIcon />
                    )
                  }
                  variant="outlined"
                  size="small"
                  disableElevation
                  sx={{ borderRadius: "0px", py: "10px", width: "40%" }}
                  onClick={() => {
                    handleWishlistClick(productData);
                  }}
                >
                  {isWishlisted ? "Wishlisted" : "Wishlist"}
                </Button>
                {isAddToCart ? (
                  <Button
                    startIcon={<ShoppingBasketIcon />}
                    component={NavLink}
                    to="/cart"
                    variant="contained"
                    size="small"
                    disableElevation
                    sx={{ borderRadius: "0px", width: "60%" }}
                  >
                    View Cart
                  </Button>
                ) : (
                  <Button
                    startIcon={
                      <>
                        <Stack position="relative">
                          <FontAwesomeIcon className="product" icon={faShirt} />
                          <ShoppingCartIcon className="cart" />
                        </Stack>
                      </>
                    }
                    className="cartBtn "
                    variant="contained"
                    size="small"
                    disableElevation
                    sx={{ borderRadius: "0px", width: "60%" }}
                    onClick={handleAddToCartClick}
                    disabled={stockValue == 0 ? true : false}
                  >
                    Add to Cart
                  </Button>
                )}
              </Stack>
              <Divider sx={{ my: 3 }} />
              {isLoading ? (
                <Skeleton
                  variant="rectangle"
                  width="100%"
                  height={50}
                  animation="wave"
                />
              ) : (
                <Grid container mt={5} sx={{ px: { xs: "20px", md: "0px" } }}>
                  <Grid item xs={4} md={4} lg={4}>
                    <Stack justifyContent="center" alignItems="center">
                      <MonetizationOnOutlinedIcon
                        sx={{ color: "#2B3947", fontSize: { md: "1.5rem" } }}
                      />
                      <Typography
                        sx={{
                          color: "#2B3947",
                          fontSize: { md: "1rem", xs: "0.8rem" },
                        }}
                        textAlign="center"
                        variant="subtitle1"
                        lineHeight={1.3}
                      >
                        {productData.is_cash_on_delivery
                          ? "COD available"
                          : "COD not available"}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={4} md={4} lg={4}>
                    <Stack justifyContent="center" alignItems="center">
                      <SwapHorizontalCircleOutlinedIcon
                        sx={{ color: "#2B3947", fontSize: { md: "1.5rem" } }}
                      />
                      <Typography
                        sx={{
                          color: "#2B3947",
                          fontSize: { md: "1rem", xs: "0.8rem" },
                        }}
                        textAlign="center"
                        variant="subtitle1"
                        lineHeight={1.3}
                      >
                        {productData.no_of_days_for_return_exchange > 0
                          ? `${productData.no_of_days_for_return_exchange} Days Return and Exchange`
                          : "No Return and Exchange"}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={4} md={4} lg={4}>
                    <Stack justifyContent="center" alignItems="center">
                      <LocalShippingOutlinedIcon
                        sx={{ color: "#2B3947", fontSize: { md: "1.5rem" } }}
                      />
                      <Typography
                        sx={{
                          color: "#2B3947",
                          fontSize: { md: "1rem", xs: "0.8rem" },
                        }}
                        textAlign="center"
                        variant="subtitle1"
                        lineHeight={1.3}
                      >
                        Usually ships in 1 day
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid container py={8} justifyContent="center">
            <Grid
              item
              xs={12}
              md={5.5}
              lg={5.5}
              sx={{
                paddingLeft: { xs: "20px", md: "10px", lg: "24px" },
                paddingRight: { xs: "20px", md: "0px", lg: "0px" },
              }}
            >
              <Stack spacing={1.5}>
                {isLoading ? (
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1.3rem" }}
                    animation="wave"
                  />
                ) : (
                  <Typography
                    variant="h1"
                    component="h1"
                    fontWeight={600}
                    fontSize={18}
                    textTransform="uppercase"
                  >
                    Description
                  </Typography>
                )}
                {isLoading ? (
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={150}
                    animation="wave"
                  />
                ) : (
                  <Typography fontSize={14} variant="body1">
                    <SanitizedHtml htmlContent={productData.product_description} />
                  </Typography>
                )}
              </Stack>
            </Grid>
            <Grid
              xs={12}
              item
              md={5.5}
              lg={5.5}
              px={5}
              sx={{ padding: { md: "0 40px", xs: "10px 0" } }}
            >
              {isLoading ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={200}
                  animation="wave"
                />
              ) : (
                <>
                  <Accordion
                    expanded={expanded === "panel1"}
                    onChange={handleChange("panel1")}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Stack direction="row" spacing={2}>
                        <SubjectOutlinedIcon />
                        <Typography sx={{ flexShrink: 0 }}>
                          Product Specifications
                        </Typography>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ul>
                        {productSpecification.map((specification, index) => {
                          return <li key={index}> <SanitizedHtml htmlContent={specification} /> </li>;
                        })}
                      </ul>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion
                    expanded={expanded === "panel2"}
                    onChange={handleChange("panel2")}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2bh-content"
                      id="panel2bh-header"
                    >
                      <Stack direction="row" spacing={2}>
                        <BusinessOutlinedIcon />
                        <Typography sx={{ flexShrink: 0 }}>
                          Manufacturer Details
                        </Typography>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography color="text.secondary">
                        <b> Manufactured & Marketed By: </b>
                        <br />
                        {productData.manufacturer_name_address}
                        <br />
                        <br />
                        <b>Country of Origin: </b>
                        <br />
                        {productData.country_of_origin}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion
                    expanded={expanded === "panel3"}
                    onChange={handleChange("panel3")}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2bh-content"
                      id="panel2bh-header"
                    >
                      <Stack direction="row" spacing={2}>
                        <SwapHorizontalCircleOutlinedIcon />
                        <Typography sx={{ flexShrink: 0 }}>
                          Return Policy
                        </Typography>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{productData.return_policy}</Typography>
                    </AccordionDetails>
                  </Accordion>
                </>
              )}
            </Grid>
          </Grid>

          <Grid container justifyContent="center" py={0}>
            <Grid
              item
              xs={12}
              md={11}
              lg={10.7}
              sx={{ paddingLeft: { md: "10px", lg: "0px", xs: "0px" } }}
            >
              <Stack
                spacing={2}
                sx={{
                  paddingLeft: { md: "0px", lg: "0px", xs: "20px" },
                  paddingRight: { md: "0px", lg: "0px", xs: "20px" },
                }}
              >
                <Typography
                  variant="h1"
                  component="h1"
                  fontWeight={600}
                  fontSize={18}
                  lineHeight="28px"
                  textTransform="uppercase"
                >
                  Customer Reviews
                </Typography>
                <Rating
                  sx={{ color: "#2B3947" }}
                  name="read-only"
                  value={
                    productData.overall_rating ? productData.overall_rating : 0
                  }
                  precision={0.1}
                  readOnly
                  size="large"
                />
                <Typography
                  variant="h1"
                  component="h1"
                  fontWeight={600}
                  fontSize={28}
                  lineHeight="36px"
                  textTransform="uppercase"
                  sx={{ mt: "6px !important" }}
                >
                  {productData.overall_rating
                    ? productData.overall_rating.toFixed(1)
                    : 0}
                  <span style={{ color: "#A3AAB0" }}>/5</span>
                </Typography>
                <Stack direction="row" spacing={3}>
                  <Typography
                    sx={{ mt: "1px !important" }}
                    color="text.secondary"
                  >
                    Based on {totalReviews} ratings
                  </Typography>
                  <Button
                    sx={{ textTransform: "capitalize" }}
                    variant="outlined"
                    onClick={() => setopenReviewForm(true)}
                  >
                    Write Review
                  </Button>
                </Stack>
              </Stack>
              <Typography
                mt={2.5}
                fontWeight={600}
                variant="subtitle1"
                sx={{
                  fontSize: { md: "17px", xs: "15px" },
                  paddingLeft: { md: "0px", lg: "0px", xs: "20px" },
                  paddingRight: { md: "0px", lg: "0px", xs: "20px" },
                }}
              >
                Hear what our customers say ({totalReviews})
              </Typography>

              {/* reviews starting from here  */}
              <Stack>
                <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                  {displayReviews
                    .slice(startIndex, endIndex)
                    .map((review, index) => {
                      return (
                        <span key={review.uid}>
                          <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                              {isLoading ? (
                                <Skeleton
                                  variant="circular"
                                  animation="wave"
                                  width={45}
                                  height={45}
                                />
                              ) : (
                                <Avatar {...stringAvatar(review.user_name)} />
                              )}
                            </ListItemAvatar>

                            <ListItemText
                              primary={
                                <>
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                  >
                                    {isLoading ? (
                                      <Skeleton
                                        variant="text"
                                        sx={{ fontSize: "1rem" }}
                                        width="30%"
                                        animation="wave"
                                      />
                                    ) : (
                                      <>
                                        <Typography
                                          fontWeight={500}
                                          sx={{
                                            fontSize: {
                                              xs: "14px",
                                              md: "1rem",
                                            },
                                          }}
                                        >
                                          {review.user_name}
                                        </Typography>
                                        {review.isVerified ? (
                                          <Chip
                                            icon={
                                              <VerifiedIcon
                                                sx={{
                                                  fontSize: {
                                                    md: "18px !important",
                                                    xs: "16px !important",
                                                  },
                                                }}
                                              />
                                            }
                                            sx={{
                                              fontSize: {
                                                md: "10px",
                                                xs: "10px",
                                              },
                                            }}
                                            label="Verified buyer"
                                            color="success"
                                            size="small"
                                          />
                                        ) : null}
                                      </>
                                    )}

                                    <Box sx={{ flexGrow: 1 }} textAlign="end">
                                      <Typography
                                        textAlign="end"
                                        variant="caption"
                                        color="text.secondary"
                                        fontSize={13}
                                      >
                                        {new Date(
                                          review.created_at
                                        ).toLocaleDateString("en-GB", {
                                          day: "numeric",
                                          month: "numeric",
                                          year: "numeric",
                                        })}
                                      </Typography>
                                    </Box>
                                  </Stack>
                                </>
                              }
                              secondary={
                                <Typography component="span" variant="body2">
                                  <Stack spacing={2} pt={2}>
                                    {isLoading ? (
                                      <Skeleton
                                        variant="text"
                                        sx={{ fontSize: "2rem" }}
                                        width="20%"
                                        animation="wave"
                                      />
                                    ) : (
                                      <Stack
                                        direction="row"
                                        spacing={0.5}
                                        alignItems="center"
                                      >
                                        <Rating
                                          sx={{ color: "#2B3947" }}
                                          name="read-only"
                                          value={review.rating}
                                          precision={0.1}
                                          readOnly
                                        />
                                        <Typography
                                          className="reviewTitle"
                                          variant="subtitle1"
                                          sx={{ color: "black" }}
                                          fontWeight={500}
                                          fontSize={16}
                                        >
                                          ({review.rating})
                                        </Typography>
                                      </Stack>
                                    )}
                                    {isLoading ? (
                                      <Skeleton
                                        variant="text"
                                        sx={{ fontSize: "1.3rem" }}
                                        width="50%"
                                        animation="wave"
                                      />
                                    ) : (
                                      <Typography
                                        className="reviewTitle"
                                        variant="subtitle1"
                                        sx={{
                                          color: "black",
                                          fontSize: {
                                            xs: "14px",
                                            md: "16px",
                                          },
                                        }}
                                        fontWeight={600}
                                      >
                                        {review.review_title}
                                      </Typography>
                                    )}
                                    {isLoading ? (
                                      <Skeleton
                                        variant="text"
                                        sx={{ fontSize: "1rem" }}
                                        width="70%"
                                        animation="wave"
                                      />
                                    ) : (
                                      <Typography
                                        className="reviewBody"
                                        variant="subtitle2"
                                        sx={{
                                          color: "text.primary",
                                          marginTop: "1px !important",
                                          fontSize: {
                                            xs: "12px",
                                            md: "16px",
                                          },
                                        }}
                                      >
                                        {review.review_description}
                                      </Typography>
                                    )}
                                  </Stack>
                                </Typography>
                              }
                            />
                          </ListItem>
                          {(index + 1) % 5 == 0 ||
                            (index + 1 == totalReviews % 5 &&
                              page != 1) ? null : (
                            <Divider variant="inset" component="li" />
                          )}
                        </span>
                      );
                    })}
                </List>
              </Stack>
              {totalReviews > 4 ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  py={3}
                >
                  <Pagination
                    count={Math.ceil(totalReviews / pageSize)}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    color="primary"
                    shape="rounded"
                  />
                </Box>
              ) : null}
            </Grid>
          </Grid>

          <Snackbar
            open={open}
            TransitionComponent={transition}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            sx={{ top: "64px !important" }}
          >
            <Alert
              onClose={handleClose}
              severity={sbColor}
              sx={{ width: "100%" }}
              variant="filled"
            >
              {snackbarMsg}
            </Alert>
          </Snackbar>

          {/* review form modal  */}
          <Dialog
            // fullScreen={fullScreen}
            open={openReviewForm}
            onClose={closeReviewForm}
            aria-labelledby="responsive-dialog-title"
            // sx={{width: "100%" }}
            fullWidth
            maxWidth="sm"
            sx={{ backdropFilter: 'blur(5px)' }}
          >
            <DialogTitle
              textAlign="center"
              fontSize={21}
              textTransform="none"
              fontWeight={600}
              letterSpacing={0}
              id="alert-dialog-title"
            >
              {"Write Review"}
            </DialogTitle>
            <DialogContent sx={{ p: { xs: 0, md: "20px 24px !important" } }}>
              <ProductReviewFrom
                closeReviewFormMethod={closeReviewForm}
                setnewReviewChangeState={setnewReviewChangeState}
                productId={productData.uid}
              />
            </DialogContent>
          </Dialog>
        </ThemeProvider>
      ) : (
        <Typography variant="h2" textAlign="center">
          {productData.res}
        </Typography>
      )}
    </motion.div>
  );
};

export default SingleProduct;
