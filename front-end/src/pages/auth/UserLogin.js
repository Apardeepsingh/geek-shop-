import {
  TextField,
  Button,
  Box,
  Alert,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  useGetLoggedUserQuery,
  useLoginUserMutation,
} from "../../services/userAuthApi";
import {
  getToken,
  storeToken,
  storeUser,
} from "../../services/localStorageServices";
import { useDispatch } from "react-redux";
import { setUserToken } from "../../features/authSlice";

import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import React from 'react';

const UserLogin = () => {
  const [serverError, setServerError] = useState({});
  const dispatch = useDispatch();

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const navigate = useNavigate();

  let { access_token } = getToken();

  //handling login request
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const actualData = {
      email: data.get("email").trim(),
      password: data.get("password").trim(),
    };

    const res = await loginUser(actualData);
    if (res.error) {
      // console.log(res.error.data.errors)
      setServerError(res.error.data.errors);
    }
    if (res.data) {
      storeToken(res.data.token);
      let { access_token } = getToken();

      dispatch(setUserToken({ access_token: access_token }));
      navigate("/");
    }
  };

  useEffect(() => {
    dispatch(setUserToken({ access_token: access_token }));
  }, [access_token, dispatch]);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Box
        component="form"
        noValidate
        sx={{ mt: 1 }}
        id="user_login_form"
        onSubmit={handleSubmit}
      >
        {/* email field */}
        <TextField
          required
          fullWidth
          margin="normal"
          id="email"
          name="email"
          label="Email"
          sx={{mt:3}}
        />
        {serverError.email ? (
          <Typography color="red" fontSize={12}>
            {"*" + serverError.email[0]}
          </Typography>
        ) : null}

        {/* password field  */}
        <FormControl fullWidth  variant="outlined" sx={{mt:'20px'}}>
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            required
            fullWidth
            margin="normal"
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        {serverError.password ? (
          <Typography color="red" fontSize={12}>
            {"*" + serverError.password[0]}
          </Typography>
        ) : null}

        {/* submit button */}
        <Box textAlign="center">
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 5, mb: 2, px: 5 }}
            >
              Login
            </Button>
          )}
        </Box>
        <NavLink to="/sendpasswordresetmail">Forget Password ?</NavLink>
        {serverError.non_field_errors ? (
          <Alert sx={{ mt: 5 }} severity="error">
            {serverError.non_field_errors[0]}
          </Alert>
        ) : null}
      </Box>
    </>
  );
};

export default UserLogin;
