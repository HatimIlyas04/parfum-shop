import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─── INJECT STYLES ─────────────────────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById("as-cart-styles")) return;
  const style = document.createElement("style");
  style.id = "as-cart-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Poppins:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Poppins', sans-serif;
      background: #f9f8f5;
      color: #0a0a0a;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #f5f5f0; }
    ::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 10px; }

    /* ── NAVBAR ── */
    .cart-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      height: 68px; padding: 0 52px;
      background: rgba(255,255,255,0.97);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(212,175,55,0.15);
      display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 2px 20px rgba(0,0,0,0.05);
    }
    .cart-nav-logo {
      font-family: 'Playfair Display', serif;
      font-size: 22px; font-weight: 700; letter-spacing: 4px;
      color: #0a0a0a; text-decoration: none; cursor: pointer;
    }
    .cart-nav-logo span { color: #D4AF37; }
    .cart-nav-back {
      display: flex; align-items: center; gap: 8px;
      background: none; border: none; cursor: pointer;
      font-family: 'Poppins', sans-serif; font-size: 11px;
      font-weight: 500; letter-spacing: 2px; text-transform: uppercase;
      color: #666; transition: color 0.3s;
      padding: 8px 0;
    }
    .cart-nav-back:hover { color: #D4AF37; }
    .cart-nav-back svg { transition: transform 0.3s; }
    .cart-nav-back:hover svg { transform: translateX(-4px); }

    /* ── PAGE WRAPPER ── */
    .cart-page {
      min-height: 100vh;
      padding: 100px 5% 80px;
      max-width: 1300px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
    }

    /* ── PAGE HEADER ── */
    .cart-header {
      margin-bottom: 44px;
      animation: cart-up 0.6s ease both;
      text-align: center;
    }
    .cart-eyebrow {
      font-family: 'Poppins', sans-serif; font-size: 10px;
      letter-spacing: 5px; text-transform: uppercase;
      color: #D4AF37; margin-bottom: 10px;
      text-align: center;
    }
    .cart-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(28px, 4vw, 42px); font-weight: 600;
      color: #0a0a0a; line-height: 1.15;
      text-align: center;
    }
    .cart-title em { color: #D4AF37; font-style: italic; }
    .cart-count-pill {
      display: inline-flex; align-items: center; gap: 6px;
      margin-top: 16px;
      background: #f0ede4; border-radius: 30px;
      padding: 5px 16px;
      font-family: 'Poppins', sans-serif; font-size: 11px;
      font-weight: 500; letter-spacing: 1.5px; color: #666;
      justify-content: center;
    }
    .cart-count-pill strong { color: #D4AF37; font-weight: 600; }

    /* ── LAYOUT GRID ── */
    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 32px;
      align-items: start;
    }

    /* ── ITEMS SECTION ── */
    .cart-items-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* ── CART ITEM CARD ── */
    .cart-item {
      background: #fff;
      border-radius: 20px;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 2px 14px rgba(0,0,0,0.05);
      transition: box-shadow 0.3s ease, transform 0.3s ease;
      animation: cart-up 0.5s ease both;
      width: 100%;
    }
    .cart-item:hover {
      box-shadow: 0 8px 28px rgba(0,0,0,0.09);
      transform: translateY(-2px);
    }
    .cart-item-img {
      width: 100px;
      height: 100px;
      border-radius: 16px;
      overflow: hidden;
      flex-shrink: 0;
      background: #f5f4f0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    }
    .cart-item-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center top;
      display: block;
    }
    .cart-item-body {
      flex: 1;
      min-width: 0;
    }
    .cart-item-name {
      font-family: 'Playfair Display', serif;
      font-size: 17px;
      font-weight: 600;
      color: #0a0a0a;
      margin-bottom: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .cart-item-category {
      font-family: 'Poppins', sans-serif;
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #aaa;
      margin-bottom: 10px;
    }
    .cart-item-price {
      font-family: 'Poppins', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: #D4AF37;
    }

    /* Quantity control */
    .cart-item-qty {
      display: flex;
      align-items: center;
      gap: 0;
      border: 1.5px solid #e8e5de;
      border-radius: 40px;
      overflow: hidden;
      background: #fafaf7;
    }
    .cart-qty-btn {
      width: 34px;
      height: 34px;
      border: none;
      background: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #666;
      transition: all 0.2s;
      font-family: 'Poppins', sans-serif;
      font-weight: 400;
      flex-shrink: 0;
    }
    .cart-qty-btn:hover {
      color: #D4AF37;
      background: rgba(212,175,55,0.07);
    }
    .cart-qty-num {
      min-width: 36px;
      text-align: center;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #0a0a0a;
    }

    /* Delete button */
    .cart-item-delete {
      width: 40px;
      height: 40px;
      flex-shrink: 0;
      border-radius: 50%;
      border: 1.5px solid #f0e8e8;
      background: #fff8f8;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #d07070;
    }
    .cart-item-delete svg {
      width: 16px;
      height: 16px;
      transition: transform 0.2s;
    }
    .cart-item-delete:hover {
      background: #e53e3e;
      border-color: #e53e3e;
      color: #fff;
      transform: scale(1.08);
    }
    .cart-item-delete:hover svg {
      transform: scale(1.05);
    }
    .cart-item-delete:active {
      transform: scale(0.94);
    }

    /* Item right side */
    .cart-item-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 12px;
      flex-shrink: 0;
    }
    .cart-item-total {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #555;
      white-space: nowrap;
    }

    /* ── SUMMARY CARD ── */
    .cart-summary {
      background: #fff;
      border-radius: 24px;
      padding: 32px 28px 32px;
      box-shadow: 0 8px 28px rgba(0,0,0,0.08);
      position: sticky;
      top: 88px;
      animation: cart-up 0.6s ease 0.1s both;
    }
    .cart-summary-title {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      font-weight: 600;
      color: #0a0a0a;
      margin-bottom: 24px;
      padding-bottom: 18px;
      border-bottom: 1px solid #f0ede4;
      text-align: center;
    }
    .cart-summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      color: #777;
    }
    .cart-summary-row + .cart-summary-row {
      border-top: 1px dashed #f0ede4;
    }
    .cart-summary-row span:last-child {
      font-weight: 500;
      color: #333;
    }
    .cart-summary-divider {
      height: 1px;
      background: #e8e4d8;
      margin: 16px 0;
    }
    .cart-summary-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0 20px;
    }
    .cart-summary-total-label {
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      font-weight: 600;
      color: #0a0a0a;
    }
    .cart-summary-total-price {
      font-family: 'Poppins', sans-serif;
      font-size: 26px;
      font-weight: 700;
      color: #D4AF37;
      letter-spacing: 0.5px;
    }

    /* Delivery badge */
    .cart-delivery-badge {
      background: #f9f7f0;
      border-radius: 12px;
      padding: 12px 16px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-family: 'Poppins', sans-serif;
      font-size: 12px;
      color: #888;
      letter-spacing: 0.5px;
      text-align: center;
    }
    .cart-delivery-badge svg {
      color: #D4AF37;
      flex-shrink: 0;
    }
    .cart-delivery-badge strong {
      color: #0a0a0a;
    }

    /* Checkout button */
    .cart-checkout-btn {
      width: 100%;
      padding: 16px;
      background: #D4AF37;
      color: #fff;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      font-family: 'Poppins', sans-serif;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .cart-checkout-btn:hover {
      background: #b8952a;
      transform: translateY(-2px);
      box-shadow: 0 10px 26px rgba(212,175,55,0.38);
    }
    .cart-checkout-btn:active {
      transform: translateY(0);
    }

    /* Continue shopping */
    .cart-continue {
      display: block;
      width: 100%;
      margin-top: 14px;
      padding: 14px;
      background: none;
      border: 1.5px solid #e8e4d8;
      border-radius: 50px;
      font-family: 'Poppins', sans-serif;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #999;
      cursor: pointer;
      transition: all 0.3s;
      text-align: center;
    }
    .cart-continue:hover {
      border-color: #D4AF37;
      color: #D4AF37;
    }

    /* ── EMPTY STATE ── */
    .cart-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 80px 24px;
      animation: cart-up 0.6s ease both;
      min-height: 60vh;
    }
    .cart-empty-icon {
      width: 100px;
      height: 100px;
      background: #f5f2ea;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 28px;
      color: #D4AF37;
    }
    .cart-empty-icon svg {
      width: 48px;
      height: 48px;
    }
    .cart-empty-title {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 600;
      color: #0a0a0a;
      margin-bottom: 12px;
    }
    .cart-empty-sub {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      color: #aaa;
      margin-bottom: 36px;
      max-width: 320px;
      line-height: 1.7;
    }
    .cart-empty-btn {
      padding: 16px 48px;
      background: #D4AF37;
      color: #fff;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      font-family: 'Poppins', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
      transition: all 0.3s;
    }
    .cart-empty-btn:hover {
      background: #b8952a;
      transform: translateY(-3px);
      box-shadow: 0 10px 26px rgba(212,175,55,0.35);
    }

    /* ── TOAST ── */
    .cart-toast {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 9999;
      background: #141414;
      color: #fff;
      font-family: 'Poppins', sans-serif;
      font-size: 12.5px;
      padding: 13px 22px;
      border-left: 3px solid #e53e3e;
      box-shadow: 0 8px 32px rgba(0,0,0,0.22);
      transform: translateY(80px) scale(0.96);
      opacity: 0;
      transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
      border-radius: 8px;
      max-width: 300px;
    }
    .cart-toast.show {
      transform: translateY(0) scale(1);
      opacity: 1;
    }

    @keyframes cart-up {
      from {
        opacity: 0;
        transform: translateY(24px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* ── RESPONSIVE ── */
    @media (max-width: 960px) {
      .cart-layout {
        grid-template-columns: 1fr;
        gap: 28px;
      }
      .cart-summary {
        position: static;
      }
    }
    @media (max-width: 768px) {
      .cart-nav {
        padding: 0 20px;
      }
      .cart-page {
        padding: 90px 16px 50px;
      }
      .cart-item {
        padding: 16px;
        gap: 14px;
      }
      .cart-item-img {
        width: 80px;
        height: 80px;
        border-radius: 12px;
      }
      .cart-item-name {
        font-size: 15px;
      }
      .cart-item-price {
        font-size: 14px;
      }
      .cart-item-right {
        gap: 10px;
      }
      .cart-summary {
        padding: 24px 20px;
      }
      .cart-summary-total-price {
        font-size: 22px;
      }
    }
    @media (max-width: 480px) {
      .cart-item {
        flex-wrap: wrap;
        padding: 14px;
      }
      .cart-item-img {
        width: 70px;
        height: 70px;
      }
      .cart-item-body {
        flex: 1;
        min-width: 150px;
      }
      .cart-item-right {
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;
      }
      .cart-checkout-btn {
        font-size: 10px;
        letter-spacing: 2px;
        padding: 14px;
      }
    }
  `;
  document.head.appendChild(style);
};

// ─── INLINE SVG ICONS ──────────────────────────────────────────────────────────
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
);

const CartEmptyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 5v4h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const CheckoutArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

// ─── CART PAGE ──────────────────────────────────────────────────────────────────
export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState({ msg: "", show: false });
  const toastRef = typeof window !== "undefined" ? { current: null } : { current: null };

  useEffect(() => { injectStyles(); }, []);

  // Load cart
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      const parsed = raw ? JSON.parse(raw) : [];
      // Attach a unique cart key per item (handle duplicates with qty)
      const merged = [];
      parsed.forEach(item => {
        const existing = merged.find(m => m.id === item.id);
        if (existing) {
          existing.qty = (existing.qty || 1) + 1;
        } else {
          merged.push({ ...item, qty: 1 });
        }
      });
      setCart(merged);
    } catch {
      setCart([]);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  const persistCart = (updatedCart) => {
    // Expand qty back to flat array
    const flat = [];
    updatedCart.forEach(item => {
      for (let i = 0; i < (item.qty || 1); i++) flat.push({ ...item, qty: undefined });
    });
    localStorage.setItem("cart", JSON.stringify(flat));
    // Trigger storage event for navbar badge
    window.dispatchEvent(new Event("storage"));
  };

  const removeItem = (id) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    persistCart(updated);
    showToast("Produit retiré du panier");
  };

  const changeQty = (id, delta) => {
    const updated = cart.map(item => {
      if (item.id !== id) return item;
      const newQty = (item.qty || 1) + delta;
      return newQty < 1 ? null : { ...item, qty: newQty };
    }).filter(Boolean);
    setCart(updated);
    persistCart(updated);
  };

  const showToast = (msg) => {
    clearTimeout(toastRef.current);
    setToast({ msg, show: true });
    toastRef.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2600);
  };

  // Calculations — always numeric
  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) * (item.qty || 1)), 0);
  const shipping = 35;
  const total = subtotal + shipping;

  const totalItems = cart.reduce((s, i) => s + (i.qty || 1), 0);
  const FALLBACK_IMG = "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80";

  return (
    <div style={{ background: "#f9f8f5", minHeight: "100vh" }}>

      {/* ── NAVBAR ── */}
      <nav className="cart-nav">
        <span className="cart-nav-logo" onClick={() => navigate("/")}>
          A<span>S</span>
        </span>
        <button className="cart-nav-back" onClick={() => navigate("/")}>
          <ArrowLeftIcon />
          Continuer mes achats
        </button>
      </nav>

      {/* ── PAGE ── */}
      <div className="cart-page">

        {/* Header - Centered */}
        <div className="cart-header">
          <p className="cart-eyebrow">Mon Espace</p>
          <h1 className="cart-title">Mon <em>Panier</em></h1>
          {cart.length > 0 && (
            <div className="cart-count-pill">
              <strong>{totalItems}</strong>
              {totalItems === 1 ? " article" : " articles"}
            </div>
          )}
        </div>

        {/* Empty state - Perfectly centered */}
        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <CartEmptyIcon />
            </div>
            <h2 className="cart-empty-title">Votre panier est vide</h2>
            <p className="cart-empty-sub">
              Découvrez notre collection de parfums d'exception et trouvez votre fragrance idéale.
            </p>
            <button className="cart-empty-btn" onClick={() => navigate("/")}>
              Découvrir nos parfums
            </button>
          </div>
        ) : (
          <div className="cart-layout">

            {/* ── LEFT: Items ── */}
            <div className="cart-items-section">
              {cart.map((item, idx) => (
                <div
                  key={item.id}
                  className="cart-item"
                  style={{ animationDelay: `${idx * 0.07}s` }}
                >
                  {/* Image */}
                  <div className="cart-item-img">
                    <img
                      src={item.image || FALLBACK_IMG}
                      alt={item.name}
                      onError={e => { e.target.src = FALLBACK_IMG; }}
                    />
                  </div>

                  {/* Body */}
                  <div className="cart-item-body">
                    <h3 className="cart-item-name">{item.name}</h3>
                    {item.category && (
                      <p className="cart-item-category">{item.category}</p>
                    )}
                    <p className="cart-item-price">{Number(item.price).toLocaleString()} DH</p>
                  </div>

                  {/* Right: qty + delete */}
                  <div className="cart-item-right">
                    {/* Quantity */}
                    <div className="cart-item-qty">
                      <button
                        className="cart-qty-btn"
                        onClick={() => changeQty(item.id, -1)}
                        aria-label="Diminuer"
                      >
                        −
                      </button>
                      <span className="cart-qty-num">{item.qty || 1}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => changeQty(item.id, +1)}
                        aria-label="Augmenter"
                      >
                        +
                      </button>
                    </div>

                    {/* Item total */}
                    <p className="cart-item-total">
                      {(Number(item.price) * (item.qty || 1)).toLocaleString()} DH
                    </p>

                    {/* Delete */}
                    <button
                      className="cart-item-delete"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Supprimer ${item.name}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── RIGHT: Summary ── */}
            <div className="cart-summary">
              <h2 className="cart-summary-title">Résumé</h2>

              {/* Delivery info */}
              <div className="cart-delivery-badge">
                <TruckIcon />
                <span>Livraison partout au <strong>Maroc</strong> — 35 DH</span>
              </div>

              {/* Rows */}
              <div className="cart-summary-row">
                <span>Sous-total</span>
                <span>{subtotal.toLocaleString()} DH</span>
              </div>
              <div className="cart-summary-row">
                <span>Livraison</span>
                <span>{shipping} DH</span>
              </div>

              <div className="cart-summary-divider" />

              {/* Total */}
              <div className="cart-summary-total">
                <span className="cart-summary-total-label">Total</span>
                <span className="cart-summary-total-price">
                  {total.toLocaleString()} DH
                </span>
              </div>

              {/* CTA */}
              <button 
                className="cart-checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Passer la commande
                <CheckoutArrow />
              </button>
              <button className="cart-continue" onClick={() => navigate("/")}>
                Continuer mes achats
              </button>
            </div>

          </div>
        )}
      </div>

      {/* ── TOAST ── */}
      <div className={`cart-toast ${toast.show ? "show" : ""}`}>
        {toast.msg}
      </div>

    </div>
  );
}