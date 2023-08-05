import {
  TextField,
  Button,
  Box,
  Alert,
  Checkbox,
  FormControlLabel,
  Typography,
  CircularProgress,
  Stack,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  useRegisterUserMutation,
  useUdpateUserMutation,
} from "../../services/userAuthApi";
import { getToken, storeToken } from "../../services/localStorageServices";
import { useDispatch, useSelector } from "react-redux";
import { setUserToken } from "../../features/authSlice";
import { setUserInfo } from "../../features/userSlice";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme";
import React from 'react';

const ProfileInfoForm = () => {
  const preData = useSelector((state) => state.user);

  const [prevFName, setPrevFName] = useState(preData.name.split(" "));

  const getFirstFuLLName = () => {
    var i;
    var firstName = "";
    for (i = 0; i < prevFName.length - 1; i++) {
      firstName = firstName + " " + prevFName[i];
    }

    return firstName;
  };

  const [fullFirstName, setFullFirstName] = useState(getFirstFuLLName());
  const [prevAddress, setPrevAddress] = useState(preData.address.split(" | "));
  const [serverError, setServerError] = useState({});
  const [serverMsg, setServerMsg] = useState({});
  const [updateUserInfo, { isLoading }] = useUdpateUserMutation();
  const { access_token } = getToken();

  const dispatch = useDispatch();

  // console.log(preData)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const actualData = {
      email: data.get("email").trim(),
      name: data.get("name").trim() + " " + data.get("lastname").trim(),
      mobile: data.get("mobile").trim(),
      address:
        data.get("postcode").trim() +
        " | " +
        data.get("address").trim() +
        " | " +
        data.get("city").trim() +
        " | " +
        data.get("state").trim(),
    };
    // console.log(actualData);
    const res = await updateUserInfo({ actualData, access_token });
    if (res.error) {
      setServerError(res.error.data.errors);
      setServerMsg({});
      console.log(res.error);
    }
    if (res.data) {
      // document.getElementById("user_updation_form").reset();
      setServerError({});
      setServerMsg(res.data);
      dispatch(
        setUserInfo({
          id: preData.id,
          email: actualData.email,
          name: actualData.name,
          mobile: actualData.mobile,
          address: actualData.address,
          isAdmin: preData.isAdmin,
        })
      );
      console.log(res.data);
    }
  };

  const nameFieldProps = {
    margin: "none",
    id: "name",
    name: "name",
    label: "Name",
    required: true,
    ...(serverError.name && { error: true }),
    ...(serverError.name && { helperText: serverError.name[0] }),
  };

  const emailFieldProps = {
    margin: "normal",
    id: "email",
    name: "email",
    label: "Email",
    required: true,
    fullWidth: true,
    ...(serverError.email && { error: true }),
    ...(serverError.email && { helperText: serverError.email[0] }),
  };

  const mobileFieldProps = {
    margin: "normal",
    id: "mobile",
    name: "mobile",
    label: "Mobile",
    required: true,
    fullWidth: true,
    ...(serverError.mobile && { error: true }),
    ...(serverError.mobile && { helperText: serverError.mobile[0] }),
  };

  const addressFieldProps = {
    margin: "normal",
    id: "address",
    name: "address",
    label: "Address",
    required: true,
    fullWidth: true,
    ...(serverError.address && { error: true }),
    ...(serverError.address && { helperText: serverError.address[0] }),
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Grid
          container
          justifyContent="center"
          alignItems="start"
          height="100%"
          pt={5}
        >
          <Grid
            item
            lg={8}
            component="form"
            sx={{ mt: 1 }}
            id="user_updation_form"
            onSubmit={handleSubmit}
          >
            <Stack spacing={5}>
              <Stack direction="row" spacing={2} mt={3}>
                {/* name field */}
                <TextField
                  {...nameFieldProps}
                  sx={{ width: "50%" }}
                  defaultValue={fullFirstName}
                />

                {/* last name field */}
                <TextField
                  sx={{ width: "50%" }}
                  required
                  id="lastname"
                  name="lastname"
                  label="Last Name"
                  margin="none"
                  defaultValue={prevFName[prevFName.length - 1]}
                />
              </Stack>

              {/* email field */}
              <TextField {...emailFieldProps} defaultValue={preData.email} />

              {/* mobile field */}
              <TextField {...mobileFieldProps} defaultValue={preData.mobile} />

              {/* address field */}
              <Stack direction="row" spacing={2} mt={2}>
                <TextField
                  required
                  margin="none"
                  id="postcode"
                  name="postcode"
                  label="Post Code"
                  sx={{ width: "33.33%" }}
                  defaultValue={prevAddress[0]}
                />
                <TextField
                  required
                  margin="none"
                  id="city"
                  name="city"
                  label="City"
                  sx={{ width: "33.33%" }}
                  defaultValue={prevAddress[2]}
                />
                <TextField
                  required
                  margin="none"
                  id="state"
                  name="state"
                  label="State"
                  sx={{ width: "33.33%" }}
                  defaultValue={prevAddress[3]}
                />
              </Stack>

              {/* address field */}
              <TextField {...addressFieldProps} defaultValue={prevAddress[1]} />

              <Box textAlign="center">
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2, px: 5 }}
                  >
                    Save
                  </Button>
                )}
              </Box>
              {serverError.non_field_errors ? (
                <Alert severity="error">
                  {serverError.non_field_errors[0]}
                </Alert>
              ) : null}
              {serverMsg.msg ? (
                <Alert sx={{ mt: "0 !important" }} severity="success">
                  {serverMsg.msg}
                </Alert>
              ) : (
                ""
              )}
            </Stack>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default ProfileInfoForm;
