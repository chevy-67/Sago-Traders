import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import PromoBanner from './components/PromoBanner';
import DealsSection from './components/DealsSection';
import Features from './components/Features';
import Brands from './components/Brands';
import Footer from './components/Footer';

// Placeholder for Category Page
const CategoryPage = () => {
  const { name } = useParams();
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Category: {name}</h2>
      <p>Products for {name} will appear here.</p>
    </div>
  );
};

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
          <Route path="/category/:name" element={<CategoryPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
