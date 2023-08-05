
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import {AnimatePresence} from 'framer-motion'
import Layout from "../pages/Layout";
import Home from "../pages/Home";
import Contact from "../pages/Contact";
import RegisterLogin from "../pages/auth/RegisterLogin";
import SendPasswordResetMail from "../pages/auth/SendPasswordResetMail";
import ResetPassword from "../pages/auth/ResetPassword";
import UserDashboard from "../pages/UserDashboard";
import SingleProduct from "../pages/SingleProduct";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import Orders from "../pages/Orders";
import OrderSuccess from "../pages/OrderSuccess";
import NotFound from "../pages/NotFound";


const AnimatedRoutes = () => {
    const {access_token} = useSelector(state => state.auth)
    const location = useLocation()

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}> 
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />{" "}
          {/*index is written to share parent path */}
          <Route path="contact" element={<Contact />} />
          <Route
            path="login"
            element={
              !access_token ? (
                <RegisterLogin />
              ) : (
                <Navigate to="/userdashboard" />
              )
            }
          />
          <Route
            path="sendpasswordresetmail"
            element={<SendPasswordResetMail />}
          />
          <Route path="api/user/reset/:id/:token" element={<ResetPassword />} />
          <Route
            path="/userdashboard"
            element={
              access_token ? <UserDashboard /> : <Navigate to="/login" />
            }
          />
          <Route path="singleproduct/:slug" element={<SingleProduct />} />
          <Route
            path="cart"
            element={access_token ? <Cart /> : <Navigate to="/login" />}
          />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="my-orders" element={<Orders />} />
        </Route>
        <Route path="/order-success/:uid" element={<OrderSuccess />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
