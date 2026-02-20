import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import PromoBanner from './components/PromoBanner';
import DealsSection from './components/DealsSection';
import Features from './components/Features';
import Brands from './components/Brands';
import ProductListPage from './components/ProductListPage';
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import PublicLayout from './components/PublicLayout';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './components/AdminDashboard';
import ProductSpecsCRUD from './components/ProductSpecsCRUD';


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
    <Router>
      <div className="app">
        <Routes>
          {/* Public Routes with Header/Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/category/:name" element={<ProductListPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
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
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
