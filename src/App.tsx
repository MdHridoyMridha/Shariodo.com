import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ShopProvider } from './contexts/ShopContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ShopProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home onOpenCheckout={() => {}} onOpenAddProduct={() => {}} />} />
              <Route path="/wishlist" element={<Wishlist onOpenCheckout={() => {}} />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </ShopProvider>
      </AuthProvider>
    </Router>
  );
}
