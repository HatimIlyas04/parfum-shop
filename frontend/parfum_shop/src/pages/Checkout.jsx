import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ─── INJECT STYLES ──────────────────────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById("ck-styles")) return;
  const s = document.createElement("style");
  s.id = "ck-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Poppins:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Poppins', sans-serif; background: #f9f8f5; color: #0a0a0a; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 10px; }

    /* ── NAVBAR ── */
    .ck-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      height: 68px; padding: 0 52px;
      background: rgba(255,255,255,0.97);
      backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(212,175,55,0.13);
      display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 2px 20px rgba(0,0,0,0.04);
    }
    .ck-nav-logo {
      font-family: 'Playfair Display', serif;
      font-size: 22px; font-weight: 700; letter-spacing: 4px;
      color: #0a0a0a; cursor: pointer; user-select: none; text-decoration: none;
    }
    .ck-nav-logo span { color: #D4AF37; }
    .ck-nav-back {
      display: flex; align-items: center; gap: 7px;
      background: none; border: none; cursor: pointer;
      font-family: 'Poppins', sans-serif; font-size: 10.5px;
      font-weight: 500; letter-spacing: 2px; text-transform: uppercase;
      color: #888; transition: color 0.3s; padding: 6px 0;
    }
    .ck-nav-back:hover { color: #D4AF37; }
    .ck-nav-back:hover svg { transform: translateX(-4px); }
    .ck-nav-back svg { transition: transform 0.3s; }

    /* ── STEPS BAR - Centered ── */
    .ck-steps {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      margin-bottom: 48px;
      width: 100%;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    .ck-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
    .ck-step-circle {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Poppins', sans-serif;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.3s;
    }
    .ck-step-circle.done  { background: #D4AF37; color: #fff; }
    .ck-step-circle.active { background: #0a0a0a; color: #fff; }
    .ck-step-circle.idle  { background: #f0ede4; color: #aaa; }
    .ck-step-label {
      font-size: 9px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #bbb;
      white-space: nowrap;
      text-align: center;
    }
    .ck-step-label.active { color: #0a0a0a; font-weight: 600; }
    .ck-step-label.done   { color: #D4AF37; }
    .ck-step-line {
      width: 60px;
      height: 1px;
      background: #e8e4d8;
      margin: 0 8px 20px 8px;
      flex-shrink: 0;
    }
    .ck-step-line.done { background: #D4AF37; }

    /* ── PAGE ── */
    .ck-page {
      min-height: 100vh;
      padding: 100px 5% 80px;
      max-width: 1300px;
      margin: 0 auto;
      width: 100%;
    }
    @keyframes ck-fade { from { opacity:0; } to { opacity:1; } }

    /* ── PAGE HEADER - Centered ── */
    .ck-page-header {
      margin-bottom: 48px;
      text-align: center;
    }
    .ck-eyebrow {
      font-size: 10px;
      letter-spacing: 5px;
      text-transform: uppercase;
      color: #D4AF37;
      margin-bottom: 12px;
      text-align: center;
    }
    .ck-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(28px, 4vw, 42px);
      font-weight: 600;
      color: #0a0a0a;
      line-height: 1.2;
      text-align: center;
    }
    .ck-title em { color: #D4AF37; font-style: italic; }

    /* ── LAYOUT ── */
    .ck-layout {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 32px;
      align-items: start;
      max-width: 1200px;
      margin: 0 auto;
    }

    /* ── CARD ── */
    .ck-card {
      background: #fff;
      border-radius: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      border: 1px solid #f0ece0;
      overflow: hidden;
    }
    .ck-card-head {
      padding: 24px 28px 20px;
      border-bottom: 1px solid #f0ece0;
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .ck-card-head-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: rgba(212,175,55,0.1);
      color: #D4AF37;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .ck-card-title {
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      font-weight: 600;
      color: #0a0a0a;
    }
    .ck-card-body {
      padding: 28px;
    }

    /* ── FLOATING LABEL FIELD ── */
    .ck-field { position: relative; margin-bottom: 24px; }
    .ck-field:last-child { margin-bottom: 0; }
    .ck-input {
      width: 100%;
      padding: 18px 16px 8px;
      border: 1.5px solid #e8e4d8;
      border-radius: 14px;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      color: #0a0a0a;
      background: #fafaf7;
      outline: none;
      transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
    }
    .ck-input:focus {
      border-color: #D4AF37;
      box-shadow: 0 0 0 3px rgba(212,175,55,0.11);
      background: #fff;
    }
    .ck-input.error { border-color: #e53e3e; box-shadow: 0 0 0 3px rgba(229,62,62,0.08); }
    .ck-input:focus + .ck-label,
    .ck-input:not(:placeholder-shown) + .ck-label {
      top: 7px;
      font-size: 9.5px;
      letter-spacing: 1.5px;
      color: #D4AF37;
    }
    .ck-label {
      position: absolute;
      top: 50%;
      left: 17px;
      transform: translateY(-50%);
      font-family: 'Poppins', sans-serif;
      font-size: 13px;
      font-weight: 400;
      color: #aaa;
      pointer-events: none;
      letter-spacing: 0.3px;
      transition: all 0.22s ease;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 1.5px;
    }
    .ck-error-hint {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      font-size: 11.5px;
      color: #c53030;
      font-weight: 400;
    }
    textarea.ck-input {
      resize: none;
      height: 100px;
      padding-top: 20px;
      line-height: 1.5;
    }
    textarea.ck-input + .ck-label { top: 20px; transform: none; }
    textarea.ck-input:focus + .ck-label,
    textarea.ck-input:not(:placeholder-shown) + .ck-label {
      top: 7px;
      transform: none;
    }

    /* ── SUBMIT BUTTON ── */
    .ck-submit-btn {
      width: 100%;
      padding: 16px;
      margin-top: 28px;
      background: #D4AF37;
      color: #fff;
      border: none;
      border-radius: 50px;
      font-family: 'Poppins', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .ck-submit-btn:hover:not(:disabled) {
      background: #b8952a;
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(212,175,55,0.38);
    }
    .ck-submit-btn:active:not(:disabled) { transform: translateY(0) scale(0.99); }
    .ck-submit-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

    /* ── SPINNER ── */
    .ck-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: ck-spin 0.7s linear infinite;
    }
    @keyframes ck-spin { to { transform: rotate(360deg); } }

    /* ── SECURITY BADGES - Centered ── */
    .ck-badges {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #f0ece0;
      flex-wrap: wrap;
    }
    .ck-badge-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 10.5px;
      color: #aaa;
    }
    .ck-badge-item svg { color: #D4AF37; }

    /* ── SUMMARY: PRODUCT ITEMS ── */
    .ck-items {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }
    .ck-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px;
      border-radius: 16px;
      background: #fafaf7;
      transition: background 0.2s;
    }
    .ck-item:hover { background: #f5f2ea; }
    .ck-item-img {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      overflow: hidden;
      flex-shrink: 0;
      background: #eee;
    }
    .ck-item-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center top;
      display: block;
    }
    .ck-item-body {
      flex: 1;
      min-width: 0;
    }
    .ck-item-name {
      font-family: 'Playfair Display', serif;
      font-size: 15px;
      font-weight: 600;
      color: #0a0a0a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ck-item-qty {
      font-size: 11px;
      color: #aaa;
      margin-top: 4px;
    }
    .ck-item-price {
      font-family: 'Poppins', sans-serif;
      font-size: 15px;
      font-weight: 600;
      color: #D4AF37;
      white-space: nowrap;
      flex-shrink: 0;
    }

    /* ── SUMMARY TOTALS ── */
    .ck-divider {
      height: 1px;
      background: #f0ece0;
      margin: 20px 0;
    }
    .ck-sum-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      font-family: 'Poppins', sans-serif;
      font-size: 13px;
      color: #888;
    }
    .ck-sum-row span:last-child {
      font-weight: 500;
      color: #444;
    }
    .ck-sum-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0 8px;
    }
    .ck-sum-total-label {
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      font-weight: 600;
      color: #0a0a0a;
    }
    .ck-sum-total-price {
      font-family: 'Poppins', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: #D4AF37;
    }
    .ck-delivery-box {
      background: #f5f2ea;
      border-radius: 14px;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: 12px;
      color: #888;
      margin-top: 20px;
      text-align: center;
    }
    .ck-delivery-box svg { color: #D4AF37; flex-shrink: 0; }
    .ck-delivery-box strong { color: #0a0a0a; }

    /* ── EMPTY CART - Perfectly Centered ── */
    .ck-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
      animation: ck-up 0.5s ease both;
    }
    .ck-empty-icon {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      background: #f5f2ea;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #D4AF37;
      margin-bottom: 28px;
    }
    .ck-empty-title {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 600;
      color: #0a0a0a;
      margin-bottom: 12px;
    }
    .ck-empty-sub {
      font-size: 14px;
      color: #aaa;
      max-width: 300px;
      line-height: 1.7;
      margin-bottom: 32px;
    }
    .ck-empty-btn {
      padding: 14px 44px;
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
    .ck-empty-btn:hover {
      background: #b8952a;
      transform: translateY(-3px);
      box-shadow: 0 10px 24px rgba(212,175,55,0.35);
    }

    /* ── SUCCESS SCREEN - Perfectly Centered ── */
    .ck-success {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 40px 20px;
      background: #f9f8f5;
      animation: ck-up 0.5s ease both;
    }
    .ck-success-ring {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 3px solid #D4AF37;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #D4AF37;
      margin-bottom: 32px;
      animation: ck-pop 0.5s cubic-bezier(0.2,0.9,0.4,1.1) both;
    }
    @keyframes ck-pop {
      from { transform: scale(0.6); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .ck-success-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(30px, 5vw, 44px);
      font-weight: 600;
      color: #0a0a0a;
      margin-bottom: 16px;
    }
    .ck-success-title em { color: #D4AF37; font-style: italic; }
    .ck-success-msg {
      font-size: 14px;
      color: #888;
      max-width: 380px;
      line-height: 1.8;
      margin-bottom: 40px;
    }
    .ck-success-ref {
      background: #fff;
      border-radius: 16px;
      padding: 16px 32px;
      font-family: 'Poppins', sans-serif;
      font-size: 12px;
      color: #aaa;
      margin-bottom: 36px;
      border: 1px solid #f0ece0;
    }
    .ck-success-ref strong {
      color: #D4AF37;
      font-size: 15px;
      letter-spacing: 1px;
    }

    /* ── TOAST ── */
    .ck-toast {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 9999;
      background: #141414;
      color: #fff;
      font-family: 'Poppins', sans-serif;
      font-size: 12.5px;
      padding: 12px 20px;
      border-radius: 10px;
      box-shadow: 0 8px 28px rgba(0,0,0,0.2);
      transform: translateY(80px) scale(0.96);
      opacity: 0;
      transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
      display: flex;
      align-items: center;
      gap: 10px;
      max-width: 320px;
    }
    .ck-toast.show {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    .ck-toast.success { border-left: 3px solid #48bb78; }
    .ck-toast.error   { border-left: 3px solid #fc8181; }

    @keyframes ck-up {
      from { opacity:0; transform:translateY(22px); }
      to { opacity:1; transform:translateY(0); }
    }

    /* ── RESPONSIVE ── */
    @media (max-width: 900px) {
      .ck-layout {
        grid-template-columns: 1fr;
        gap: 28px;
      }
      .ck-summary-col { order: -1; }
    }
    @media (max-width: 768px) {
      .ck-nav {
        padding: 0 20px;
        height: 62px;
      }
      .ck-page {
        padding: 90px 16px 50px;
      }
      .ck-steps {
        max-width: 100%;
        margin-bottom: 36px;
      }
      .ck-step-line {
        width: 40px;
      }
      .ck-card-head {
        padding: 18px 20px;
      }
      .ck-card-body {
        padding: 20px;
      }
      .ck-empty-title {
        font-size: 24px;
      }
    }
    @media (max-width: 480px) {
      .ck-step-circle {
        width: 32px;
        height: 32px;
        font-size: 11px;
      }
      .ck-step-label {
        font-size: 8px;
      }
      .ck-step-line {
        width: 30px;
      }
      .ck-badges {
        gap: 16px;
      }
      .ck-badge-item {
        font-size: 9px;
      }
    }
  `;
  document.head.appendChild(s);
};

// ─── SVG ICONS ──────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, stroke = "currentColor", sw = "1.8" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const IC = {
  back:    "M19 12H5M12 19l-7-7 7-7",
  form:    "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
  summary: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
  truck:   "M1 3h15v13H1zM16 8h4l3 5v4h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  check:   "M20 6L9 17l-5-5",
  shield:  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  lock:    "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4",
  cart:    "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
  warn:    "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
  user:    "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  phone:   "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  pin:     "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z",
};

// ─── CHECKOUT COMPONENT ─────────────────────────────────────────────────────────
export default function Checkout() {
  const navigate = useNavigate();

  const [form, setForm]         = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [toast, setToast]       = useState({ msg: "", type: "success", show: false });
  const toastTimer = useRef(null);

  // Load cart (merge quantities)
  const [cart, setCart] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("cart") || "[]");
      const merged = [];
      raw.forEach(item => {
        const ex = merged.find(m => m.id === item.id);
        if (ex) ex.qty = (ex.qty || 1) + 1;
        else merged.push({ ...item, qty: item.qty || 1 });
      });
      return merged;
    } catch { return []; }
  });

  useEffect(() => { injectStyles(); }, []);

  const showToast = (msg, type = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type, show: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  // ── Totals (always numeric — no string concat bug) ──
  const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (item.qty || 1), 0);
  const shipping = 35;
  const total    = subtotal + shipping;

  // ── Validation ──
  const validate = () => {
    const errs = {};
    if (!form.name.trim())         errs.name    = "Le nom est requis.";
    if (!form.phone.trim())        errs.phone   = "Le téléphone est requis.";
    else if (!/^\d{8,15}$/.test(form.phone.replace(/\s/g, "")))
                                   errs.phone   = "Numéro invalide (chiffres uniquement).";
    if (!form.address.trim())      errs.address = "L'adresse est requise.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: "" }));
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const payload = {
      name:     form.name.trim(),
      phone:    form.phone.trim(),
      address:  form.address.trim(),
      products: cart,
      subtotal,
      shipping,
      total,
      status: "en cours",
    };
    try {
      await axios.post("https://asfragrances-api.onrender.com/orders", payload);
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("storage"));
      setOrderRef(`AS-${Date.now().toString().slice(-6)}`);
      setSuccess(true);
    } catch {
      showToast("Erreur serveur — commande non envoyée.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const FALLBACK = "https://images.unsplash.com/photo-1541643600914-78b084683702?w=300&q=70";

  // ══ SUCCESS SCREEN ══════════════════════════════════════════════════════════
  if (success) return (
    <div className="ck-success">
      <div className="ck-success-ring">
        <Ico d={IC.check} size={42} sw="2.5" />
      </div>
      <h1 className="ck-success-title">Commande <em>confirmée</em> !</h1>
      <p className="ck-success-msg">
        Merci pour votre confiance. Votre commande a été reçue et sera traitée dans les plus brefs délais.
      </p>
      <div className="ck-success-ref">
        Référence commande : <strong>{orderRef}</strong>
      </div>
      <button className="ck-empty-btn" onClick={() => navigate("/")}>
        Retour à la boutique
      </button>
    </div>
  );

  // ══ EMPTY CART ═══════════════════════════════════════════════════════════════
  if (cart.length === 0) return (
    <>
      <nav className="ck-nav">
        <span className="ck-nav-logo" onClick={() => navigate("/")}>A<span>S</span></span>
        <button className="ck-nav-back" onClick={() => navigate("/")}>
          <Ico d={IC.back} size={13} sw="2" /> Retour
        </button>
      </nav>
      <div className="ck-page">
        <div className="ck-empty">
          <div className="ck-empty-icon"><Ico d={IC.cart} size={42} sw="1.5" /></div>
          <h2 className="ck-empty-title">Votre panier est vide</h2>
          <p className="ck-empty-sub">Ajoutez des parfums à votre panier avant de passer commande.</p>
          <button className="ck-empty-btn" onClick={() => navigate("/")}>
            Découvrir nos parfums
          </button>
        </div>
      </div>
    </>
  );

  // ══ MAIN CHECKOUT ══════════════════════════════════════════════════════════════
  return (
    <div style={{ background: "#f9f8f5", minHeight: "100vh" }}>

      {/* ── Navbar ── */}
      <nav className="ck-nav">
        <span className="ck-nav-logo" onClick={() => navigate("/")}>A<span>S</span></span>
        <button className="ck-nav-back" onClick={() => navigate(-1)}>
          <Ico d={IC.back} size={13} sw="2" /> Retour
        </button>
      </nav>

      <div className="ck-page">

        {/* Steps - Perfectly Centered */}
        <div className="ck-steps">
          <div className="ck-step">
            <div className="ck-step-circle done"><Ico d={IC.cart} size={14} sw="2" /></div>
            <span className="ck-step-label done">Panier</span>
          </div>
          <div className="ck-step-line done" />
          <div className="ck-step">
            <div className="ck-step-circle active">2</div>
            <span className="ck-step-label active">Commande</span>
          </div>
          <div className="ck-step-line" />
          <div className="ck-step">
            <div className="ck-step-circle idle">3</div>
            <span className="ck-step-label">Confirmation</span>
          </div>
        </div>

        {/* Header - Perfectly Centered */}
        <div className="ck-page-header">
          <p className="ck-eyebrow">Finalisation</p>
          <h1 className="ck-title">Votre <em>commande</em></h1>
        </div>

        {/* Layout */}
        <div className="ck-layout">

          {/* ─── LEFT: FORM ─── */}
          <div>
            <div className="ck-card">
              <div className="ck-card-head">
                <div className="ck-card-head-icon"><Ico d={IC.user} size={18} sw="1.7" /></div>
                <h2 className="ck-card-title">Informations de livraison</h2>
              </div>
              <div className="ck-card-body">
                <form onSubmit={handleSubmit} noValidate>

                  {/* Name */}
                  <div className="ck-field">
                    <input
                      className={`ck-input ${errors.name ? "error" : ""}`}
                      type="text" id="name" name="name"
                      value={form.name} onChange={handleChange}
                      placeholder=" " autoComplete="name"
                    />
                    <label className="ck-label" htmlFor="name">
                      Nom complet
                    </label>
                    {errors.name && (
                      <p className="ck-error-hint">
                        <Ico d={IC.warn} size={12} stroke="#c53030" sw="2" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="ck-field">
                    <input
                      className={`ck-input ${errors.phone ? "error" : ""}`}
                      type="tel" id="phone" name="phone"
                      value={form.phone} onChange={handleChange}
                      placeholder=" " autoComplete="tel"
                      inputMode="numeric"
                    />
                    <label className="ck-label" htmlFor="phone">
                      Téléphone
                    </label>
                    {errors.phone && (
                      <p className="ck-error-hint">
                        <Ico d={IC.warn} size={12} stroke="#c53030" sw="2" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="ck-field">
                    <textarea
                      className={`ck-input ${errors.address ? "error" : ""}`}
                      id="address" name="address"
                      value={form.address} onChange={handleChange}
                      placeholder=" " autoComplete="street-address"
                    />
                    <label className="ck-label" htmlFor="address">
                      Adresse complète
                    </label>
                    {errors.address && (
                      <p className="ck-error-hint">
                        <Ico d={IC.warn} size={12} stroke="#c53030" sw="2" />
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button type="submit" className="ck-submit-btn" disabled={submitting}>
                    {submitting
                      ? <><div className="ck-spinner" /> Envoi en cours…</>
                      : <><Ico d={IC.check} size={15} sw="2.5" /> Confirmer la commande</>
                    }
                  </button>

                  {/* Security badges - Centered */}
                  <div className="ck-badges">
                    <div className="ck-badge-item">
                      <Ico d={IC.shield} size={13} sw="1.8" /> Paiement sécurisé
                    </div>
                    <div className="ck-badge-item">
                      <Ico d={IC.lock} size={13} sw="1.8" /> Données protégées
                    </div>
                    <div className="ck-badge-item">
                      <Ico d={IC.truck} size={13} sw="1.8" /> Livraison Maroc
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: SUMMARY ─── */}
          <div className="ck-summary-col">
            <div className="ck-card" style={{ position: "sticky", top: 88 }}>
              <div className="ck-card-head">
                <div className="ck-card-head-icon"><Ico d={IC.summary} size={18} sw="1.7" /></div>
                <h2 className="ck-card-title">Résumé ({cart.reduce((s, i) => s + i.qty, 0)} articles)</h2>
              </div>
              <div className="ck-card-body">

                {/* Items */}
                <div className="ck-items">
                  {cart.map(item => (
                    <div key={item.id} className="ck-item">
                      <div className="ck-item-img">
                        <img
                          src={item.image || FALLBACK}
                          alt={item.name}
                          onError={e => { e.target.src = FALLBACK; }}
                        />
                      </div>
                      <div className="ck-item-body">
                        <p className="ck-item-name">{item.name}</p>
                        <p className="ck-item-qty">
                          {item.qty > 1 ? `${item.qty} × ${parseFloat(item.price).toLocaleString()} DH` : ""}
                        </p>
                      </div>
                      <p className="ck-item-price">
                        {(parseFloat(item.price) * item.qty).toLocaleString()} DH
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals — all numeric calculations */}
                <div className="ck-divider" />
                <div className="ck-sum-row">
                  <span>Sous-total</span>
                  <span>{subtotal.toLocaleString()} DH</span>
                </div>
                <div className="ck-sum-row">
                  <span>Livraison</span>
                  <span>{shipping} DH</span>
                </div>
                <div className="ck-divider" />
                <div className="ck-sum-total">
                  <span className="ck-sum-total-label">Total</span>
                  <span className="ck-sum-total-price">{total.toLocaleString()} DH</span>
                </div>

                {/* Delivery note - Centered */}
                <div className="ck-delivery-box">
                  <Ico d={IC.truck} size={16} sw="1.7" />
                  <span>Livraison partout au <strong>Maroc</strong> — 35 DH seulement</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Toast ── */}
      <div className={`ck-toast ${toast.type} ${toast.show ? "show" : ""}`}>
        {toast.type === "error" && <Ico d={IC.warn} size={14} stroke="#fc8181" sw="2" />}
        {toast.msg}
      </div>

    </div>
  );
}