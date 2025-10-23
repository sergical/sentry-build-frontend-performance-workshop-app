import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Shop from './pages/Shop';
import Sale from './pages/Sale';

// Create the Sentry-wrapped Routes component
const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-100">
            <SentryRoutes>
              <Route
                path="/"
                element={<Home />}
                errorElement={<ErrorBoundary />}
              />
              <Route
                path="/shop"
                element={<Shop />}
                errorElement={<ErrorBoundary />}
              />
              <Route
                path="/sale"
                element={<Sale />}
                errorElement={<ErrorBoundary />}
              />
              <Route
                path="/cart"
                element={<Cart />}
                errorElement={<ErrorBoundary />}
              />
              <Route
                path="/login"
                element={<Login />}
                errorElement={<ErrorBoundary />}
              />
              <Route
                path="/register"
                element={<Register />}
                errorElement={<ErrorBoundary />}
              />
              <Route
                path="/product/:id"
                element={<ProductDetail />}
                errorElement={<ErrorBoundary />}
              />
            </SentryRoutes>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
