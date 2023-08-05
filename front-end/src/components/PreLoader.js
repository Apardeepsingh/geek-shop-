import { Box } from "@mui/material";
import { useState } from "react";
import FadeLoader from "react-spinners/FadeLoader";
import React from 'react';



const PreLoader = () => {
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  return (
    <>
      <Box
        width="100%"
        height="100vh"
        position="fixed"
        top={0}
        left={0}
        zIndex={9999}
        bgcolor="white"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <FadeLoader 
          color="#2B3947"
          loading={true}
          cssOverride={override}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </Box>
    </>
  );
};

export default PreLoader;
