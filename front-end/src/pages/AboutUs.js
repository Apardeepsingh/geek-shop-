import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";

const AboutUs = () => {
  useEffect(() => {
    document.title = 'About Us';
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <Grid container justifyContent="center" py={5}>
        <Grid item xs={11} md={5}>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item md={8}>
              <Box>
                <Typography sx={{ fontSize: { xs: 38, md: 48 }, fontWeight: { xs: 500, md: 600 } }}  >
                  Our Story
                </Typography>
                <Box height="3px" sx={{ width: { xs: "17%", md: "20%" } }} bgcolor="#2B3947"></Box>
              </Box>
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <img width="100%" src="/images/ourStory.png" alt="ourStory" />
              </Box>
              <Box sx={{ display: { xs: "block", md: "none" } }}>
                <img width="70%" src="/images/ourStory.png" alt="ourStory" />
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={11} md={6} sx={{ py: { xs: 2, md: 12 }, pr: { xs: 0, md: 12 } }}>
          <Typography variant="subtitle1" fontSize={17}>
            Welcome to Geek Shop, a clothing brand that is dedicated to
            providing high-quality and timeless fashion products that you can
            enjoy for years to come. Our product range includes everything from
            casual wear to formal wear, ensuring that every customer can find
            the perfect outfit for any occasion.
          </Typography>
          <br />
          <Typography variant="subtitle1" fontSize={17}>
            We are committed to providing the best quality in every aspect of
            our brand, from selecting premium fabrics to expert tailoring,
            striving to offer the best possible value for our products without
            compromising on quality. We believe that every detail counts, and
            our clothing is designed to offer not only style but also durability
            and longevity.
          </Typography>
          <br />
          <Typography variant="subtitle1" fontSize={17}>
            At Geek Shop, customer satisfaction is our top priority, and we take
            great pride in providing exceptional customer service. Our team is
            committed to ensuring that every customer is satisfied with their
            purchase, and we are always available to answer any questions or
            concerns you may have.
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default AboutUs;
