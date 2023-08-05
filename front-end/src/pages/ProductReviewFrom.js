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
import React from 'react';

const ProductReviewFrom = (props) => {
  const { closeReviewFormMethod, setnewReviewChangeState, productId } = props;
  const [addReview, { isLoading }] = useAddReviewMutation();
  const { access_token } = getToken();
  const [ratingValue, setRatingValue] = useState(3);
  const [allOrders, setAllOrders] = useState([]);
  const [isReviewVerified, setisReviewVerified] = useState(false);
  const refetchProducts = useSelector((state) => state.stateRefetchProducts);

  // handeling add review function
  const handleAddReview = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    const actual_Data = {
      review_title: data.get("reviewTitle").trim(),
      review_description: data.get("reviewDesc").trim(),
      rating: ratingValue,
      product: productId,
      isVerified: isReviewVerified,
    };

    const res = await addReview({ access_token, actual_Data });
    if (res.error) {
      console.log(res.error);
    }
    if (res.data) {
      console.log(res.data);
      setnewReviewChangeState((prev) => prev + 1);
      closeReviewFormMethod();
    }
  };

  // fetching all orders of user for verifying the review
  useEffect(() => {
    const fetchData = async () => {
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/order/",
          { headers }
        );
        setAllOrders(response.data);
      } catch (error) {
        console.error("Error occurred while fetching data:", error);
      }
    };

    fetchData();
  }, [refetchProducts]);

  console.log(allOrders);

  // verifying the review
  useEffect(() => {
    const verifyReview = allOrders.some((order) =>
      order.order_items.some(
        (orderItem) =>
          orderItem.product.uid === productId && orderItem.isDeliver
      )
    );

    setisReviewVerified(verifyReview);
  }, [allOrders]);

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
            sx={{ mt: 1 }}
            id="user_address_form"
            onSubmit={handleAddReview}
          >
            <Stack spacing={4}>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1" fontWeight={600} fontSize={18}>
                  Rate:
                </Typography>
                <Rating
                  size="large"
                  precision={0.5}
                  name="rating"
                  value={ratingValue}
                  onChange={(event, newValue) => {
                    setRatingValue(newValue);
                  }}
                />
              </Stack>
              <TextField
                id="reviewTitle"
                name="reviewTitle"
                label="Review Title"
                required
                fullWidth
                size="small"
              />
              <TextareaAutosize
                id="reviewDesc"
                name="reviewDesc"
                fullWidth
                required
                minRows={10}
                placeholder="Write Review"
              />

              <Box display='flex' justifyContent='center' alignItems='center'>
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2, mb: 2, px: 5 }}
                  >
                    Add Review
                  </Button>
                )}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default ProductReviewFrom;
