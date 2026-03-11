import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import PromoBanner from './components/PromoBanner';
import DealsSection from './components/DealsSection';
import Features from './components/Features';
import Brands from './components/Brands';
import ProductListPage from './components/ProductListPage';
import SearchResults from './components/SearchResults';
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import About from './components/About';
import UserProfile from './components/UserProfile';
import ProductDetail from './components/ProductDetail';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';

import PublicLayout from './components/PublicLayout';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './components/AdminDashboard';
import ProductSpecsCRUD from './components/ProductSpecsCRUD';
import HeroBannerManager from './components/HeroBannerManager';
import AdminOrders from './components/AdminOrders';
import Cart from './components/Cart';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';


// Home Page Component
const Home = () => {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <PromoBanner />
      <DealsSection />
      <Features />
      <Brands />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Routes>
              {/* Public Routes with Header/Footer */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />

                <Route path="/login" element={<Login />} />
                <Route path="/order/confirmation" element={<OrderConfirmation />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/category/all" element={<ProductListPage />} />
                <Route path="/category/:name" element={<ProductListPage />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/search/:query" element={<SearchResults />} />
                <Route path="/cart" element={<Cart />} />
                <Route
                  path="/checkout"
                  element={
                    <PrivateRoute>
                      <Checkout />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <UserProfile />
                    </PrivateRoute>
                  }
                />
              </Route>

              {/* Admin Routes - No Header/Footer, separate layout */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              >
                <Route index element={<h2 style={{ padding: '20px' }}>Welcome to Admin Dashboard</h2>} />
                <Route path="specs" element={<ProductSpecsCRUD />} />
                <Route path="hero" element={<HeroBannerManager />} />
                <Route path="orders" element={<AdminOrders />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
