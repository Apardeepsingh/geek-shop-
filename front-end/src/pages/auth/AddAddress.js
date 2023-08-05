import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import theme from "../../theme";
import { ThemeProvider } from "@mui/material/styles";
import {
  useAddUserAddressesMutation,
  useGetSingleUserAddressesQuery,
  useUpdateUserAddressesMutation,
} from "../../services/userAuthApi";
import { getToken } from "../../services/localStorageServices";
import { useEffect, useState } from "react";
import axios from "axios";
import React from 'react';

const AddAddress = (props) => {
  const { formType, closeModal, setChangeState, uid } = props;
  const { access_token } = getToken();
  const [addAddress, { isLoading, isSuccess }] = useAddUserAddressesMutation();
  const [
    updateAddress,
    { isLoading: isUpdateAddressLoading, isSuccess: isUpdateAddressSuccess },
  ] = useUpdateUserAddressesMutation();

  const [IsSingleAddresseLoading, setIsSingleAddresseLoading] = useState(false);
  const [clickedAddress, setClickedAddress] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setIsSingleAddresseLoading(true);

      try {
        const headers = {
          Authorization: `Bearer ${access_token}`,
        };
        const response = await axios.get(
          `http://127.0.0.1:8000/api/user/address/${uid}`,
          { headers }
        );
        setClickedAddress(response.data);
      } catch (error) {
        console.error("Error occurred while fetching data:", error);
      }

      setIsSingleAddresseLoading(false);
    };

    if (uid) {
      fetchData();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    const actualData = {
      first_name: data.get("firstname").trim(),
      last_name: data.get("lastname").trim(),
      house_no: data.get("houseNumber").trim(),
      street_name: data.get("streetname").trim(),
      landmark: data.get("landmark").trim(),
      postal_code: data.get("postalCode").trim(),
      city: data.get("city").trim(),
      country: data.get("country").trim(),
      state: data.get("state").trim(),
      phone_no: data.get("mobile").trim(),
    };

    if (formType == "add") {
      const res = await addAddress({ actualData, access_token });
      if (res.error) {
        // setServerError(res.error.data.errors);
        // setServerMsg({});
        console.log(res.error);
      }
      if (res.data) {
        document.getElementById("user_address_form").reset();
        // setServerError({});
        // setServerMsg(res.data);
        console.log(res.data);
        setChangeState((prev) => prev + 1);
        closeModal();
      }
    }
    if (formType == "update") {
      const res = await updateAddress({ access_token, uid, actualData });
      if (res.error) {
        // setServerError(res.error.data.errors);
        // setServerMsg({});
        console.log(res.error);
      }
      if (res.data) {
        document.getElementById("user_address_form").reset();
        // setServerError({});
        // setServerMsg(res.data);
        console.log(res.data);
        setChangeState((prev) => prev + 1);
        closeModal();
      }
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
            component="form"
            sx={{ mt: 1 }}
            id="user_address_form"
            onSubmit={handleSubmit}
          >
            <Stack spacing={4}>
              <Stack direction="row" spacing={2} mt={3}>
                {/* first name field */}
                <TextField
                  required
                  id="firstname"
                  name="firstname"
                  label="First Name"
                  sx={{ width: "50%" }}
                  size="small"
                  // defaultValue={clickedAddress.first_name || ""}
                  value={clickedAddress.first_name || ""}
                  onChange={(e) => {
                    // Update the state when the value changes
                    setClickedAddress((prevState) => ({
                      ...prevState,
                      first_name: e.target.value,
                    }));
                  }}
                />
                {/* last name field */}
                <TextField
                  sx={{ width: "50%" }}
                  required
                  id="lastname"
                  name="lastname"
                  label="Last Name"
                  margin="none"
                  size="small"
                  // defaultValue={clickedAddress.last_name || ""}
                  value={clickedAddress.last_name || ""}
                  onChange={(e) => {
                    // Update the state when the value changes
                    setClickedAddress((prevState) => ({
                      ...prevState,
                      last_name: e.target.value,
                    }));
                  }}
                />
              </Stack>

              {/* House Number field */}
              <TextField
                id="houseNumber"
                name="houseNumber"
                label="House No."
                required
                fullWidth
                size="small"
                // defaultValue={clickedAddress.house_no || ""}
                value={clickedAddress.house_no || ""}
                onChange={(e) => {
                  // Update the state when the value changes
                  setClickedAddress((prevState) => ({
                    ...prevState,
                    house_no: e.target.value,
                  }));
                }}
              />

              {/* street name field */}
              <TextField
                id="streetname"
                name="streetname"
                label="Street Name,Area"
                required
                fullWidth
                size="small"
                // defaultValue={clickedAddress.street_name || ""}
                value={clickedAddress.street_name || ""}
                onChange={(e) => {
                  // Update the state when the value changes
                  setClickedAddress((prevState) => ({
                    ...prevState,
                    street_name: e.target.value,
                  }));
                }}
              />

              {/* Land Mark field */}
              <TextField
                id="landmark"
                name="landmark"
                label="Landmark"
                fullWidth
                size="small"
                // defaultValue={clickedAddress.landmark || ""}
                value={clickedAddress.landmark || ""}
                onChange={(e) => {
                  // Update the state when the value changes
                  setClickedAddress((prevState) => ({
                    ...prevState,
                    landmark: e.target.value,
                  }));
                }}
              />

              <Stack direction="row" spacing={2} mt={3}>
                {/* postal code field */}
                <TextField
                  id="postalCode"
                  name="postalCode"
                  label="Postal Code"
                  required
                  sx={{ width: "50%" }}
                  size="small"
                  // defaultValue={clickedAddress.postal_code || ""}
                  value={clickedAddress.postal_code || ""}
                  onChange={(e) => {
                    // Update the state when the value changes
                    setClickedAddress((prevState) => ({
                      ...prevState,
                      postal_code: e.target.value,
                    }));
                  }}
                />

                {/* city/district field */}
                <TextField
                  sx={{ width: "50%" }}
                  required
                  id="city"
                  name="city"
                  label="City/District"
                  margin="none"
                  size="small"
                  // defaultValue={clickedAddress.city || ""}
                  value={clickedAddress.city || ""}
                  onChange={(e) => {
                    // Update the state when the value changes
                    setClickedAddress((prevState) => ({
                      ...prevState,
                      city: e.target.value,
                    }));
                  }}
                />
              </Stack>

              <Stack direction="row" spacing={2} mt={3}>
                {/* country field */}
                <TextField
                  id="country"
                  name="country"
                  label="Country"
                  required
                  sx={{ width: "50%" }}
                  size="small"
                  // defaultValue={clickedAddress.country || ""}
                  value={clickedAddress.country || ""}
                  onChange={(e) => {
                    // Update the state when the value changes
                    setClickedAddress((prevState) => ({
                      ...prevState,
                      country: e.target.value,
                    }));
                  }}
                />

                {/* State field */}
                <TextField
                  sx={{ width: "50%" }}
                  required
                  id="state"
                  name="state"
                  label="State"
                  margin="none"
                  size="small"
                  // defaultValue={clickedAddress.state || ""}
                  value={clickedAddress.state || ""}
                  onChange={(e) => {
                    // Update the state when the value changes
                    setClickedAddress((prevState) => ({
                      ...prevState,
                      state: e.target.value,
                    }));
                  }}
                />
              </Stack>

              {/* mobile field  */}
              <TextField
                required
                id="mobile"
                name="mobile"
                label="Phone No."
                margin="none"
                size="small"
                // defaultValue={clickedAddress.phone_no || ""}
                value={clickedAddress.phone_no || ""}
                onChange={(e) => {
                  // Update the state when the value changes
                  setClickedAddress((prevState) => ({
                    ...prevState,
                    phone_no: e.target.value,
                  }));
                }}
              />

              <Box textAlign="center">
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2, px: 5 }}
                  >
                    {formType}
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

export default AddAddress;
