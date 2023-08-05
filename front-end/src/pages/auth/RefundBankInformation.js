import {
  Box,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Radio,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import theme from "../../theme";
import { ThemeProvider } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import { useEffect, useState } from "react";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import AddBankForm from "./AddBankForm";
import axios from "axios";
import { getToken } from "../../services/localStorageServices";
import { useDeleteBankMutation } from "../../services/userAuthApi";
import React from 'react';

const RefundBankInformation = (props) => {
  const {selectedBankAccount, setSelectedBankAccount } = props;
  const [openAddBankForm, setopenAddBankForm] = useState(false);
  const { access_token } = getToken();
  const [isLoading, setIsLoading] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [refetchAccounts, setrefetchAccounts] = useState(0);
  const [deleteBank, {}] = useDeleteBankMutation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/bank-details/",
          { headers }
        );
        setBankAccounts(response.data);
      } catch (error) {
        console.error("Error occurred while fetch ing data:", error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [refetchAccounts]);

  const closeBankDialog = () => {
    setopenAddBankForm(false);
  };

  //   deleting bank account
  const handleDeleteBank = async (uid) => {
    const res = await deleteBank({ access_token, uid });
    if (res.error) {
      console.log(res.error);
    }
    if (res.data) {
      console.log(res.data);

      setrefetchAccounts((prev) => prev + 1);
    }
  };


  const handleBankAccountChange = (bankAccId, bankAccount) => {
    setSelectedBankAccount(bankAccId)
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <Grid container spacing={2}>
          {bankAccounts.map((bankAccount) => {
            return (
              <Grid item md={6} key={bankAccount.uid}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    position: "relative",
                    height: "100%",
                    // bgcolor: selectedAddress === address.uid && "#2b39471a",
                  }}
                >
                  <Radio
                    sx={{ position: "absolute", top: 5, left: 5 }}
                    checked={selectedBankAccount === bankAccount.uid}
                    onChange={() => handleBankAccountChange(bankAccount.uid, bankAccount)}
                    value="address1"
                    name="address"
                    // inputProps={{ "aria-label": "A" }}
                  />
                  <Stack spacing={1} mt={5}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      //   bgcolor="red"
                      width="100%"
                    >
                      <Typography fontSize="14px" fontWeight={600}>
                        Bank Name
                      </Typography>
                      <Typography fontSize="14px">
                        {bankAccount.bank_name}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      //   bgcolor="red"
                      width="100%"
                    >
                      <Typography fontSize="14px" fontWeight={600}>
                        Account Holder Name
                      </Typography>
                      <Typography fontSize="14px">
                        {bankAccount.account_holder_name}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      //   bgcolor="red"
                      width="100%"
                    >
                      <Typography fontSize="14px" fontWeight={600}>
                        Account Number
                      </Typography>
                      <Typography fontSize="14px">
                        {bankAccount.account_number}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      //   bgcolor="red"
                      width="100%"
                    >
                      <Typography fontSize="14px" fontWeight={600}>
                        IFSC Code
                      </Typography>
                      <Typography fontSize="14px">
                        {bankAccount.ifsc_code}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      //   bgcolor="red"
                      width="100%"
                    >
                      <Typography fontSize="14px" fontWeight={600}>
                        Swift Code
                      </Typography>
                      <Typography fontSize="14px">
                        {bankAccount.swift_code}
                      </Typography>
                    </Box>
                  </Stack>
                  <Box textAlign="right" mt={2}>
                    <Tooltip title="Delete this Account" arrow>
                      <IconButton
                        onClick={() => handleDeleteBank(bankAccount.uid)}
                      >
                        <DeleteIcon sx={{ fontSize: "24px" }} color="error" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Card>
              </Grid>
            );
          })}

          <Grid item md={6} height="270px">
            <Card
              variant="outlined"
              sx={{
                p: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <IconButton
                size="large"
                aria-label="add"
                onClick={() => setopenAddBankForm(true)}
              >
                <AddCircleTwoToneIcon sx={{ fontSize: "3rem" }} />
              </IconButton>
              <Typography fontFamily="15px">Add New Bank</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* open/close add bank form  */}
        <Dialog
          // fullScreen={fullScreen}
          open={openAddBankForm}
          aria-labelledby="responsive-dialog-title"
          // sx={{width: "100%" }}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            fontSize="18px"
            textTransform="none"
            fontWeight={600}
            letterSpacing={0}
            id="alert-dialog-title"
          >
            {"Add Bank "}
          </DialogTitle>
          <DialogContent>
            <AddBankForm
              setrefetchAccounts={setrefetchAccounts}
              closeBankDialog={closeBankDialog}
            />
          </DialogContent>
          <DialogActions>
            <IconButton
              aria-label="delete"
              sx={{ position: "absolute", top: 10, right: 10 }}
              onClick={closeBankDialog}
            >
              <CancelRoundedIcon sx={{ fontSize: "28px" }} />
            </IconButton>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </>
  );
};

export default RefundBankInformation;
