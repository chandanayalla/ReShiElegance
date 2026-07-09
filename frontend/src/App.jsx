import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import Contact from './pages/Contact';
import OrderSuccess from './pages/OrderSuccess';
import ProductList from './pages/ProductList';
import AuthCallback from './pages/AuthCallback';

// Admin
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import Orders from './pages/admin/Orders';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
  return (
    <Router>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <AdminAuthProvider>
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/account" element={<Account />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/order-success" element={<OrderSuccess />} />

              <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminProtectedRoute><Dashboard /></AdminProtectedRoute>} />
              <Route path="/admin/products" element={<AdminProtectedRoute><Products /></AdminProtectedRoute>} />
              <Route path="/admin/products/add" element={<AdminProtectedRoute><AddProduct /></AdminProtectedRoute>} />
              <Route path="/admin/products/edit/:id" element={<AdminProtectedRoute><EditProduct /></AdminProtectedRoute>} />
              <Route path="/admin/orders" element={<AdminProtectedRoute><Orders /></AdminProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" />} />
              </Routes>
              <WhatsAppButton />
            </AdminAuthProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
