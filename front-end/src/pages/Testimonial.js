import { getToken } from "../services/localStorageServices";
import { useAddReviewMutation } from "../services/productsApi";
import { ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Rating,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import theme from "../theme";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useAddTestimonialMutation } from "../services/userAuthApi";
import React from 'react';

const Testimonial = (props) => {
  const { setOpenTestimonialForm } = props;
  const { access_token } = getToken();
  const [ratingValue, setRatingValue] = useState(3);
  const [addTestimonial, { isLoading }] = useAddTestimonialMutation();

  // handeling add testimonial function
  const handleAddTestimonial = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    const actualData = {
      rating: ratingValue,
      testimonial_description: data.get("testimonial").trim(),
    };

    const res = await addTestimonial({ access_token, actualData });
    if (res.error) {
      console.log(res.error);
    }
    if (res.data) {
      setOpenTestimonialForm(false);
    }
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <Grid
          container
          justifyContent="center"
          alignItems="start"
          height="100%"
        >
          <Grid
            item
            md={12}
            xs={11}
            component="form"
            sx={{ mt: 2 }}
            id="user_address_form"
            onSubmit={handleAddTestimonial}
          >
            <Stack spacing={5}>
              <Stack spacing={1.5} justifyContent="center" alignItems="center">
                <Typography variant="subtitle1" fontWeight={600} fontSize={16}>
                  Rate your website experience
                </Typography>
                <Rating
                  size="large"
                  sx={{ color: "#2B3947" }}
                  precision={0.5}
                  name="rating"
                  value={ratingValue}
                  onChange={(event, newValue) => {
                    setRatingValue(newValue);
                  }}
                />
              </Stack>
              <TextareaAutosize
                id="testimonial"
                name="testimonial"
                fullWidth
                required
                minRows={10}
                placeholder="Please share your feedback, for us to improve the website experience"
              />

              {access_token ? (
                <Box display="flex" justifyContent="center" alignItems="center">
                  {isLoading ? (
                    <CircularProgress />
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ mt: 2, mb: 2, px: 5 }}
                    >
                      Submit
                    </Button>
                  )}
                </Box>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center">
                  {isLoading ? (
                    <CircularProgress />
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ mt: 2, mb: 2, px: 5 }}
                      disabled
                    >
                      Login
                    </Button>
                  )}
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default Testimonial;
