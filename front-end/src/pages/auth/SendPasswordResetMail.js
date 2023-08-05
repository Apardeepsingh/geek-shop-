import { Grid, TextField, Button, Box, Alert, Typography, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useSendPasswordResetEmailMutation } from "../../services/userAuthApi";
import React from 'react';
import {motion} from 'framer-motion'

const SendPasswordResetMail = () => {
  const [serverError, setServerError] = useState({});
  const [serverMsg, setServerMsg] = useState({});
  const [sendPasswordResetEmail, { isLoading }] =
    useSendPasswordResetEmailMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const actualData = {
      email: data.get("email"),
    };

    const res = await sendPasswordResetEmail(actualData);

    if (res.error) {
      console.log(res.error.data.errors);
      setServerError(res.error.data.errors);
      setServerMsg({});
    }
    if (res.data) {
      document.getElementById("password_reset_form").reset();
      setServerError({});
      setServerMsg(res.data);
    }
  };

  return (
    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
      <Grid container justifyContent="center">
        <Grid item sm={6} xs={12}>
          <h1>Enter Registered Email</h1>
          <Box
            component="form"
            sx={{ mt: 1 }}
            id="password_reset_form"
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
              type="email"
              //   value={}
              //   onChange={}
            />
            {serverError.email ? (
              <Typography color="red" fontSize={12}>
                {"*" + serverError.email[0]}
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
                  sx={{ mt: 3, mb: 2, px: 5 }}
                >
                  Send
                </Button>
              )}
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
    </motion.div>
  );
};

export default SendPasswordResetMail;
