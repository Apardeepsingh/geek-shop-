import { Box, Button, CircularProgress, Grid, Stack, TextField } from "@mui/material";
import theme from "../../theme";
import { ThemeProvider } from "@mui/material/styles";
import { useAddBankMutation } from "../../services/userAuthApi";
import { getToken } from "../../services/localStorageServices";
import React from 'react';

const AddBankForm = (props) => {
  const [addBank, { isLoading }] = useAddBankMutation();
  const { access_token } = getToken();
  const { closeBankDialog, setrefetchAccounts } = props;

  // adding bank
  const handleBankSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    const actualData = {
      account_holder_name: data.get("accountHolderName").trim(),
      account_number: data.get("accountNumber").trim(),
      bank_name: data.get("bankName").trim(),
      ifsc_code: data.get("ifscCode").trim(),
      swift_code: data.get("swiftCode").trim(),
    };
    const res = await addBank({ access_token, actualData });
    if (res.error) {
      console.log(res.error);
    }
    if (res.data) {
      //   console.log(res.data);
    }

    setrefetchAccounts((prev) => prev + 1);
    closeBankDialog(); //getting closing function from the props
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
            onSubmit={handleBankSubmit}
          >
            <Stack spacing={4}>
              <TextField
                id="accountHolderName"
                name="accountHolderName"
                label="Account Holder Name"
                required
                fullWidth
                size="small"
              />
              <TextField
                id="accountNumber"
                name="accountNumber"
                label="Account Number"
                required
                fullWidth
                size="small"
              />
              <TextField
                id="bankName"
                name="bankName"
                label="Bank Name"
                required
                fullWidth
                size="small"
              />
              <Stack direction="row" spacing={1}>
                <TextField
                  id="ifscCode"
                  name="ifscCode"
                  label="IFSC Code"
                  required
                  fullWidth
                  size="small"
                  sx={{ width: "50%" }}
                />
                <TextField
                  id="swiftCode"
                  name="swiftCode"
                  label="Swift Code (for international transaction)"
                  fullWidth
                  size="small"
                  sx={{ width: "50%" }}
                />
              </Stack>

              <Box textAlign="center">
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2, mb: 2, px: 5 }}
                  >
                    Add
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

export default AddBankForm;
