import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { CssBaseline } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getToken, storeUser } from "../services/localStorageServices";
import { useGetLoggedUserQuery } from "../services/userAuthApi";
import { setUserInfo } from "../features/userSlice";
import { useEffect } from "react";
import { setUserToken } from "../features/authSlice";
import Footer from "../components/Footer";
import React from 'react';

const Layout = () => {
  const dispatch = useDispatch();
  const { access_token } = getToken();



  useEffect(() => {
    if (access_token) {
      dispatch(setUserToken({ access_token: access_token }));
    }
  });

  

  return (
    <>
      <CssBaseline />
      <Navbar />
      <Outlet /> {/* outlet is written to show its child components  */}
      <Footer />
    </>
  ); 
};

export default Layout;
