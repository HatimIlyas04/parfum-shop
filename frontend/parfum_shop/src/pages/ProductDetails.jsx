import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// ─── INJECT STYLES ─────────────────────────────────────────────────────────────
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
      text-decoration: none;
    }
    .pd-nav-logo span { color: #D4AF37; }
    .pd-nav-right { display: flex; align-items: center; gap: 12px; }
    .pd-back-btn {
      display: flex; align-items: center; gap: 7px;
      background: none; border: none; cursor: pointer;
      font-family: 'Poppins', sans-serif; font-size: 10.5px;
      font-weight: 500; letter-spacing: 2px; text-transform: uppercase;
      color: #777; transition: color 0.3s; padding: 6px 0;
    }
    .pd-back-btn:hover { color: #D4AF37; }
    .pd-back-btn svg { transition: transform 0.3s; }
    .pd-back-btn:hover svg { transform: translateX(-4px); }
    .pd-cart-btn {
      position: relative; width: 42px; height: 42px; border-radius: 50%;
      border: 1.5px solid rgba(212,175,55,0.45); background: transparent;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #0a0a0a; transition: all 0.3s ease;
    }
    .pd-cart-btn:hover {
      background: #D4AF37; border-color: #D4AF37; color: #fff;
      transform: translateY(-2px); box-shadow: 0 6px 18px rgba(212,175,55,0.35);
    }
    .pd-cart-badge {
      position: absolute; top: -5px; right: -5px;
      background: #0a0a0a; color: #fff; border-radius: 50%;
      width: 17px; height: 17px; font-size: 9px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      border: 1.5px solid #fff; pointer-events: none;
    }

    /* ── PAGE ── */
    .pd-page {
      min-height: 100vh;
      padding-top: 68px;
      background: #fff;
    }

    /* ── BREADCRUMB ── */
    .pd-breadcrumb {
      padding: 18px 5%;
      display: flex; align-items: center; gap: 8px;
      font-family: 'Poppins', sans-serif; font-size: 10px;
      letter-spacing: 1.5px; text-transform: uppercase; color: #bbb;
      border-bottom: 1px solid #f5f5f5;
    }
    .pd-breadcrumb a, .pd-breadcrumb span.link {
      color: #bbb; cursor: pointer; transition: color 0.2s; text-decoration: none;
    }
    .pd-breadcrumb a:hover, .pd-breadcrumb span.link:hover { color: #D4AF37; }
    .pd-breadcrumb-current { color: #888; }
    .pd-breadcrumb-sep { color: #ddd; }

    /* ── MAIN GRID ── */
    .pd-grid {
      display: grid;
      grid-template-columns: 1fr;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* ── IMAGE COLUMN ── */
    .pd-img-col {
      position: relative;
      background: #f8f6f1;
      overflow: hidden;
    }
    .pd-img-inner {
      position: relative;
      width: 100%;
      height: 480px;
      overflow: hidden;
    }
    .pd-main-img {
      width: 100%; height: 100%;
      object-fit: cover; object-position: center top;
      display: block;
      transition: transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease;
      cursor: zoom-in;
    }
    .pd-main-img.img-hidden { opacity: 0; }
    .pd-main-img.img-visible { opacity: 1; }
    .pd-img-inner:hover .pd-main-img { transform: scale(1.06); }

    /* Shimmer skeleton */
    .pd-skeleton {
      position: absolute; inset: 0;
      background: linear-gradient(90deg, #f0ede4 25%, #e8e4d8 50%, #f0ede4 75%);
      background-size: 200% 100%;
      animation: pd-shimmer 1.6s infinite;
    }
    @keyframes pd-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Floating badges */
    .pd-badge-cat {
      position: absolute; top: 20px; left: 20px; z-index: 3;
      background: #D4AF37; color: #fff;
      font-family: 'Poppins', sans-serif; font-size: 9px;
      font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase;
      padding: 6px 16px; border-radius: 30px;
      box-shadow: 0 4px 14px rgba(212,175,55,0.35);
    }
    .pd-badge-cat.dark { background: #0a0a0a; }
    .pd-badge-tag {
      position: absolute; top: 20px; right: 20px; z-index: 3;
      background: rgba(10,10,10,0.8); color: #fff;
      font-family: 'Poppins', sans-serif; font-size: 9px;
      font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
      padding: 6px 15px; border-radius: 30px;
      backdrop-filter: blur(8px);
    }

    /* Zoom hint */
    .pd-zoom-hint {
      position: absolute; bottom: 18px; right: 18px; z-index: 3;
      background: rgba(255,255,255,0.92); color: #888;
      font-family: 'Poppins', sans-serif; font-size: 9px; letter-spacing: 1.5px;
      text-transform: uppercase; padding: 6px 12px; border-radius: 20px;
      backdrop-filter: blur(6px); display: flex; align-items: center; gap: 5px;
      opacity: 0; transition: opacity 0.3s;
      pointer-events: none;
    }
    .pd-img-inner:hover .pd-zoom-hint { opacity: 1; }

    /* ── INFO COLUMN ── */
    .pd-info-col {
      padding: 40px 5%;
      display: flex; flex-direction: column; gap: 0;
      animation: pd-slide-up 0.6s ease 0.1s both;
    }
    @keyframes pd-slide-up {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Eyebrow */
    .pd-eyebrow {
      font-family: 'Poppins', sans-serif; font-size: 9.5px;
      letter-spacing: 5px; text-transform: uppercase; color: #D4AF37;
      margin-bottom: 12px;
    }

    /* Product name */
    .pd-name {
      font-family: 'Playfair Display', serif;
      font-size: clamp(30px, 5vw, 48px); font-weight: 600;
      color: #0a0a0a; line-height: 1.1; letter-spacing: -0.01em;
      margin-bottom: 20px;
    }

    /* Rating row */
    .pd-rating-row {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 24px;
    }
    .pd-stars { display: flex; gap: 2px; }
    .pd-star { color: #D4AF37; font-size: 13px; }
    .pd-star.empty { color: #e0ddd5; }
    .pd-rating-text {
      font-family: 'Poppins', sans-serif; font-size: 11px; color: #aaa;
      letter-spacing: 0.5px;
    }

    /* Price block */
    .pd-price-block { margin-bottom: 28px; }
    .pd-price-main {
      font-family: 'Poppins', sans-serif;
      font-size: clamp(28px, 4vw, 38px); font-weight: 700;
      color: #D4AF37; letter-spacing: -0.5px; line-height: 1;
      margin-bottom: 6px;
    }
    .pd-price-note {
      font-family: 'Poppins', sans-serif; font-size: 11.5px;
      color: #aaa; font-weight: 300;
    }
    .pd-price-note strong { color: #888; font-weight: 500; }

    /* Divider */
    .pd-divider {
      height: 1px;
      background: linear-gradient(to right, #eeece5 60%, transparent);
      margin: 24px 0;
    }

    /* Description */
    .pd-desc-title {
      font-family: 'Playfair Display', serif; font-size: 15px;
      font-weight: 600; color: #0a0a0a; margin-bottom: 10px;
    }
    .pd-desc {
      font-family: 'Poppins', sans-serif; font-size: 13.5px;
      line-height: 1.85; color: #666; font-weight: 300;
      margin-bottom: 28px;
    }

    /* Specs mini table */
    .pd-specs {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 12px; margin-bottom: 28px;
    }
    .pd-spec-item {
      background: #faf9f5; border-radius: 12px;
      padding: 13px 15px;
      border: 1px solid rgba(212,175,55,0.1);
    }
    .pd-spec-label {
      font-family: 'Poppins', sans-serif; font-size: 9.5px;
      letter-spacing: 2px; text-transform: uppercase; color: #bbb;
      margin-bottom: 4px;
    }
    .pd-spec-val {
      font-family: 'Poppins', sans-serif; font-size: 13px;
      font-weight: 600; color: #0a0a0a;
    }
    .pd-spec-val.gold { color: #D4AF37; }

    /* ── QUANTITY SELECTOR ── */
    .pd-qty-label {
      font-family: 'Poppins', sans-serif; font-size: 10px;
      letter-spacing: 2.5px; text-transform: uppercase; color: #888;
      margin-bottom: 10px;
    }
    .pd-qty-row {
      display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
    }
    .pd-qty-ctrl {
      display: flex; align-items: center;
      border: 1.5px solid #e8e5dc; border-radius: 40px; overflow: hidden;
    }
    .pd-qty-btn {
      width: 44px; height: 44px; background: none; border: none;
      cursor: pointer; color: #0a0a0a;
      font-size: 18px; font-weight: 300; line-height: 1;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s, color 0.2s;
    }
    .pd-qty-btn:hover { background: #f5f3ee; color: #D4AF37; }
    .pd-qty-btn:disabled { color: #ddd; cursor: not-allowed; }
    .pd-qty-val {
      min-width: 40px; text-align: center;
      font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 600;
      color: #0a0a0a; border-left: 1.5px solid #e8e5dc; border-right: 1.5px solid #e8e5dc;
      padding: 10px 0; line-height: 1;
    }
    .pd-qty-subtotal {
      font-family: 'Poppins', sans-serif; font-size: 13px;
      color: #aaa; font-weight: 300;
    }
    .pd-qty-subtotal strong { color: #D4AF37; font-weight: 600; }

    /* ── ACTIONS ── */
    .pd-actions { display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; }

    .pd-btn-primary {
      width: 100%; padding: 17px 24px;
      background: #D4AF37; color: #fff; border: none;
      border-radius: 50px; cursor: pointer;
      font-family: 'Poppins', sans-serif; font-size: 11px;
      font-weight: 600; letter-spacing: 3px; text-transform: uppercase;
      transition: all 0.3s ease;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      box-shadow: 0 6px 20px rgba(212,175,55,0.3);
    }
    .pd-btn-primary:hover {
      background: #b8952a; transform: translateY(-3px);
      box-shadow: 0 14px 30px rgba(212,175,55,0.4);
    }
    .pd-btn-primary:active { transform: translateY(0) scale(0.98); }
    .pd-btn-primary.added { background: #2e7d32; box-shadow: 0 6px 20px rgba(46,125,50,0.25); }
    .pd-btn-primary.added:hover { background: #256427; transform: translateY(-2px); }

    .pd-btn-secondary {
      width: 100%; padding: 15px 24px;
      background: #0a0a0a; color: #fff;
      border: none; border-radius: 50px; cursor: pointer;
      font-family: 'Poppins', sans-serif; font-size: 11px;
      font-weight: 600; letter-spacing: 3px; text-transform: uppercase;
      transition: all 0.3s ease;
      display: flex; align-items: center; justify-content: center; gap: 10px;
    }
    .pd-btn-secondary:hover {
      background: #1a1a1a; transform: translateY(-2px);
      box-shadow: 0 10px 24px rgba(0,0,0,0.2);
    }

    .pd-btn-ghost {
      width: 100%; padding: 14px 24px;
      background: transparent; color: #0a0a0a;
      border: 1.5px solid #e0ddd4; border-radius: 50px; cursor: pointer;
      font-family: 'Poppins', sans-serif; font-size: 11px;
      font-weight: 500; letter-spacing: 2px; text-transform: uppercase;
      transition: all 0.3s ease;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .pd-btn-ghost:hover { border-color: #D4AF37; color: #D4AF37; }

    /* Success strip */
    .pd-success-strip {
      background: linear-gradient(135deg, #f0faf0, #e8f5e8);
      border: 1px solid #c3e6c4; border-radius: 14px;
      padding: 14px 18px; margin-bottom: 20px;
      font-family: 'Poppins', sans-serif; font-size: 12.5px;
      color: #2e7d32; font-weight: 500;
      display: flex; align-items: center; gap: 10px;
      animation: pd-slide-up 0.35s ease both;
    }

    /* ── TRUST BADGES ── */
    .pd-trust {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 10px; margin-bottom: 28px;
    }
    .pd-trust-item {
      border: 1px solid #eeece5; border-radius: 14px;
      padding: 14px 10px;
      display: flex; flex-direction: column; align-items: center; gap: 7px;
      text-align: center; transition: border-color 0.3s, transform 0.3s;
    }
    .pd-trust-item:hover { border-color: rgba(212,175,55,0.4); transform: translateY(-2px); }
    .pd-trust-icon { font-size: 20px; line-height: 1; }
    .pd-trust-label {
      font-family: 'Poppins', sans-serif; font-size: 9px;
      letter-spacing: 1px; text-transform: uppercase; color: #333;
      font-weight: 600; line-height: 1.4;
    }
    .pd-trust-sub {
      font-family: 'Poppins', sans-serif; font-size: 8.5px;
      color: #aaa; letter-spacing: 0.5px; line-height: 1.3;
    }

    /* ── DETAILS ACCORDION ── */
    .pd-accordion { border-top: 1px solid #eeece5; }
    .pd-accordion-item { border-bottom: 1px solid #eeece5; }
    .pd-accordion-trigger {
      width: 100%; background: none; border: none; cursor: pointer;
      padding: 16px 0;
      display: flex; justify-content: space-between; align-items: center;
      font-family: 'Poppins', sans-serif; font-size: 11px;
      font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
      color: #0a0a0a; transition: color 0.3s;
    }
    .pd-accordion-trigger:hover { color: #D4AF37; }
    .pd-accordion-icon {
      font-size: 18px; font-weight: 300; transition: transform 0.3s ease;
      color: #aaa; line-height: 1;
    }
    .pd-accordion-icon.open { transform: rotate(45deg); color: #D4AF37; }
    .pd-accordion-body {
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1);
    }
    .pd-accordion-body.open { max-height: 400px; }
    .pd-accordion-content {
      padding-bottom: 18px;
      font-family: 'Poppins', sans-serif; font-size: 12.5px;
      line-height: 1.8; color: #666; font-weight: 300;
    }

    /* ── LOADING / ERROR ── */
    .pd-loading {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      flex-direction: column; gap: 18px; background: #fff;
    }
    .pd-spinner {
      width: 40px; height: 40px; border: 2.5px solid #f0ede4;
      border-top-color: #D4AF37; border-radius: 50%;
      animation: pd-spin 0.9s linear infinite;
    }
    @keyframes pd-spin { to { transform: rotate(360deg); } }
    .pd-loading-text {
      font-family: 'Poppins', sans-serif; font-size: 11px;
      letter-spacing: 3px; text-transform: uppercase; color: #ccc;
    }
    .pd-error {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      flex-direction: column; gap: 16px; padding: 24px; text-align: center;
    }
    .pd-error-icon {
      width: 80px; height: 80px; border-radius: 50%; background: #faf7ee;
      display: flex; align-items: center; justify-content: center; font-size: 32px; margin-bottom: 8px;
    }
    .pd-error-title {
      font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 600; color: #0a0a0a;
    }
    .pd-error-msg { font-family: 'Poppins', sans-serif; font-size: 13px; color: #aaa; max-width: 300px; line-height: 1.7; }

    /* ── RESPONSIVE ── */
    @media (max-width: 768px) {
      .pd-nav { padding: 0 18px; height: 62px; }
      .pd-page { padding-top: 62px; }
      .pd-breadcrumb { padding: 12px 18px; font-size: 9px; }
      .pd-info-col { padding: 28px 18px 48px; }
      .pd-specs { grid-template-columns: 1fr 1fr; gap: 10px; }
      .pd-trust { gap: 8px; }
    }

    @media (min-width: 769px) {
      .pd-img-inner { height: 560px; }
    }

    @media (min-width: 960px) {
      .pd-grid {
        grid-template-columns: 1fr 1fr;
        min-height: calc(100vh - 68px);
        align-items: stretch;
      }
      .pd-img-col {
        position: sticky; top: 68px;
        height: calc(100vh - 68px);
      }
      .pd-img-inner { height: 100%; }
      .pd-info-col {
        padding: 48px 6%;
        overflow-y: auto;
        max-height: calc(100vh - 68px);
      }
    }

    @media (min-width: 1200px) {
      .pd-info-col { padding: 56px 8% 56px 6%; }
    }
  `;
  document.head.appendChild(style);
};

// ─── ICONS ─────────────────────────────────────────────────────────────────────
const ArrowLeftIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const CartIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);
const CheckIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ZapIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

// ─── FALLBACK DATA ──────────────────────────────────────────────────────────────
const FALLBACK_PRODUCTS = {
  1: { id:1, name:"Oud Impérial",    price:450, category:"homme",  tag:"Bestseller", image:"https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80", description:"Un oud d'exception qui allie la richesse des bois orientaux à une délicatesse florale. Notes de tête: bergamote et rose. Cœur: oud, encens. Fond: ambre, musc blanc et santal précieux. Une fragrance majestueuse pour les esprits d'exception." },
  2: { id:2, name:"Rose Éternelle",  price:380, category:"femme",  tag:"Nouveau",    image:"https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80", description:"Une ode à la rose de Damas, capturée à l'aube dans toute sa splendeur. Notes de tête: pivoine, bergamote. Cœur: rose turque, jasmin, lys. Fond: musc, patchouli léger, cèdre. Une féminité absolue." },
  3: { id:3, name:"Nuit de Velours", price:520, category:"homme",  tag:"",           image:"https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&q=80", description:"Une nuit de luxe dans une bouteille. Notes de tête: poivre noir, cardamome. Cœur: cuir, violette. Fond: oud, vétiver, vanille." },
  4: { id:4, name:"Fleur de Soie",   price:420, category:"femme",  tag:"Exclusif",   image:"https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=800&q=80", description:"La délicatesse du satin floral, distillée en une seule fragrance. Notes fleuries et poudrées pour une féminité raffinée." },
  5: { id:5, name:"Atlas Cedar",     price:490, category:"mixte",  tag:"Unisex",     image:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80", description:"L'essence brute des cèdres de l'Atlas marocain. Boisé, frais, intemporel — une fragrance qui transcende les genres." },
};

const ACCORDION_ITEMS = [
  {
    key: "notes",
    title: "Notes Olfactives",
    content: "Chaque fragrance AS est composée en trois actes : les notes de tête (premières impressions), les notes de cœur (l'âme du parfum) et les notes de fond (l'empreinte durable). Un voyage sensoriel unique façonné par nos maîtres parfumeurs."
  },
  {
    key: "delivery",
    title: "Livraison & Retours",
    content: "Livraison partout au Maroc en 24-72h pour seulement 35 DH. Emballage cadeau disponible. Retours acceptés sous 14 jours pour tout produit non ouvert."
  },
  {
    key: "auth",
    title: "Authenticité & Garantie",
    content: "Tous nos parfums sont 100% authentiques, sourcés directement auprès des maisons de parfumerie. Chaque flacon est accompagné d'un certificat d'authenticité AS Fragrances."
  }
];

const FALLBACK_IMG = "https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80";

// ─── QUANTITY SELECTOR ──────────────────────────────────────────────────────────
function QuantitySelector({ value, onChange, price }) {
  const subtotal = value * price;
  return (
    <div style={{ marginBottom: 20 }}>
      <p className="pd-qty-label">Quantité</p>
      <div className="pd-qty-row">
        <div className="pd-qty-ctrl">
          <button
            className="pd-qty-btn"
            onClick={() => onChange(Math.max(1, value - 1))}
            disabled={value <= 1}
            aria-label="Diminuer"
          >−</button>
          <span className="pd-qty-val">{value}</span>
          <button
            className="pd-qty-btn"
            onClick={() => onChange(Math.min(10, value + 1))}
            disabled={value >= 10}
            aria-label="Augmenter"
          >+</button>
        </div>
        {value > 1 && (
          <span className="pd-qty-subtotal">
            Sous-total: <strong>{subtotal.toLocaleString()} DH</strong>
          </span>
        )}
      </div>
    </div>
  );
}

// ─── ACCORDION ─────────────────────────────────────────────────────────────────
function Accordion() {
  const [open, setOpen] = useState(null);
  const toggle = (key) => setOpen(o => o === key ? null : key);

  return (
    <div className="pd-accordion">
      {ACCORDION_ITEMS.map(item => (
        <div key={item.key} className="pd-accordion-item">
          <button className="pd-accordion-trigger" onClick={() => toggle(item.key)}>
            {item.title}
            <span className={`pd-accordion-icon ${open === item.key ? "open" : ""}`}>+</span>
          </button>
          <div className={`pd-accordion-body ${open === item.key ? "open" : ""}`}>
            <p className="pd-accordion-content">{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── STAR RATING ───────────────────────────────────────────────────────────────
function StarRating({ rating = 4.5 }) {
  return (
    <div className="pd-rating-row">
      <div className="pd-stars">
        {[1,2,3,4,5].map(i => (
          <span key={i} className={`pd-star ${i <= Math.floor(rating) ? "" : "empty"}`}>★</span>
        ))}
      </div>
      <span className="pd-rating-text">{rating} / 5 — Excellent</span>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────────
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [imgLoaded, setImgLoaded]   = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [qty, setQty]               = useState(1);
  const [cartCount, setCartCount]   = useState(0);

  useEffect(() => { injectStyles(); }, []);

  // Sync cart badge
  const syncCart = useCallback(() => {
    try {
      const c = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(c.length);
    } catch { setCartCount(0); }
  }, []);

  useEffect(() => {
    syncCart();
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, [syncCart]);

  // Fetch product
  useEffect(() => {
    if (!id) return;
    setLoading(true); setImgLoaded(false);
    axios.get(`https://asfragrances-api.onrender.com/products/${id}`)
      .then(res => { setProduct(res.data); setError(null); })
      .catch(() => {
        const fb = FALLBACK_PRODUCTS[Number(id)];
        if (fb) { setProduct(fb); setError(null); }
        else setError("Produit non trouvé.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      for (let i = 0; i < qty; i++) cart.push({ ...product, price: Number(product.price) });
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));
      syncCart();
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch {}
  }, [product, qty, syncCart]);

  const handleBuyNow = useCallback(() => {
    handleAddToCart();
    navigate("/cart");
  }, [handleAddToCart, navigate]);

  const catLabel = (cat) => {
    if (!cat) return "Parfum";
    if (cat === "mixte") return "Unisex";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  if (loading) return (
    <div className="pd-loading">
      <div className="pd-spinner" />
      <p className="pd-loading-text">Chargement du parfum…</p>
    </div>
  );

  if (error || !product) return (
    <div className="pd-error">
      <div className="pd-error-icon">✨</div>
      <h2 className="pd-error-title">Produit introuvable</h2>
      <p className="pd-error-msg">{error || "Ce parfum n'existe pas ou a été retiré."}</p>
      <button className="pd-btn-primary" style={{ width: "auto", padding: "13px 36px", marginTop: 8 }}
        onClick={() => navigate("/")}>
        Retour à la collection
      </button>
    </div>
  );

  const price = Number(product.price) || 0;
  const totalWithDelivery = price * qty + 35;

  return (
    <div style={{ background: "#fff" }}>

      {/* ── NAVBAR ── */}
      <nav className="pd-nav">
        <a
          href="/"
          className="pd-nav-logo"
          onClick={e => { e.preventDefault(); navigate("/"); }}
        >
          A<span>S</span>
        </a>
        <div className="pd-nav-right">
          <button className="pd-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeftIcon /> Retour
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
        <nav className="pd-breadcrumb" aria-label="Fil d'ariane">
          <span className="link" onClick={() => navigate("/")}>Accueil</span>
          <span className="pd-breadcrumb-sep">›</span>
          <span className="link" onClick={() => navigate("/")}>Parfums</span>
          <span className="pd-breadcrumb-sep">›</span>
          <span className="pd-breadcrumb-current">{product.name}</span>
        </nav>

        {/* ── MAIN GRID ── */}
        <div className="pd-grid">

          {/* ── LEFT: Image ── */}
          <div className="pd-img-col">
            <div className="pd-img-inner">
              {!imgLoaded && <div className="pd-skeleton" />}
              <img
                className={`pd-main-img ${imgLoaded ? "img-visible" : "img-hidden"}`}
                src={product.image || FALLBACK_IMG}
                alt={product.name}
                onLoad={() => setImgLoaded(true)}
                onError={e => { e.target.src = FALLBACK_IMG; setImgLoaded(true); }}
              />
              {product.category && (
                <span className={`pd-badge-cat ${product.category === "mixte" ? "dark" : ""}`}>
                  {catLabel(product.category)}
                </span>
              )}
              {product.tag && (
                <span className="pd-badge-tag">{product.tag}</span>
              )}
              <div className="pd-zoom-hint">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                Zoom
              </div>
            </div>
          </div>

          {/* ── RIGHT: Info ── */}
          <div className="pd-info-col">

            <p className="pd-eyebrow">AS Parfums — Collection Exclusive</p>
            <h1 className="pd-name">{product.name}</h1>
            <StarRating rating={4.7} />

            {/* Price */}
            <div className="pd-price-block">
              <p className="pd-price-main">{price.toLocaleString()} DH</p>
              <p className="pd-price-note">+ livraison <strong>35 DH</strong> — partout au Maroc</p>
            </div>

            <div className="pd-divider" />

            {/* Description */}
            <p className="pd-desc-title">Description</p>
            <p className="pd-desc">
              {product.description ||
                "Une fragrance d'exception qui incarne l'élégance et la sophistication. Composée avec les meilleurs ingrédients, cette création olfactive vous accompagne avec une présence subtile et envoûtante."}
            </p>

            {/* Specs */}
            <div className="pd-specs">
              <div className="pd-spec-item">
                <p className="pd-spec-label">Catégorie</p>
                <p className="pd-spec-val gold">{catLabel(product.category)}</p>
              </div>
              <div className="pd-spec-item">
                <p className="pd-spec-label">Référence</p>
                <p className="pd-spec-val">AS-{String(product.id || "000").padStart(3, "0")}</p>
              </div>
              <div className="pd-spec-item">
                <p className="pd-spec-label">Livraison</p>
                <p className="pd-spec-val">35 DH Maroc</p>
              </div>
              <div className="pd-spec-item">
                <p className="pd-spec-label">Total estimé</p>
                <p className="pd-spec-val gold">{totalWithDelivery.toLocaleString()} DH</p>
              </div>
            </div>

            <div className="pd-divider" />

            {/* Quantity */}
            <QuantitySelector value={qty} onChange={setQty} price={price} />

            {/* Actions */}
            <div className="pd-actions">
              <button
                className={`pd-btn-primary ${addedToCart ? "added" : ""}`}
                onClick={handleAddToCart}
              >
                {addedToCart
                  ? <><CheckIcon size={15} /> Ajouté au panier</>
                  : <><CartIcon size={15} /> Ajouter au panier{qty > 1 ? ` (×${qty})` : ""}</>
                }
              </button>
              <button className="pd-btn-secondary" onClick={handleBuyNow}>
                <ZapIcon size={15} /> Commander maintenant
              </button>
              <button className="pd-btn-ghost" onClick={() => navigate(-1)}>
                <ArrowLeftIcon size={13} /> Continuer mes achats
              </button>
            </div>

            {/* Success strip */}
            {addedToCart && (
              <div className="pd-success-strip">
                <CheckIcon size={16} />
                {qty > 1 ? `${qty}× ` : ""}{product.name} ajouté au panier avec succès.
              </div>
            )}

            {/* Trust badges */}
            <div className="pd-trust">
              <div className="pd-trust-item">
                <span className="pd-trust-icon">🚚</span>
                <span className="pd-trust-label">Livraison rapide</span>
                <span className="pd-trust-sub">24–72h Maroc</span>
              </div>
              <div className="pd-trust-item">
                <span className="pd-trust-icon">🔒</span>
                <span className="pd-trust-label">Paiement sécurisé</span>
                <span className="pd-trust-sub">100% sécurisé</span>
              </div>
              <div className="pd-trust-item">
                <span className="pd-trust-icon">✨</span>
                <span className="pd-trust-label">Authentique</span>
                <span className="pd-trust-sub">Certifié AS</span>
              </div>
            </div>

            {/* Accordion */}
            <Accordion />

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;