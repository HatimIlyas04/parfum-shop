import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ─── STYLES ────────────────────────────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById("adm-styles")) return;
  const s = document.createElement("style");
  s.id = "adm-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Poppins:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Poppins', sans-serif; background: #f4f3ef; color: #0a0a0a; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 10px; }

    /* ── LOGIN ── */
    .adm-login-wrap {
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      background: linear-gradient(135deg, #fff 0%, #f9f7f1 100%);
    }
    .adm-login-card {
      width: 100%; max-width: 440px;
      background: #fff; border-radius: 28px;
      box-shadow: 0 24px 56px rgba(0,0,0,0.09);
      padding: 48px 40px;
      border: 1px solid rgba(212,175,55,0.12);
      animation: adm-up 0.6s ease both;
    }
    .adm-login-logo {
      text-align: center; margin-bottom: 36px;
    }
    .adm-login-logo h1 {
      font-family: 'Playfair Display', serif;
      font-size: 38px; font-weight: 700; letter-spacing: 6px; color: #0a0a0a;
    }
    .adm-login-logo h1 span { color: #D4AF37; }
    .adm-login-logo p {
      font-size: 10px; letter-spacing: 4px; text-transform: uppercase;
      color: #bbb; margin-top: 6px;
    }
    .adm-field { margin-bottom: 20px; }
    .adm-label {
      display: block; font-size: 10.5px; font-weight: 600;
      letter-spacing: 1.5px; text-transform: uppercase; color: #777; margin-bottom: 8px;
    }
    .adm-input {
      width: 100%; padding: 13px 16px;
      border: 1.5px solid #e8e4d8; border-radius: 12px;
      font-family: 'Poppins', sans-serif; font-size: 13.5px; color: #0a0a0a;
      outline: none; transition: border-color 0.3s, box-shadow 0.3s;
      background: #fafaf7;
    }
    .adm-input:focus {
      border-color: #D4AF37;
      box-shadow: 0 0 0 3px rgba(212,175,55,0.12);
      background: #fff;
    }
    .adm-input-error { border-color: #e53e3e !important; }
    select.adm-input { cursor: pointer; }
    textarea.adm-input { resize: vertical; min-height: 80px; line-height: 1.6; }
    .adm-error-msg {
      background: #fff5f5; color: #c53030; border: 1px solid #fcd5d5;
      border-radius: 10px; padding: 11px 14px;
      font-size: 12.5px; margin-bottom: 18px; text-align: center;
    }
    .adm-btn-gold {
      width: 100%; padding: 14px; border: none; border-radius: 40px;
      background: #D4AF37; color: #fff; cursor: pointer;
      font-family: 'Poppins', sans-serif; font-size: 11px;
      font-weight: 600; letter-spacing: 3px; text-transform: uppercase;
      transition: all 0.3s ease;
    }
    .adm-btn-gold:hover { background: #b8952a; transform: translateY(-2px); box-shadow: 0 10px 24px rgba(212,175,55,0.35); }
    .adm-btn-gold:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

    /* ── LAYOUT ── */
    .adm-layout { display: flex; min-height: 100vh; }

    /* ── SIDEBAR ── */
    .adm-sidebar {
      width: 260px; flex-shrink: 0;
      background: #0a0a0a; color: #fff;
      display: flex; flex-direction: column;
      position: fixed; top: 0; left: 0; bottom: 0; z-index: 200;
      transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
    }
    .adm-sidebar.closed { transform: translateX(-100%); }
    .adm-sidebar-logo {
      padding: 32px 24px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      flex-shrink: 0;
    }
    .adm-sidebar-logo h2 {
      font-family: 'Playfair Display', serif;
      font-size: 22px; font-weight: 700; letter-spacing: 4px; color: #fff;
    }
    .adm-sidebar-logo h2 span { color: #D4AF37; }
    .adm-sidebar-logo p {
      font-size: 9px; letter-spacing: 3px; text-transform: uppercase;
      color: rgba(255,255,255,0.3); margin-top: 4px;
    }
    .adm-nav { padding: 20px 16px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .adm-nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 14px; border-radius: 12px; cursor: pointer;
      font-size: 12px; font-weight: 500; letter-spacing: 0.5px; color: rgba(255,255,255,0.5);
      transition: all 0.25s ease; border: none; background: none; width: 100%; text-align: left;
    }
    .adm-nav-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.9); }
    .adm-nav-item.active { background: rgba(212,175,55,0.15); color: #D4AF37; }
    .adm-nav-item svg { flex-shrink: 0; width: 16px; height: 16px; }
    .adm-sidebar-footer {
      padding: 16px 16px 28px;
      border-top: 1px solid rgba(255,255,255,0.07);
    }
    .adm-logout-btn {
      display: flex; align-items: center; gap: 10px; width: 100%;
      padding: 11px 14px; border-radius: 12px; cursor: pointer;
      font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 500;
      color: rgba(255,255,255,0.4); background: none; border: none;
      transition: all 0.25s; text-align: left;
    }
    .adm-logout-btn:hover { background: rgba(229,62,62,0.12); color: #fc8181; }

    /* ── MAIN ── */
    .adm-main {
      margin-left: 260px;
      flex: 1; min-width: 0;
      display: flex; flex-direction: column;
      transition: margin-left 0.4s cubic-bezier(0.4,0,0.2,1);
    }
    .adm-main.full { margin-left: 0; }

    /* ── TOPBAR ── */
    .adm-topbar {
      position: sticky; top: 0; z-index: 100;
      background: rgba(244,243,239,0.96); backdrop-filter: blur(10px);
      border-bottom: 1px solid #eeebe0;
      height: 70px; padding: 0 32px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .adm-topbar-left { display: flex; align-items: center; gap: 16px; }
    .adm-hamburger {
      width: 38px; height: 38px; border-radius: 10px; border: none;
      background: #fff; display: flex; flex-direction: column; align-items: center;
      justify-content: center; gap: 4px; cursor: pointer;
      box-shadow: 0 1px 6px rgba(0,0,0,0.08); display: none;
    }
    .adm-hamburger span { display: block; width: 18px; height: 2px; background: #555; border-radius: 2px; transition: all 0.3s; }
    .adm-topbar-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 600; color: #0a0a0a; }
    .adm-topbar-right { display: flex; align-items: center; gap: 12px; }
    .adm-refresh-btn {
      width: 38px; height: 38px; border-radius: 10px; border: 1.5px solid #e8e4d8;
      background: #fff; display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #888; transition: all 0.3s;
    }
    .adm-refresh-btn:hover { border-color: #D4AF37; color: #D4AF37; }
    .adm-topbar-user {
      display: flex; align-items: center; gap: 10px;
      padding: 6px 16px 6px 8px;
      background: #fff; border-radius: 40px; box-shadow: 0 1px 6px rgba(0,0,0,0.07);
    }
    .adm-user-avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: #D4AF37; display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 700; color: #fff;
    }
    .adm-user-name { font-size: 12px; font-weight: 500; color: #333; }

    /* ── CONTENT ── */
    .adm-content { padding: 32px; flex: 1; }

    /* ── STAT CARDS ── */
    .adm-stats-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px;
    }
    .adm-stat-card {
      background: #fff; border-radius: 20px; padding: 24px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.05); border: 1px solid #f0ece0;
      transition: transform 0.3s, box-shadow 0.3s; cursor: default;
    }
    .adm-stat-card:hover { transform: translateY(-4px); box-shadow: 0 10px 28px rgba(0,0,0,0.09); }
    .adm-stat-icon {
      width: 48px; height: 48px; border-radius: 12px; margin-bottom: 18px;
      display: flex; align-items: center; justify-content: center;
    }
    .adm-stat-icon.gold { background: rgba(212,175,55,0.12); color: #D4AF37; }
    .adm-stat-icon.dark { background: rgba(10,10,10,0.06); color: #0a0a0a; }
    .adm-stat-icon.green { background: rgba(56,161,105,0.1); color: #2f855a; }
    .adm-stat-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #aaa; margin-bottom: 6px; }
    .adm-stat-value { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 600; color: #0a0a0a; }

    /* ── SECTION CARD ── */
    .adm-section-card {
      background: #fff; border-radius: 20px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.05); border: 1px solid #f0ece0;
      overflow: hidden; margin-bottom: 24px;
    }
    .adm-section-head {
      padding: 20px 24px; display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid #f0ece0; flex-wrap: wrap; gap: 12px;
    }
    .adm-section-head h3 {
      font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 600; color: #0a0a0a;
    }
    .adm-section-body { padding: 22px 24px; }

    /* ── BUTTONS ── */
    .adm-btn-sm {
      padding: 8px 18px; border-radius: 30px; border: none; cursor: pointer;
      font-family: 'Poppins', sans-serif; font-size: 10px; font-weight: 600;
      letter-spacing: 1.5px; text-transform: uppercase; transition: all 0.25s ease;
    }
    .adm-btn-sm.gold { background: #D4AF37; color: #fff; }
    .adm-btn-sm.gold:hover { background: #b8952a; transform: translateY(-1px); }
    .adm-btn-sm.outline { background: transparent; color: #0a0a0a; border: 1.5px solid #e0ddd4; }
    .adm-btn-sm.outline:hover { border-color: #D4AF37; color: #D4AF37; }
    .adm-btn-sm.danger { background: #fff5f5; color: #c53030; border: 1.5px solid #fcd5d5; }
    .adm-btn-sm.danger:hover { background: #e53e3e; color: #fff; border-color: #e53e3e; }
    .adm-icon-btn {
      width: 34px; height: 34px; border-radius: 8px; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center; transition: all 0.25s;
    }
    .adm-icon-btn.edit { background: rgba(212,175,55,0.1); color: #D4AF37; }
    .adm-icon-btn.edit:hover { background: #D4AF37; color: #fff; }
    .adm-icon-btn.del { background: #fff5f5; color: #c53030; }
    .adm-icon-btn.del:hover { background: #e53e3e; color: #fff; }

    /* ── TABLE ── */
    .adm-table-wrap { overflow-x: auto; }
    .adm-table { width: 100%; border-collapse: collapse; min-width: 600px; }
    .adm-table th {
      text-align: left; padding: 14px 16px;
      font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
      color: #aaa; border-bottom: 1.5px solid #f0ece0; white-space: nowrap;
    }
    .adm-table td {
      padding: 14px 16px; font-size: 13px; color: #333;
      border-bottom: 1px solid #f8f6f0; vertical-align: middle;
    }
    .adm-table tr:last-child td { border-bottom: none; }
    .adm-table tr:hover td { background: #fafaf5; }
    .adm-prod-img { width: 52px; height: 52px; border-radius: 10px; object-fit: cover; display: block; background: #f0ede4; }
    .adm-prod-name { font-weight: 500; color: #0a0a0a; }
    .adm-prod-price { color: #D4AF37; font-weight: 600; }
    .adm-cat-pill {
      display: inline-block; padding: 4px 12px; border-radius: 20px;
      font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;
    }
    .adm-cat-pill.homme { background: rgba(10,10,10,0.07); color: #444; }
    .adm-cat-pill.femme { background: rgba(212,175,55,0.12); color: #a07820; }
    .adm-cat-pill.mixte,
    .adm-cat-pill.unisex { background: rgba(99,179,237,0.12); color: #2b6cb0; }
    .adm-td-actions { display: flex; gap: 8px; }

    /* ── STATUS ── */
    .adm-status {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 4px 12px; border-radius: 20px;
      font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;
    }
    .adm-status.pending { background: #fff7e6; color: #c05621; }
    .adm-status.confirmed { background: #ebf8ff; color: #2b6cb0; }
    .adm-status.delivered { background: #f0fff4; color: #276749; }
    .adm-status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
    .adm-status-select {
      padding: 5px 12px; border-radius: 20px; border: 1.5px solid #e8e4d8;
      font-family: 'Poppins', sans-serif; font-size: 10px; font-weight: 600;
      letter-spacing: 1px; text-transform: uppercase; cursor: pointer;
      outline: none; background: #fafaf7; transition: border-color 0.25s;
    }

    /* ── FORM GRID ── */
    .adm-form-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 18px;
    }
    .adm-form-full { grid-column: 1 / -1; }

    /* ── TOAST ── */
    .adm-toast {
      position: fixed; bottom: 28px; right: 28px; z-index: 9999;
      background: #141414; color: #fff;
      font-family: 'Poppins', sans-serif; font-size: 12.5px;
      padding: 12px 20px; border-radius: 10px;
      box-shadow: 0 8px 28px rgba(0,0,0,0.2);
      transform: translateY(80px) scale(0.96); opacity: 0;
      transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
      display: flex; align-items: center; gap: 10px; max-width: 340px;
    }
    .adm-toast.show { transform: translateY(0) scale(1); opacity: 1; }
    .adm-toast.success { border-left: 3px solid #48bb78; }
    .adm-toast.error   { border-left: 3px solid #fc8181; }
    .adm-toast.info    { border-left: 3px solid #D4AF37; }

    /* ── MODAL ── */
    .adm-modal-overlay {
      position: fixed; inset: 0; z-index: 500;
      background: rgba(10,10,10,0.5); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px; animation: adm-fade 0.25s ease both;
    }
    @keyframes adm-fade { from { opacity: 0; } to { opacity: 1; } }
    .adm-modal {
      background: #fff; border-radius: 24px;
      padding: 32px; width: 100%; max-width: 560px;
      box-shadow: 0 24px 56px rgba(0,0,0,0.16);
      animation: adm-up 0.3s ease both; max-height: 90vh; overflow-y: auto;
    }
    .adm-modal-title {
      font-family: 'Playfair Display', serif; font-size: 22px;
      font-weight: 600; color: #0a0a0a; margin-bottom: 24px;
      padding-bottom: 16px; border-bottom: 1px solid #f0ece0;
    }
    .adm-modal-actions { display: flex; gap: 12px; margin-top: 24px; padding-top: 18px; border-top: 1px solid #f0ece0; }

    /* ── CONFIRM DIALOG ── */
    .adm-confirm-icon {
      width: 56px; height: 56px; border-radius: 50%;
      background: #fff5f5; display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px; color: #e53e3e;
    }
    .adm-confirm-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 600; text-align: center; margin-bottom: 8px; }
    .adm-confirm-msg { font-size: 13px; color: #666; text-align: center; line-height: 1.6; }
    .adm-empty {
      text-align: center; padding: 56px 20px; color: #ccc;
      font-family: 'Playfair Display', serif; font-size: 18px; font-style: italic;
    }
    .adm-spinner {
      width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff; border-radius: 50%; animation: adm-spin 0.7s linear infinite;
    }
    @keyframes adm-spin { to { transform: rotate(360deg); } }
    @keyframes adm-up { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

    /* ── RESPONSIVE ── */
    @media (max-width: 960px) {
      .adm-sidebar { transform: translateX(-100%); }
      .adm-sidebar.open { transform: translateX(0); }
      .adm-main { margin-left: 0; }
      .adm-hamburger { display: flex !important; }
      .adm-stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 600px) {
      .adm-stats-grid { grid-template-columns: 1fr; }
      .adm-content { padding: 20px; }
      .adm-topbar { padding: 0 16px; }
      .adm-form-grid { grid-template-columns: 1fr; }
      .adm-form-full { grid-column: 1; }
      .adm-login-card { padding: 32px 24px; }
    }
  `;
  document.head.appendChild(s);
};

// ─── SVG ICONS ──────────────────────────────────────────────────────────────────
const icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  products:  "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01",
  orders:    "M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2M12 11h4M12 16h4M8 11h.01M8 16h.01",
  logout:    "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  edit:      "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:     "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  refresh:   "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
  warning:   "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
  check:     "M20 6L9 17l-5-5",
  store:     "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
};

// ─── ADMIN COMPONENT ─────────────────────────────────────────────────────────────
const Admin = () => {
  const navigate = useNavigate();

  // Auth
  const [isAuth, setIsAuth] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Layout
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Data
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);

  // Stats
  const stats = {
    products: products.length,
    orders: orders.length,
    revenue: orders.reduce((s, o) => s + (Number(o.total) || 0), 0),
  };

  // Toast
  const [toast, setToast] = useState({ msg: "", type: "info", show: false });
  const toastRef = useRef(null);
  const showToast = (msg, type = "info") => {
    clearTimeout(toastRef.current);
    setToast({ msg, type, show: true });
    toastRef.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2800);
  };

  // Modals
  const [productModal, setProductModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  // Product form
  const emptyForm = { name: "", price: "", category: "homme", image: "", description: "", tag: "" };
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  // ── Init ──
  useEffect(() => { injectStyles(); }, []);
  useEffect(() => {
    if (localStorage.getItem("admin_auth") === "true") {
      setIsAuth(true);
      fetchData();
    }
  }, []);

  // ── Fetch Data ──
  const fetchData = async () => {
    setLoading(true);
    setServerError(false);
    try {
      const [pRes, oRes] = await Promise.all([
        axios.get("https://asfragrances-api.onrender.com/products"),
        axios.get("https://asfragrances-api.onrender.com/orders"),
      ]);
      setProducts(pRes.data);
      setOrders(oRes.data);
    } catch (error) {
      console.error("Fetch error:", error);
      setServerError(true);
      showToast("Erreur de connexion au serveur", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Login ──
  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "admin@gmail.com" && password === "123456") {
      localStorage.setItem("admin_auth", "true");
      setIsAuth(true);
      setLoginError("");
      fetchData();
    } else {
      setLoginError("Email ou mot de passe incorrect.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuth(false);
    setActiveTab("dashboard");
  };

  // ── Product CRUD ──
  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = true;
    if (!form.price || Number(form.price) <= 0) errs.price = true;
    if (!form.image.trim()) errs.image = true;
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openAdd = () => {
    setForm(emptyForm);
    setFormErrors({});
    setEditProduct(null);
    setProductModal("add");
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      price: String(p.price),
      category: p.category || "homme",
      image: p.image || "",
      description: p.description || "",
      tag: p.tag || "",
    });
    setFormErrors({});
    setEditProduct(p);
    setProductModal("edit");
  };

  const saveProduct = async () => {
    if (!validateForm()) return;
    setLoading(true);
    const payload = {
      name: form.name.trim(),
      price: parseFloat(form.price),
      category: form.category,
      image: form.image.trim(),
      description: form.description.trim(),
      tag: form.tag.trim(),
    };
    try {
      if (productModal === "add") {
        await axios.post("https://asfragrances-api.onrender.com/add-product", payload);
        showToast("✅ Produit ajouté avec succès !", "success");
      } else {
        await axios.put(`https://asfragrances-api.onrender.com/products/${editProduct.id}`, payload);
        showToast("✅ Produit modifié avec succès !", "success");
      }
      await fetchData();
    } catch (error) {
      console.error("Save error:", error);
      showToast("❌ Erreur lors de l'enregistrement", "error");
    } finally {
      setLoading(false);
      setProductModal(false);
    }
  };

  const confirmDelete = (p) => setConfirmModal(p);

  const deleteProduct = async () => {
    setLoading(true);
    try {
      await axios.delete(`https://asfragrances-api.onrender.com/products/${confirmModal.id}`);
      showToast("🗑️ Produit supprimé avec succès", "success");
      await fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      showToast("❌ Erreur lors de la suppression", "error");
    } finally {
      setLoading(false);
      setConfirmModal(null);
    }
  };

  // ── Order status ──
  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`https://asfragrances-api.onrender.com/orders/${orderId}`, { status });
      showToast("Statut mis à jour", "success");
      await fetchData();
    } catch (error) {
      console.error("Status update error:", error);
      showToast("Erreur lors de la mise à jour", "error");
    }
  };

  const catLabel = (cat) => {
    if (cat === "mixte") return "Unisex";
    return cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : "—";
  };

  const FALLBACK_IMG = "https://images.unsplash.com/photo-1541643600914-78b084683702?w=200&q=80";

  // ══════════════════════════════════════════════════════════════════════════════
  // LOGIN PAGE
  // ══════════════════════════════════════════════════════════════════════════════
  if (!isAuth) return (
    <div className="adm-login-wrap">
      <div className="adm-login-card">
        <div className="adm-login-logo">
          <h1>A<span>S</span></h1>
          <p>Espace Administration</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="adm-field">
            <label className="adm-label">Email</label>
            <input className={`adm-input ${loginError ? "adm-input-error" : ""}`}
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@gmail.com" required />
          </div>
          <div className="adm-field">
            <label className="adm-label">Mot de passe</label>
            <input className={`adm-input ${loginError ? "adm-input-error" : ""}`}
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required />
          </div>
          {loginError && <div className="adm-error-msg">{loginError}</div>}
          <button type="submit" className="adm-btn-gold">Se connecter</button>
        </form>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════════
  // DASHBOARD
  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="adm-layout">

      {/* ── SIDEBAR ── */}
      <aside className={`adm-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="adm-sidebar-logo">
          <h2>A<span>S</span></h2>
          <p>Administration</p>
        </div>
        <nav className="adm-nav">
          {[
            { key: "dashboard", label: "Tableau de bord", icon: icons.dashboard },
            { key: "products", label: "Produits", icon: icons.products },
            { key: "orders", label: "Commandes", icon: icons.orders },
          ].map(item => (
            <button key={item.key}
              className={`adm-nav-item ${activeTab === item.key ? "active" : ""}`}
              onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="adm-sidebar-footer">
          <button className="adm-logout-btn" onClick={handleLogout}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d={icons.logout} />
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 199 }} />
      )}

      {/* ── MAIN ── */}
      <main className="adm-main">

        {/* Topbar */}
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <button className="adm-hamburger" onClick={() => setSidebarOpen(v => !v)}>
              <span /><span /><span />
            </button>
            <h1 className="adm-topbar-title">
              {activeTab === "dashboard" ? "Tableau de bord" : activeTab === "products" ? "Produits" : "Commandes"}
            </h1>
          </div>
          <div className="adm-topbar-right">
            <button className="adm-refresh-btn" onClick={fetchData} title="Actualiser">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={icons.refresh} />
              </svg>
            </button>
            <div className="adm-topbar-user">
              <div className="adm-user-avatar">A</div>
              <span className="adm-user-name">Admin</span>
            </div>
          </div>
        </header>

        {/* Server error banner */}
        {serverError && (
          <div style={{ margin: "12px 32px 0", padding: "12px 16px", background: "#fffbeb", border: "1px solid #f6d860", borderRadius: "12px", fontSize: "12px", color: "#92400e", display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={icons.warning} /></svg>
            ⚠️ Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur https://asfragrances-api.onrender.com
          </div>
        )}

        {/* ── CONTENT ── */}
        <div className="adm-content">

          {/* ════ DASHBOARD ════ */}
          {activeTab === "dashboard" && (
            <>
              <div className="adm-stats-grid">
                {[
                  { label: "Produits", value: stats.products, cls: "gold", icon: icons.store },
                  { label: "Commandes", value: stats.orders, cls: "dark", icon: icons.orders },
                  { label: "Chiffre d'affaires", value: `${stats.revenue.toLocaleString()} DH`, cls: "green", icon: icons.check },
                ].map((c, i) => (
                  <div key={i} className="adm-stat-card">
                    <div className={`adm-stat-icon ${c.cls}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.8">
                        <path d={c.icon} />
                      </svg>
                    </div>
                    <p className="adm-stat-label">{c.label}</p>
                    <p className="adm-stat-value">{c.value}</p>
                  </div>
                ))}
              </div>

              <div className="adm-section-card">
                <div className="adm-section-head">
                  <h3>Derniers produits</h3>
                  <button className="adm-btn-sm gold" onClick={() => setActiveTab("products")}>Voir tout</button>
                </div>
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead><tr><th>Image</th><th>Nom</th><th>Prix</th><th>Catégorie</th></tr></thead>
                    <tbody>
                      {products.slice(0, 4).map(p => (
                        <tr key={p.id}>
                          <td><img src={p.image || FALLBACK_IMG} alt={p.name} className="adm-prod-img" onError={e => { e.target.src = FALLBACK_IMG; }} /></td>
                          <td className="adm-prod-name">{p.name}</td>
                          <td className="adm-prod-price">{Number(p.price).toLocaleString()} DH</td>
                          <td><span className={`adm-cat-pill ${p.category || "homme"}`}>{catLabel(p.category)}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="adm-section-card">
                <div className="adm-section-head">
                  <h3>Dernières commandes</h3>
                  <button className="adm-btn-sm outline" onClick={() => setActiveTab("orders")}>Voir tout</button>
                </div>
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead><tr><th>Client</th><th>Total</th><th>Statut</th></tr></thead>
                    <tbody>
                      {orders.slice(0, 3).map(o => (
                        <tr key={o.id}>
                          <td className="adm-prod-name">{o.name}</td>
                          <td className="adm-prod-price">{Number(o.total).toLocaleString()} DH</td>
                          <td><span className={`adm-status ${o.status === "livrée" ? "delivered" : o.status === "validée" ? "confirmed" : "pending"}`}>
                            <span className="adm-status-dot" />{o.status || "en cours"}
                          </span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ════ PRODUCTS ════ */}
          {activeTab === "products" && (
            <div className="adm-section-card">
              <div className="adm-section-head">
                <h3>Produits ({products.length})</h3>
                <button className="adm-btn-sm gold" onClick={openAdd}>+ Ajouter un produit</button>
              </div>
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead><tr><th>Image</th><th>Nom</th><th>Prix</th><th>Catégorie</th><th>Actions</th></tr></thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr><td colSpan="5"><div className="adm-empty">Aucun produit.</div></td></tr>
                    ) : products.map(p => (
                      <tr key={p.id}>
                        <td><img src={p.image || FALLBACK_IMG} alt={p.name} className="adm-prod-img" onError={e => { e.target.src = FALLBACK_IMG; }} /></td>
                        <td className="adm-prod-name">{p.name}</td>
                        <td className="adm-prod-price">{Number(p.price).toLocaleString()} DH</td>
                        <td><span className={`adm-cat-pill ${p.category || "homme"}`}>{catLabel(p.category)}</span></td>
                        <td>
                          <div className="adm-td-actions">
                            <button className="adm-icon-btn edit" onClick={() => openEdit(p)} title="Modifier">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={icons.edit} /></svg>
                            </button>
                            <button className="adm-icon-btn del" onClick={() => confirmDelete(p)} title="Supprimer">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={icons.trash} /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════ ORDERS ════ */}
          {activeTab === "orders" && (
            <div className="adm-section-card">
              <div className="adm-section-head">
                <h3>Commandes ({orders.length})</h3>
              </div>
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead><tr><th>Client</th><th>Téléphone</th><th>Adresse</th><th>Produits</th><th>Total</th><th>Statut</th></tr></thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan="6"><div className="adm-empty">Aucune commande.</div></td></tr>
                    ) : orders.map(o => {
                      const prods = typeof o.products === "string" ? (() => { try { return JSON.parse(o.products); } catch { return []; } })() : (o.products || []);
                      return (
                        <tr key={o.id}>
                          <td className="adm-prod-name">{o.name || "—"}</td>
                          <td>{o.phone || "—"}</td>
                          <td style={{ maxWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.address || "—"}</td>
                          <td style={{ maxWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{prods.map(p => p.name).join(", ") || "—"}</td>
                          <td className="adm-prod-price">{Number(o.total || 0).toLocaleString()} DH</td>
                          <td>
                            <select className="adm-status-select" value={o.status || "en cours"} onChange={e => updateOrderStatus(o.id, e.target.value)}>
                              <option value="en cours">En cours</option>
                              <option value="validée">Validée</option>
                              <option value="livrée">Livrée</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ══ PRODUCT MODAL ══ */}
      {productModal && (
        <div className="adm-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setProductModal(false); }}>
          <div className="adm-modal">
            <h2 className="adm-modal-title">{productModal === "add" ? "Ajouter un produit" : "Modifier le produit"}</h2>
            <div className="adm-form-grid">
              <div className="adm-field">
                <label className="adm-label">Nom *</label>
                <input className={`adm-input ${formErrors.name ? "adm-input-error" : ""}`}
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: Oud Impérial" />
              </div>
              <div className="adm-field">
                <label className="adm-label">Prix (DH) *</label>
                <input className={`adm-input ${formErrors.price ? "adm-input-error" : ""}`}
                  type="number" min="1" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="Ex: 450" />
              </div>
              <div className="adm-field">
                <label className="adm-label">Catégorie</label>
                <select className="adm-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="mixte">Unisex</option>
                </select>
              </div>
              <div className="adm-field">
                <label className="adm-label">Badge</label>
                <select className="adm-input" value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}>
                  <option value="">Aucun</option>
                  <option value="Nouveau">Nouveau</option>
                  <option value="Bestseller">Bestseller</option>
                  <option value="Exclusif">Exclusif</option>
                </select>
              </div>
              <div className="adm-field adm-form-full">
                <label className="adm-label">URL de l'image *</label>
                <input className={`adm-input ${formErrors.image ? "adm-input-error" : ""}`}
                  value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                  placeholder="https://..." />
              </div>
              <div className="adm-field adm-form-full">
                <label className="adm-label">Description</label>
                <textarea className="adm-input" value={form.description} rows="3"
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Description du parfum…" />
              </div>
            </div>
            <div className="adm-modal-actions">
              <button className="adm-btn-sm gold" style={{ flex: 1, padding: "12px" }} onClick={saveProduct} disabled={loading}>
                {loading ? <div className="adm-spinner" style={{ margin: "0 auto" }} /> : (productModal === "add" ? "Ajouter" : "Enregistrer")}
              </button>
              <button className="adm-btn-sm outline" style={{ flex: 1, padding: "12px" }} onClick={() => setProductModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ CONFIRM DELETE MODAL ══ */}
      {confirmModal && (
        <div className="adm-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setConfirmModal(null); }}>
          <div className="adm-modal" style={{ maxWidth: 400 }}>
            <div className="adm-confirm-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={icons.warning} /></svg>
            </div>
            <h3 className="adm-confirm-title">Supprimer le produit ?</h3>
            <p className="adm-confirm-msg">Vous êtes sur le point de supprimer <strong>"{confirmModal.name}"</strong>. Cette action est irréversible.</p>
            <div className="adm-modal-actions">
              <button className="adm-btn-sm danger" style={{ flex: 1, padding: "12px" }} onClick={deleteProduct} disabled={loading}>
                {loading ? <div className="adm-spinner" style={{ margin: "0 auto", borderTopColor: "#e53e3e" }} /> : "Supprimer"}
              </button>
              <button className="adm-btn-sm outline" style={{ flex: 1, padding: "12px" }} onClick={() => setConfirmModal(null)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      <div className={`adm-toast ${toast.type} ${toast.show ? "show" : ""}`}>
        {toast.type === "success" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#48bb78" strokeWidth="2.5"><path d={icons.check} /></svg>}
        {toast.msg}
      </div>

    </div>
  );
};

export default Admin;
