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
} from "@mui/material";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../../services/userAuthApi";
import { getToken, storeToken } from "../../services/localStorageServices";
import { useDispatch } from "react-redux";
import { setUserToken } from "../../features/authSlice";
import React from 'react';

const UserRegistration = () => {
  const [serverError, setServerError] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const actualData = {
      email: data.get("email").trim(),
      name: data.get("name").trim() + " " + data.get("lastname").trim(),
      mobile: data.get("mobile").trim(),
      address: data.get("postcode").trim()+" | "+data.get("address").trim()+" | "+data.get("city").trim()+" | "+data.get("state").trim(),
      password: data.get("password").trim(),
      password2: data.get("password2").trim(),
      tc: data.get("tc"),
    };

    const res = await registerUser(actualData);
    if (res.error) {
      setServerError(res.error.data.errors);
    }
    if (res.data) {
      storeToken(res.data.token);
      let { access_token } = getToken();
      dispatch(setUserToken({ access_token: access_token }));
      navigate("/");
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

  const passwordFieldProps = {
    margin: "normal",
    id: "password",
    name: "password",
    label: "Password",
    required: true,
    fullWidth: true,
    type: "password",
    ...(serverError.password && { error: true }),
    ...(serverError.password && { helperText: serverError.password[0] }),
  };

  const password2FieldProps = {
    margin: "normal",
    id: "password2",
    name: "password2",
    label: "Confirm Password",
    required: true,
    fullWidth: true,
    type: "password",
    ...(serverError.password2 && { error: true }),
    ...(serverError.password2 && { helperText: serverError.password2[0] }),
  };
  return (
    <>
      <Box
        component="form"
        sx={{ mt: 1 }}
        id="user_registration_form"
        onSubmit={handleSubmit}
        >
        <Stack direction="row" spacing={2} mt={3}>
          {/* name field */}
          <TextField {...nameFieldProps} sx={{ width: "50%" }} />

          {/* last name field */}
          <TextField
            sx={{ width: "50%" }}
            required
            id="lastname"
            name="lastname"
            label="Last Name"
            margin="none"
          />
        </Stack>
        {/* email field */}
        <TextField {...emailFieldProps} />

        {/* mobile field */}
        <TextField {...mobileFieldProps} />

        {/* address field */}
        <Stack direction="row" spacing={2} mt={2}>
          <TextField required margin="none" id="postcode" name="postcode" label="Post Code" />
          <TextField required margin="none" id="city" name="city" label="City" />
          <TextField required margin="none" id="state" name="state" label="State" />
        </Stack>

        {/* address field */}
        <TextField {...addressFieldProps} />

        {/* password field  */}
        <TextField {...passwordFieldProps} />

        {/* password2 field  */}
        <TextField {...password2FieldProps} />

        {/* TC agreement */}
        <FormControlLabel
          control={<Checkbox value={true} color="primary" name="tc" id="tc" />}
          label="I agree to terms and conditions."
        />
        {serverError.tc ? (
          <span style={{ color: "red", fontSize: 12 }}>
            {"*" + serverError.tc[0]}
          </span>
        ) : null}

        {/* submit button */}
        <Box textAlign="center">
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2, px: 5 }}
            >
              Register
            </Button>
          )}
        </Box>
        {serverError.non_field_errors ? (
          <Alert severity="error"> {serverError.non_field_errors[0]} </Alert>
        ) : null}
      </Box>
    </>
  );
};

export default UserRegistration;
