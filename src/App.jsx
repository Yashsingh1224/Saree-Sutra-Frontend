import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import Navbar from './components/Navbar/Navbar'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminRoute from './Routes/AdminRoute';
import AdminProductUpload from "./components/Admin/AdminProductUpload";
import CartPage from './components/Cart/CartPage';
import CheckoutPage from './components/Checkout/CheckoutPage';
import ShopPage from './components/Shop/ShopPage';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/Contact';
import Footer from './components/Footer/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import MyOrders from './pages/MyOrders';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path='/shop' element={<ShopPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="my-orders" element={<MyOrders />} />

          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>} />
          <Route path="product-upload" element={
            <AdminRoute>
              <AdminProductUpload />
            </AdminRoute>} />

        </Routes>
        <Footer />
      </Router>

    </>
  )
}

export default App
