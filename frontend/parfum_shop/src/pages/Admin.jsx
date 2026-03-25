import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ─── INJECT STYLES ─────────────────────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById("as-home-styles")) return;
  const style = document.createElement("style");
  style.id = "as-home-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Poppins:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Poppins', sans-serif;
      background: #fff; color: #0a0a0a;
      overflow-x: hidden; -webkit-font-smoothing: antialiased;
    }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #fafaf7; }
    ::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 10px; }

    /* ══ NAVBAR ══ */
    .as-navbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      background: rgba(255,255,255,0.96);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(212,175,55,0.12);
      height: 68px; padding: 0 48px;
      display: flex; align-items: center; justify-content: space-between; gap: 16px;
      transition: box-shadow 0.4s ease, height 0.4s ease, background 0.4s ease;
    }
    .as-navbar.scrolled {
      box-shadow: 0 4px 32px rgba(0,0,0,0.08); height: 60px;
      background: rgba(255,255,255,0.99);
    }
    .as-logo {
      display: flex; align-items: center; text-decoration: none; flex-shrink: 0;
    }
    .as-logo-text {
      font-family: 'Playfair Display', serif;
      font-size: 22px; font-weight: 700; letter-spacing: 5px;
      color: #0a0a0a; user-select: none; line-height: 1;
    }
    .as-logo-text span { color: #D4AF37; }
    .as-nav-links {
      position: absolute; left: 50%; transform: translateX(-50%);
      display: flex; gap: 40px; list-style: none; align-items: center;
    }
    .as-nav-links a {
      font-family: 'Poppins', sans-serif; font-size: 10.5px; font-weight: 500;
      letter-spacing: 2.5px; text-transform: uppercase;
      color: #0a0a0a; text-decoration: none;
      position: relative; padding-bottom: 4px;
      transition: color 0.3s ease; cursor: pointer;
    }
    .as-nav-links a::after {
      content: ''; position: absolute; bottom: 0; left: 0;
      width: 0; height: 1px; background: #D4AF37;
      transition: width 0.35s cubic-bezier(0.4,0,0.2,1);
    }
    .as-nav-links a:hover { color: #D4AF37; }
    .as-nav-links a:hover::after { width: 100%; }
    .as-nav-actions { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }

    /* Search + Filter Container */
    .as-actions-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    /* Modern Category Select */
    .as-category-select {
      height: 42px;
      border: 1.5px solid rgba(212,175,55,0.4);
      border-radius: 40px;
      background: #fafaf8;
      font-family: 'Poppins', sans-serif;
      font-size: 11px;
      color: #0a0a0a;
      letter-spacing: 0.5px;
      padding: 0 32px 0 18px;
      cursor: pointer;
      outline: none;
      transition: all 0.3s ease;
      appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 14px;
    }
    .as-category-select:focus {
      border-color: #D4AF37;
      background-color: #fff;
    }
    .as-category-select:hover {
      border-color: #D4AF37;
    }

    /* Search */
    .as-search-wrap { position: relative; display: flex; align-items: center; }
    .as-search-input {
      height: 40px; border: 1.5px solid rgba(212,175,55,0.3);
      border-radius: 40px; background: #fafaf8;
      font-family: 'Poppins', sans-serif; font-size: 11px;
      color: #0a0a0a; letter-spacing: 0.5px;
      padding: 0 42px 0 18px;
      width: 0; opacity: 0; pointer-events: none;
      transition: width 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s, border-color 0.3s;
      outline: none;
    }
    .as-search-input::placeholder { color: #bbb; }
    .as-search-input:focus { border-color: #D4AF37; background: #fff; }
    .as-search-wrap.open .as-search-input { width: 220px; opacity: 1; pointer-events: all; }
    .as-search-toggle {
      position: absolute; right: 6px; width: 30px; height: 30px;
      background: none; border: none;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #666; z-index: 2;
      transition: color 0.3s; border-radius: 50%;
    }
    .as-search-toggle:hover { color: #D4AF37; }
    .as-search-wrap:not(.open) .as-search-toggle {
      position: static; border: 1.5px solid rgba(212,175,55,0.4);
      background: transparent; border-radius: 50%;
      width: 42px; height: 42px; transition: all 0.3s ease;
    }
    .as-search-wrap:not(.open) .as-search-toggle:hover {
      background: #D4AF37; border-color: #D4AF37; color: #fff;
      transform: translateY(-2px); box-shadow: 0 6px 20px rgba(212,175,55,0.35);
    }

    /* Icon buttons */
    .as-icon-btn {
      position: relative; width: 42px; height: 42px;
      border: 1.5px solid rgba(212,175,55,0.4);
      background: transparent; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.3s ease; color: #0a0a0a; flex-shrink: 0;
    }
    .as-icon-btn:hover {
      background: #D4AF37; border-color: #D4AF37; color: #fff;
      transform: translateY(-2px); box-shadow: 0 6px 20px rgba(212,175,55,0.35);
    }
    .as-icon-btn svg { width: 18px; height: 18px; transition: transform 0.3s ease; }
    .as-icon-btn:hover svg { transform: scale(1.08); }
    .as-cart-badge {
      position: absolute; top: -5px; right: -5px;
      background: #0a0a0a; color: #fff; border-radius: 50%;
      width: 18px; height: 18px; font-size: 9px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid #fff; pointer-events: none;
      animation: as-badge-pop 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
    }
    @keyframes as-badge-pop { from { transform: scale(0); } to { transform: scale(1); } }
    .as-btn-admin {
      padding: 9px 20px; border: none;
      background: #0a0a0a; color: #fff;
      font-family: 'Poppins', sans-serif; font-size: 9.5px;
      font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
      cursor: pointer; transition: all 0.3s ease; border-radius: 4px; white-space: nowrap;
    }
    .as-btn-admin:hover { background: #D4AF37; transform: translateY(-1px); }

    /* Hamburger */
    .as-hamburger {
      display: none; flex-direction: column; gap: 5px;
      background: none; border: none; cursor: pointer; padding: 6px; flex-shrink: 0;
    }
    .as-hamburger span {
      display: block; width: 22px; height: 1.5px;
      background: #0a0a0a; transition: all 0.35s ease; transform-origin: center;
    }
    .as-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
    .as-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    .as-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

    /* Mobile menu */
    .as-mobile-menu {
      position: fixed; top: 68px; left: 0; right: 0;
      background: rgba(255,255,255,0.98); backdrop-filter: blur(20px);
      z-index: 999; padding: 20px 24px 28px;
      border-bottom: 1px solid rgba(212,175,55,0.15);
      box-shadow: 0 12px 40px rgba(0,0,0,0.1);
      transform: translateY(-110%);
      transition: transform 0.42s cubic-bezier(0.4,0,0.2,1);
      display: flex; flex-direction: column; gap: 4px;
    }
    .as-mobile-menu.open { transform: translateY(0); }
    .as-mobile-menu a {
      font-family: 'Poppins', sans-serif; font-size: 11px;
      font-weight: 500; letter-spacing: 2.5px; text-transform: uppercase;
      color: #0a0a0a; text-decoration: none;
      padding: 13px 0; border-bottom: 1px solid #f5f5f5;
      transition: color 0.3s, padding-left 0.3s; cursor: pointer; display: block;
    }
    .as-mobile-menu a:hover { color: #D4AF37; padding-left: 6px; }
    .as-mobile-bottom { display: flex; gap: 10px; padding-top: 16px; align-items: center; flex-wrap: wrap; }
    .as-mobile-search { position: relative; margin-bottom: 4px; }
    .as-mobile-search input {
      width: 100%; height: 44px;
      border: 1.5px solid rgba(212,175,55,0.3); border-radius: 40px;
      background: #fafaf8; font-family: 'Poppins', sans-serif;
      font-size: 12px; color: #0a0a0a; padding: 0 48px 0 20px;
      outline: none; transition: border-color 0.3s, background 0.3s;
    }
    .as-mobile-search input:focus { border-color: #D4AF37; background: #fff; }
    .as-mobile-search input::placeholder { color: #bbb; }
    .as-mobile-search .srch-icon {
      position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
      color: #ccc; pointer-events: none;
    }
    .as-mobile-select {
      margin-top: 12px;
      width: 100%;
      height: 44px;
      border: 1.5px solid rgba(212,175,55,0.3);
      border-radius: 40px;
      background: #fafaf8;
      font-family: 'Poppins', sans-serif;
      font-size: 12px;
      color: #0a0a0a;
      padding: 0 20px;
      outline: none;
    }

    /* ══ SIDE CART ══ */
    .as-cart-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.5);
      z-index: 1100; opacity: 0; pointer-events: none;
      transition: opacity 0.38s ease;
    }
    .as-cart-overlay.open { opacity: 1; pointer-events: all; }
    .as-side-cart {
      position: fixed; top: 0; right: 0; bottom: 0; z-index: 1101;
      width: 420px; max-width: 95vw; background: #fff;
      display: flex; flex-direction: column;
      transform: translateX(105%);
      transition: transform 0.44s cubic-bezier(0.4,0,0.2,1);
      box-shadow: -16px 0 60px rgba(0,0,0,0.16);
    }
    .as-side-cart.open { transform: translateX(0); }
    .as-sc-header {
      padding: 24px 24px 18px; border-bottom: 1px solid #f0f0f0;
      display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
    }
    .as-sc-title-wrap { display: flex; align-items: center; gap: 10px; }
    .as-sc-title {
      font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 600; color: #0a0a0a;
    }
    .as-sc-count {
      background: #f5f4f0; color: #888;
      font-family: 'Poppins', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 1px;
      padding: 3px 9px; border-radius: 20px;
    }
    .as-sc-close {
      width: 36px; height: 36px; border-radius: 50%;
      border: 1.5px solid #e8e8e8; background: none;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.3s; color: #555; flex-shrink: 0;
    }
    .as-sc-close:hover { background: #0a0a0a; color: #fff; border-color: #0a0a0a; }
    .as-sc-body {
      flex: 1; overflow-y: auto; padding: 8px 24px;
      display: flex;
      flex-direction: column;
    }
    .as-sc-body::-webkit-scrollbar { width: 3px; }
    .as-sc-body::-webkit-scrollbar-thumb { background: #e8e5de; border-radius: 10px; }
    .as-sc-empty {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; text-align: center;
      height: 100%; gap: 16px; padding: 60px 20px;
    }
    .as-sc-empty-icon {
      width: 72px; height: 72px; border-radius: 50%;
      background: #f8f6f0; border: 1.5px solid rgba(212,175,55,0.15);
      display: flex; align-items: center; justify-content: center; color: #D4AF37;
    }
    .as-sc-empty p { font-family: 'Playfair Display', serif; font-size: 17px; font-style: italic; color: #bbb; }
    .as-sc-empty span { font-family: 'Poppins', sans-serif; font-size: 10.5px; color: #ccc; letter-spacing: 1px; }
    .as-sc-item {
      display: flex; gap: 14px; padding: 16px 0;
      border-bottom: 1px solid #f8f8f8;
      animation: as-item-in 0.32s ease both;
    }
    @keyframes as-item-in { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }
    .as-sc-item-img {
      width: 76px; height: 84px; border-radius: 12px;
      object-fit: cover; flex-shrink: 0; background: #f5f4f0;
    }
    .as-sc-item-body { flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-width: 0; }
    .as-sc-item-name {
      font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 600;
      color: #0a0a0a; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .as-sc-item-price { font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600; color: #D4AF37; }
    .as-sc-item-controls { display: flex; align-items: center; gap: 8px; }
    .as-sc-qty {
      display: flex; align-items: center;
      border: 1.5px solid #eeece5; border-radius: 30px; overflow: hidden;
    }
    .as-sc-qty-btn {
      width: 28px; height: 28px; background: none; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 15px; color: #0a0a0a; font-weight: 300; line-height: 1;
      transition: background 0.2s, color 0.2s;
    }
    .as-sc-qty-btn:hover { background: #f8f6f0; color: #D4AF37; }
    .as-sc-qty-btn:disabled { color: #ddd; cursor: not-allowed; }
    .as-sc-qty-val {
      min-width: 28px; text-align: center;
      font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600;
      border-left: 1.5px solid #eeece5; border-right: 1.5px solid #eeece5;
      padding: 4px 2px; line-height: 1.4;
    }
    .as-sc-remove {
      background: none; border: none; cursor: pointer;
      color: #ccc; font-size: 17px; padding: 4px; transition: color 0.2s; line-height: 1;
    }
    .as-sc-remove:hover { color: #e74c3c; }
    .as-sc-footer {
      padding: 18px 24px 24px; border-top: 1px solid #f0f0f0; flex-shrink: 0;
      margin-top: auto; /* Pushes footer to bottom */
    }
    .as-sc-delivery-note {
      display: flex; align-items: center; gap: 8px;
      background: #faf9f5; border-radius: 10px; padding: 10px 14px; margin-bottom: 14px;
      font-family: 'Poppins', sans-serif; font-size: 11px; color: #888;
    }
    .as-sc-delivery-note span { color: #D4AF37; font-weight: 600; }
    .as-sc-totals { margin-bottom: 16px; }
    .as-sc-row { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; }
    .as-sc-row-label { font-family: 'Poppins', sans-serif; font-size: 11px; color: #aaa; }
    .as-sc-row-val { font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 500; color: #555; }
    .as-sc-divider { height: 1px; background: #f0f0f0; margin: 8px 0; }
    .as-sc-total-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0 0; }
    .as-sc-total-label { font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #333; }
    .as-sc-total-val { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; color: #0a0a0a; }
    .as-sc-total-val small { color: #D4AF37; font-size: 14px; font-family: 'Poppins', sans-serif; font-weight: 600; }
    .as-sc-checkout {
      width: 100%; padding: 16px; background: #0a0a0a; color: #fff; border: none;
      font-family: 'Poppins', sans-serif; font-size: 11px;
      font-weight: 600; letter-spacing: 3px; text-transform: uppercase;
      cursor: pointer; border-radius: 50px;
      transition: all 0.3s ease;
      display: flex; align-items: center; justify-content: center; gap: 10px;
    }
    .as-sc-checkout:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
    .as-sc-checkout:hover:not(:disabled) {
      background: #D4AF37; transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(212,175,55,0.38);
    }
    .as-sc-continue {
      width: 100%; padding: 13px; background: transparent; color: #999;
      border: none; font-family: 'Poppins', sans-serif; font-size: 10.5px;
      font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase;
      cursor: pointer; margin-top: 10px; transition: color 0.3s;
    }
    .as-sc-continue:hover { color: #D4AF37; }

    /* ══ ANNOUNCEMENT ══ */
    .as-announce {
      background: #0a0a0a; color: rgba(255,255,255,0.75);
      text-align: center; padding: 11px 24px;
      font-family: 'Poppins', sans-serif; font-size: 10px;
      letter-spacing: 3.5px; text-transform: uppercase;
    }
    .as-announce span { color: #D4AF37; font-weight: 600; }

    /* ══ HERO ══ */
    .as-hero {
      position: relative; width: 100%; height: 92vh;
      min-height: 560px; max-height: 1000px; overflow: hidden;
    }
    .as-hero-bg {
      position: absolute; inset: 0;
      background-size: cover; background-position: center;
      will-change: transform;
      animation: as-zoom 22s ease-in-out infinite alternate;
    }
    @keyframes as-zoom { from { transform: scale(1.0); } to { transform: scale(1.08); } }
    .as-hero-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(160deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.65) 100%);
    }
    .as-hero-content {
      position: relative; z-index: 2; height: 100%;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      text-align: center; padding: 0 24px;
    }
    .as-hero-eyebrow {
      font-family: 'Poppins', sans-serif; font-size: 10.5px;
      letter-spacing: 9px; text-transform: uppercase; color: #D4AF37;
      margin-bottom: 22px; animation: as-up 1s ease both;
    }
    .as-hero-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(32px, 6.5vw, 80px);
      font-weight: 600; color: #fff; line-height: 1.1; max-width: 900px;
      animation: as-up 1s ease 0.18s both;
    }
    .as-hero-title em { color: #D4AF37; font-style: italic; }
    .as-hero-sub {
      font-family: 'Poppins', sans-serif;
      font-size: clamp(12px, 1.5vw, 14px);
      font-weight: 300; color: rgba(255,255,255,0.8);
      letter-spacing: 2.5px; margin-top: 20px;
      animation: as-up 1s ease 0.32s both;
    }
    .as-hero-sub strong { color: #D4AF37; font-weight: 600; }
    .as-hero-cta {
      margin-top: 44px; display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;
      animation: as-up 1s ease 0.46s both;
    }
    .as-btn-gold {
      padding: 15px 48px; background: #D4AF37; color: #fff; border: none;
      font-family: 'Poppins', sans-serif; font-size: 10.5px;
      font-weight: 600; letter-spacing: 3.5px; text-transform: uppercase;
      cursor: pointer; transition: all 0.35s ease; border-radius: 50px;
    }
    .as-btn-gold:hover {
      background: #b8952a; transform: translateY(-4px);
      box-shadow: 0 14px 32px rgba(212,175,55,0.45);
    }
    .as-btn-ghost {
      padding: 15px 48px; background: transparent; color: #fff;
      border: 1.5px solid rgba(255,255,255,0.4);
      font-family: 'Poppins', sans-serif; font-size: 10.5px;
      font-weight: 600; letter-spacing: 3.5px; text-transform: uppercase;
      cursor: pointer; transition: all 0.35s ease; border-radius: 50px;
    }
    .as-btn-ghost:hover { border-color: #D4AF37; color: #D4AF37; background: rgba(212,175,55,0.08); }
    .as-hero-scroll {
      position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      color: rgba(255,255,255,0.4); font-size: 8.5px; letter-spacing: 4px;
      text-transform: uppercase; z-index: 2;
      animation: as-fade 2s ease 1.4s both;
    }
    .as-scroll-line {
      width: 1px; height: 38px;
      background: linear-gradient(to bottom, #D4AF37, transparent);
      animation: as-pulse 2.5s ease-in-out infinite;
    }
    @keyframes as-pulse { 0%,100% { opacity: 0.25; transform: scaleY(0.7); } 50% { opacity: 1; transform: scaleY(1); } }
    @keyframes as-up { from { opacity: 0; transform: translateY(36px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes as-fade { from { opacity: 0; } to { opacity: 1; } }

    /* ══ PRODUCTS SECTION ══ */
    .as-products { padding: 88px 5%; background: #fff; }
    .as-sec-header { text-align: center; margin-bottom: 52px; }
    .as-sec-eye {
      font-family: 'Poppins', sans-serif; font-size: 9.5px;
      letter-spacing: 6px; text-transform: uppercase; color: #D4AF37; margin-bottom: 14px;
    }
    .as-sec-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(26px, 4vw, 44px); font-weight: 600; color: #0a0a0a; line-height: 1.15;
    }
    .as-sec-title em { color: #D4AF37; font-style: italic; }
    .as-sec-line { width: 52px; height: 1.5px; background: #D4AF37; margin: 20px auto 0; opacity: 0.6; }
    .as-filter-bar {
      display: flex; gap: 0; justify-content: center;
      margin-bottom: 56px; border-bottom: 1px solid #ebebeb; flex-wrap: wrap;
    }
    .as-filter-btn {
      padding: 13px 30px; background: none; border: none;
      border-bottom: 2px solid transparent; margin-bottom: -1px;
      font-family: 'Poppins', sans-serif; font-size: 10.5px;
      font-weight: 500; letter-spacing: 2.5px; text-transform: uppercase;
      color: #999; cursor: pointer; transition: all 0.3s ease;
    }
    .as-filter-btn:hover { color: #444; }
    .as-filter-btn.active { color: #D4AF37; border-bottom-color: #D4AF37; }

    /* Grid */
    .as-product-grid {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 28px; max-width: 1440px; margin: 0 auto;
    }

    /* Card */
    .as-product-card {
      background: #fff; border-radius: 20px;
      box-shadow: 0 2px 20px rgba(0,0,0,0.06);
      overflow: hidden; cursor: pointer;
      transition: transform 0.4s cubic-bezier(0.2,0.9,0.4,1.1), box-shadow 0.4s ease;
      display: flex; flex-direction: column;
      border: 1px solid rgba(0,0,0,0.04);
    }
    .as-product-card:hover { transform: translateY(-10px); box-shadow: 0 20px 48px rgba(0,0,0,0.14); }
    .as-prod-img-wrap {
      position: relative; width: 100%; height: 268px;
      overflow: hidden; background: #f7f5f0; flex-shrink: 0;
    }
    .as-prod-img-wrap img {
      width: 100%; height: 100%; object-fit: cover; object-position: center top;
      display: block; transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
    }
    .as-product-card:hover .as-prod-img-wrap img { transform: scale(1.08); }
    .as-prod-skeleton {
      position: absolute; inset: 0;
      background: linear-gradient(90deg, #f2efe6 25%, #e8e4d8 50%, #f2efe6 75%);
      background-size: 200% 100%;
      animation: as-shimmer 1.6s ease-in-out infinite;
      transition: opacity 0.3s;
    }
    .as-prod-skeleton.hidden { opacity: 0; pointer-events: none; }
    @keyframes as-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    .as-prod-tag {
      position: absolute; top: 14px; left: 14px; z-index: 2;
      background: #D4AF37; color: #fff;
      font-family: 'Poppins', sans-serif; font-size: 8px;
      font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
      padding: 5px 12px; border-radius: 30px;
      box-shadow: 0 2px 10px rgba(212,175,55,0.35);
    }
    .as-prod-tag.new { background: #0a0a0a; }
    .as-prod-overlay {
      position: absolute; inset: 0; z-index: 3;
      background: rgba(10,10,10,0.3);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.38s ease;
    }
    .as-product-card:hover .as-prod-overlay { opacity: 1; }
    .as-prod-quick-btn {
      background: #fff; color: #0a0a0a; border: none;
      font-family: 'Poppins', sans-serif; font-size: 9px;
      font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase;
      padding: 12px 28px; border-radius: 50px; cursor: pointer;
      transform: translateY(14px);
      transition: transform 0.38s ease, background 0.3s, color 0.3s, box-shadow 0.3s;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    .as-product-card:hover .as-prod-quick-btn { transform: translateY(0); }
    .as-prod-quick-btn:hover { background: #D4AF37; color: #fff; box-shadow: 0 6px 24px rgba(212,175,55,0.4); }
    .as-prod-info { padding: 18px 18px 20px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
    .as-prod-name { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 600; color: #0a0a0a; line-height: 1.3; }
    .as-prod-bottom { display: flex; align-items: center; justify-content: space-between; }
    .as-prod-price { font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 700; color: #D4AF37; }
    .as-card-cart-btn {
      width: 38px; height: 38px; border-radius: 50%;
      border: 1.5px solid #e8e5dc; background: #fafaf8;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.3s ease; color: #555; flex-shrink: 0;
    }
    .as-card-cart-btn svg { width: 15px; height: 15px; transition: transform 0.3s; }
    .as-card-cart-btn:hover {
      background: #D4AF37; border-color: #D4AF37; color: #fff;
      transform: scale(1.15); box-shadow: 0 4px 16px rgba(212,175,55,0.45);
    }
    .as-card-cart-btn:active { transform: scale(0.94); }

    /* Skeleton cards */
    .as-skel-card {
      background: #fff; border-radius: 20px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.05);
      overflow: hidden; border: 1px solid rgba(0,0,0,0.04);
    }
    .as-skel-img {
      height: 268px;
      background: linear-gradient(90deg, #f2efe6 25%, #e8e4d8 50%, #f2efe6 75%);
      background-size: 200% 100%; animation: as-shimmer 1.6s ease-in-out infinite;
    }
    .as-skel-body { padding: 18px; display: flex; flex-direction: column; gap: 10px; }
    .as-skel-line {
      height: 12px; border-radius: 6px;
      background: linear-gradient(90deg, #f2efe6 25%, #e8e4d8 50%, #f2efe6 75%);
      background-size: 200% 100%; animation: as-shimmer 1.6s ease-in-out infinite;
    }

    /* Empty state */
    .as-empty {
      grid-column: 1 / -1; text-align: center; padding: 80px 20px;
      font-family: 'Playfair Display', serif; font-size: 20px; color: #ccc; font-style: italic;
    }

    /* Toast */
    .as-toast {
      position: fixed; bottom: 28px; right: 28px; z-index: 9999;
      background: #141414; color: #fff;
      font-family: 'Poppins', sans-serif; font-size: 12px;
      padding: 14px 22px; border-left: 3px solid #D4AF37;
      box-shadow: 0 10px 36px rgba(0,0,0,0.24);
      transform: translateY(100px) scale(0.94); opacity: 0;
      transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
      border-radius: 10px; max-width: 320px;
      display: flex; align-items: center; gap: 10px;
    }
    .as-toast.show { transform: translateY(0) scale(1); opacity: 1; }

    /* ══ FOOTER ══ */
    .as-footer { background: #0a0a0a; color: rgba(255,255,255,0.42); padding: 64px 5% 30px; }
    .as-footer-top {
      display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 44px;
      margin-bottom: 44px; padding-bottom: 44px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
    }
    .as-footer-brand {
      font-family: 'Playfair Display', serif; font-size: 24px;
      font-weight: 700; color: #fff; letter-spacing: 5px; margin-bottom: 14px;
    }
    .as-footer-brand span { color: #D4AF37; }
    .as-footer-desc { font-size: 11.5px; line-height: 1.85; max-width: 230px; margin-bottom: 22px; }
    .as-footer-socials { display: flex; gap: 10px; }
    .as-social-link {
      width: 38px; height: 38px; border-radius: 50%;
      border: 1.5px solid rgba(255,255,255,0.12);
      display: flex; align-items: center; justify-content: center;
      text-decoration: none; color: rgba(255,255,255,0.45);
      transition: all 0.3s ease;
    }
    .as-social-link:hover {
      border-color: #D4AF37; color: #D4AF37;
      background: rgba(212,175,55,0.1); transform: translateY(-3px);
    }
    .as-social-link svg { width: 16px; height: 16px; }
    .as-footer-col-title {
      font-size: 9px; font-weight: 700; letter-spacing: 3.5px;
      text-transform: uppercase; color: rgba(255,255,255,0.7); margin-bottom: 18px;
    }
    .as-footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
    .as-footer-col ul li a {
      color: rgba(255,255,255,0.38); text-decoration: none; font-size: 11.5px;
      transition: color 0.3s, padding-left 0.3s; display: inline-block;
    }
    .as-footer-col ul li a:hover { color: #D4AF37; padding-left: 4px; }
    .as-footer-bottom {
      display: flex; justify-content: space-between; align-items: center;
      font-size: 10px; flex-wrap: wrap; gap: 12px;
    }
    .as-footer-gold { color: #D4AF37; }
    .as-footer-credit { font-size: 9.5px; letter-spacing: 1px; }
    .as-footer-credit span { color: #D4AF37; font-weight: 600; }

    /* ══ RESPONSIVE ══ */
    @media (min-width: 1280px) { .as-product-grid { grid-template-columns: repeat(4, 1fr); } }
    @media (min-width: 960px) and (max-width: 1279px) {
      .as-product-grid { grid-template-columns: repeat(3, 1fr); gap: 22px; }
      .as-navbar { padding: 0 32px; }
    }
    @media (min-width: 600px) and (max-width: 959px) {
      .as-product-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
      .as-footer-top { grid-template-columns: 1fr 1fr; gap: 32px; }
      .as-prod-img-wrap { height: 230px; }
      .as-skel-img { height: 230px; }
      .as-navbar { padding: 0 24px; }
    }
    @media (max-width: 960px) { .as-nav-links { display: none !important; } }
    @media (max-width: 767px) {
      .as-navbar { padding: 0 18px; height: 62px; }
      .as-navbar.scrolled { height: 58px; }
      .as-mobile-menu { top: 62px; }
      .as-nav-actions .as-btn-admin,
      .as-nav-actions .as-search-wrap,
      .as-nav-actions .as-category-select { display: none !important; }
      .as-hamburger { display: flex !important; }
      .as-hero { min-height: 460px; height: 80vh; max-height: 700px; }
      .as-hero-cta { gap: 10px; }
      .as-btn-gold, .as-btn-ghost { padding: 13px 28px; font-size: 10px; }
      .as-products { padding: 56px 16px; }
      .as-footer { padding: 42px 18px 24px; }
      .as-footer-top { grid-template-columns: 1fr; gap: 30px; }
      .as-footer-bottom { flex-direction: column; text-align: center; }
      .as-product-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .as-prod-img-wrap { height: 180px; }
      .as-skel-img { height: 180px; }
    }
    @media (max-width: 420px) {
      .as-product-grid { gap: 10px; }
      .as-prod-img-wrap { height: 155px; }
      .as-prod-info { padding: 12px 12px 14px; gap: 7px; }
      .as-prod-name { font-size: 13.5px; }
      .as-prod-price { font-size: 13px; }
      .as-card-cart-btn { width: 34px; height: 34px; }
      .as-card-cart-btn svg { width: 13px; height: 13px; }
      .as-logo-text { font-size: 18px; letter-spacing: 3px; }
      .as-filter-btn { padding: 10px 14px; font-size: 9px; letter-spacing: 1.5px; }
      .as-btn-gold, .as-btn-ghost { padding: 12px 22px; }
    }
  `;
  document.head.appendChild(style);
};

// ─── ICONS ─────────────────────────────────────────────────────────────────────
const CartIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);
const SearchIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const CloseIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const TruckIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 5v4h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.82a4.85 4.85 0 01-1.07-.13z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

// ─── FALLBACK DATA ──────────────────────────────────────────────────────────────
const FALLBACK_PRODUCTS = [
  { id: 1, name: "Oud Impérial",    price: 450, category: "homme", image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80", tag: "Bestseller" },
  { id: 2, name: "Rose Éternelle",  price: 380, category: "femme", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80", tag: "Nouveau" },
  { id: 3, name: "Nuit de Velours", price: 520, category: "homme", image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80", tag: "" },
  { id: 4, name: "Fleur de Soie",   price: 420, category: "femme", image: "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=600&q=80", tag: "Exclusif" },
  { id: 5, name: "Atlas Cedar",     price: 490, category: "mixte", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", tag: "Unisex" },
  { id: 6, name: "Jasmin Blanc",    price: 360, category: "femme", image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&q=80", tag: "Bestseller" },
  { id: 7, name: "Santal Noir",     price: 550, category: "mixte", image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e10?w=600&q=80", tag: "Unisex" },
  { id: 8, name: "Iris Précieux",   price: 410, category: "femme", image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80", tag: "Nouveau" },
];

const FALLBACK_IMG = "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80";

// ─── SKELETON CARD ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="as-skel-card">
      <div className="as-skel-img" />
      <div className="as-skel-body">
        <div className="as-skel-line" style={{ width: "72%" }} />
        <div className="as-skel-line" style={{ width: "40%" }} />
      </div>
    </div>
  );
}

// ─── PRODUCT CARD ───────────────────────────────────────────────────────────────
const ProductCard = ({ product, onAddToCart, onClick }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <div className="as-product-card" onClick={onClick}>
      <div className="as-prod-img-wrap">
        <div className={`as-prod-skeleton ${imgLoaded ? "hidden" : ""}`} />
        <img
          src={product.image || FALLBACK_IMG}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={e => { e.target.src = FALLBACK_IMG; setImgLoaded(true); }}
        />
        {product.tag && (
          <span className={`as-prod-tag ${product.tag === "Nouveau" ? "new" : ""}`}>
            {product.tag}
          </span>
        )}
        <div className="as-prod-overlay">
          <button className="as-prod-quick-btn" onClick={e => onAddToCart(e, product)}>
            Ajouter au panier
          </button>
        </div>
      </div>
      <div className="as-prod-info">
        <h3 className="as-prod-name">{product.name}</h3>
        <div className="as-prod-bottom">
          <p className="as-prod-price">{product.price} DH</p>
          <button
            className="as-card-cart-btn"
            onClick={e => onAddToCart(e, product)}
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <CartIcon size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── SIDE CART ──────────────────────────────────────────────────────────────────
function SideCart({ open, onClose, cartItems, onRemove, onQtyChange, onCheckout, isCheckingOut }) {
  const subtotal = useMemo(
    () => cartItems.reduce((s, i) => s + Number(i.price || 0) * (i.qty || 1), 0),
    [cartItems]
  );
  const total = subtotal + 35;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div className={`as-cart-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`as-side-cart ${open ? "open" : ""}`} role="dialog" aria-label="Panier">
        <div className="as-sc-header">
          <div className="as-sc-title-wrap">
            <h2 className="as-sc-title">Mon Panier</h2>
            {cartItems.length > 0 && (
              <span className="as-sc-count">{cartItems.length} article{cartItems.length > 1 ? "s" : ""}</span>
            )}
          </div>
          <button className="as-sc-close" onClick={onClose} aria-label="Fermer">
            <CloseIcon size={15} />
          </button>
        </div>

        <div className="as-sc-body">
          {cartItems.length === 0 ? (
            <div className="as-sc-empty">
              <div className="as-sc-empty-icon"><CartIcon size={28} /></div>
              <p>Votre panier est vide</p>
              <span>Ajoutez des parfums pour commencer</span>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="as-sc-item">
                <img
                  className="as-sc-item-img"
                  src={item.image || FALLBACK_IMG}
                  alt={item.name}
                  onError={e => { e.target.src = FALLBACK_IMG; }}
                />
                <div className="as-sc-item-body">
                  <p className="as-sc-item-name">{item.name}</p>
                  <p className="as-sc-item-price">{(Number(item.price) * (item.qty || 1)).toLocaleString()} DH</p>
                  <div className="as-sc-item-controls">
                    <div className="as-sc-qty">
                      <button className="as-sc-qty-btn" onClick={() => onQtyChange(idx, (item.qty || 1) - 1)} disabled={(item.qty || 1) <= 1}>−</button>
                      <span className="as-sc-qty-val">{item.qty || 1}</span>
                      <button className="as-sc-qty-btn" onClick={() => onQtyChange(idx, (item.qty || 1) + 1)} disabled={(item.qty || 1) >= 10}>+</button>
                    </div>
                    <button className="as-sc-remove" onClick={() => onRemove(idx)} aria-label="Supprimer">×</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="as-sc-footer">
            <div className="as-sc-delivery-note">
              <TruckIcon size={13} />
              Livraison partout au Maroc — <span>35 DH</span>
            </div>
            <div className="as-sc-totals">
              <div className="as-sc-row">
                <span className="as-sc-row-label">Sous-total</span>
                <span className="as-sc-row-val">{subtotal.toLocaleString()} DH</span>
              </div>
              <div className="as-sc-row">
                <span className="as-sc-row-label">Livraison</span>
                <span className="as-sc-row-val">35 DH</span>
              </div>
              <div className="as-sc-divider" />
              <div className="as-sc-total-row">
                <span className="as-sc-total-label">Total</span>
                <span className="as-sc-total-val">{total.toLocaleString()} <small>DH</small></span>
              </div>
            </div>
            <button className="as-sc-checkout" onClick={onCheckout} disabled={isCheckingOut}>
              {isCheckingOut ? 'Redirection...' : 'Commander'}
            </button>
            <button className="as-sc-continue" onClick={onClose}>Continuer mes achats</button>
          </div>
        )}
      </aside>
    </>
  );
}

// ─── HOME ───────────────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();

  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState("tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen]   = useState(false);
  const [cartItems, setCartItems]     = useState([]);
  const [cartOpen, setCartOpen]       = useState(false);
  const [toast, setToast]             = useState({ msg: "", show: false });
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const toastTimer  = useRef(null);
  const productsRef = useRef(null);
  const searchRef   = useRef(null);

  useEffect(() => { injectStyles(); }, []);

  // ── Flatten cart items to flat array for storage ──
  const persistCart = useCallback((items) => {
    const flat = items.flatMap(item =>
      Array.from({ length: item.qty || 1 }, () => ({ ...item }))
    );
    localStorage.setItem("cart", JSON.stringify(flat));
    window.dispatchEvent(new Event("storage"));
  }, []);

  // ── Sync from localStorage (deduplicate by id) ──
  const syncCart = useCallback(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("cart") || "[]");
      const map = {};
      stored.forEach(item => {
        if (map[item.id]) map[item.id].qty = (map[item.id].qty || 1) + 1;
        else map[item.id] = { ...item, qty: item.qty || 1 };
      });
      setCartItems(Object.values(map));
    } catch { setCartItems([]); }
  }, []);

  useEffect(() => {
    syncCart();
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, [syncCart]);

  // ── Fetch products ──
  useEffect(() => {
    setLoading(true);
    axios.get("https://asfragrances-api.onrender.com/products")
      .then(res => setProducts(res.data))
      .catch(() => setProducts(FALLBACK_PRODUCTS))
      .finally(() => setLoading(false));
  }, []);

  // ── Scroll ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Search focus ──
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 80);
  }, [searchOpen]);

  const showToast = useCallback((msg) => {
    clearTimeout(toastTimer.current);
    setToast({ msg, show: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2800);
  }, []);

  const addToCart = useCallback((e, product) => {
    e.stopPropagation();
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      const updated = existing
        ? prev.map(i => i.id === product.id ? { ...i, qty: (i.qty || 1) + 1 } : i)
        : [...prev, { ...product, qty: 1 }];
      persistCart(updated);
      return updated;
    });
    showToast(`${product.name} ajouté au panier`);
    setCartOpen(true);
  }, [showToast, persistCart]);

  const removeFromCart = useCallback((idx) => {
    setCartItems(prev => {
      const updated = prev.filter((_, i) => i !== idx);
      persistCart(updated);
      return updated;
    });
  }, [persistCart]);

  const changeQty = useCallback((idx, newQty) => {
    if (newQty < 1) return;
    setCartItems(prev => {
      const updated = prev.map((item, i) => i === idx ? { ...item, qty: newQty } : item);
      persistCart(updated);
      return updated;
    });
  }, [persistCart]);

  const scrollToProducts = useCallback(() => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const filteredProducts = useMemo(() => {
    let list = products;
    if (filter !== "tous") list = list.filter(p => p.category === filter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [products, filter, searchQuery]);

  const cartCount = useMemo(
    () => cartItems.reduce((s, i) => s + (i.qty || 1), 0),
    [cartItems]
  );

  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) {
      showToast("Votre panier est vide");
      return;
    }
    setIsCheckingOut(true);
    // Prepare order data for the checkout page
    const orderData = {
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.qty,
        image: item.image
      })),
      total: cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0) + 35, // including shipping
      shipping: 35
    };
    // Use navigate with state to pass cart data securely
    navigate('/checkout', { state: { cart: orderData } });
    setCartOpen(false);
    // Reset loading state after a delay (navigation will unmount component, but for safety)
    setTimeout(() => setIsCheckingOut(false), 500);
  }, [cartItems, navigate, showToast]);

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>

      <SideCart
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onRemove={removeFromCart}
        onQtyChange={changeQty}
        onCheckout={handleCheckout}
        isCheckingOut={isCheckingOut}
      />

      {/* NAVBAR */}
      <nav className={`as-navbar ${scrolled ? "scrolled" : ""}`}>
        <a href="/" className="as-logo">
          <span className="as-logo-text">A<span>S</span></span>
        </a>

        <ul className="as-nav-links">
          <li><a onClick={scrollToProducts}>Parfums</a></li>
          <li><a href="#">Notre Histoire</a></li>
        </ul>

        <div className="as-nav-actions">
          <div className="as-actions-container">
            <div className={`as-search-wrap ${searchOpen ? "open" : ""}`}>
              <input
                ref={searchRef}
                className="as-search-input"
                type="text"
                placeholder="Rechercher…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); } }}
              />
              <button
                className="as-search-toggle"
                aria-label={searchOpen ? "Fermer" : "Rechercher"}
                onClick={() => { if (searchOpen) setSearchQuery(""); setSearchOpen(v => !v); }}
              >
                {searchOpen ? <CloseIcon size={14} /> : <SearchIcon size={16} />}
              </button>
            </div>
            <select
              className="as-category-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filtrer par catégorie"
            >
              <option value="tous">Tous</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
              <option value="mixte">Mixte</option>
            </select>
          </div>

          <button className="as-icon-btn" onClick={() => setCartOpen(true)} aria-label="Panier">
            <CartIcon size={18} />
            {cartCount > 0 && <span className="as-cart-badge">{cartCount}</span>}
          </button>

          <button className="as-btn-admin" onClick={() => navigate("/admin")}>Admin</button>
        </div>

        <button
          className={`as-hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`as-mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="as-mobile-search">
          <input
            type="text"
            placeholder="Rechercher un parfum…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <span className="srch-icon"><SearchIcon size={15} /></span>
        </div>
        <select
          className="as-mobile-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filtrer par catégorie"
        >
          <option value="tous">Tous</option>
          <option value="homme">Homme</option>
          <option value="femme">Femme</option>
          <option value="mixte">Mixte</option>
        </select>
        <a onClick={() => { scrollToProducts(); setMenuOpen(false); }}>Parfums</a>
        <a href="#" onClick={() => setMenuOpen(false)}>Notre Histoire</a>
        <div className="as-mobile-bottom">
          <button className="as-icon-btn" onClick={() => { setCartOpen(true); setMenuOpen(false); }}>
            <CartIcon size={16} />
            {cartCount > 0 && <span className="as-cart-badge">{cartCount}</span>}
          </button>
          <button className="as-btn-admin" onClick={() => { navigate("/admin"); setMenuOpen(false); }}>Admin</button>
        </div>
      </div>

      {/* ANNOUNCEMENT */}
      <div className="as-announce" style={{ marginTop: 68 }}>
        Livraison partout au Maroc — seulement <span>35 DH</span>
      </div>

      {/* HERO */}
      <section className="as-hero">
        <div
          className="as-hero-bg"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1800&q=85')" }}
        />
        <div className="as-hero-overlay" />
        <div className="as-hero-content">
          <p className="as-hero-eyebrow">L'Art de la Parfumerie</p>
          <h1 className="as-hero-title">
            L'élégance commence<br />par le <em>parfum</em>
          </h1>
          <p className="as-hero-sub">
            Livraison partout au Maroc — seulement <strong>35 DH</strong>
          </p>
          <div className="as-hero-cta">
            <button className="as-btn-gold" onClick={scrollToProducts}>Découvrir</button>
            <button className="as-btn-ghost">Notre Histoire</button>
          </div>
        </div>
        <div className="as-hero-scroll">
          <div className="as-scroll-line" />
          Défiler
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="as-products" id="products" ref={productsRef}>
        <div className="as-sec-header">
          <p className="as-sec-eye">Notre Collection</p>
          <h2 className="as-sec-title">Nos <em>Parfums</em></h2>
          <div className="as-sec-line" />
        </div>

        <div className="as-filter-bar">
          {[
            { key: "tous",  label: "Tous" },
            { key: "homme", label: "Homme" },
            { key: "femme", label: "Femme" },
            { key: "mixte", label: "Unisex" },
          ].map(f => (
            <button
              key={f.key}
              className={`as-filter-btn ${filter === f.key ? "active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="as-product-grid">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filteredProducts.length === 0
              ? <p className="as-empty">
                  {searchQuery ? `Aucun résultat pour « ${searchQuery} »` : "Aucun parfum dans cette catégorie."}
                </p>
              : filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onClick={() => navigate(`/product/${product.id}`)}
                  />
                ))
          }
        </div>
      </section>

      {/* FOOTER */}
      <footer className="as-footer">
        <div className="as-footer-top">
          <div>
            <div className="as-footer-brand">A<span>S</span></div>
            <p className="as-footer-desc">
              Des fragrances d'exception, façonnées pour ceux qui exigent le meilleur. Livraison dans tout le Maroc.
            </p>
            <div className="as-footer-socials">
              <a href="https://www.tiktok.com/@as.fragrances1?_r=1&_t=ZS-94ytX19NjSX" className="as-social-link" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
                <TikTokIcon />
              </a>
              <a href="https://www.instagram.com/as.fragrances1?igsh=MW1sbWRoeHBqcTgyag==" className="as-social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <InstagramIcon />
              </a>
            </div>
          </div>
          {[
            { title: "Navigation", links: ["Parfums", "Notre Histoire"] },
            { title: "Service",    links: ["Livraison", "Retours", "FAQ", "Contact"] },
            { title: "Légal",      links: ["Mentions légales", "Confidentialité", "CGV"] },
          ].map(col => (
            <div key={col.title} className="as-footer-col">
              <p className="as-footer-col-title">{col.title}</p>
              <ul>{col.links.map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="as-footer-bottom">
          <span>© 2026 AS FRAGRANCES. Tous droits réservés.</span>
          <span className="as-footer-gold">Livraison Maroc — 35 DH</span>
          <span className="as-footer-credit">Created by <span>HATIM ILYAS VITI</span></span>
        </div>
      </footer>

      {/* TOAST */}
      <div className={`as-toast ${toast.show ? "show" : ""}`}>
        <span style={{ color: "#D4AF37", fontSize: 15 }}>✓</span>
        {toast.msg}
      </div>
    </div>
  );
}