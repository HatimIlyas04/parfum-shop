import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages ديالك (خاصهم يكونو ف src/pages)
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🏠 Home */}
        <Route path="/" element={<Home />} />

        {/* 🛍️ Panier */}
        <Route path="/cart" element={<Cart />} />

        {/* 📦 Product Details */}
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* 💳 Checkout (commande) */}
        <Route path="/checkout" element={<Checkout />} />

        {/* 👑 Admin Dashboard */}
        <Route path="/admin" element={<Admin />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;