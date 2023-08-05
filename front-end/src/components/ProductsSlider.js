import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Checkbox,
  Grid,
  Rating,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useGetAllProductsQuery } from "../services/productsApi";
import { v4 as uuidv4 } from "uuid";
import {
  getUserWishlistMapping,
  storeUserWishlistMapping,
} from "../services/localStorageServices";
import { useSelector } from "react-redux";
import axios from "axios";
import React from 'react';

const ProductsSlider = (props) => {
  const [isProductAddedToCart, setIsProductAddedToCart] = useState();
  const [isProductAddedToWishlist, setIsProductAddedToWishlist] = useState();
  // const { data, isLoading, isSuccess } = useGetAllProductsQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [categorizedProducts, setCategorizedProducts] = useState([]);
  const refetchProducts = useSelector((state) => state.stateRefetchProducts);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get("http://127.0.0.1:8000/product/");
        setAllProducts(response.data);
      } catch (error) {
        console.error("Error occurred while fetching data:", error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [refetchProducts, props.navigatedFrom]);


  useEffect(() => {
    if (allProducts.length > 0) {
      const filtered = allProducts.filter((product) => {
        // Check if the product's category array contains the specified category name
        const mainCategoryFilter = product.category.some(
          (cat) => cat.category_name == props.title
        );

        const subCategoryFilter =
          props.navigatedFrom == "all" ||
          product.category.some(
            (cat) => cat.category_name == props.navigatedFrom
          );

        return mainCategoryFilter && subCategoryFilter;
      });

      setCategorizedProducts(filtered);
    }
  }, [allProducts]);

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  // handeling wishlist actions
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [isAlreadyWishlisted, setIsAlreadyWishlisted] = useState({});
  const userWishlistMapping = getUserWishlistMapping(); //getting from localstorage
  const loggedinUser = useSelector((state) => state.user);

  // for checking if already in wishlist
  useEffect(() => {
    const userProductIds = userWishlistMapping[loggedinUser.email];

    if (userProductIds) {
      categorizedProducts.map((product) => {
        setIsAlreadyWishlisted((prevStatus) => ({
          ...prevStatus,
          [product.uid]: userProductIds.includes(product.uid),
        }));
      });
    }
  }, [categorizedProducts, loggedinUser]);

  const removeFromWishlist = (productId) => {
    // updating userMapped object
    const userMappedProducts = userWishlistMapping[loggedinUser.email];
    const updatedUserMappedArray = userMappedProducts.filter(
      (pId) => pId != productId
    );

    userWishlistMapping[loggedinUser.email] = updatedUserMappedArray;
    storeUserWishlistMapping(userWishlistMapping);
  };

  const handleProductAddToWishlistAction = (event, productData) => {
    const checked = event.target.checked;

    if (checked) {
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

    setIsAlreadyWishlisted((prevStatus) => ({
      ...prevStatus,
      [productData.uid]: checked,
    }));
  };

  return (
    <>
      {categorizedProducts.length > 0 ? (
        <Grid
          container
          justifyContent="center"
          sx={{ mt: { md: "0px", lg: "40px !important" } }}
          mb={3}
        >
          <Grid item lg={11.2} xs={11.2}>
            <Typography
              variant="h1"
              textAlign="center"
              sx={{ fontSize: { xs: 22, md: 31 } }}
              fontWeight={700}
              my={4}
            >
              {props.title}
            </Typography>
            {/* <img src="../../../backend/products/images/mens-blue-all-over-printed-oversized-t-shirt/cardThumb.jpg" alt="" /> */}
            <Carousel
              responsive={responsive}
              swipeable={true}
              draggable={true}
              infinite={true}
              keyBoardControl={true}
              renderButtonGroupOutside={true}
              autoPlay={props.isAutoPlay}
              autoPlaySpeed={7000}
            >
              {isLoading ? (
                <CircularProgress />
              ) : (
                categorizedProducts.map((product) => {
                  // console.log(product);

                  const backendBaseUrl = "http://127.0.0.1:8000";
                  const cardThumbUrl = `${backendBaseUrl}${product.card_thumb_image}`;

                  const disocuntPercentage = parseInt(
                    ((product.maximum_retail_price - product.price) /
                      product.maximum_retail_price) *
                    100
                  );

                  const uniqueId = uuidv4();

                  return (
                    <Card
                      key={product.uid}
                      sx={{
                        maxWidth: 345,
                        borderRadius: "0px",
                        margin: "0 12px",
                        transition: "all 0.3s",
                        boxShadow: "none",
                        "&:hover .productImg": { transform: "scale(1.1)" },
                        "&:hover .productCardImageOverlay:before": {
                          opacity: 0.3,
                        },
                        "&:hover .addToCartIcon": { right: 0 },
                        "&:hover .addToWishlistIcon": { right: 0 },
                      }}
                    >
                      <Box
                        component="div"
                        sx={{ overflow: "hidden", position: "relative" }}
                      >
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

                          <CardContent sx={{ textAlign: "center" }}>
                            <Typography
                              gutterBottom
                              variant="subtitle2"
                              fontSize={12}
                              color="#AEB4BE"
                              lineHeight="1.5"
                              component="div"
                              mb={0}
                            >
                              {product.brand_name}
                            </Typography>
                            <Typography
                              gutterBottom
                              variant="subtitle1"
                              my={0}
                              fontSize={14}
                              fontWeight={700}
                              component="div"
                            >
                              {product.product_name.length > 30
                                ? product.product_name.slice(0, 30) + "..."
                                : product.product_name}
                            </Typography>
                            <Stack
                              spacing={0.5}
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Typography
                                gutterBottom
                                fontSize={16}
                                lineHeight="1.5"
                                my={0}
                                py="4px"
                                variant="h4"
                                fontWeight={600}
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
                                      fontSize={14}
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
                                      }}
                                    >
                                      ₹{product.maximum_retail_price}
                                    </Typography>
                                    <Typography
                                      gutterBottom
                                      fontSize={14}
                                      lineHeight="1.5"
                                      my={0}
                                      py="4px"
                                      variant="h4"
                                      fontWeight={200}
                                      component="h4"
                                      id="discountPercent"
                                      color="#000000cf"
                                    >
                                      ({disocuntPercentage}% off)
                                    </Typography>
                                  </>
                                ) : null
                              }
                            </Stack>
                            <Rating
                              id="productRating"
                              size="small"
                              name="half-rating-read"
                              value={product.overall_rating}
                              precision={0.1}
                              readOnly
                            />
                          </CardContent>
                        </CardActionArea>
                        <Tooltip
                          title={
                            isProductAddedToWishlist
                              ? "Remove from Wishlist"
                              : "Add to Wishlist"
                          }
                          arrow
                          placement="right-end"
                        >
                          <Checkbox
                            id={`addToWishlist-${uniqueId}`}
                            className="addToWishlistIcon"
                            icon={
                              <FavoriteBorder
                                sx={{ color: "#2B3947", fontSize: "32px" }}
                              />
                            }
                            checkedIcon={
                              <Favorite
                                sx={{ color: "#D23F57", fontSize: "32px" }}
                              />
                            }
                            sx={{
                              position: "absolute",
                              top: 0,
                              zIndex: 9,
                              right: -55,
                              mt: "5px",
                              mr: "5px",
                              transition: "right 0.3s",
                            }}
                            onChange={(event) =>
                              handleProductAddToWishlistAction(event, product)
                            }
                            checked={isAlreadyWishlisted[product.uid] || false}
                          />
                        </Tooltip>
                      </Box>
                    </Card>
                  );
                })
              )}
            </Carousel>
          </Grid>
        </Grid>
      ) : null}
    </>
  );
};

export default ProductsSlider;
