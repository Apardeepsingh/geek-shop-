import { Box, Stack, Typography } from "@mui/material";
import React from 'react';
import Grid from "@mui/material/Grid";

const CustomerBenifitsBanner = () => {
  return (
    <>
      <Grid container spacing={3}  justifyContent="center" alignItems="center" mt={10.2} mb={15}>
        <Grid item md={1.9} sm={2.2}  lg={1.9} xs={11} >
          <Stack textAlign="center" >
            <Box>
              <img width="auto" src="images/returnIcon.png" alt="return" />
            </Box>
            <Typography
              fontSize="16px"
              lineHeight="24px"
              fontWeight={700}
              variant="subtitle1"
            >
              30 days <br /> free return
            </Typography>
          </Stack>
        </Grid>
        <Grid item md={1.9}  sm={2.2}  lg={1.9} xs={11}>
          <Stack textAlign="center" >
            <Box>
              <img width="auto" src="images/paymentIcon.png" alt="return" />
            </Box>
            <Typography
              fontSize="16px"
              lineHeight="24px"
              fontWeight={700}
              variant="subtitle1"
            >
              Secure <br /> Payments
            </Typography>
          </Stack>
        </Grid>
        <Grid item md={1.9} sm={2.2}   lg={1.9} xs={11}>
          <Stack textAlign="center" >
            <Box>
              <img width="auto" src="images/supportIcon.png" alt="return" />
            </Box>
            <Typography
              fontSize="16px"
              lineHeight="24px"
              fontWeight={700}
              variant="subtitle1"
            >
              Excellent <br /> support
            </Typography>
          </Stack>
        </Grid>
        <Grid item md={1.9}  sm={2.2}  lg={1.9} xs={11}>
          <Stack textAlign="center" >
            <Box>
              <img width="auto" src="images/satisfactionIcon.png" alt="return" />
            </Box>
            <Typography
              fontSize="16px"
              lineHeight="24px"
              fontWeight={700}
              variant="subtitle1"
            >
              Satisfaction<br />guarantee
            </Typography>
          </Stack>
        </Grid>
        <Grid item md={1.9} sm={2.2}   lg={1.9} xs={11}>
          <Stack textAlign="center" >
            <Box>
              <img width="auto" src="images/deliveryIcon.png" alt="return" />
            </Box>
            <Typography
              fontSize="16px"
              lineHeight="24px"
              fontWeight={700}
              variant="subtitle1"
            >
              Super fast <br /> delivery
            </Typography>
          </Stack>
        </Grid>
        
      </Grid>
    </>
  );
};

export default CustomerBenifitsBanner;
