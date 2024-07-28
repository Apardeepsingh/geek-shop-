import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import {
  Button,
  CardActionArea,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  useGetBillboardsQuery,
  useGetCategoriesQuery,
} from "../services/productsApi";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import ProductsSlider from "../components/ProductsSlider";
import Carousel from "react-material-ui-carousel";
import React from 'react';
import PreLoader from "../components/PreLoader";

function Item(props) {

  return (
    <Box
      sx={{
        height: { md: "80vh", xs: "60vh" },
      }}
    >
      <Grid
        container
        component={NavLink}
        to={props.slide.billboard_url}
        sx={{
          background: {
            xs: "black",
            sm: "black",
            md: `url(${`https://apardeepsingh.pythonanywhere.com${props.slide.billboard_image}`})`,
            lg: `url(${`https://apardeepsingh.pythonanywhere.com${props.slide.billboard_image}`})`,
            xl: `url(${`https://apardeepsingh.pythonanywhere.com${props.slide.billboard_image}`})`,
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

              {/* <Box>
                <Button
                  size="large"
                  variant="contained"
                  className="bannerBtn"
                  classtitle="CheckButton"
                >
                  Shop Now
                </Button>
              </Box> */}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

const Category = () => {
  const { gender } = useParams();
  const [menCategories, setMenCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: billboardData, isLoading: isBillboardLoading } = useGetBillboardsQuery();
  const [homeBillBoards, setHomeBillBoards] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [gender]);


  useEffect(() => {
    document.title = gender;
  }, [gender]);

  useEffect(() => {
    if (billboardData) {
      const billboards = billboardData.filter((billboard) => {
        return billboard.billboard_page == gender;
      });

      setHomeBillBoards(billboards);
    }
  }, [billboardData, isBillboardLoading, gender]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(
          `https://apardeepsingh.pythonanywhere.com/product/categories/`
        );
        const filterCats = response.data.filter((cat) => {
          return cat.is_for == gender || cat.is_for == "both";
        });

        setMenCategories(filterCats);
      } catch (error) {
        console.error("Error occurred while fetching data:", error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [gender]);


  return (
    <>
      <ThemeProvider theme={theme}>
        {isLoading || isBillboardLoading ? (
          <PreLoader />
        ) : (
          <>
            <Grid container justifyContent="center">
              <Grid item xs={12} md={11}>
                <Box>
                  <Carousel
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
                </Box>
                <Box mt={3}>
                  <Typography
                    py={3}
                    textAlign="center"
                    variant="h1"
                    sx={{ fontSize: { xs: 22, md: 28 } }}
                    fontWeight={600}
                  >
                    Shop By Categories
                  </Typography>
                  <Grid container sx={{ m: "0 !important" }} justifyContent='center'>
                    <Grid item xs={11.7} md={12}>
                      <Grid container sx={{ gap: { xs: 1, md: 2 } }} >
                        {menCategories.map((cat, index) => {
                          let imgUrl = "";
                          if (gender == "men") {
                            imgUrl = `https://apardeepsingh.pythonanywhere.com${cat.men_image}`;
                          }
                          if (gender == "women") {
                            imgUrl = `https://apardeepsingh.pythonanywhere.com${cat.women_image}`;
                          }

                          return (
                            <Grid item xs={5.8} md={3.9} key={index}>
                              <Box
                                overflow="hidden"
                                position="relative"
                                key={index}
                                sx={{
                                  ":hover img": {
                                    transform: "scale(1.1)",
                                  },
                                  ":hover .catName": {
                                    color: "white",
                                  },
                                  ":hover .overlayBox": {
                                    height: "30%",
                                    backdropFilter: "blur(2px)",
                                  },
                                }}
                              >
                                <CardActionArea
                                  component={NavLink}
                                  to={`/category/${gender}/${cat.slug}`}
                                >
                                  <img
                                    src={imgUrl}
                                    srcSet={imgUrl}
                                    alt={cat.category_name}
                                    loading="lazy"
                                    style={{
                                      display: "block",
                                      width: "100%",
                                      transition: "all 0.3s",
                                    }}
                                  />
                                  <Box
                                    sx={{
                                      background: "rgb(2,0,36)",
                                      background:
                                        "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7176995798319328) 37%, rgba(0,212,255,0) 100%)",
                                      //   background: "#000000c4",
                                      backdropFilter: "blur(1px)",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      mt: "-56px",
                                      position: "absolute",
                                      bottom: 0,
                                      zIndex: 1,
                                      height: "20%",
                                      width: "100%",
                                      transition: "all 0.3s",
                                    }}
                                    className="overlayBox"
                                  >
                                    <Typography
                                      variant="subtitle1"
                                      className="catName"
                                      textAlign="center"
                                      color="#ffffffc9"
                                      sx={{ transition: "all 0.3s", fontSize: { xs: 16, md: 23 } }}
                                    >
                                      {cat.category_name}
                                    </Typography>
                                  </Box>
                                </CardActionArea>
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>

                <ProductsSlider
                  title="Best Selling"
                  navigatedFrom={gender.charAt(0).toUpperCase() + gender.slice(1)}
                  isAutoPlay={true}
                />
              </Grid>
            </Grid>
          </>
        )}
      </ThemeProvider>
    </>
  );
};

export default Category;
