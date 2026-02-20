import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import PromoBanner from './components/PromoBanner';
import DealsSection from './components/DealsSection';
import Features from './components/Features';
import Brands from './components/Brands';
import Footer from './components/Footer';
import ProductListPage from './components/ProductListPage';
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from './components/Dashboard';
import Login from './components/Login';


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
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
