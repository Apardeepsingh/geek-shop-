import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Tooltip,
  Grid,
  Stack,
  Drawer,
  Divider,
} from "@mui/material";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../services/localStorageServices";
import Avatar from "@mui/material/Avatar";

import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Fade from "@mui/material/Fade";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetLoggedUserQuery } from "../services/userAuthApi";
import { setUserInfo, unSetUserInfo } from "../features/userSlice";
import jwt_decode from "jwt-decode";
import { unSetUserToken } from "../features/authSlice";
import theme from "../theme";
import { ThemeProvider } from "@mui/material/styles";
import PropTypes from "prop-types";
import * as React from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Badge from "@mui/material/Badge";
import { useGetCartItemsQuery } from "../services/userAuthApi";
import { setCartInfo, unSetCartInfo } from "../features/cartSlice";
import { setCartCount, unSetCartCount } from "../features/cartCountSlice";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import MenuIcon from "@mui/icons-material/Menu";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import FaceOutlinedIcon from "@mui/icons-material/FaceOutlined";
import Face3OutlinedIcon from "@mui/icons-material/Face3Outlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

function ScrollTop(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({
        block: "center",
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

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

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "10px",
  backgroundColor: theme.palette.grey[100],
  boxShadow: `inset 5px 5px 10px ${theme.palette.grey[300]}, inset -5px -5px 10px ${theme.palette.grey[50]}`,
  transition: "box-shadow 0.3s",
  "&:focus": {
    backgroundColor: theme.palette.common.white,
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },

  marginRight: theme.spacing(0),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(0),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 14,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    minWidth: "22px",
    height: "22px",
    borderRadius: "13px",
  },
}));

// main component starting from here
const Navbar = (props) => {
  const dispatch = useDispatch();
  const [access_token, setAccessToken] = useState();
  const navigate = useNavigate();
  const [searchValue, setsearchValue] = useState("");

  useEffect(() => {
    const { access_token } = getToken();

    setAccessToken(access_token);
  });

  const cartdatastate = useSelector((state) => state.cart);
  const cartCount = useSelector((state) => state.cartCount.cartCount);

  // const [cartCount, setCartCount] = useState(0);

  const isTokenExpired = (access_token) => {
    const decodedToken = jwt_decode(access_token);
    const currentTime = Date.now() / 1000; // Convert to seconds

    if (decodedToken.exp < currentTime) {
      // Token is expired
      return true;
    } else {
      // Token is still valid
      return false;
    }
  };

  const [tokenIsExpired, setTokenIsExpired] = useState();

  const params = {
    ...(access_token && { access_token: access_token }),
  };
  const { data, isLoading, isSuccess } = useGetLoggedUserQuery(params);
  const {
    data: cartDataFetched,
    isLoading: isCartDataFetchedLoading,
    isSuccess: isCartDataFetchedSuccess,
  } = useGetCartItemsQuery(access_token);

  const [userData, setUserData] = useState(data);

  // console.log(data)
  useEffect(() => {
    if (access_token) {
      if (data && isSuccess) {
        // storeUser(data)
        dispatch(
          setUserInfo({
            id: data.id,
            email: data.email,
            name: data.name,
            mobile: data.mobile,
            address: data.address,
            isAdmin: data.is_admin,
          })
        );

        setUserData(data);
      }
    }
  }, [data]);

  useEffect(() => {
    if (access_token) {
      if (cartDataFetched && isCartDataFetchedSuccess) {
        dispatch(setCartInfo(cartDataFetched));
      }
    }
  }, [cartDataFetched]);

  useEffect(() => {
    let cCount = 0;
    if (Object.keys(cartdatastate.cartData).length > 0) {
      cartdatastate.cartData.cart_items.forEach((item) => {
        cCount += item.quantity;
      });
      dispatch(setCartCount(cCount));
    }
  }, [cartdatastate]);

  useEffect(() => {
    if (access_token) {
      const expired = isTokenExpired(access_token);
      // console.log(expired);
      if (expired) {
        removeToken();
        dispatch(unSetUserToken({ access_token: null }));
        dispatch(
          unSetUserInfo({
            id: "",
            name: "",
            email: "",
            mobile: "",
            address: "",
            isAdmin: "",
          })
        );
      }
    }
  }, [access_token]);

  const [name, setName] = useState("Anonymous User");
  const userDisplayData = useSelector((state) => state.user);

  useEffect(() => {
    if (userDisplayData) {
      // console.log(userDisplayData.name);
      setUserData(userDisplayData);
    }
  }, [userDisplayData]);

  useEffect(() => {
    if (userData) {
      if (isLoading) {
        // console.log("loading");
      } else {
        // console.log(data.name);
        var displayNameArray = userData.name.split(" ");
        let displayName =
          displayNameArray[0] +
          " " +
          displayNameArray[displayNameArray.length - 1];

        setName(displayName);
      }
    }
  }, [isLoading, userData]);

  const handleSearch = (e) => {
    e.preventDefault();

    navigate(`search?search=${e.target.elements.searchInput.value}`);

    setsearchValue("");
  };

  const [toggleDrawer, setToggleDrawer] = useState(false);

  // handeling logout
  const handleLogout = () => {
    removeToken();
    dispatch(
      unSetUserInfo({
        id: "",
        name: "",
        email: "",
        mobile: "",
        address: "",
        isAdmin: "",
      })
    );
    dispatch(unSetUserToken({ access_token: null }));
    // removeUser()

    dispatch(unSetCartInfo({}));
    dispatch(unSetCartCount(0));
    setToggleDrawer(false);
    navigate("/login");
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1 }}>
          <ElevationScroll {...props}>
            <AppBar color="secondary">
              <Toolbar>
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  sx={{ display: { xs: "none", lg: "flex" } }}
                >
                  <Grid item md={4.5}>
                    <Stack direction="row" spacing={3}>
                      <Box>
                        <Typography
                          variant="h5"
                          component="h5"
                          display="inline"
                        >
                          Geek-Shop
                        </Typography>
                      </Box>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Button
                          component={NavLink}
                          to="/"
                          style={({ isActive }) => {
                            return {
                              borderBottom: isActive
                                ? " 2px solid #2B3947"
                                : "",
                              // color: isActive ? "#FFFFFF" : "#2B3947",
                            };
                          }}
                          sx={{
                            textTransform: "none",
                            borderRadius: "0px",
                            fontSize: "16px",
                          }}
                        >
                          Home
                        </Button>
                        <Button
                          component={NavLink}
                          to="/shop"
                          style={({ isActive }) => {
                            return {
                              borderBottom: isActive
                                ? " 2px solid #2B3947"
                                : "",
                            };
                          }}
                          sx={{
                            textTransform: "none",
                            borderRadius: "0px",
                            fontSize: "16px",
                          }}
                        >
                          Shop
                        </Button>
                        <Button
                          component={NavLink}
                          to="/category/men"
                          style={({ isActive }) => {
                            return {
                              borderBottom: isActive
                                ? " 2px solid #2B3947"
                                : "",
                            };
                          }}
                          sx={{
                            textTransform: "none",
                            borderRadius: "0px",
                            fontSize: "16px",
                          }}
                        >
                          Men
                        </Button>
                        <Button
                          component={NavLink}
                          to="/category/women"
                          style={({ isActive }) => {
                            return {
                              borderBottom: isActive
                                ? " 2px solid #2B3947"
                                : "",
                            };
                          }}
                          sx={{
                            textTransform: "none",
                            borderRadius: "0px",
                            fontSize: "16px",
                          }}
                        >
                          Women
                        </Button>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item md={4.5}>
                    <Box component="form" onSubmit={handleSearch}>
                      <Search>
                        <SearchIconWrapper>
                          <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                          id="searchInput"
                          sx={{ width: "100%" }}
                          placeholder="Search…"
                          inputProps={{ "aria-label": "search" }}
                          value={searchValue}
                          onChange={(e) => setsearchValue(e.target.value)}
                        />
                      </Search>
                    </Box>
                  </Grid>
                  <Grid item md={3} textAlign="end">
                    <Stack
                      alignItems="center"
                      direction="row"
                      justifyContent="end"
                      spacing={1.3}
                    >
                      <Tooltip title="Wishlist" arrow>
                        <IconButton
                          component={NavLink}
                          to="/wishlist"
                          aria-label="favourite"
                          color="primary"
                          size="large"
                        >
                          <FavoriteBorderOutlinedIcon
                            sx={{ fontSize: "29px" }}
                          />
                        </IconButton>
                      </Tooltip>
                      {access_token ? (
                        <Tooltip title="Cart" arrow>
                          <IconButton
                            component={NavLink}
                            to="/cart"
                            aria-label="cart"
                            color="primary"
                            size="large"
                            // sx={{ml:'6px!important'}}
                          >
                            <StyledBadge
                              badgeContent={cartCount}
                              color="error"
                              max={9}
                              sx={{ fontSize: "29px" }}
                            >
                              {cartCount == 0 ? (
                                <ShoppingCartOutlinedIcon
                                  sx={{ fontSize: "29px" }}
                                />
                              ) : (
                                <ShoppingCartIcon sx={{ fontSize: "29px" }} />
                              )}
                            </StyledBadge>
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Need to Login" arrow>
                          <IconButton
                            component={NavLink}
                            to="/cart"
                            aria-label="cart"
                            color="primary"
                            size="large"
                            // sx={{ml:'6px!important'}}
                          >
                            <ProductionQuantityLimitsIcon
                              sx={{ fontSize: "29px" }}
                            />
                          </IconButton>
                        </Tooltip>
                      )}

                      {isLoading ? (
                        <CircularProgress color="primary" />
                      ) : access_token ? (
                        <Tooltip title="Account settings">
                          <IconButton
                            component={NavLink}
                            to="/userdashboard"
                            color="primary"
                            aria-label="add to shopping cart"
                          >
                            <Avatar {...stringAvatar(name)} />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Login">
                          <IconButton
                            component={NavLink}
                            to="/login"
                            color="primary"
                            aria-label="add to shopping cart"
                          >
                            <Avatar src="/broken-image.jpg" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </Grid>
                </Grid>

                {/* navbar for small screens */}
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  sx={{ display: { xs: "flex", lg: "none" } }}
                >
                  <Grid item xs={11} md={6}>
                    <Box component="form" onSubmit={handleSearch}>
                      <Search>
                        <SearchIconWrapper>
                          <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                          id="searchInput"
                          sx={{ width: "100%" }}
                          placeholder="Search…"
                          inputProps={{ "aria-label": "search" }}
                          value={searchValue}
                          onChange={(e) => setsearchValue(e.target.value)}
                        />
                      </Search>
                    </Box>
                  </Grid>
                </Grid>
              </Toolbar>
            </AppBar>
          </ElevationScroll>

          {/* full appbar for small screens */}
          <ElevationScroll {...props}>
            <AppBar
              color="secondary"
              position="fixed"
              sx={{
                top: "auto",
                bottom: 0,
                bgcolor: "#ffffffa8",
                backdropFilter: "blur(10px)",
                display: { xs: "flex", lg: "none" },
              }}
            >
              <Toolbar>
                <Grid container justifyContent="center" alignItems="center">
                  <Grid
                    item
                    xs={3}
                    textAlign="end"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Tooltip title="Wishlist" arrow>
                      <Button
                        component={NavLink}
                        to="/"
                        aria-label="favourite"
                        color="primary"
                        size="large"
                        style={({ isActive }) => {
                          return {
                            borderTop: isActive ? "3px solid #2B3947" : "",
                            color: isActive ? "#2B3947" : "#0000009c",
                          };
                        }}
                        sx={{ mt: " -6px !important" }}
                      >
                        <HomeOutlinedIcon
                          sx={{ fontSize: "32px !important" }}
                        />
                      </Button>
                    </Tooltip>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {isLoading ? (
                      <CircularProgress color="primary" />
                    ) : access_token ? (
                      <Tooltip title="Account settings">
                        <Button
                          component={NavLink}
                          to="/userdashboard"
                          aria-label="add to shopping cart"
                          color="primary"
                          size="large"
                          style={({ isActive }) => {
                            return {
                              borderTop: isActive ? "2px solid #2B3947" : "",
                              color: isActive ? "#2B3947" : "#0000009c",
                            };
                          }}
                          sx={{ mt: " -6px !important" }}
                        >
                          <PersonOutlineOutlinedIcon
                            sx={{ fontSize: "32px !important" }}
                          />
                        </Button>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Login">
                        <IconButton
                          component={NavLink}
                          to="/login"
                          color="primary"
                          aria-label="add to shopping cart"
                        >
                          <Avatar src="/broken-image.jpg" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {access_token ? (
                      <Tooltip title="Cart" arrow>
                        <Button
                          component={NavLink}
                          to="/cart"
                          aria-label="cart"
                          color="primary"
                          size="large"
                          style={({ isActive }) => {
                            return {
                              borderTop: isActive ? "2px solid #2B3947" : "",
                              color: isActive ? "#2B3947" : "#0000009c",
                            };
                          }}
                          sx={{ mt: " -6px !important" }}
                        >
                          <StyledBadge
                            badgeContent={cartCount}
                            color="error"
                            max={9}
                            sx={{ fontSize: "29px" }}
                          >
                            {cartCount == 0 ? (
                              <ShoppingCartOutlinedIcon
                                sx={{ fontSize: "32px !important" }}
                              />
                            ) : (
                              <ShoppingCartIcon
                                sx={{ fontSize: "32px !important" }}
                              />
                            )}
                          </StyledBadge>
                        </Button>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Need to Login" arrow>
                        <Button
                          component={NavLink}
                          to="/cart"
                          aria-label="cart"
                          color="primary"
                          size="large"
                          style={({ isActive }) => {
                            return {
                              borderTop: isActive ? "2px solid #2B3947" : "",
                              color: isActive ? "#2B3947" : "#0000009c",
                            };
                          }}
                          sx={{ mt: " -6px !important" }}
                        >
                          <ProductionQuantityLimitsIcon
                            sx={{ fontSize: "32px !important" }}
                          />
                        </Button>
                      </Tooltip>
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Box>
                      <Button
                        size="large"
                        onClick={() => setToggleDrawer(true)}
                        sx={{ mt: " -6px !important" }}
                      >
                        <MenuIcon sx={{ fontSize: "32px !important" }} />
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Toolbar>
            </AppBar>
          </ElevationScroll>
          <Toolbar id="back-to-top-anchor" />
          <Box
            className="scrollTopFab"
            sx={{ position: "absolute", zIndex: 9999 }}
          >
            <ScrollTop {...props}>
              <Fab
                size="small"
                aria-label="scroll back to top"
                sx={{ mb: { xs: "50px", lg: "0px" } }}
              >
                <KeyboardArrowUpIcon />
              </Fab>
            </ScrollTop>
          </Box>
        </Box>

        <Drawer
          anchor="right"
          open={toggleDrawer}
          onClose={() => setToggleDrawer(false)}
          sx={{zIndex: 99999}}
        >
          <>
            <Box>
              <Box sx={{ px: 2, py: 2 }}>
                <Typography fontWeight={800} fontSize={16}>
                  {access_token ? `Hello  ${userData.name} ` : "Hello User"}
                </Typography>
              </Box>
              <Divider />
              <Stack
                alignItems="center"
                spacing={2}
                width="100%"
                sx={{ py: 2, mt: 1 }}
              >
                <Button
                  component={NavLink}
                  to="/userdashboard"
                  onClick={() => setToggleDrawer(false)}
                  style={({ isActive }) => {
                    return {
                      color: isActive ? " #2B3947" : "",
                      fontWeight: isActive ? "bold" : "",
                      // color: isActive ? "#FFFFFF" : "#2B3947",
                    };
                  }}
                  endIcon={
                    <AccountCircleOutlinedIcon
                      sx={{ fontSize: "28px !important" }}
                    />
                  }
                  sx={{
                    textTransform: "none",
                    borderRadius: "0px",
                    fontSize: "16px",
                    width: "100%",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    px: 2,
                    alignItems: "center",
                  }}
                >
                  My Account
                </Button>
                <Button
                  component={NavLink}
                  to="/wishlist"
                  onClick={() => setToggleDrawer(false)}
                  style={({ isActive }) => {
                    return {
                      color: isActive ? " #2B3947" : "",
                      fontWeight: isActive ? "bold" : "",
                      // color: isActive ? "#FFFFFF" : "#2B3947",
                    };
                  }}
                  endIcon={
                    <FavoriteBorderOutlinedIcon
                      sx={{ fontSize: "28px !important" }}
                    />
                  }
                  sx={{
                    textTransform: "none",
                    borderRadius: "0px",
                    fontSize: "16px",
                    width: "100%",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    px: 2,
                    alignItems: "center",
                  }}
                >
                  My Wishlist
                </Button>
                <Button
                  component={NavLink}
                  to="/"
                  onClick={() => setToggleDrawer(false)}
                  style={({ isActive }) => {
                    return {
                      color: isActive ? " #2B3947" : "",
                      fontWeight: isActive ? "bold" : "",
                      // color: isActive ? "#FFFFFF" : "#2B3947",
                    };
                  }}
                  endIcon={
                    <HomeOutlinedIcon sx={{ fontSize: "28px !important" }} />
                  }
                  sx={{
                    textTransform: "none",
                    borderRadius: "0px",
                    fontSize: "16px",
                    width: "100%",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    px: 2,
                    alignItems: "center",
                  }}
                >
                  Home
                </Button>
                <Button
                  component={NavLink}
                  to="/shop"
                  onClick={() => setToggleDrawer(false)}
                  style={({ isActive }) => {
                    return {
                      color: isActive ? " #2B3947" : "",
                      fontWeight: isActive ? "bold" : "",
                      // color: isActive ? "#FFFFFF" : "#2B3947",
                    };
                  }}
                  endIcon={
                    <StoreOutlinedIcon sx={{ fontSize: "28px !important" }} />
                  }
                  sx={{
                    textTransform: "none",
                    borderRadius: "0px",
                    fontSize: "16px",
                    width: "100%",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    px: 2,
                    alignItems: "center",
                  }}
                >
                  Shop
                </Button>
                <Button
                  component={NavLink}
                  to="/category/men"
                  onClick={() => setToggleDrawer(false)}
                  style={({ isActive }) => {
                    return {
                      color: isActive ? " #2B3947" : "",
                      fontWeight: isActive ? "bold" : "",
                      // color: isActive ? "#FFFFFF" : "#2B3947",
                    };
                  }}
                  endIcon={
                    <FaceOutlinedIcon sx={{ fontSize: "28px !important" }} />
                  }
                  sx={{
                    textTransform: "none",
                    borderRadius: "0px",
                    fontSize: "16px",
                    width: "100%",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    px: 2,
                    alignItems: "center",
                  }}
                >
                  Men
                </Button>
                <Button
                  component={NavLink}
                  to="/category/women"
                  onClick={() => setToggleDrawer(false)}
                  style={({ isActive }) => {
                    return {
                      color: isActive ? " #2B3947" : "",
                      fontWeight: isActive ? "bold" : "",
                      // color: isActive ? "#FFFFFF" : "#2B3947",
                    };
                  }}
                  endIcon={
                    <Face3OutlinedIcon sx={{ fontSize: "28px !important" }} />
                  }
                  sx={{
                    textTransform: "none",
                    borderRadius: "0px",
                    fontSize: "16px",
                    width: "100%",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    px: 2,
                    alignItems: "center",
                  }}
                >
                  Women
                </Button>
              </Stack>
              <Button
                onClick={handleLogout}
                endIcon={
                  <LogoutOutlinedIcon sx={{ fontSize: "28px !important" }} />
                }
                sx={{
                  textTransform: "none",
                  borderRadius: "0px",
                  fontSize: "16px",
                  width: "100%",
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  px: 2,
                  alignItems: "center",
                  fontWeight: "bold",
                  position: "absolute",
                  bottom: 0,
                  mb: 2,
                }}
                color="error"
              >
                Logout
              </Button>
            </Box>
          </>
        </Drawer>
      </ThemeProvider>
    </>
  );
};

export default Navbar;
