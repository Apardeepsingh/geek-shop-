import { Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { NavLink } from "react-router-dom";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import YouTubeIcon from "@mui/icons-material/YouTube";
import React from 'react';

const Footer = () => {
  return (
    <>
      <Grid
        container
        component="footer"
        spacing={0}
        // direction="row"
        justifyContent="center"
        alignItems="center"
        alignContent="center"
        wrap="wrap"
        bgcolor="#F6F6F6"
      >
        <Grid item lg={12} py={3}>
          <Stack spacing={3}>
            <Typography
              textAlign="center"
              variant="subtitle1"
              fontSize={22}
              fontWeight={600}
            >
              Quick Links
            </Typography>

            {/* link for medium annd large screens */}
            <Stack direction="row" sx={{display:{xs:'none', md:'flex'}}} spacing={3} justifyContent="center">
              <Typography
                sx={{ textDecoration: "none", color: "black" }}
                component={NavLink}
                to="/"
                variant="body1"
                fontSize={15}
                fontWeight={500}
              >
                Exchange & Return Policy
              </Typography>
              <Typography
                sx={{ textDecoration: "none", color: "black" }}
                component={NavLink}
                to="/"
                variant="body1"
                fontSize={15}
                fontWeight={500}
              >
                Shipping Policy
              </Typography>
              <Typography
                sx={{ textDecoration: "none", color: "black" }}
                component={NavLink}
                to="/"
                variant="body1"
                fontSize={15}
                fontWeight={500}
              >
                Privacy policy
              </Typography>
              <Typography
                sx={{ textDecoration: "none", color: "black" }}
                component={NavLink}
                to="/"
                variant="body1"
                fontSize={15}
                fontWeight={500}
              >
                Terms of Service
              </Typography>
              <Typography
                sx={{ textDecoration: "none", color: "black" }}
                component={NavLink}
                to="/contact"
                variant="body1"
                fontSize={15}
                fontWeight={500}
              >
                Contact Us
              </Typography>
              <Typography
                sx={{ textDecoration: "none", color: "black" }}
                component={NavLink}
                to="/"
                variant="body1"
                fontSize={15}
                fontWeight={500}
              >
                Refund Policy
              </Typography>
            </Stack>

            {/* link for small and extra small screens */}
            <Stack direction="column" sx={{display:{xs:'flex', md:'none'}}} spacing={3} justifyContent="center">
              <Typography
                sx={{ textDecoration: "none", color: "black" }}
                component={NavLink}
                to="/"
                variant="body1"
                fontSize={15}
                fontWeight={500}
                textAlign='center'
              >
                Exchange & Return Policy
              </Typography>
              <Typography
                sx={{ textDecoration: "none", color: "black" }}
                component={NavLink}
                to="/"
                variant="body1"
                fontSize={15}
                fontWeight={500}
                textAlign='center'
              >
                Shipping Policy
              </Typography>
              <Typography
                sx={{ textDecoration: "none", color: "black" }}
                component={NavLink}
                to="/"
                variant="body1"
                fontSize={15}
                fontWeight={500}
                textAlign='center'
              >
                Privacy policy
              </Typography>
              <Typography
                sx={{ textDecoration: "none", color: "black" }}
                component={NavLink}
                to="/"
                variant="body1"
                fontSize={15}
                fontWeight={500}
                textAlign='center'
              >
                Terms of Service
              </Typography>
              <Typography
                sx={{ textDecoration: "none", color: "black" }}
                component={NavLink}
                to="/contact"
                variant="body1"
                fontSize={15}
                fontWeight={500}
                textAlign='center'
              >
                Contact Us
              </Typography>
              <Typography
                sx={{ textDecoration: "none", color: "black" }}
                component={NavLink}
                to="/"
                variant="body1"
                fontSize={15}
                fontWeight={500}
                textAlign='center'
              >
                Refund Policy
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={5}
              textAlign="center"
              justifyContent="center"
            >
              <IconButton component={NavLink} to="/userdashboard">
                
                <FacebookOutlinedIcon />
              </IconButton>
              <IconButton component={NavLink} to="/userdashboard">
                
                <InstagramIcon />
              </IconButton>
              <IconButton component={NavLink} to="/userdashboard">
                
                <YouTubeIcon />
              </IconButton>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              spacing={1.5}
              textAlign="center"
              justifyContent="center"
            >
              <Box
                bgcolor="white"
                width="45px"
                height="25px"
                borderRadius="4px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                // sx={{px:'10px'}}
              >
                <img width="100%" src="/images/visa-icon.png" alt="visa" />
              </Box>
              <Box
                bgcolor="white"
                width="45px"
                height="25px"
                borderRadius="3px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                // sx={{px:'10px'}}
              >
                <img
                  width="100%"
                  src="/images/master-card-icon.png"
                  alt="masterCard"
                />
              </Box>
              <Box
                bgcolor="white"
                width="45px"
                height="25px"
                borderRadius="4px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                border="2px solid #808080b5"
                // sx={{px:'10px'}}
              >
                <img width="70%" src="/images/GooglePay.png" alt="visa" />
              </Box>
              <Box
                bgcolor="white"
                width="45px"
                height="25px"
                borderRadius="3px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                // sx={{px:'10px'}}
              >
                <img width="100%" src="/images/upi-icon.png" alt="visa" />
              </Box>
              <Box
                bgcolor="white"
                width="45px"
                height="25px"
                borderRadius="3px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                // sx={{px:'10px'}}
              >
                <img width="100%" src="/images/apple-pay-icon.png" alt="visa" />
              </Box>
              <Box
                bgcolor="white"
                width="45px"
                height="25px"
                borderRadius="4px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                border="2px solid #808080b5"
                // sx={{px:'10px'}}
              >
                <img width="70%" src="/images/paytm.png" alt="visa" />
              </Box>
            </Stack>

            <Typography
              textAlign="center"
              variant="body1"
              fontSize={12}
              fontWeight={500}
            >
              © 2023, Geek-Shop | All rights reserved.
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default Footer;
