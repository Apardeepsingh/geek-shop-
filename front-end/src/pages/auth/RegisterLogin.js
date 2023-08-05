import { Grid, Card, Typography, Tabs, Tab, Box } from "@mui/material";
import { useEffect, useState } from "react";
import UserLogin from "./UserLogin";
import UserRegistration from "./UserRegistration";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import theme from "../../theme";
import { motion } from "framer-motion";
import React from "react";

const TabPanel = (props) => {
  const { children, value, index } = props;

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const RegisterLogin = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ThemeProvider theme={theme}>
        <Grid
          container
          sx={{ height: "90vh" }}
          bgcolor="#FAFAFA"
          justifyContent="center"
          py={5}
        >
          <Grid item lg={5} sm={7} xs={12}>
            <Card>
              <Box sx={{ mx: 0 }} px={3} py={5}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="primary"
                    indicatorColor="primary"
                  >
                    <Tab
                      label="Login"
                      sx={{ textTransform: "none", fontWeight: "bold" }}
                    ></Tab>
                    <Tab
                      label="Registration"
                      sx={{ textTransform: "none", fontWeight: "bold" }}
                    ></Tab>
                  </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                  <UserLogin />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <UserRegistration />
                </TabPanel>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </ThemeProvider>
    </motion.div>
  );
};

export default RegisterLogin;
