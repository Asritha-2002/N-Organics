import React,{useEffect} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
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


        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;