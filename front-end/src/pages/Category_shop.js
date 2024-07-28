import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  Slider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  Tab,
  Tabs,
  Drawer,
  IconButton,
} from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  getUserWishlistMapping,
  storeUserWishlistMapping,
} from "../services/localStorageServices";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import { v4 as uuidv4 } from "uuid";
import SquareRoundedIcon from "@mui/icons-material/SquareRounded";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import { useLocation } from "react-router-dom";
import {
  useGetBrandsQuery,
  useGetCategoriesQuery,
  useGetColorsQuery,
} from "../services/productsApi";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import PreLoader from "../components/PreLoader";
import React from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box px={2} width="70%" role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

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

function valuetext(value) {
  return `${value}°C`;
}

const Category_shop = () => {
  const { gender, category } = useParams();
  const [expanded, setExpanded] = useState(false);
  const refetchProducts = useSelector((state) => state.stateRefetchProducts);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [filterUpdateState, setFilterUpdateState] = useState(0);
  const { data, isSuccess } = useGetCategoriesQuery();
  const { data: brandData, isSuccess: isBrandSuccess } = useGetBrandsQuery();
  const { data: colorData, isSuccess: isColorSuccess } = useGetColorsQuery();
  const [allBrands, setAllBrands] = useState([]);
  const [allColors, setAllColors] = useState([]);
  const [sortDrawer, setSortDrawer] = useState(false)
  const [sortOption, setSortOption] = useState("")
  const [filterDrawer, setFilterDrawer] = useState(false)
  const [drawerFilterValue, setDrawerFilterValue] = useState(0)

  useEffect(() => {
    if (brandData && isBrandSuccess) {
      setAllBrands(brandData);
    }
  }, [brandData]);

  useEffect(() => {
    if (colorData && isColorSuccess) {
      setAllColors(colorData);
    }
  }, [colorData]);


  // handeling filters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [priceRange, setPriceRange] = useState(
    queryParams.get("price") ? queryParams.get("price").split("_") : [0, 9999]
  );

  const [filterColors, setFilterColors] = useState(
    queryParams.get("color") ? queryParams.get("color").split("_") : []
  );

  const [ratingFilters, setRatingFilters] = useState(
    queryParams.get("rating") ? queryParams.get("rating").split("_") : []
  );

  const [fitFilters, setFitFilters] = useState(
    queryParams.get("fit") ? queryParams.get("fit").split("_") : []
  );

  const [brandFilters, setBrandFilters] = useState(
    queryParams.get("brand") ? queryParams.get("brand").split("_") : []
  );

  const [size, setSizes] = useState(
    queryParams.get("size") ? queryParams.get("size").split("_") : []
  );

  // handle sort
  const [sortBy, setSortBy] = useState(
    queryParams.get("sort") ? queryParams.get("sort") : ""
  );

  // handeling size filter
  const handleSizeFilter = (event, selectedSizes) => {
    setSizes(selectedSizes);
  };

  // handeling color filters
  const handleColorFilter = (event) => {
    const checked = event.target.checked;

    if (checked) {
      setFilterColors((prev) => [...prev, event.target.value]);
    } else {
      setFilterColors((prev) => prev.filter((c) => c !== event.target.value));
    }
  };

  // handeling rating filters
  const handleRatingFilter = (event) => {
    const checked = event.target.checked;

    if (checked) {
      setRatingFilters((prev) => [...prev, event.target.value]);
    } else {
      setRatingFilters((prev) => prev.filter((c) => c !== event.target.value));
    }
  };

  // handeling fit type filters
  const handleFitFilter = (event) => {
    const checked = event.target.checked;

    if (checked) {
      setFitFilters((prev) => [...prev, event.target.value.toLowerCase()]);
    } else {
      setFitFilters((prev) =>
        prev.filter((c) => c !== event.target.value.toLowerCase())
      );
    }
  };

  // handeling brand filters
  const handleBrandFilter = (event) => {
    const checked = event.target.checked;

    if (checked) {
      setBrandFilters((prev) => [...prev, event.target.value]);
    } else {
      setBrandFilters((prev) => prev.filter((c) => c !== event.target.value));
    }
  };

  // applying filters
  const handleFilters = () => {
    if (filterColors.length >= 0) {
      const colorsString = filterColors.join("_");

      queryParams.set("color", colorsString);

      if (filterColors.length == 0) {
        queryParams.delete("color");
      }
    }

    if (priceRange[0] != 0 || priceRange[1] != 9999) {
      const price_filter = priceRange[0] + "_" + priceRange[1];

      queryParams.set("price", price_filter);
    } else {
      queryParams.delete("price");
    }

    if (size.length > 0) {
      const sizeString = size.join("_");

      queryParams.set("size", sizeString);
    } else {
      queryParams.delete("size");
    }

    if (ratingFilters.length > 0) {
      const ratingString = ratingFilters.join("_");

      queryParams.set("rating", ratingString);
    } else {
      queryParams.delete("rating");
    }

    if (fitFilters.length > 0) {
      const fitString = fitFilters.join("_");

      queryParams.set("fit", fitString);
    } else {
      queryParams.delete("fit");
    }

    if (brandFilters.length > 0) {
      const brandString = brandFilters.join("_");

      queryParams.set("brand", brandString);
    } else {
      queryParams.delete("brand");
    }

    navigate({
      pathname: `/category/${gender}/${category}`,
      search: "?" + queryParams.toString(),
    });

    setFilterUpdateState((prev) => prev + 1);
    setFilterDrawer(false)
  };

  const handleSorting = (sortValue) => {
    setSortOption(sortValue)
    if (sortValue == "clear" || sortValue == null) {
      setSortBy("");
      queryParams.delete("sort");

      navigate({
        pathname: `/category/${gender}/${category}`,
        search: "",
      });

      setFilterUpdateState((prev) => prev + 1);
    } else {
      setSortBy(sortValue);

      queryParams.set("sort", sortValue);

      navigate({
        pathname: `/category/${gender}/${category}`,
        search: "?" + queryParams.toString(),
      });

      setFilterUpdateState((prev) => prev + 1);
    }
    setSortDrawer(false)
  };

  // fetching all products
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get("https://apardeepsingh.pythonanywhere.com/product/");

        let cartegoryFilter = response.data.filter((product) => {
          const genderFilter = product.category.some(
            (cat) => cat.slug == gender
          );

          const categoryFilter = product.category.some(
            (cat) => cat.slug == category
          );

          return genderFilter && categoryFilter;
        });

        let filteredProducts = cartegoryFilter.filter((product) => {
          const productColor = product.color.split(",");
          const productPrice = product.price;
          const minRating = Math.min(...ratingFilters);

          // Check if the product's color is included in the filterColors array
          const colorFilterPassed =
            filterColors.length === 0 || productColor.some(prodColor => filterColors.includes(prodColor.toLowerCase().trim()));


          // Check if the product's price is within the selected price range
          const priceFilterPassed =
            productPrice >= parseInt(priceRange[0]) &&
            productPrice <= parseInt(priceRange[1]);

          // check if the product has the selected size
          const sizeFilterPassed =
            size.length === 0 ||
            product.size_variant.some(
              (sizeObj) =>
                size.includes(sizeObj.size_name.toLowerCase()) &&
                sizeObj.stock > 0
            );

          // check if the product has min rating for selected ratings
          const ratingFilterPassed =
            ratingFilters.length === 0 || product.overall_rating >= minRating;

          // check if the products has selected fit type
          const fitFilterPassed =
            fitFilters.length === 0 ||
            fitFilters.includes(product.fit_type.toLowerCase());

          // check if the products has selected brand
          const brandFilterPassed =
            brandFilters.length === 0 ||
            brandFilters.includes(product.brand_name);

          return (
            colorFilterPassed &&
            priceFilterPassed &&
            sizeFilterPassed &&
            ratingFilterPassed &&
            fitFilterPassed &&
            brandFilterPassed
          );
        });
        if (sortBy == "low") {
          filteredProducts = [...filteredProducts].sort(
            (a, b) => a.price - b.price
          );
        }
        if (sortBy == "high") {
          filteredProducts = [...filteredProducts].sort(
            (a, b) => b.price - a.price
          );
        }
        if (sortBy == "new") {
          filteredProducts = [...filteredProducts].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
        }
        setAllProducts(filteredProducts);
      } catch (error) {
        console.error("Error occurred while fetching data:", error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [refetchProducts, filterUpdateState]);

  // clear filters
  const clearFilters = () => {
    setFilterColors([]);
    setSizes([]);
    setFitFilters([]);
    setBrandFilters([]);
    setRatingFilters([]);
    setPriceRange([0, 9999]);
    queryParams.delete("color");
    queryParams.delete("price");
    queryParams.delete("size");
    queryParams.delete("fit");
    queryParams.delete("rating");
    queryParams.delete("brand");
    setSortBy("");
    queryParams.delete("sort");

    navigate({
      pathname: `/category/${gender}/${category}`,
      search: "",
    });
    setFilterUpdateState((prev) => prev + 1);
    setFilterDrawer(false)
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // handeling wishlist actions
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [isAlreadyWishlisted, setIsAlreadyWishlisted] = useState({});
  const userWishlistMapping = getUserWishlistMapping(); //getting from localstorage
  const loggedinUser = useSelector((state) => state.user);
  const [isProductAddedToWishlist, setIsProductAddedToWishlist] = useState();

  // for checking if already in wishlist
  useEffect(() => {
    const userProductIds = userWishlistMapping[loggedinUser.email];

    if (userProductIds) {
      allProducts.map((product) => {
        setIsAlreadyWishlisted((prevStatus) => ({
          ...prevStatus,
          [product.uid]: userProductIds.includes(product.uid),
        }));
      });
    }
  }, [allProducts, loggedinUser]);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [allProducts]);

  // rating array for filter
  const ratings = [4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1];
  const fitTypes = [
    "Oversized Fit",
    "Slim Fit",
    "Regular Fit",
    "Relaxed Fit",
    "Super Loose Fit",
    "Skinny Fit",
    "Boxy Fit",
    "Loose Comfort Fit",
    "Loose Fit",
    "Straight Fit",
    "Tapered Fit",
    "Square Fit",
  ];

  useEffect(() => {
    document.title = `${category.replace(/-/g, ' ').toUpperCase()} for ${gender.toUpperCase()}`;
  }, [category, gender]);


  return (
    <>
      <ThemeProvider theme={theme}>
        {isLoading ? (
          <PreLoader />
        ) : (
          <>
            <Box textAlign="left" pb={0} sx={{ px: { xs: 0, md: 10 }, pt: { xs: 4, md: 7 } }}>
              <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <Button component={NavLink} to={`/category/${gender}`} startIcon={<ArrowBackIosIcon sx={{ fontSize: "16px" }} />} disableElevation disableRipple sx={{ textTransform: "capitalize" }}>Back</Button>
              </Box>
              <Box>
                <Typography variant="h1" px={1} fontWeight={600} sx={{ textAlign: { xs: "center", md: "start" }, fontSize: { md: 32, xs: "24px " } }}>
                  {category.replace(/-/g, ' ').toUpperCase()} for {gender.toUpperCase()}{" "}
                  <Typography
                    component="span"
                    variant="h1"
                    sx={{ fontSize: { md: 32, xs: 24 } }}
                    color="text.secondary"
                  >
                    {" "}
                    ({allProducts.length}){" "}
                  </Typography>
                </Typography>
              </Box>
            </Box>
            <Grid container justifyContent="center" sx={{ py: { xs: 4, md: 5 } }}>
              <Grid item md={3} lg={2.5} pr={2} sx={{ display: { md: "block", xs: "none" } }}>
                <Box position="sticky" top="70px">
                  <Typography fontWeight={600} color="text.secondary" mb={3}>
                    FILTERS
                  </Typography>
                  <Box mt={1}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        sx={{ px: 0 }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                          spacing={1}
                        >
                          <Typography sx={{ flexShrink: 0 }}>Price</Typography>
                          {priceRange[0] != 0 || priceRange[1] != 9999 ? (
                            <FiberManualRecordIcon
                              color="primary"
                              sx={{ fontSize: "14px", textAlign: "center" }}
                            />
                          ) : null}
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box mr={2} ml={2} mt={4}>
                          <Slider
                            getAriaLabel={() => "Temperature range"}
                            value={priceRange}
                            onChange={(event, newValue) =>
                              setPriceRange(newValue)
                            }
                            getAriaValueText={valuetext}
                            min={0}
                            max={9999}
                            aria-label="Always visible"
                            valueLabelDisplay="on"
                            sx={{
                              "& .MuiSlider-valueLabel": {
                                background: "#2B3947",
                              },
                            }}
                          />
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2bh-content"
                        id="panel2bh-header"
                        sx={{ px: 0 }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                          spacing={1}
                        >
                          <Typography sx={{ flexShrink: 0 }}>Color</Typography>
                          {filterColors.length > 0 ? (
                            <FiberManualRecordIcon
                              color="primary"
                              sx={{ fontSize: "14px", textAlign: "center" }}
                            />
                          ) : null}
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: 0 }}>
                        <Grid container>
                          {
                            allColors.map((color) => {

                              const title = color.color_name.charAt(0).toUpperCase() + color.color_name.slice(1);

                              return (
                                <Grid item md={2} key={color.uid}>
                                  <Tooltip title={title} arrow>
                                    <Checkbox
                                      value={color.color_name}
                                      icon={
                                        <SquareRoundedIcon
                                          sx={{ color: color.color_name, fontSize: "38px" }}
                                        />
                                      }
                                      checkedIcon={
                                        <CheckBoxRoundedIcon
                                          sx={{ color: color.color_name, fontSize: "38px" }}
                                        />
                                      }
                                      checked={filterColors.includes(color.color_name)}
                                      onChange={handleColorFilter}
                                    />
                                  </Tooltip>
                                </Grid>
                              )
                            })
                          }
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        sx={{ px: 0 }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                          spacing={1}
                        >
                          <Typography sx={{ flexShrink: 0 }}>Sizes</Typography>
                          {size.length > 0 ? (
                            <FiberManualRecordIcon
                              color="primary"
                              sx={{ fontSize: "14px", textAlign: "center" }}
                            />
                          ) : null}
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: 1 }}>
                        <ToggleButtonGroup
                          color="primary"
                          value={size}
                          onChange={handleSizeFilter}
                          aria-label="text formatting"
                          sx={{
                            display: "flex",
                            gap: 2,
                            flexWrap: "wrap",
                          }}
                        >
                          <ToggleButton
                            value="xs"
                            aria-label="bold"
                            selected={size.includes("xs")}
                            sx={{
                              border: "2px solid #2B3947 !important",
                              borderRadius: "5px !important",
                              color: "black",
                              width: "55px",
                              height: "35px",
                              py: "0 !important",
                              "&.Mui-selected": {
                                backgroundColor: "#2b394730",
                              },
                            }}
                          >
                            XS
                          </ToggleButton>
                          <ToggleButton
                            value="s"
                            aria-label="italic"
                            selected={size.includes("s")}
                            sx={{
                              border: "2px solid #2B3947 !important",
                              borderRadius: "5px !important",
                              color: "black",
                              width: "55px",
                              height: "35px",
                              py: "0 !important",
                              "&.Mui-selected": {
                                backgroundColor: "#2b394730",
                              },
                            }}
                          >
                            S
                          </ToggleButton>
                          <ToggleButton
                            value="m"
                            aria-label="underlined"
                            selected={size.includes("m")}
                            sx={{
                              border: "2px solid #2B3947 !important",
                              borderRadius: "5px !important",
                              color: "black",
                              width: "55px",
                              height: "35px",
                              py: "0 !important",
                              "&.Mui-selected": {
                                backgroundColor: "#2b394730",
                              },
                            }}
                          >
                            M
                          </ToggleButton>
                          <ToggleButton
                            value="l"
                            aria-label="color"
                            selected={size.includes("l")}
                            sx={{
                              border: "2px solid #2B3947 !important",
                              borderRadius: "5px !important",
                              color: "black",
                              width: "55px",
                              height: "35px",
                              py: "0 !important",
                              "&.Mui-selected": {
                                backgroundColor: "#2b394730",
                              },
                            }}
                          >
                            L
                          </ToggleButton>
                          <ToggleButton
                            value="xl"
                            aria-label="color"
                            selected={size.includes("xl")}
                            sx={{
                              border: "2px solid #2B3947 !important",
                              borderRadius: "5px !important",
                              color: "black",
                              width: "55px",
                              height: "35px",
                              py: "0 !important",
                              "&.Mui-selected": {
                                backgroundColor: "#2b394730",
                              },
                            }}
                          >
                            XL
                          </ToggleButton>
                          <ToggleButton
                            value="xxl"
                            aria-label="color"
                            selected={size.includes("xxl")}
                            sx={{
                              border: "2px solid #2B3947 !important",
                              borderRadius: "5px !important",
                              color: "black",
                              width: "55px",
                              height: "35px",
                              py: "0 !important",
                              "&.Mui-selected": {
                                backgroundColor: "#2b394730",
                              },
                            }}
                          >
                            XXL
                          </ToggleButton>
                          <ToggleButton
                            value="xxxl"
                            aria-label="color"
                            selected={size.includes("xxxl")}
                            sx={{
                              border: "2px solid #2B3947 !important",
                              borderRadius: "5px !important",
                              color: "black",
                              width: "55px",
                              height: "35px",
                              py: "0 !important",
                              "&.Mui-selected": {
                                backgroundColor: "#2b394730",
                              },
                            }}
                          >
                            XXXL
                          </ToggleButton>
                          <ToggleButton
                            value="28"
                            aria-label="color"
                            selected={size.includes("28")}
                            sx={{
                              border: "2px solid #2B3947 !important",
                              borderRadius: "5px !important",
                              color: "black",
                              width: "55px",
                              height: "35px",
                              py: "0 !important",
                              "&.Mui-selected": {
                                backgroundColor: "#2b394730",
                              },
                            }}
                          >
                            28
                          </ToggleButton>
                          <ToggleButton
                            value="30"
                            aria-label="color"
                            selected={size.includes("30")}
                            sx={{
                              border: "2px solid #2B3947 !important",
                              borderRadius: "5px !important",
                              color: "black",
                              width: "55px",
                              height: "35px",
                              py: "0 !important",
                              "&.Mui-selected": {
                                backgroundColor: "#2b394730",
                              },
                            }}
                          >
                            30
                          </ToggleButton>
                          <ToggleButton
                            value="32"
                            aria-label="color"
                            selected={size.includes("32")}
                            sx={{
                              border: "2px solid #2B3947 !important",
                              borderRadius: "5px !important",
                              color: "black",
                              width: "55px",
                              height: "35px",
                              py: "0 !important",
                              "&.Mui-selected": {
                                backgroundColor: "#2b394730",
                              },
                            }}
                          >
                            32
                          </ToggleButton>
                          <ToggleButton
                            value="40"
                            aria-label="color"
                            selected={size.includes("40")}
                            sx={{
                              border: "2px solid #2B3947 !important",
                              borderRadius: "5px !important",
                              color: "black",
                              width: "55px",
                              height: "35px",
                              py: "0 !important",
                              "&.Mui-selected": {
                                backgroundColor: "#2b394730",
                              },
                            }}
                          >
                            40
                          </ToggleButton>
                          <ToggleButton
                            value="42"
                            aria-label="color"
                            selected={size.includes("42")}
                            sx={{
                              border: "2px solid #2B3947 !important",
                              borderRadius: "5px !important",
                              color: "black",
                              width: "55px",
                              height: "35px",
                              py: "0 !important",
                              "&.Mui-selected": {
                                backgroundColor: "#2b394730",
                              },
                            }}
                          >
                            42
                          </ToggleButton>
                          <ToggleButton
                            value="44"
                            aria-label="color"
                            selected={size.includes("44")}
                            sx={{
                              border: "2px solid #2B3947 !important",
                              borderRadius: "5px !important",
                              color: "black",
                              width: "55px",
                              height: "35px",
                              py: "0 !important",
                              "&.Mui-selected": {
                                backgroundColor: "#2b394730",
                              },
                            }}
                          >
                            44
                          </ToggleButton>
                          <ToggleButton
                            value="46"
                            aria-label="color"
                            selected={size.includes("46")}
                            sx={{
                              border: "2px solid #2B3947 !important",
                              borderRadius: "5px !important",
                              color: "black",
                              width: "55px",
                              height: "35px",
                              py: "0 !important",
                              "&.Mui-selected": {
                                backgroundColor: "#2b394730",
                              },
                            }}
                          >
                            46
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        sx={{ px: 0 }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                          spacing={1}
                        >
                          <Typography sx={{ flexShrink: 0 }}>Brand</Typography>
                          {brandFilters.length > 0 ? (
                            <FiberManualRecordIcon
                              color="primary"
                              sx={{ fontSize: "14px", textAlign: "center" }}
                            />
                          ) : null}
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: 1, py: 0 }}>
                        <FormControl component="fieldset">
                          <FormGroup aria-label="position">
                            {allBrands.map((brand, index) => {
                              return (
                                <FormControlLabel
                                  key={index}
                                  value={brand.brand_name}
                                  control={<Checkbox />}
                                  label={brand.brand_name}
                                  labelPlacement="end"
                                  onChange={handleBrandFilter}
                                  checked={brandFilters.includes(
                                    brand.brand_name
                                  )}
                                />
                              );
                            })}
                          </FormGroup>
                        </FormControl>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        sx={{ px: 0 }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                          spacing={1}
                        >
                          <Typography sx={{ flexShrink: 0 }}>Fit</Typography>
                          {fitFilters.length > 0 ? (
                            <FiberManualRecordIcon
                              color="primary"
                              sx={{ fontSize: "14px", textAlign: "center" }}
                            />
                          ) : null}
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: 1, py: 0 }}>
                        <FormControl component="fieldset">
                          <FormGroup aria-label="position">
                            {fitTypes.map((fit, index) => {
                              return (
                                <FormControlLabel
                                  key={index}
                                  value={fit}
                                  control={<Checkbox />}
                                  label={fit}
                                  labelPlacement="end"
                                  onChange={handleFitFilter}
                                  checked={fitFilters.includes(
                                    fit.toLowerCase()
                                  )}
                                />
                              );
                            })}
                          </FormGroup>
                        </FormControl>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        sx={{ px: 0 }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                          spacing={1}
                        >
                          <Typography sx={{ flexShrink: 0 }}>Rating</Typography>
                          {ratingFilters.length > 0 ? (
                            <FiberManualRecordIcon
                              color="primary"
                              sx={{ fontSize: "14px", textAlign: "center" }}
                            />
                          ) : null}
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: 1, py: 0 }}>
                        <FormControl component="fieldset">
                          <FormGroup aria-label="position">
                            {ratings.map((rating, index) => {
                              return (
                                <FormControlLabel
                                  key={index}
                                  value={rating}
                                  control={<Checkbox />}
                                  label={`${rating} and above`}
                                  labelPlacement="end"
                                  onChange={handleRatingFilter}
                                  checked={ratingFilters.includes(
                                    rating.toString()
                                  )}
                                />
                              );
                            })}
                          </FormGroup>
                        </FormControl>
                      </AccordionDetails>
                    </Accordion>
                    <Stack mt={4} direction="row" spacing={2}>
                      <Button
                        onClick={handleFilters}
                        sx={{ width: "50%" }}
                        size="large"
                        variant="contained"
                      >
                        Apply
                      </Button>
                      <Button
                        onClick={clearFilters}
                        sx={{ width: "50%" }}
                        size="large"
                        variant="outlined"
                      >
                        Clear
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={8} lg={8}>
                <Grid px={2} direction="row-reverse" container mb={3} sx={{ display: { md: "flex", xs: "none" } }}>
                  <Grid item md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">
                        Select Sorting Options
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sortBy}
                        label="Select Sorting Options &nbsp; &nbsp; "
                        onChange={(event) => handleSorting(event.target.value)}
                        defaultValue="Newest"
                        IconComponent={SortRoundedIcon}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              background: "#2B3947",
                              background: "#000000ba",
                              backdropFilter: "blur(5px)",
                              color: "#ffffffc9",
                            },
                          },
                        }}
                        sx={{ fontSize: "14px" }}
                      >
                        <MenuItem
                          sx={{ borderBottom: "1px solid  #ffffff30" }}
                          value="clear"
                        >
                          None
                        </MenuItem>
                        <MenuItem
                          sx={{ borderBottom: "1px solid  #ffffff30" }}
                          value="new"
                        >
                          Newest
                        </MenuItem>
                        <MenuItem
                          sx={{ borderBottom: "1px solid  #ffffff30" }}
                          value="low"
                        >
                          Price: Low to High
                        </MenuItem>
                        <MenuItem value="high">Price: High to Low</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container>
                  {allProducts.length > 0 ? (
                    allProducts.map((product) => {
                      const backendBaseUrl = "https://apardeepsingh.pythonanywhere.com";
                      const cardThumbUrl = `${backendBaseUrl}${product.card_thumb_image}`;

                      const disocuntPercentage = parseInt(
                        ((product.maximum_retail_price - product.price) /
                          product.maximum_retail_price) *
                        100
                      );

                      const uniqueId = uuidv4();

                      return (
                        <Grid item xs={6} md={4} key={product.uid}>
                          <Card
                            sx={{
                              mx: "5px !important",
                              borderRadius: "0px",
                              margin: { xs: "0 0", md: "0 12px !important" },
                              transition: "all 0.3s",
                              boxShadow: "none",
                              "&:hover .productImg": {
                                transform: "scale(1.1)",
                              },
                              "&:hover .productCardImageOverlay:before": {
                                opacity: 0.3,
                              },
                              "&:hover .addToCartIcon": { right: 0 },
                              "&:hover .addToWishlistIcon": { right: 0 },
                            }}
                          >
                            <Box
                              component="div"
                              sx={{
                                overflow: "hidden",
                                position: "relative",
                              }}
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
                              </CardActionArea>
                              <CardContent sx={{ textAlign: { md: "center", xs: "start" }, p: { xs: "8px", md: "16px" } }}>
                                <Typography
                                  gutterBottom
                                  variant="subtitle2"
                                  sx={{ fontSize: { xs: 10, md: 12 } }}
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
                                  sx={{ display: { xs: "none", md: "inline-flex" } }}
                                />
                              </CardContent>

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
                                      sx={{
                                        color: "#2B3947",
                                        fontSize: "32px",
                                      }}
                                    />
                                  }
                                  checkedIcon={
                                    <Favorite
                                      sx={{
                                        color: "#D23F57",
                                        fontSize: "32px",
                                      }}
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
                                    handleProductAddToWishlistAction(
                                      event,
                                      product
                                    )
                                  }
                                  checked={
                                    isAlreadyWishlisted[product.uid] || false
                                  }
                                />
                              </Tooltip>
                            </Box>
                          </Card>
                        </Grid>
                      );
                    })
                  ) : (
                    <Stack
                      width="90%"
                      margin="10% auto"
                      justifyContent="center"
                      alignItems="center"
                      spacing={3}
                    >
                      <Typography
                        color="text.secondary"
                        variant="h1"
                        fontSize="32px"
                      >
                        Sorry, We couldn’t Find any matches!
                      </Typography>
                      <Button
                        size="large"
                        variant="outlined"
                        onClick={clearFilters}
                      >
                        Clear Filters
                      </Button>
                    </Stack>
                  )}
                </Grid>
              </Grid>
            </Grid>

            {/* filter and sort for small screens  */}
            <Box position='fixed' bottom={0} bgcolor='white' zIndex={9999} width='100%'
              sx={{ display: { xs: "block", md: "none" }, boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", }} >
              <Stack direction='row' >
                <Button onClick={() => setSortDrawer(true)} startIcon={
                  <Box display='flex' alignItems='center' justifyContent='center'>
                    {
                      sortBy.length > 0 ? <FiberManualRecordIcon sx={{ fontSize: "12px !important", mr: 1 }} /> : null
                    }
                    <SyncAltIcon sx={{ transform: 'rotate(90deg)' }} />
                  </Box>
                }
                  sx={{ width: "50%", borderRadius: 0, py: "15px" }}
                  size="large">
                  Sort
                </Button>
                <Divider orientation="vertical" flexItem />
                <Button onClick={() => setFilterDrawer(true)} startIcon={
                  <Box display='flex' alignItems='center' justifyContent='center'>
                    {
                      (priceRange[0] != 0 || priceRange[1] != 9999) || filterColors.length > 0 || size.length > 0 || brandFilters.length > 0 || fitFilters.length > 0 || ratingFilters.length > 0 ? <FiberManualRecordIcon sx={{ fontSize: "12px !important", mr: 1 }} /> : null
                    }
                    <FilterAltOutlinedIcon />
                  </Box>
                } sx={{ width: "50%", borderRadius: 0, py: "15px" }} size="large">Filter</Button>
              </Stack>
            </Box>



            {/* sort drawer  for small screens */}
            <Drawer
              anchor="bottom"
              open={sortDrawer}
              onClose={() => setSortDrawer(false)}
              sx={{ zIndex: 9999 }}
              PaperProps={{
                sx: {
                  borderTopRightRadius: "12px", // No need for !important
                  borderTopLeftRadius: "12px",  // No need for !important
                },
              }}
            >
              <Box py={2} px={2} display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant="subtitle1" fontWeight={700} fontSize={16} >Sort By</Typography>
                <IconButton onClick={() => setSortDrawer(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Divider />
              <ToggleButtonGroup
                orientation="vertical"
                value={sortOption}
                exclusive
                onChange={(event, newSort) => handleSorting(newSort)}
                aria-label="text alignment"
              >
                <ToggleButton sx={{ justifyContent: 'flex-start', textTransform: 'none', color: "black" }} value="clear" aria-label="left aligned" >
                  None
                </ToggleButton>
                <ToggleButton sx={{ justifyContent: 'flex-start', textTransform: 'none', color: "black", fontWeight: sortBy.includes("new") && 600 }} value="new" aria-label="centered" selected={sortBy.includes("new")} >
                  Newest
                </ToggleButton>
                <ToggleButton sx={{ justifyContent: 'flex-start', textTransform: 'none', color: "black", fontWeight: sortBy.includes("low") && 600 }} value="low" aria-label="right aligned" selected={sortBy.includes("low")} >
                  Price: Low to High
                </ToggleButton>
                <ToggleButton sx={{ justifyContent: 'flex-start', textTransform: 'none', color: "black", fontWeight: sortBy.includes("high") && 600 }} value="high" aria-label="justified" selected={sortBy.includes("high")} >
                  Price: High to Low
                </ToggleButton>
              </ToggleButtonGroup>
            </Drawer>


            {/* filter drawer  for small screens */}
            <Drawer
              anchor="bottom"
              open={filterDrawer}
              onClose={() => setFilterDrawer(false)}
              sx={{ zIndex: 9999 }}
              PaperProps={{
                sx: {
                  borderTopRightRadius: "12px", // No need for !important
                  borderTopLeftRadius: "12px",  // No need for !important
                },
              }}
            >
              <Box py={2} px={2} display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant="subtitle1" fontWeight={700} fontSize={16} >Filters</Typography>
                <IconButton onClick={() => setFilterDrawer(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Divider />
              <Box
                sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}
              >
                <Tabs
                  orientation="vertical"
                  variant="scrollable"
                  value={drawerFilterValue}
                  onChange={(event, newFilterValue) => setDrawerFilterValue(newFilterValue)}
                  aria-label="Vertical tabs example"
                  sx={{ borderRight: 1, borderColor: 'divider', width: "30%", pb: 22 }}
                >
                  <Tab sx={{ textTransform: "capitalize", alignItems: "start" }} label={<Box display='flex' alignItems='center' justifyContent='center'> <Typography fontSize={14}>Price</Typography>         {(priceRange[0] != 0 || priceRange[1] != 9999) ? <FiberManualRecordIcon sx={{ fontSize: "12px !important", ml: 1, color: "#2B3947" }} /> : null} </Box>} id="vertical-tab-0" />

                  <Tab sx={{ textTransform: "capitalize", alignItems: "start" }} label={<Box display='flex' alignItems='center' justifyContent='center'> <Typography fontSize={14}>Color</Typography>       {filterColors.length > 0 ? <FiberManualRecordIcon sx={{ fontSize: "12px !important", ml: 1, color: "#2B3947" }} /> : null}</Box>} id="vertical-tab-1" />

                  <Tab sx={{ textTransform: "capitalize", alignItems: "start" }} label={<Box display='flex' alignItems='center' justifyContent='center'> <Typography fontSize={14}>Sizes</Typography> {size.length > 0 ? <FiberManualRecordIcon sx={{ fontSize: "12px !important", ml: 1, color: "#2B3947" }} /> : null} </Box>} id="vertical-tab-1" />

                  <Tab sx={{ textTransform: "capitalize", alignItems: "start" }} label={<Box display='flex' alignItems='center' justifyContent='center'> <Typography fontSize={14}>Brand</Typography> {brandFilters.length > 0 ? <FiberManualRecordIcon sx={{ fontSize: "12px !important", ml: 1, color: "#2B3947" }} /> : null} </Box>} id="vertical-tab-1" />

                  <Tab sx={{ textTransform: "capitalize", alignItems: "start" }} label={<Box display='flex' alignItems='center' justifyContent='center'> <Typography fontSize={14}>Fit</Typography> {fitFilters.length > 0 ? <FiberManualRecordIcon sx={{ fontSize: "12px !important", ml: 1, color: "#2B3947" }} /> : null}</Box>} id="vertical-tab-1" />

                  <Tab sx={{ textTransform: "capitalize", alignItems: "start" }} label={<Box display='flex' alignItems='center' justifyContent='center'> <Typography fontSize={14}>Rating</Typography> {ratingFilters.length > 0 ? <FiberManualRecordIcon sx={{ fontSize: "12px !important", ml: 1, color: "#2B3947" }} /> : null} </Box>} id="vertical-tab-1" />
                </Tabs>
                <TabPanel value={drawerFilterValue} index={0}>
                  <Box mr={2} ml={2} mt={8}>
                    <Slider
                      getAriaLabel={() => "Temperature range"}
                      value={priceRange}
                      onChange={(event, newValue) =>
                        setPriceRange(newValue)
                      }
                      getAriaValueText={valuetext}
                      min={0}
                      max={9999}
                      aria-label="Always visible"
                      valueLabelDisplay="on"
                      sx={{
                        "& .MuiSlider-valueLabel": {
                          background: "#2B3947",
                        },
                      }}
                    />
                  </Box>
                </TabPanel>
                <TabPanel value={drawerFilterValue} index={1}>
                  <Grid container>
                    <Grid item md={2}>
                      <Tooltip title="Maroon" arrow>
                        <Checkbox
                          value="maroon"
                          icon={
                            <SquareRoundedIcon
                              sx={{ color: "maroon", fontSize: "38px" }}
                            />
                          }
                          checkedIcon={
                            <CheckBoxRoundedIcon
                              sx={{ color: "maroon", fontSize: "38px" }}
                            />
                          }
                          checked={filterColors.includes("maroon")}
                          onChange={handleColorFilter}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item md={2}>
                      <Tooltip title="Blue" arrow>
                        <Checkbox
                          value="blue"
                          icon={
                            <SquareRoundedIcon
                              sx={{ color: "blue", fontSize: "38px" }}
                            />
                          }
                          checkedIcon={
                            <CheckBoxRoundedIcon
                              sx={{ color: "blue", fontSize: "38px" }}
                            />
                          }
                          checked={filterColors.includes("blue")}
                          onChange={handleColorFilter}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item md={2}>
                      <Tooltip title="Black" arrow>
                        <Checkbox
                          value="black"
                          icon={
                            <SquareRoundedIcon
                              sx={{ color: "black", fontSize: "38px" }}
                            />
                          }
                          checkedIcon={
                            <CheckBoxRoundedIcon
                              sx={{ color: "black", fontSize: "38px" }}
                            />
                          }
                          checked={filterColors.includes("black")}
                          onChange={handleColorFilter}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item md={2}>
                      <Tooltip title="White" arrow>
                        <Checkbox
                          value="white"
                          icon={
                            <SquareRoundedIcon
                              sx={{ color: "#f4f4f4", fontSize: "38px" }}
                            />
                          }
                          checkedIcon={
                            <CheckBoxRoundedIcon
                              sx={{ color: "#f4f4f4", fontSize: "38px" }}
                            />
                          }
                          checked={filterColors.includes("white")}
                          onChange={handleColorFilter}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item md={2}>
                      <Tooltip title="Gray" arrow>
                        <Checkbox
                          value="gray"
                          icon={
                            <SquareRoundedIcon
                              sx={{ color: "gray", fontSize: "38px" }}
                            />
                          }
                          checkedIcon={
                            <CheckBoxRoundedIcon
                              sx={{ color: "gray", fontSize: "38px" }}
                            />
                          }
                          checked={filterColors.includes("gray")}
                          onChange={handleColorFilter}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item md={2}>
                      <Tooltip title="Red" arrow>
                        <Checkbox
                          value="red"
                          icon={
                            <SquareRoundedIcon
                              sx={{ color: "red", fontSize: "38px" }}
                            />
                          }
                          checkedIcon={
                            <CheckBoxRoundedIcon
                              sx={{ color: "red", fontSize: "38px" }}
                            />
                          }
                          checked={filterColors.includes("red")}
                          onChange={handleColorFilter}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item md={2}>
                      <Tooltip title="Yellow" arrow>
                        <Checkbox
                          value="yellow"
                          icon={
                            <SquareRoundedIcon
                              sx={{ color: "yellow", fontSize: "38px" }}
                            />
                          }
                          checkedIcon={
                            <CheckBoxRoundedIcon
                              sx={{ color: "yellow", fontSize: "38px" }}
                            />
                          }
                          checked={filterColors.includes("yellow")}
                          onChange={handleColorFilter}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item md={2}>
                      <Tooltip title="Orange" arrow>
                        <Checkbox
                          value="orange"
                          icon={
                            <SquareRoundedIcon
                              sx={{ color: "orange", fontSize: "38px" }}
                            />
                          }
                          checkedIcon={
                            <CheckBoxRoundedIcon
                              sx={{ color: "orange", fontSize: "38px" }}
                            />
                          }
                          checked={filterColors.includes("orange")}
                          onChange={handleColorFilter}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item md={2}>
                      <Tooltip title="Brown" arrow>
                        <Checkbox
                          value="brown"
                          icon={
                            <SquareRoundedIcon
                              sx={{ color: "brown", fontSize: "38px" }}
                            />
                          }
                          checkedIcon={
                            <CheckBoxRoundedIcon
                              sx={{ color: "brown", fontSize: "38px" }}
                            />
                          }
                          checked={filterColors.includes("brown")}
                          onChange={handleColorFilter}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item md={2}>
                      <Tooltip title="Pink" arrow>
                        <Checkbox
                          value="pink"
                          icon={
                            <SquareRoundedIcon
                              sx={{ color: "pink", fontSize: "38px" }}
                            />
                          }
                          checkedIcon={
                            <CheckBoxRoundedIcon
                              sx={{ color: "pink", fontSize: "38px" }}
                            />
                          }
                          checked={filterColors.includes("pink")}
                          onChange={handleColorFilter}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item md={2}>
                      <Tooltip title="Beige" arrow>
                        <Checkbox
                          value="beige"
                          icon={
                            <SquareRoundedIcon
                              sx={{ color: "beige", fontSize: "38px" }}
                            />
                          }
                          checkedIcon={
                            <CheckBoxRoundedIcon
                              sx={{ color: "beige", fontSize: "38px" }}
                            />
                          }
                          checked={filterColors.includes("beige")}
                          onChange={handleColorFilter}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item md={2}>
                      <Tooltip title="Green" arrow>
                        <Checkbox
                          value="green"
                          icon={
                            <SquareRoundedIcon
                              sx={{ color: "green", fontSize: "38px" }}
                            />
                          }
                          checkedIcon={
                            <CheckBoxRoundedIcon
                              sx={{ color: "green", fontSize: "38px" }}
                            />
                          }
                          checked={filterColors.includes("green")}
                          onChange={handleColorFilter}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item md={2}>
                      <Tooltip title="Charcoal" arrow>
                        <Checkbox
                          value="charcoal"
                          icon={
                            <SquareRoundedIcon
                              sx={{ color: "charcoal", fontSize: "38px" }}
                            />
                          }
                          checkedIcon={
                            <CheckBoxRoundedIcon
                              sx={{ color: "charcoal", fontSize: "38px" }}
                            />
                          }
                          checked={filterColors.includes("charcoal")}
                          onChange={handleColorFilter}
                        />
                      </Tooltip>
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={drawerFilterValue} index={2}>
                  <ToggleButtonGroup
                    color="primary"
                    value={size}
                    onChange={handleSizeFilter}
                    aria-label="text formatting"
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <ToggleButton
                      value="xs"
                      aria-label="bold"
                      selected={size.includes("xs")}
                      sx={{
                        border: "2px solid #2B3947 !important",
                        borderRadius: "5px !important",
                        color: "black",
                        width: "55px",
                        height: "35px",
                        py: "0 !important",
                        "&.Mui-selected": {
                          backgroundColor: "#2b394730",
                        },
                      }}
                    >
                      XS
                    </ToggleButton>
                    <ToggleButton
                      value="s"
                      aria-label="italic"
                      selected={size.includes("s")}
                      sx={{
                        border: "2px solid #2B3947 !important",
                        borderRadius: "5px !important",
                        color: "black",
                        width: "55px",
                        height: "35px",
                        py: "0 !important",
                        "&.Mui-selected": {
                          backgroundColor: "#2b394730",
                        },
                      }}
                    >
                      S
                    </ToggleButton>
                    <ToggleButton
                      value="m"
                      aria-label="underlined"
                      selected={size.includes("m")}
                      sx={{
                        border: "2px solid #2B3947 !important",
                        borderRadius: "5px !important",
                        color: "black",
                        width: "55px",
                        height: "35px",
                        py: "0 !important",
                        "&.Mui-selected": {
                          backgroundColor: "#2b394730",
                        },
                      }}
                    >
                      M
                    </ToggleButton>
                    <ToggleButton
                      value="l"
                      aria-label="color"
                      selected={size.includes("l")}
                      sx={{
                        border: "2px solid #2B3947 !important",
                        borderRadius: "5px !important",
                        color: "black",
                        width: "55px",
                        height: "35px",
                        py: "0 !important",
                        "&.Mui-selected": {
                          backgroundColor: "#2b394730",
                        },
                      }}
                    >
                      L
                    </ToggleButton>
                    <ToggleButton
                      value="xl"
                      aria-label="color"
                      selected={size.includes("xl")}
                      sx={{
                        border: "2px solid #2B3947 !important",
                        borderRadius: "5px !important",
                        color: "black",
                        width: "55px",
                        height: "35px",
                        py: "0 !important",
                        "&.Mui-selected": {
                          backgroundColor: "#2b394730",
                        },
                      }}
                    >
                      XL
                    </ToggleButton>
                    <ToggleButton
                      value="xxl"
                      aria-label="color"
                      selected={size.includes("xxl")}
                      sx={{
                        border: "2px solid #2B3947 !important",
                        borderRadius: "5px !important",
                        color: "black",
                        width: "55px",
                        height: "35px",
                        py: "0 !important",
                        "&.Mui-selected": {
                          backgroundColor: "#2b394730",
                        },
                      }}
                    >
                      XXL
                    </ToggleButton>
                    <ToggleButton
                      value="xxxl"
                      aria-label="color"
                      selected={size.includes("xxxl")}
                      sx={{
                        border: "2px solid #2B3947 !important",
                        borderRadius: "5px !important",
                        color: "black",
                        width: "55px",
                        height: "35px",
                        py: "0 !important",
                        "&.Mui-selected": {
                          backgroundColor: "#2b394730",
                        },
                      }}
                    >
                      XXXL
                    </ToggleButton>
                    <ToggleButton
                      value="28"
                      aria-label="color"
                      selected={size.includes("28")}
                      sx={{
                        border: "2px solid #2B3947 !important",
                        borderRadius: "5px !important",
                        color: "black",
                        width: "55px",
                        height: "35px",
                        py: "0 !important",
                        "&.Mui-selected": {
                          backgroundColor: "#2b394730",
                        },
                      }}
                    >
                      28
                    </ToggleButton>
                    <ToggleButton
                      value="30"
                      aria-label="color"
                      selected={size.includes("30")}
                      sx={{
                        border: "2px solid #2B3947 !important",
                        borderRadius: "5px !important",
                        color: "black",
                        width: "55px",
                        height: "35px",
                        py: "0 !important",
                        "&.Mui-selected": {
                          backgroundColor: "#2b394730",
                        },
                      }}
                    >
                      30
                    </ToggleButton>
                    <ToggleButton
                      value="32"
                      aria-label="color"
                      selected={size.includes("32")}
                      sx={{
                        border: "2px solid #2B3947 !important",
                        borderRadius: "5px !important",
                        color: "black",
                        width: "55px",
                        height: "35px",
                        py: "0 !important",
                        "&.Mui-selected": {
                          backgroundColor: "#2b394730",
                        },
                      }}
                    >
                      32
                    </ToggleButton>
                    <ToggleButton
                      value="40"
                      aria-label="color"
                      selected={size.includes("40")}
                      sx={{
                        border: "2px solid #2B3947 !important",
                        borderRadius: "5px !important",
                        color: "black",
                        width: "55px",
                        height: "35px",
                        py: "0 !important",
                        "&.Mui-selected": {
                          backgroundColor: "#2b394730",
                        },
                      }}
                    >
                      40
                    </ToggleButton>
                    <ToggleButton
                      value="42"
                      aria-label="color"
                      selected={size.includes("42")}
                      sx={{
                        border: "2px solid #2B3947 !important",
                        borderRadius: "5px !important",
                        color: "black",
                        width: "55px",
                        height: "35px",
                        py: "0 !important",
                        "&.Mui-selected": {
                          backgroundColor: "#2b394730",
                        },
                      }}
                    >
                      42
                    </ToggleButton>
                    <ToggleButton
                      value="44"
                      aria-label="color"
                      selected={size.includes("44")}
                      sx={{
                        border: "2px solid #2B3947 !important",
                        borderRadius: "5px !important",
                        color: "black",
                        width: "55px",
                        height: "35px",
                        py: "0 !important",
                        "&.Mui-selected": {
                          backgroundColor: "#2b394730",
                        },
                      }}
                    >
                      44
                    </ToggleButton>
                    <ToggleButton
                      value="46"
                      aria-label="color"
                      selected={size.includes("46")}
                      sx={{
                        border: "2px solid #2B3947 !important",
                        borderRadius: "5px !important",
                        color: "black",
                        width: "55px",
                        height: "35px",
                        py: "0 !important",
                        "&.Mui-selected": {
                          backgroundColor: "#2b394730",
                        },
                      }}
                    >
                      46
                    </ToggleButton>
                  </ToggleButtonGroup>
                </TabPanel>
                <TabPanel value={drawerFilterValue} index={3}>
                  <FormControl component="fieldset">
                    <FormGroup aria-label="position">
                      {allBrands.map((brand, index) => {
                        return (
                          <FormControlLabel
                            key={index}
                            value={brand.brand_name}
                            control={<Checkbox />}
                            label={brand.brand_name}
                            labelPlacement="end"
                            onChange={handleBrandFilter}
                            checked={brandFilters.includes(
                              brand.brand_name
                            )}
                          />
                        );
                      })}
                    </FormGroup>
                  </FormControl>
                </TabPanel>
                <TabPanel value={drawerFilterValue} index={4}>
                  <FormControl component="fieldset">
                    <FormGroup aria-label="position">
                      {fitTypes.map((fit, index) => {
                        return (
                          <FormControlLabel
                            key={index}
                            value={fit}
                            control={<Checkbox />}
                            label={fit}
                            labelPlacement="end"
                            onChange={handleFitFilter}
                            checked={fitFilters.includes(
                              fit.toLowerCase()
                            )}
                          />
                        );
                      })}
                    </FormGroup>
                  </FormControl>
                </TabPanel>
                <TabPanel value={drawerFilterValue} index={5}>
                  <FormControl component="fieldset">
                    <FormGroup aria-label="position">
                      {ratings.map((rating, index) => {
                        return (
                          <FormControlLabel
                            key={index}
                            value={rating}
                            control={<Checkbox />}
                            label={`${rating} and above`}
                            labelPlacement="end"
                            onChange={handleRatingFilter}
                            checked={ratingFilters.includes(
                              rating.toString()
                            )}
                          />
                        );
                      })}
                    </FormGroup>
                  </FormControl>
                </TabPanel>
              </Box>
              <Stack mt={4} direction="row" spacing={0}>
                <Button
                  onClick={clearFilters}
                  sx={{ width: "50%", borderRadius: 0, py: 1 }}
                  size="large"
                  variant="outlined"
                >
                  Clear
                </Button>
                <Button
                  onClick={handleFilters}
                  sx={{ width: "50%", borderRadius: 0, py: 1 }}
                  size="large"
                  variant="contained"
                >
                  Apply
                </Button>
              </Stack>
            </Drawer>
          </>
        )}
      </ThemeProvider>
    </>
  );
};

export default Category_shop;
