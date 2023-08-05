import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import theme from "../theme";
import { ThemeProvider } from "@mui/material/styles";
import React from 'react';
import { NavLink } from "react-router-dom";

const AboutUsBanner = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Grid
          container
          height="100%"
          justifyContent="center"
          alignItems="center"
          my={5}
        >
          <Grid item md={5.5} lg={5.5} xs={11} height="100%">
            <Box
              width="80%"
              height="100%"
              sx={{
                marginLeft: { xs: "auto" },
                marginRight: { xs: "auto", md: "24px" },
              }}
            >
              <img
                style={{ maxWidth: "100%" }}
                width="auto"
                src="images/aboutBannerImg.png"
                alt="about us"
              />
            </Box>
          </Grid>
          <Grid item md={5.5} lg={5.5} xs={11} height="100%">
            <Stack
              spacing={5}
              pr={13.2}
              pl={5}
              sx={{
                paddingRight: { xs: "26px", md: "105.6px" },
                paddingLeft: { xs: "26px", md: "40px" },
                paddingTop: { xs: "50px", md: "0px" },
              }}
            >
              <Typography
                variant="h1"
                component="h1"
                fontWeight={700}
                sx={{
                  fontSize: { xs: "22px", md: "37px" },
                  lineHeight: { xs: "27px", md: "45px" },
                }}
              >
                We provide the newest trends in fashion
              </Typography>
              <Typography variant="body1">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </Typography>
              <Box>
                <Button
                  sx={{ textTransform: "none" }}
                  size="large"
                  variant="outlined"
                  component={NavLink}
                  to="/about-us"
                >
                  About Us
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default AboutUsBanner;
