import { Grid, TextField, Button, Box, Alert, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useChangeUserPasswordMutation } from "../../services/userAuthApi";
import { getToken } from "../../services/localStorageServices";
import theme from "../../theme";
import { ThemeProvider } from "@mui/material/styles";
import React from 'react';

const ChangePassword = () => {
  const [serverError, setServerError] = useState({});
  const [serverMsg, setServerMsg] = useState({});
  const [changeUserPassword] = useChangeUserPasswordMutation();
  const { access_token } = getToken();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const actualData = {
      password: data.get("password"),
      password2: data.get("password2"),
    };

    const res = await changeUserPassword({ actualData, access_token });
    if (res.error) {
      setServerError(res.error.data.errors);
      setServerMsg({});
    }
    if (res.data) {
      document.getElementById("change_password").reset();
      setServerError({});
      setServerMsg(res.data);
    }
  };

  const myData = useSelector((state) => state.user);
  return (
    <>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            maxWidth: 600,
            mx: 4,
          }}
        >
          <Box
            component="form"
            sx={{ mt: 1 }}
            id="change_password"
            onSubmit={handleSubmit}
          >
            {/* password field  */}
            <TextField
              required
              fullWidth
              margin="normal"
              id="password"
              name="password"
              label="New Password"
              type="password"
              //   value={}
              //   onChange={}
            />
            {serverError.password ? (
              <Typography color="red" fontSize={12}>
                {"*" + serverError.password[0]}
              </Typography>
            ) : null}

            {/* password field  */}
            <TextField
              required
              fullWidth
              margin="normal"
              id="password2"
              name="password2"
              label="Confirm New Password"
              type="password"
            />
            {serverError.password ? (
              <Typography color="red" fontSize={12}>
                {"*" + serverError.password[0]}
              </Typography>
            ) : null}

            {/* submit button */}
            <Box textAlign="center">
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2, px: 5 }}
                size="large"
              >
                Update
              </Button>
            </Box>
            {serverError.non_field_errors ? (
              <Alert sx={{ mt: 5 }} severity="error">
                {serverError.non_field_errors[0]}
              </Alert>
            ) : null}
            {serverMsg.msg ? (
              <Alert sx={{ mt: 5 }} severity="success">
                {serverMsg.msg}
              </Alert>
            ) : (
              ""
            )}
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default ChangePassword;
