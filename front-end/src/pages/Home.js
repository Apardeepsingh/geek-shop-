import Carousel from "react-material-ui-carousel";
import {
  Paper,
  Button,
  Box,
  Stack,
  Grid,
  Typography,
  Divider,
  colors,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import "../css/home.css";
import { green, red } from "@mui/material/colors";
import ProductsSlider from "../components/ProductsSlider";
import AboutUsBanner from "../components/AboutUsBanner";
import CustomerBenifitsBanner from "../components/CustomerBenifitsBanner";
import { useEffect, useState } from "react";
import { useGetBillboardsQuery, useGetCategoriesQuery } from "../services/productsApi";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import React from 'react';
import PreLoader from "../components/PreLoader";

function Item(props) {
  // console.log("props.slide.billboard_image")
  const [imgUrl, setimgUrl] = useState(`https://apardeepsingh.pythonanywhere.com${props.slide.billboard_image}`)

  return (
    <Box
      sx={{
        height: { md: "80vh", xs: "60vh" },
      }}
    >
      <Grid
        container
        sx={{
          background: {
            xs: "black",
            sm: "black",
            md: `url(${imgUrl})`,
            lg: `url(${imgUrl})`,
            xl: `url(${imgUrl})`,
          },
          backgroundRepeat: "no-repeat !important",
          backgroundSize: "cover !important",
          backgroundPosition: "center !important",
          height: "100%",
          // display: { xs: "none", sm: "block" },
        }}
        className="bannerBgGrid"
      >
        <Grid
          item
          xs={12}
          md={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Paper
            className="bannerContent"
            sx={{
              background: "none",
              borderRadius: 0,
              border: "none",
              boxShadow: "none",
            }}
          >
            <Stack
              spacing={2}
              sx={{
                display: "inline",
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Typography
                sx={{ fontSize: { xs: "21px", md: "32px" } }}
                // fontSize={21}
                variant="subtitle1"
                color="white"
                textTransform="uppercase"
              >
                {props.slide.billboard_title}
              </Typography>
              <Typography
                sx={{
                  mt: "0 !important",
                  fontSize: { xs: "38px", md: "38px" },
                }}
                fontWeight={900}
                variant="h1"
                color="white"
                textTransform="uppercase"
              >
                {props.slide.billboard_for}
              </Typography>
              <Typography
                sx={{ fontSize: { xs: "23px", md: "32px" } }}
                fontWeight={600}
                variant="subtitle2"
                color="white"
                textTransform="uppercase"
              >
                {props.slide.billboard_description}
              </Typography>

              <Box>
                <Button
                  size="large"
                  variant="contained"
                  className="bannerBtn"
                  classtitle="CheckButton"
                  component={NavLink}
                  to={props.slide.billboard_url}
                >
                  Shop Now
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

const Home = () => {
  const theme = useTheme();
  const isXsBreakpoint = useMediaQuery(theme.breakpoints.down("xs"));
  const { data, isLoading, isSuccess } = useGetCategoriesQuery();
  const { data: billboardData, isLoading: isBillboardLoading } = useGetBillboardsQuery();
  const [homeBillBoards, setHomeBillBoards] = useState([]);
  const [featureCategories, setFeatureCategories] = useState([]);

  useEffect(() => {
    if (data) {
      const categories = data.filter((category) => {
        return category.is_featured;
      });

      setFeatureCategories(categories);
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (billboardData) {
      const billboards = billboardData.filter((billboard) => {
        return billboard.billboard_page == "home";
      });

      setHomeBillBoards(billboards);
    }
  }, [billboardData, isBillboardLoading]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    document.title = "Home";
  }, []);


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {isBillboardLoading ? (
        <PreLoader />
      ) : (
        <>
          <Grid container justifyContent="center">
            <Grid
              item
              lg={11}
              md={11}
              sm={11}
              xs={11}
              sx={{ height: { md: "80vh", xs: "60vh" } }}
            >
              <Carousel
                className="homeBanner"
                sx={{
                  borderRadius: 0,
                  // bgcolor: 'red'
                }}
                indicatorContainerProps={{
                  style: {
                    marginTop: "-24px", // 5
                    paddingBottom: "0px", // 5
                    position: "relative",
                    zIndex: 1,
                    bottom: "16px",
                  },
                }}
              >
                {homeBillBoards.map((slide, i) => (
                  <Item key={i} slide={slide} />
                ))}
              </Carousel>
            </Grid>
          </Grid>

          <Grid
            container
            // height="35vh"
            sx={{ height: { xs: "100%", sm: "100%", md: "30vh", lg: "37vh" } }}
            justifyContent="center"
            my={0}
            spacing={3}
            mb={3}
          // height="100%"
          >
            <Grid
              className="forMenGrid"
              item
              md={5.5}
              lg={5.5}
              xs={11}
              height="100%"
            >
              <Box className="forMenOverlayBox">
                <img
                  className="forMenImage"
                  src="images/homeForMen.jpg"
                  alt="For Men"
                />
                <Stack
                  sx={{ position: "absolute", top: 0 }}
                  spacing={3}
                  height="100%"
                  justifyContent="center"
                  ml={3}
                >
                  <Typography
                    variant="subtitle1"
                    color="white"
                    fontSize="25px"
                    fontWeight={600}
                  >
                    For Men's
                  </Typography>
                  <Typography
                    sx={{ mt: "0 !important" }}
                    variant="subtitle2"
                    color="white"
                    fontSize="14px"
                    fontWeight={100}
                  >
                    Style for him, defined
                  </Typography>
                  <Divider sx={{ border: "2px solid white", width: "40%" }} />
                  <Button
                    variant="text"
                    sx={{
                      color: "white",
                      mt: "10px !important",
                      paddingX: "0 !important",
                      width: "81px !important",
                    }}
                    component={NavLink}
                    to="/category/men"
                    disableElevation
                  >
                    Shop Now
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid
              className="forWomenGrid"
              item
              md={5.5}
              lg={5.5}
              xs={11}
              height="100%"
            >
              <Box className="forWomenOverlayBox">
                <img
                  className="forWomenImage"
                  src="images/homeForWomen.jpg"
                  alt="For Women"
                />
                <Stack
                  sx={{ position: "absolute", top: 0, right: 0 }}
                  spacing={3}
                  height="100%"
                  justifyContent="center"
                  mr={3}
                  alignItems="end"
                >
                  <Typography
                    variant="subtitle1"
                    color="white"
                    fontSize="25px"
                    fontWeight={600}
                  >
                    For Women's
                  </Typography>
                  <Typography
                    sx={{ mt: "0 !important" }}
                    variant="subtitle2"
                    color="white"
                    fontSize="14px"
                    fontWeight={100}
                  >
                    Fashion that empowers.
                  </Typography>
                  <Divider
                    variant="inset"
                    sx={{ border: "2px solid white", width: "40%" }}
                  />
                  <Button
                    variant="text"
                    sx={{
                      color: "white",
                      mt: "10px !important",
                      paddingX: "0 !important",
                      width: "81px !important",
                    }}
                    component={NavLink}
                    to="/category/women"
                    disableElevation
                  >
                    Shop Now
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>

          {/* feature products */}
          {featureCategories.slice(0, 2).map((featureCategory) => {
            return (
              <ProductsSlider
                key={featureCategory.uid}
                navigatedFrom="all"
                title={featureCategory.category_name}
                isAutoPlay={
                  featureCategory.category_name == "Best Sellling" ? true : false
                }
              ></ProductsSlider>
            );
          })}

          {/* about us section  */}
          <AboutUsBanner />

          {/* feature products */}
          {featureCategories.slice(2).map((featureCategory) => {
            return (
              <ProductsSlider
                key={featureCategory.uid}
                title={featureCategory.category_name}
                navigatedFrom="all"
                isAutoPlay={
                  featureCategory.category_name == "Best Sellling" ? true : false
                }
              ></ProductsSlider>
            );
          })}

          {/* Cutomer Benifits  */}
          <CustomerBenifitsBanner />

          <Box sx={{ display: { xs: "none", md: "flex" } }} justifyContent="center">
            <img width="25%" src="images/bags.png" alt="bags" />
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }} justifyContent="center">
            <img width="45%" src="images/bags.png" alt="bags" />
          </Box>
        </>
      )}
    </motion.div>
  );
};

export default Home;
