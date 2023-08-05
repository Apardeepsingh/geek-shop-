import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RegisterLogin from "./pages/auth/RegisterLogin";
import SendPasswordResetMail from "./pages/auth/SendPasswordResetMail";
import ResetPassword from "./pages/auth/ResetPassword";
import UserDashboard from "./pages/UserDashboard";
import NotFound from "./pages/NotFound"
import { useSelector } from "react-redux";
import SingleProduct from "./pages/SingleProduct";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import SingleOrderItem from "./pages/SingleOrderItem";
import Shop from "./pages/Shop";
import Category from "./pages/Category";
import Category_shop from "./pages/Category_shop";
import React from 'react';
import Search from "./pages/Search";
import AboutUs from "./pages/AboutUs";

function App() {
  const {access_token} = useSelector(state => state.auth)
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} /> {/*index is written to share parent path */}
            <Route path="contact" element={<Contact />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="shop" element={<Shop />} />
            <Route path="category/:gender" element={<Category />} />
            <Route path="category/:gender/:category" element={<Category_shop />} />
            <Route path="login" element={ !access_token ? <RegisterLogin /> : <Navigate to='/userdashboard' />} />
            <Route path="sendpasswordresetmail" element={<SendPasswordResetMail />} />
            <Route path="api/user/reset/:id/:token" element={<ResetPassword />} />
            <Route path="/userdashboard" element={access_token ?  <UserDashboard /> : <Navigate to='/login'/>} />
            <Route path="singleproduct/:slug" element={<SingleProduct />} />
            <Route path="cart" element={access_token ? <Cart /> : <Navigate to='/login'/>} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="my-orders" element={<Orders />} />
            <Route path="my-orders/:orderId/:orderItemId" element={<SingleOrderItem />} />
            <Route path="search" element={<Search />} />
          </Route>
          <Route path="/order-success/:uid" element={<OrderSuccess />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;










// for animatin 


// import Contact from "./pages/Contact";
// import Home from "./pages/Home";
// import Layout from "./pages/Layout";
// import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
// import RegisterLogin from "./pages/auth/RegisterLogin";
// import SendPasswordResetMail from "./pages/auth/SendPasswordResetMail";
// import ResetPassword from "./pages/auth/ResetPassword";
// import UserDashboard from "./pages/UserDashboard";
// import NotFound from "./pages/NotFound"
// import { useSelector } from "react-redux";
// import SingleProduct from "./pages/SingleProduct";
// import Cart from "./pages/Cart";
// import Wishlist from "./pages/Wishlist";
// import OrderSuccess from "./pages/OrderSuccess";
// import Orders from "./pages/Orders";
// import AnimatedRoutes from "./components/AnimatedRoutes";

// function App() {
  
  
//   return (
//     <>
//       <BrowserRouter>
//         <AnimatedRoutes />
//       </BrowserRouter>
//     </>
//   );
// }

// export default App;