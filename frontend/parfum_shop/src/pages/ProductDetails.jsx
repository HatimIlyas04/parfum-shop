import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// ─── INJECT STYLES ──────────────────────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById("pd-styles")) return;
  const style = document.createElement("style");
  style.id = "pd-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Poppins:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Poppins', sans-serif;
      background: #fff;
      color: #0a0a0a;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #fafaf7; }
    ::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 10px; }

    /* ── NAVBAR ── */
    .pd-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      height: 68px; padding: 0 52px;
      background: rgba(255,255,255,0.97);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(212,175,55,0.13);
      display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 2px 18px rgba(0,0,0,0.04);
    }
    .pd-nav-logo {
      font-family: 'Playfair Display', serif;
      font-size: 22px; font-weight: 700; letter-spacing: 4px;
      color: #0a0a0a; cursor: pointer; user-select: none;
    }
    .pd-nav-logo span { color: #D4AF37; }
    .pd-nav-right { display: flex; align-items: center; gap: 12px; }
    .pd-back-btn {
      display: flex; align-items: center; gap: 7px;
      background: none; border: none; cursor: pointer;
      font-family: 'Poppins', sans-serif; font-size: 10.5px;
      font-weight: 500; letter-spacing: 2px; text-transform: uppercase;
      color: #777; transition: color 0.3s;
      padding: 6px 0;
    }
    .pd-back-btn:hover { color: #D4AF37; }
    .pd-back-btn svg { transition: transform 0.3s; }
    .pd-back-btn:hover svg { transform: translateX(-4px); }
    .pd-cart-btn {
      position: relative;
      width: 42px; height: 42px; border-radius: 50%;
      border: 1.5px solid rgba(212,175,55,0.45);
      background: transparent;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #0a0a0a;
      transition: all 0.3s ease;
    }
    .pd-cart-btn:hover {
      background: #D4AF37; border-color: #D4AF37; color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(212,175,55,0.35);
    }
    .pd-cart-badge {
      position: absolute; top: -5px; right: -5px;
      background: #0a0a0a; color: #fff;
      border-radius: 50%; width: 17px; height: 17px;
      font-size: 9px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      border: 1.5px solid #fff;
      pointer-events: none;
    }

    /* ── PAGE WRAPPER ── */
    .pd-page {
      min-height: 100vh;
      padding: 88px 0 60px;
      background: #fff;
      animation: pd-fade 0.6s ease both;
    }
    @keyframes pd-fade { from { opacity: 0; } to { opacity: 1; } }

    /* ── BREADCRUMB ── */
    .pd-breadcrumb {
      padding: 20px 5% 0;
      display: flex; align-items: center; gap: 8px;
      font-family: 'Poppins', sans-serif; font-size: 10px;
      letter-spacing: 1.5px; text-transform: uppercase; color: #bbb;
    }
    .pd-breadcrumb span { color: #D4AF37; }
    .pd-breadcrumb-sep { color: #ddd; }

    /* ── HERO LAYOUT ── */
    .pd-hero {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* ── IMAGE SIDE ── */
    .pd-img-side {
      position: relative;
      width: 100%;
      background: #f7f5f0;
      overflow: hidden;
      animation: pd-up 0.7s ease both;
    }
    .pd-img-wrap {
      position: relative;
      width: 100%;
      height: 420px;
      overflow: hidden;
    }
    .pd-img-wrap img {
      width: 100%; height: 100%;
      object-fit: cover; object-position: center top;
      display: block;
      transition: transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease;
    }
    .pd-img-wrap img.loaded { opacity: 1; }
    .pd-img-wrap img.loading-img { opacity: 0; }
    .pd-img-wrap:hover img { transform: scale(1.04); }

    /* Image skeleton */
    .pd-img-skeleton {
      position: absolute; inset: 0;
      background: linear-gradient(90deg, #f0ede4 25%, #e8e4d8 50%, #f0ede4 75%);
      background-size: 200% 100%;
      animation: pd-shimmer 1.6s infinite;
    }
    @keyframes pd-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Category badge on image */
    .pd-cat-badge {
      position: absolute; top: 16px; left: 16px; z-index: 2;
      background: #D4AF37; color: #fff;
      font-family: 'Poppins', sans-serif; font-size: 9px;
      font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase;
      padding: 5px 14px; border-radius: 30px;
      box-shadow: 0 2px 10px rgba(212,175,55,0.3);
    }
    .pd-cat-badge.dark { background: #0a0a0a; }

    /* Tag (nouveau, bestseller) */
    .pd-tag-badge {
      position: absolute; top: 16px; right: 16px; z-index: 2;
      background: rgba(10,10,10,0.75); color: #fff;
      font-family: 'Poppins', sans-serif; font-size: 9px;
      font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
      padding: 5px 13px; border-radius: 30px;
      backdrop-filter: blur(6px);
    }

    /* ── INFO SIDE ── */
    .pd-info-side {
      padding: 36px 5%;
      display: flex; flex-direction: column; gap: 28px;
      animation: pd-up 0.7s ease 0.12s both;
    }
    @keyframes pd-up {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Eyebrow */
    .pd-eyebrow {
      font-family: 'Poppins', sans-serif; font-size: 10px;
      letter-spacing: 5px; text-transform: uppercase;
      color: #D4AF37;
    }

    /* Name */
    .pd-name {
      font-family: 'Playfair Display', serif;
      font-size: clamp(28px, 6vw, 46px); font-weight: 600;
      color: #0a0a0a; line-height: 1.15;
      letter-spacing: -0.01em;
    }

    /* Price block */
    .pd-price-block {
      display: flex; align-items: baseline; gap: 14px;
    }
    .pd-price {
      font-family: 'Poppins', sans-serif;
      font-size: clamp(26px, 5vw, 36px); font-weight: 700;
      color: #D4AF37; letter-spacing: 0.5px;
    }
    .pd-price-delivery {
      font-family: 'Poppins', sans-serif; font-size: 12px;
      color: #aaa; font-weight: 400;
    }
    .pd-price-delivery strong { color: #888; font-weight: 500; }

    /* Divider */
    .pd-divider {
      height: 1px; background: linear-gradient(to right, #e8e4d8, transparent);
    }

    /* Description */
    .pd-desc-label {
      font-family: 'Playfair Display', serif;
      font-size: 14px; font-weight: 600; color: #0a0a0a;
      margin-bottom: 10px; letter-spacing: 0.3px;
    }
    .pd-desc {
      font-family: 'Poppins', sans-serif; font-size: 13.5px;
      line-height: 1.8; color: #666; font-weight: 300;
    }

    /* Details table */
    .pd-details-table {
      background: #faf9f5;
      border-radius: 16px;
      border: 1px solid rgba(212,175,55,0.1);
      overflow: hidden;
    }
    .pd-detail-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 13px 18px;
      font-family: 'Poppins', sans-serif; font-size: 12.5px;
    }
    .pd-detail-row + .pd-detail-row { border-top: 1px solid #eeece5; }
    .pd-detail-label { color: #888; font-weight: 400; }
    .pd-detail-value { color: #0a0a0a; font-weight: 500; }
    .pd-detail-value.gold { color: #D4AF37; }

    /* Action area */
    .pd-actions { display: flex; flex-direction: column; gap: 12px; }

    .pd-add-btn {
      width: 100%; padding: 15px 24px;
      background: #D4AF37; color: #fff; border: none;
      border-radius: 50px; cursor: pointer;
      font-family: 'Poppins', sans-serif; font-size: 11px;
      font-weight: 600; letter-spacing: 3px; text-transform: uppercase;
      transition: all 0.3s ease;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      box-shadow: 0 4px 16px rgba(212,175,55,0.25);
    }
    .pd-add-btn:hover {
      background: #b8952a; transform: translateY(-3px);
      box-shadow: 0 12px 28px rgba(212,175,55,0.38);
    }
    .pd-add-btn:active { transform: translateY(0) scale(0.98); }
    .pd-add-btn.added { background: #2e7d32; box-shadow: 0 4px 16px rgba(46,125,50,0.25); }
    .pd-add-btn.added:hover { background: #256427; }

    .pd-outline-btn {
      width: 100%; padding: 14px 24px;
      background: transparent; color: #0a0a0a;
      border: 1.5px solid #e0ddd4; border-radius: 50px; cursor: pointer;
      font-family: 'Poppins', sans-serif; font-size: 11px;
      font-weight: 500; letter-spacing: 2px; text-transform: uppercase;
      transition: all 0.3s ease;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .pd-outline-btn:hover {
      border-color: #D4AF37; color: #D4AF37;
      background: rgba(212,175,55,0.04);
    }

    /* Success feedback */
    .pd-success-msg {
      padding: 13px 18px;
      background: #f0faf0;
      border: 1px solid #c3e6c4; border-radius: 12px;
      font-family: 'Poppins', sans-serif; font-size: 12.5px;
      color: #2e7d32; font-weight: 500;
      display: flex; align-items: center; gap: 9px;
      animation: pd-up 0.35s ease both;
    }

    /* Assurance icons row */
    .pd-assurance {
      display: flex; gap: 0; border: 1px solid #eeece5; border-radius: 14px; overflow: hidden;
    }
    .pd-assurance-item {
      flex: 1; padding: 14px 10px;
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      font-family: 'Poppins', sans-serif; font-size: 9.5px;
      letter-spacing: 1px; text-transform: uppercase; color: #999;
      text-align: center; line-height: 1.4;
    }
    .pd-assurance-item + .pd-assurance-item { border-left: 1px solid #eeece5; }
    .pd-assurance-item svg { color: #D4AF37; }
    .pd-assurance-item strong { color: #333; display: block; }

    /* ── LOADING STATE ── */
    .pd-loading {
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      flex-direction: column; gap: 18px;
      background: #fff;
    }
    .pd-spinner {
      width: 40px; height: 40px;
      border: 2.5px solid #f0ede4;
      border-top-color: #D4AF37; border-radius: 50%;
      animation: pd-spin 0.9s linear infinite;
    }
    @keyframes pd-spin { to { transform: rotate(360deg); } }
    .pd-loading-text {
      font-family: 'Poppins', sans-serif; font-size: 11px;
      letter-spacing: 3px; text-transform: uppercase; color: #ccc;
    }

    /* ── ERROR STATE ── */
    .pd-error {
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      flex-direction: column; gap: 16px; padding: 24px;
      text-align: center; background: #fff;
    }
    .pd-error-icon {
      width: 80px; height: 80px; border-radius: 50%;
      background: #faf7ee;
      display: flex; align-items: center; justify-content: center;
      font-size: 32px; margin-bottom: 8px;
    }
    .pd-error-title {
      font-family: 'Playfair Display', serif;
      font-size: 26px; font-weight: 600; color: #0a0a0a;
    }
    .pd-error-msg {
      font-family: 'Poppins', sans-serif; font-size: 13px;
      color: #aaa; max-width: 300px; line-height: 1.7;
    }

    /* ── RESPONSIVE ── */
    @media (max-width: 768px) {
      .pd-nav { padding: 0 18px; height: 62px; }
      .pd-page { padding-top: 62px; }
      .pd-breadcrumb { padding: 14px 18px 0; }
    }
    @media (min-width: 768px) {
      .pd-img-wrap { height: 500px; }
    }
    @media (min-width: 960px) {
      .pd-hero {
        grid-template-columns: 1fr 1fr;
        min-height: calc(100vh - 68px);
        align-items: stretch;
      }
      .pd-img-side { position: sticky; top: 68px; height: calc(100vh - 68px); }
      .pd-img-wrap { height: 100%; }
      .pd-info-side {
        padding: 52px 6%;
        overflow-y: auto;
        max-height: calc(100vh - 68px);
      }
    }
    @media (min-width: 1200px) {
      .pd-info-side { padding: 60px 8% 60px 6%; }
    }
  `;
  document.head.appendChild(style);
};

// ─── SVG ICONS ─────────────────────────────────────────────────────────────────
const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);
const CartIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const TruckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 5v4h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

// ─── FALLBACK DATA ──────────────────────────────────────────────────────────────
const FALLBACK_PRODUCTS = {
  1: { id:1, name:"Oud Impérial",    price:450, category:"homme",  tag:"Bestseller", image:"https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80", description:"Un oud d'exception qui allie la richesse des bois orientaux à une délicatesse florale. Notes de tête: bergamote et rose. Cœur: oud, encens. Fond: ambre, musc blanc et santal précieux. Une fragrance majestueuse pour les esprits d'exception." },
  2: { id:2, name:"Rose Éternelle",  price:380, category:"femme",  tag:"Nouveau",    image:"https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80", description:"Une ode à la rose de Damas, capturée à l'aube dans toute sa splendeur. Notes de tête: pivoine, bergamote. Cœur: rose turque, jasmin, lys. Fond: musc, patchouli léger, cèdre. Une féminité absolue." },
  3: { id:3, name:"Nuit de Velours", price:520, category:"homme",  tag:"",           image:"https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&q=80", description:"Une nuit de luxe dans une bouteille. Ce parfum envoûtant mêle des notes sombres et sensuelles à une légèreté surprenante. Notes de tête: poivre noir, cardamome. Cœur: cuir, violette. Fond: oud, vétiver, vanille." },
};

// ─── PRODUCT DETAILS ───────────────────────────────────────────────────────────
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => { injectStyles(); }, []);

  // Cart count
  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    } catch { setCartCount(0); }
  };
  useEffect(() => {
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  // Fetch product
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setImageLoaded(false);
    axios.get(`https://asfragrances-api.onrender.com/products/${id}`)
      .then(res => { setProduct(res.data); setError(null); })
      .catch(err => {
        // Use fallback for demo
        const fallback = FALLBACK_PRODUCTS[Number(id)];
        if (fallback) {
          setProduct(fallback);
          setError(null);
        } else {
          setError(err.response?.status === 404
            ? "Produit non trouvé."
            : "Impossible de charger ce produit.");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      cart.push({ ...product, price: Number(product.price) });
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));
      updateCartCount();
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2800);
    } catch {}
  };

  const categoryLabel = (cat) => {
    if (!cat) return "Parfum";
    if (cat === "mixte") return "Unisex";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  const FALLBACK_IMG = "https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80";

  // ── LOADING ──
  if (loading) return (
    <div className="pd-loading">
      <div className="pd-spinner" />
      <p className="pd-loading-text">Chargement du parfum…</p>
    </div>
  );

  // ── ERROR ──
  if (error || !product) return (
    <div className="pd-error">
      <div className="pd-error-icon">✨</div>
      <h2 className="pd-error-title">Produit introuvable</h2>
      <p className="pd-error-msg">{error || "Ce parfum n'existe pas ou a été retiré de la collection."}</p>
      <button className="pd-add-btn" style={{ width: "auto", padding: "13px 36px", marginTop: 8 }}
        onClick={() => navigate("/")}>
        Retour à la collection
      </button>
    </div>
  );

  const productPrice = Number(product.price) || 0;
  const totalWithDelivery = productPrice + 35;

  return (
    <div style={{ background: "#fff" }}>

      {/* ── NAVBAR ── */}
<nav className="pd-nav">
  <a href="/" className="pd-logo" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
    <div className="pd-logo-premium">
      <div className="logo-monogram">
        <span className="monogram-letter letter-a">A</span>
        <span className="monogram-letter letter-s">S</span>
      </div>
      <div className="logo-divider"></div>
      <div className="logo-text">
        <span className="logo-title">FRAGRANCES</span>
        <span className="logo-subtitle">PARFUMS</span>
      </div>
    </div>
  </a>
  <div className="pd-nav-right">
    <button className="pd-back-btn" onClick={() => navigate(-1)}>
      <ArrowLeftIcon />
      Retour
    </button>
    <button className="pd-cart-btn" onClick={() => navigate("/cart")} aria-label="Panier">
      <CartIcon size={18} />
      {cartCount > 0 && <span className="pd-cart-badge">{cartCount}</span>}
    </button>
  </div>
</nav>

      {/* ── PAGE ── */}
      <div className="pd-page">

        {/* Breadcrumb */}
        <nav className="pd-breadcrumb">
          <span style={{ cursor: "pointer", color: "#bbb" }} onClick={() => navigate("/")}>Accueil</span>
          <span className="pd-breadcrumb-sep">›</span>
          <span style={{ cursor: "pointer", color: "#bbb" }} onClick={() => navigate("/")}>Parfums</span>
          <span className="pd-breadcrumb-sep">›</span>
          <span>{product.name}</span>
        </nav>

        {/* ── HERO GRID ── */}
        <div className="pd-hero">

          {/* Left: Image */}
          <div className="pd-img-side">
            <div className="pd-img-wrap">
              {!imageLoaded && <div className="pd-img-skeleton" />}
              <img
                src={product.image || FALLBACK_IMG}
                alt={product.name}
                className={imageLoaded ? "loaded" : "loading-img"}
                onLoad={() => setImageLoaded(true)}
                onError={e => { e.target.src = FALLBACK_IMG; setImageLoaded(true); }}
              />
              {/* Badges */}
              {product.category && (
                <span className={`pd-cat-badge ${product.category === "mixte" ? "dark" : ""}`}>
                  {categoryLabel(product.category)}
                </span>
              )}
              {product.tag && (
                <span className="pd-tag-badge">{product.tag}</span>
              )}
            </div>
          </div>

          {/* Right: Info */}
          <div className="pd-info-side">

            {/* Eyebrow */}
            <p className="pd-eyebrow">AS Parfums — Collection Exclusive</p>

            {/* Name */}
            <h1 className="pd-name">{product.name}</h1>

            {/* Price */}
            <div className="pd-price-block">
              <span className="pd-price">{productPrice.toLocaleString()} DH</span>
              <span className="pd-price-delivery">+ livraison <strong>35 DH</strong></span>
            </div>

            <div className="pd-divider" />

            {/* Description */}
            <div>
              <p className="pd-desc-label">Description</p>
              <p className="pd-desc">
                {product.description ||
                  "Une fragrance d'exception qui incarne l'élégance et la sophistication. Composée avec les meilleurs ingrédients, cette création olfactive unique vous accompagne tout au long de la journée avec une présence subtile et envoûtante."}
              </p>
            </div>

            {/* Details table */}
            <div className="pd-details-table">
              <div className="pd-detail-row">
                <span className="pd-detail-label">Catégorie</span>
                <span className="pd-detail-value gold">{categoryLabel(product.category)}</span>
              </div>
              <div className="pd-detail-row">
                <span className="pd-detail-label">Référence</span>
                <span className="pd-detail-value">AS-{String(product.id || "000").padStart(3, "0")}</span>
              </div>
              <div className="pd-detail-row">
                <span className="pd-detail-label">Livraison</span>
                <span className="pd-detail-value">Partout au Maroc — 35 DH</span>
              </div>
              <div className="pd-detail-row">
                <span className="pd-detail-label">Total estimé</span>
                <span className="pd-detail-value gold">{totalWithDelivery.toLocaleString()} DH</span>
              </div>
            </div>

            {/* Assurance row */}
            <div className="pd-assurance">
              <div className="pd-assurance-item">
                <TruckIcon />
                <span><strong>Livraison</strong>Maroc</span>
              </div>
              <div className="pd-assurance-item">
                <ShieldIcon />
                <span><strong>Garanti</strong>Authentique</span>
              </div>
              <div className="pd-assurance-item">
                <StarIcon />
                <span><strong>Luxe</strong>Premium</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pd-actions">
              <button
                className={`pd-add-btn ${addedToCart ? "added" : ""}`}
                onClick={addToCart}
              >
                {addedToCart ? (
                  <><CheckIcon /> Ajouté au panier</>
                ) : (
                  <><CartIcon size={15} /> Ajouter au panier</>
                )}
              </button>
              <button className="pd-outline-btn" onClick={() => navigate(-1)}>
                <ArrowLeftIcon />
                Continuer mes achats
              </button>
            </div>

            {/* Success message */}
            {addedToCart && (
              <div className="pd-success-msg">
                <CheckIcon />
                {product.name} a bien été ajouté à votre panier.
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;