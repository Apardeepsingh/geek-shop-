import { useEffect } from "react";
import { motion } from "framer-motion";
import Map from "../components/Map";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import { Grid, Typography } from "@mui/material";
import {
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from "@mui/material";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiAccordion from "@mui/material/Accordion";
import { styled } from "@mui/material/styles";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  borderLeft: "none", // Remove left border
  borderRight: "none", // Remove right border
  borderBottom: `1px solid ${theme.palette.divider}`,
  ":last-child": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const Contact = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ThemeProvider theme={theme}>
        <Box py={5}>
          <Grid container sx={{ height: { xs: "auto", md: "80vh" } }} justifyContent="center">
            <Grid item xs={11} md={5.5} sx={{ height: { xs: "50vh", md: "auto" } }} >
              <Map />
            </Grid>
            <Grid item xs={11} md={5.5} my={5} px={3} >
              <Typography
                variant="h1"
                color="primary"
                fontWeight={600}
                sx={{ fontSize: { xs: 32, md: 42 } }}
              >
                Get in Touch
              </Typography>
              <Divider light sx={{ my: 3 }} />
              <Stack spacing={4} sx={{ mt: { xs: 3, md: 5 } }}>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="start"
                  alignItems="top"
                >
                  <PinDropOutlinedIcon
                    sx={{ fontSize: "32px", color: "#2B3947" }}
                  />
                  <Typography fontSize="17px">
                    2192, Meadowbrook Road, <br /> Los Angeles, CA, <br /> 90017
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="start"
                  alignItems="center"
                >
                  <MailOutlinedIcon
                    sx={{ fontSize: "32px", color: "#2B3947" }}
                  />
                  <Typography fontSize="17px">lorem@ipsum.com</Typography>
                </Stack>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="start"
                  alignItems="center"
                >
                  <PhoneOutlinedIcon
                    sx={{ fontSize: "32px", color: "#2B3947" }}
                  />
                  <Typography fontSize="17px">+91 79861081434 </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
          <Grid container justifyContent="center" mt={5}>
            <Grid item xs={11} md={11}>
              <Typography
                variant="h1"
                textAlign="center"
                color="primary"
                fontWeight={600}
                sx={{ fontSize: { xs: 32, md: 42 } }}

              >
                FAQs
              </Typography>

              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                mt={3}
              >
                <Accordion sx={{ width: {xs: "100%", md: "70%" }  }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    sx={{ px: 0, py: 1 }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      spacing={1}
                    >
                      <Typography sx={{
                        flexShrink: 0,
                        fontSize: { xs: 14, md: 16 },
                        maxWidth: "100%",
                        wordWrap: "break-word",
                      }}>
                        I wish to add few more products in my order. Will it be
                        possible?
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 1, py: 3 }}>
                    <Typography sx={{ fontSize: { xs: 14, md: 15 } }} color="text.secondary">
                      Once you have confirmed the order and we have accepted it,
                      you cannot add any more products to your order. You will
                      have to place a fresh order for the other products.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion sx={{ width: {xs: "100%", md: "70%" } }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    sx={{ px: 0, py: 1 }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      spacing={1}
                    >
                      <Typography sx={{
                        flexShrink: 0,
                        fontSize: { xs: 14, md: 16 },
                        maxWidth: "100%",
                        wordWrap: "break-word",
                      }}>
                        How do I cancel the order I have placed?
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 1, py: 3 }}>
                    <Typography sx={{ fontSize: { xs: 14, md: 15 } }} color="text.secondary">
                      Tap on “My Orders” section under the My Account of your
                      Website and then select the order you want to cancel. The
                      'Cancel' option will only be available before your order
                      is shipped. If you are facing an issue, please email us
                      and we will sort it for you.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion sx={{ width: {xs: "100%", md: "70%" } }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    sx={{ px: 0, py: 1 }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      spacing={1}
                    >
                      <Typography sx={{
                        flexShrink: 0,
                        fontSize: { xs: 14, md: 16 },
                        maxWidth: "100%",
                        wordWrap: "break-word",
                      }}>
                        How do I know if my order was placed successfully?
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 1, py: 3 }}>
                    <Typography sx={{ fontSize: { xs: 14, md: 15 } }} color="text.secondary">
                      Once you successfully place your order, you will receive a
                      confirmation email with details of your order and your
                      order ID.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion sx={{ width:{xs: "100%", md: "70%" } }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    sx={{ px: 0, py: 1 }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      spacing={1}
                    >
                      <Typography sx={{
                        flexShrink: 0,
                        fontSize: { xs: 14, md: 16 },
                        maxWidth: "100%",
                        wordWrap: "break-word",
                      }}>
                        How do I check the status of my order?
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 1, py: 0 }}>
                    <ul style={{ textAlign: "justify" }} >
                      <li style={{ marginBottom: "10px" }}>
                        <Typography sx={{ fontSize: { xs: 14, md: 15 } }} color="text.secondary">
                          To find out when your order is arriving, you need to
                          first log in to your account. Click on the My Account
                          on your right hand side of the screen.
                        </Typography>
                      </li>
                      <li style={{ marginBottom: "10px" }}>
                        <Typography sx={{ fontSize: { xs: 14, md: 15 } }} color="text.secondary">
                          Click on My Orders to see the status of your current
                          order (as well as your order history). You can also
                          simply click on the product from the Order ID to check
                          your order status.
                        </Typography>
                      </li>
                      <li style={{ marginBottom: "10px" }}>
                        <Typography sx={{ fontSize: { xs: 14, md: 15 } }} color="text.secondary">
                          After your order has been successfully placed, you
                          will immediately receive a confirmation and order
                          details via email.
                        </Typography>
                      </li>
                      <li style={{ marginBottom: "10px" }}>
                        <Typography sx={{ fontSize: { xs: 14, md: 15 } }} color="text.secondary">
                          If there are any other issues/ delays that come up, or
                          you need the order to be delivered urgently, write to
                          us, we will see what we can do to help.
                        </Typography>
                      </li>
                    </ul>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    </motion.div>
  );
};

export default Contact;
