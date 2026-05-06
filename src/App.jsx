import React,{useEffect} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { Toaster } from "react-hot-toast";
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import { useLocation } from 'react-router-dom';
import Shop from './pages/Shop';
import Productdetail from './components/shop/Productdetail';
import ProductDetailed from './pages/ProductDetailed';
import Signup from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import RecetPassword from './pages/RecetPassword';
import VerifyEmail from './pages/VerifyEmail';
import NewPassword from './pages/NewPassword';
import SuccessPasswordRecet from './pages/SuccessPasswordRecet';
import FailPasswordRecet from './pages/FailPasswordRecet';
import AdminLayout from './layout/AdminLayout';
import ProtectedRoute from './pages/ProtectedRoute';
import Banners from './components/admin/Banners';
import AnnouncementBar from './components/admin/AnnouncementBar';
import UserManagementPage from './components/admin/UserManagementPage';

function App() {
  const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
};
  return (
    <BrowserRouter>
    <Toaster position="top-center" />
    <ScrollToTop/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ingredients" element={<Home />} />
        <Route path="/reviews" element={<Home />} />
        <Route path="/shop" element={<Shop/>} />
        <Route path="/product/:id" element={<ProductDetailed />} />
        <Route path="/sign-up" element={<Signup/>} />
        <Route path="/sign-in" element={<SignIn/>} />
        <Route path="/forget-password" element={<ForgotPassword/>} />
        <Route path="/reset-password" element={<RecetPassword/>} />
         <Route path="/verify-email" element={<VerifyEmail/>} />
         <Route path="/forgot-password-reset" element={<NewPassword/>} />
         <Route path="/recet-success" element={
           <SuccessPasswordRecet/>
          } />

          <Route path="/recet-failed" element={
           <FailPasswordRecet/>
          } />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout/>
              </ProtectedRoute>
            }
          >
                  <Route path="banners" element={<Banners />} />
                  <Route path="announcementbar" element={<AnnouncementBar />} />
                  <Route path="users" element={<UserManagementPage />} />


          </Route>


        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;