import { Grid, TextField, Button, Box, Alert, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../services/userAuthApi";
import React from 'react';

const ResetPassword = () => {
  const [serverError, setServerError] = useState({});
  const [serverMsg, setServerMsg] = useState({})
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const {id, token} = useParams()
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const actualData = {
      password: data.get("password"),
      password2: data.get("password2"),
    };

    const res = await resetPassword({ actualData, id, token });
    if (res.error) {
      setServerError(res.error.data.errors);
      setServerMsg({})
    }
    if (res.data) {
      document.getElementById('reset_password').reset()
      setServerError({});
      setServerMsg(res.data)
    }
  };

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item sm={6} xs={12}>
          <h1>Reset Password</h1>
          <Box
            component="form"
            sx={{ mt: 1 }}
            id="reset_password"
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
              >
                Reset
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
        </Grid>
      </Grid>
    </>
  );
};

export default ResetPassword;
