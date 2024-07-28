import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import ChangePassword from "./auth/ChangePassword";
import {
  getToken,
  removeToken,
  removeUser,
} from "../services/localStorageServices";
import { useDispatch, useSelector } from "react-redux";
import { unSetUserToken } from "../features/authSlice";
import {
  useDeleteUserAddressesMutation,
  useGetLoggedUserQuery,
} from "../services/userAuthApi";
import { useEffect, useState } from "react";
import { setUserInfo, unSetUserInfo } from "../features/userSlice";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ProfileInfoForm from "./auth/ProfileInfoForm";
import CloseIcon from "@mui/icons-material/Close";
import { ThemeProvider } from "@mui/material/styles";
import MyTheme from "../theme";
import Slide from "@mui/material/Slide";
import * as React from "react";
import { unSetCartInfo } from "../features/cartSlice";
import { unSetCartCount } from "../features/cartCountSlice";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import { motion } from "framer-motion";
import axios from "axios";
import EditLocationOutlinedIcon from "@mui/icons-material/EditLocationOutlined";
import AddAddress from "./auth/AddAddress";
import EditIcon from "@mui/icons-material/Edit";
import AddLocationRoundedIcon from "@mui/icons-material/AddLocationRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import Form_Testimonial from "./Testimonial";
import Testimonial from "./Testimonial";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { access_token } = getToken();
  const userData = useSelector((state) => state.user);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [openUserAddresses, setopenUserAddresses] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [changeState, setChangeState] = useState(0);
  const [isOpenAddressForm, setIsOpenAddressForm] = useState(false);
  const [openFormId, setOpenFormId] = useState("");
  const [formType, setFormType] = useState();
  const [openTestimonialForm, setOpenTestimonialForm] = useState(false)
  const [selectedAddressData, setSelectedAddressData] = useState({});
  const [
    deleteUserAddress,
    { isLoading: isDeleteAddressLoading, isSuccess: isDeleteAddressSuccess },
  ] = useDeleteUserAddressesMutation();

  useEffect(() => {
    const fetchData = async () => {
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
    }
  };

  const openAddressForm = (addressId, openFormType) => {
    setIsOpenAddressForm(true);
    setOpenFormId(addressId);
    setFormType(openFormType);
  };

  const closeAddressDialog = () => {
    setIsOpenAddressForm(false);
  };

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
    navigate("/login");
  };

  const [open, setOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [openUserInfo, setOpenUserInfo] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const openChangePassword = () => {
    setChangePasswordOpen(true);
  };

  const closeChangePassword = () => {
    setChangePasswordOpen(false);
  };

  const openUserInfoForm = () => {
    setOpenUserInfo(true);
  };

  const closeUserInfoForm = () => {
    setOpenUserInfo(false);
  };

  useEffect(() => {
    document.title = "My Account"

  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <CssBaseline />
      <ThemeProvider theme={MyTheme}>
        <Grid
          container
          direction="column"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box sx={{ width: "100%" }}>
            <Grid item py={5}>
              <Stack direction="row" justifyContent="center" alignItems="top">
                <Typography
                  fontSize={42}
                  fontWeight={700}
                  textAlign="center"
                  variant="h1"
                >
                  My Account
                </Typography>
                {userData.isAdmin ? (
                  <Chip label="Admin" size="small" color="success" />
                ) : null}
              </Stack>
            </Grid>
            <Divider />
            <Grid
              container
              display="flex"
              justifyContent="center"
              bgcolor="#FAFAFA"
              item
              sx={{ paddingTop: { xs: "70px", sm: "16px" } }}
              paddingBottom={5}
            >
              <Grid
                item
                lg={7.2}
                md={10}
                sm={10}
                xs={11}
                // sx={{ width: "60%" }}
              >
                <Paper elevation={2} sx={{ padding: 3 }}>
                  <Grid container sx={{ display: { xs: "none", sm: "flex" } }}>
                    <Grid
                      item
                      lg={3}
                      md={4}
                      sm={3}
                      xs={12}
                      display="flex"
                      justifyContent="left"
                      alignItems="center"
                    >
                      <Avatar
                        src="/broken-image.jpg"
                        variant="square"
                        sx={{ width: "60%", height: "100%" }}
                      />
                    </Grid>
                    <Grid item lg={5} md={4} sm={5} xs={12}>
                      <Box>
                        <Stack spacing={4}>
                          <Box>
                            <Typography variant="subtitle2">Name</Typography>
                            <Typography variant="subtitle1" lineHeight={1.5}>
                              {userData.name}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="subtitle2">Email</Typography>
                            <Typography variant="subtitle1" lineHeight={1.5}>
                              {userData.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Grid>
                    <Grid item lg={4} md={4} sm={4} xs={12}>
                      <Box>
                        <Stack spacing={4}>
                          <Box>
                            <Typography variant="subtitle2">Mobile</Typography>
                            <Typography variant="subtitle1" lineHeight={1.5}>
                              {userData.mobile}
                            </Typography>
                          </Box>
                          {userData.isAdmin ? (
                            <Box>
                              {/* this will shown from mid screens */}
                              <Button
                                startIcon={<AdminPanelSettingsRoundedIcon />}
                                size="large"
                                sx={{
                                  textTransform: "none",
                                  display: { sm: "none", md: "inline-flex" },
                                }}
                                variant="contained"
                                component={NavLink}
                                to="https://apardeepsingh.pythonanywhere.com/admin/"
                                target="_blank"
                              >
                                Admin Dashboard
                              </Button>

                              {/* this will shown in small screen */}
                              <Button
                                size="small"
                                sx={{
                                  textTransform: "none",
                                  display: {
                                    sm: "inline-flex",
                                    md: "none",
                                    xs: "none",
                                  },
                                }}
                                variant="contained"
                                component={NavLink}
                                to="https://apardeepsingh.pythonanywhere.com/admin/"
                                target="_blank"
                              >
                                Admin Dashboard
                              </Button>
                            </Box>
                          ) : null}
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* this is for extra small screen */}
                  <Grid container sx={{ display: { xs: "flex", sm: "none" } }}>
                    <Grid
                      item
                      xs={12}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      // bgcolor='lavender'
                      mt="-77px"
                    >
                      <Avatar
                        src="/broken-image.jpg"
                        variant="square"
                        sx={{ width: "25%", height: "100%" }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="subtitle2">Name</Typography>
                            <Typography variant="subtitle1" lineHeight={1.5}>
                              {userData.name}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="subtitle2">Email</Typography>
                            <Typography variant="subtitle1" lineHeight={1.5}>
                              {userData.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack
                        spacing={4}
                        justifyContent="center"
                        alignItems="end"
                      >
                        <Box>
                          <Typography variant="subtitle2">Mobile</Typography>
                          <Typography variant="subtitle1" lineHeight={1.5}>
                            {userData.mobile}
                          </Typography>
                        </Box>
                        {userData.isAdmin ? (
                          <Box>
                            <Button
                              size="small"
                              sx={{
                                textTransform: "none",
                              }}
                              variant="contained"
                              component={NavLink}
                              to="https://apardeepsingh.pythonanywhere.com/admin/"
                              target="_blank"
                            >
                              Admin Dashboard
                            </Button>
                          </Box>
                        ) : null}
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>

                <Grid container mt={5} spacing={2}>
                  <Grid item lg={4} md={6} sm={12} xs={12}>
                    <Card variant="outlined">
                      <CardActionArea>
                        <CardContent
                          component={NavLink}
                          to="/my-orders"
                          color="black"
                          sx={{ textDecoration: "none" }}
                        >
                          <Stack
                            color="black"
                            spacing={2}
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height={230}
                          >
                            <LocalShippingOutlinedIcon
                              sx={{ fontSize: 34, color: "#000000ba" }}
                            />
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              color="#000000ba"
                            >
                              Orders
                            </Typography>
                            <Typography
                              sx={{ mt: "0 !important" }}
                              variant="subtitle2"
                              fontWeight={100}
                              color="grey"
                            >
                              Check your order status
                            </Typography>
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>

                  {/* for wishlist */}
                  <Grid item lg={4} md={6} sm={12} xs={12}>
                    <Card variant="outlined">
                      <CardActionArea>
                        <CardContent
                          component={NavLink}
                          to="/wishlist"
                          color="black"
                          sx={{ textDecoration: "none" }}
                        >
                          <Stack
                            color="black"
                            spacing={2}
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height={230}
                          >
                            <FavoriteBorderIcon
                              sx={{ fontSize: 34, color: "#000000ba" }}
                            />
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              color="#000000ba"
                            >
                              Wishlist
                            </Typography>
                            <Typography
                              sx={{ mt: "0 !important" }}
                              variant="subtitle2"
                              fontWeight={100}
                              color="grey"
                            >
                              All your curated product collections
                            </Typography>
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>

                  {/* for Cart */}
                  <Grid item lg={4} md={6} sm={12} xs={12}>
                    <Card variant="outlined">
                      <CardActionArea>
                        <CardContent
                          component={NavLink}
                          to="/cart"
                          color="black"
                          sx={{ textDecoration: "none" }}
                        >
                          <Stack
                            color="black"
                            spacing={2}
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height={230}
                          >
                            <ShoppingCartCheckoutOutlinedIcon
                              sx={{ fontSize: 34, color: "#000000ba" }}
                            />
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              color="#000000ba"
                            >
                              Cart
                            </Typography>
                            <Typography
                              sx={{ mt: "0 !important" }}
                              variant="subtitle2"
                              fontWeight={100}
                              color="grey"
                            >
                              Proceed to Checkout
                            </Typography>
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>

                  {/* change password */}
                  <Grid item lg={4} md={6} sm={12} xs={12}>
                    <Card variant="outlined" onClick={openChangePassword}>
                      <CardActionArea>
                        <CardContent
                          color="black"
                          sx={{ textDecoration: "none" }}
                        >
                          <Stack
                            color="black"
                            spacing={2}
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height={230}
                          >
                            <LockResetOutlinedIcon
                              sx={{ fontSize: 34, color: "#000000ba" }}
                            />
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              color="#000000ba"
                            >
                              Change Password
                            </Typography>
                            <Typography
                              sx={{ mt: "0 !important" }}
                              variant="subtitle2"
                              fontWeight={100}
                              color="grey"
                            >
                              Change your password
                            </Typography>
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>

                  {/* Profile */}
                  <Grid item lg={4} md={6} sm={12} xs={12}>
                    <Card variant="outlined" onClick={openUserInfoForm}>
                      <CardActionArea>
                        <CardContent
                          color="black"
                          sx={{ textDecoration: "none" }}
                        >
                          <Stack
                            color="black"
                            spacing={2}
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height={230}
                          >
                            <AccountCircleOutlinedIcon
                              sx={{ fontSize: 34, color: "#000000ba" }}
                            />
                            {/* <Person2OutlinedIcon sx={{ fontSize: 34 }} /> */}
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              color="#000000ba"
                            >
                              Profile
                            </Typography>
                            <Typography
                              sx={{ mt: "0 !important" }}
                              variant="subtitle2"
                              fontWeight={100}
                              color="grey"
                            >
                              Manage your profile
                            </Typography>
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>

                  {/* Manage Addresses */}
                  <Grid item lg={4} md={6} sm={12} xs={12}>
                    <Card
                      variant="outlined"
                      onClick={() => setopenUserAddresses(true)}
                    >
                      <CardActionArea>
                        <CardContent
                          color="black"
                          sx={{ textDecoration: "none" }}
                        >
                          <Stack
                            color="black"
                            spacing={2}
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height={230}
                          >
                            <EditLocationOutlinedIcon
                              sx={{ fontSize: 34, color: "#000000ba" }}
                            />
                            {/* <Person2OutlinedIcon sx={{ fontSize: 34 }} /> */}
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              color="#000000ba"
                            >
                              Addresses
                            </Typography>
                            <Typography
                              sx={{ mt: "0 !important" }}
                              variant="subtitle2"
                              fontWeight={100}
                              color="grey"
                              textAlign="center"
                            >
                              Save addresses for a hassle-free checkout
                            </Typography>
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>

                  {/* customer care */}
                  <Grid item lg={4} md={6} sm={12} xs={12}>
                    <Card variant="outlined">
                      <CardActionArea>
                        <CardContent
                          component={NavLink}
                          to="/contact"
                          color="black"
                          sx={{ textDecoration: "none" }}
                        >
                          <Stack
                            color="black"
                            spacing={2}
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height={230}
                          >
                            <SupportAgentOutlinedIcon
                              sx={{ fontSize: 34, color: "#000000ba" }}
                            />
                            {/* <Person2OutlinedIcon sx={{ fontSize: 34 }} /> */}
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              color="#000000ba"
                            >
                              Contact Us
                            </Typography>
                            <Typography
                              sx={{ mt: "0 !important" }}
                              variant="subtitle2"
                              fontWeight={100}
                              color="grey"
                            >
                              Get in touch with us
                            </Typography>
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>

                  {/* customer care */}
                  <Grid item lg={4} md={6} sm={12} xs={12}>
                    <Card variant="outlined">
                      <CardActionArea onClick={() => setOpenTestimonialForm(true)}>
                        <CardContent
                          color="black"
                          sx={{ textDecoration: "none" }}
                        >
                          <Stack
                            color="black"
                            spacing={2}
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height={230}
                          >
                            <RateReviewOutlinedIcon
                              sx={{ fontSize: 34, color: "#000000ba" }}
                            />
                            {/* <Person2OutlinedIcon sx={{ fontSize: 34 }} /> */}
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              color="#000000ba"
                            >
                              Help us Improve
                            </Typography>
                            <Typography
                              sx={{ mt: "0 !important" }}
                              variant="subtitle2"
                              fontWeight={100}
                              color="grey"
                            >
                              Rate your website experience
                            </Typography>
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>

                  {/* Logout */}
                  <Grid item lg={4} md={6} sm={12} xs={12}>
                    <Card variant="outlined" onClick={handleClickOpen}>
                      <CardActionArea>
                        <CardContent
                          color="black"
                          sx={{ textDecoration: "none" }}
                        >
                          <Stack
                            color="black"
                            spacing={2}
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height={230}
                          >
                            <LogoutOutlinedIcon
                              sx={{ fontSize: 34, color: "#000000ba" }}
                            />
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              color="#000000ba"
                            >
                              Logout
                            </Typography>
                            <Typography
                              sx={{ mt: "0 !important" }}
                              variant="subtitle2"
                              fontWeight={100}
                              color="grey"
                            >
                              Logout of your account
                            </Typography>
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* dialog box for logout confirmation */}
        <Dialog
          // fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle
            fontSize={16}
            textTransform="none"
            fontWeight={500}
            letterSpacing={0}
            id="alert-dialog-title"
          >
            {"Are you sure you want to log out?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleLogout} autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>

        {/* dialog box for change password */}
        <Dialog
          // fullScreen={fullScreen}
          open={changePasswordOpen}
          onClose={closeChangePassword}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle
            fontSize={22}
            textTransform="none"
            fontWeight={700}
            textAlign="center"
            letterSpacing={0}
            id="alert-dialog-title"
          >
            {"Change Password"}
          </DialogTitle>
          <DialogContent sx={{p: {xs: 0, md: "20px 24px !important"}}}>
            <ChangePassword />
          </DialogContent>
        </Dialog>

        {/* dialog box for user info */}
        <Dialog
          fullScreen
          open={openUserInfo}
          onClose={closeUserInfoForm}
          TransitionComponent={Transition}
          aria-labelledby="responsive-dialog-title"
        >
          <AppBar sx={{ position: "relative", bgcolor: "#2B3947" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={closeUserInfoForm}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography
                sx={{ ml: 2, flex: 1 }}
                variant="h6"
                component="div"
                textAlign="center"
              >
                Edit Profile
              </Typography>
            </Toolbar>
          </AppBar>
          <DialogContent>
            <ProfileInfoForm />
          </DialogContent>
        </Dialog>

        {/* dialog box for user Addresses */}
        <Dialog
          fullScreen
          open={openUserAddresses}
          onClose={() => setopenUserAddresses(false)}
          TransitionComponent={Transition}
          aria-labelledby="responsive-dialog-title"
        >
          <AppBar sx={{ position: "relative", bgcolor: "#2B3947" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setopenUserAddresses(false)}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography
                sx={{ ml: 2, flex: 1 }}
                variant="h6"
                component="div"
                textAlign="center"
              >
                Saved Addresses
              </Typography>
            </Toolbar>
          </AppBar>
          <DialogContent>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
              py={5}
            >
              <Grid item md={11}>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  sx={{justifyContent: {xs: "center", md: "left"}}}
                >
                  {userAddresses.map((address) => {
                    return (
                      <Grid item xs={11} md={4} key={address.uid} height="280px">
                        <Card
                          variant="outlined"
                          sx={{
                            p: 3,
                            position: "relative",
                            height: "100%",
                          }}
                        >
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
                                onClick={() =>
                                  openAddressForm(address.uid, "update")
                                }
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

                  <Grid item xs={11} md={4} height="280px">
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
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>

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

        {/* testimonial form modal  */}
        <Dialog
            // fullScreen={fullScreen}
            open={openTestimonialForm}
            onClose={() => setOpenTestimonialForm(false)}
            aria-labelledby="responsive-dialog-title"
            // sx={{width: "100%" }}
            fullWidth
            maxWidth="sm"
            sx={{backdropFilter: 'blur(5px)'}}
          >
            <DialogTitle
              textAlign="center"
              fontSize={21}
              textTransform="none"
              fontWeight={600}
              letterSpacing={0}
              id="alert-dialog-title"
            >
              Help us improve
            </DialogTitle>
            <DialogContent sx={{p: {xs: 0, md: "20px 24px !important"}}}>
              <Testimonial setOpenTestimonialForm={setOpenTestimonialForm} />
            </DialogContent>
          </Dialog>
      </ThemeProvider>
    </motion.div>
  );
};

export default UserDashboard;
