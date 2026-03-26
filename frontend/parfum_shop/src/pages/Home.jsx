import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById("as-home-styles")) return;
  const style = document.createElement("style");
  style.id = "as-home-styles";
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
    .as-navbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      background: rgba(255,255,255,0.97);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(212,175,55,0.15);
      height: 68px; padding: 0 52px;
      display: flex; align-items: center; justify-content: space-between;
      transition: box-shadow 0.4s, height 0.4s;
    }
    .as-navbar.scrolled {
      box-shadow: 0 2px 28px rgba(0,0,0,0.07);
      height: 60px;
    }

    /* Logo */
    .as-logo {
      display: flex; align-items: center; gap: 10px;
      text-decoration: none; flex-shrink: 0;
    }
    .as-logo-img {
      height: 40px; width: auto; object-fit: contain; display: block;
    }
    .as-logo-text {
      font-family: 'Playfair Display', serif;
      font-size: 22px; font-weight: 700; letter-spacing: 4px;
      color: #0a0a0a; user-select: none;
    }
    .as-logo-text span { color: #D4AF37; }

    /* Nav links (centered) */
    .as-nav-links {
      position: absolute; left: 50%; transform: translateX(-50%);
      display: flex; gap: 44px; list-style: none;
    }
    .as-nav-links a {
      font-family: 'Poppins', sans-serif;
      font-size: 10.5px; font-weight: 500;
      letter-spacing: 2.5px; text-transform: uppercase;
      color: #0a0a0a; text-decoration: none;
      position: relative; padding-bottom: 4px;
      transition: color 0.3s; cursor: pointer;
    }
    .as-nav-links a::after {
      content: ''; position: absolute; bottom: 0; left: 0; right: 100%;
      height: 1px; background: #D4AF37;
      transition: right 0.35s cubic-bezier(0.4,0,0.2,1);
    }
    .as-nav-links a:hover { color: #D4AF37; }
    .as-nav-links a:hover::after { right: 0; }

    /* Nav actions */
    .as-nav-actions { display: flex; gap: 10px; align-items: center; flex-shrink: 0; }

    /* ── SEARCH ── */
    .as-search-wrap {
      position: relative; display: flex; align-items: center;
    }
    .as-search-input {
      height: 38px;
      border: 1.5px solid rgba(212,175,55,0.35);
      border-radius: 40px;
      background: #fafaf8;
      font-family: 'Poppins', sans-serif; font-size: 11px;
      color: #0a0a0a; letter-spacing: 0.5px;
      padding: 0 38px 0 16px;
      width: 0; opacity: 0; pointer-events: none;
      transition: width 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.3s, border-color 0.3s;
      outline: none;
    }
    .as-search-input::placeholder { color: #aaa; }
    .as-search-input:focus { border-color: #D4AF37; }
    .as-search-wrap.open .as-search-input {
      width: 210px; opacity: 1; pointer-events: all;
    }
    .as-search-toggle {
      position: absolute; right: 8px;
      width: 34px; height: 34px;
      background: none; border: none;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #555; z-index: 2;
      transition: color 0.3s;
      border-radius: 50%;
    }
    .as-search-toggle:hover { color: #D4AF37; }
    .as-search-wrap:not(.open) .as-search-toggle {
      position: static;
      border: 1.5px solid rgba(212,175,55,0.5);
      background: transparent; border-radius: 50%;
      width: 42px; height: 42px;
      transition: all 0.3s ease;
    }
    .as-search-wrap:not(.open) .as-search-toggle:hover {
      background: #D4AF37; border-color: #D4AF37; color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(212,175,55,0.35);
    }

    /* Cart icon button */
    .as-cart-btn {
      position: relative; width: 42px; height: 42px;
      border: 1.5px solid rgba(212,175,55,0.5);
      background: transparent; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.3s ease; color: #0a0a0a;
    }
    .as-cart-btn:hover {
      background: #D4AF37; border-color: #D4AF37; color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(212,175,55,0.35);
    }
    .as-cart-btn svg { width: 18px; height: 18px; transition: transform 0.3s ease; }
    .as-cart-btn:hover svg { transform: scale(1.1); }
    .as-cart-badge {
      position: absolute; top: -5px; right: -5px;
      background: #0a0a0a; color: #fff;
      border-radius: 50%; width: 17px; height: 17px;
      font-size: 9px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      border: 1.5px solid #fff; pointer-events: none;
    }

    /* Admin button */
    .as-btn-admin {
      padding: 9px 22px; border: none;
      background: #0a0a0a; color: #fff;
      font-family: 'Poppins', sans-serif; font-size: 10px;
      font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
      cursor: pointer; transition: background 0.3s; border-radius: 4px;
    }
    .as-btn-admin:hover { background: #D4AF37; }

    /* Hamburger */
    .as-hamburger {
      display: none; flex-direction: column; gap: 5px;
      background: none; border: none; cursor: pointer; padding: 4px;
    }
    .as-hamburger span {
      display: block; width: 24px; height: 1.5px;
      background: #0a0a0a; transition: all 0.3s ease;
    }
    .as-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
    .as-hamburger.open span:nth-child(2) { opacity: 0; }
    .as-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

    /* Mobile menu */
    .as-mobile-menu {
      position: fixed; top: 68px; left: 0; right: 0;
      background: #fff; z-index: 999;
      padding: 24px 28px;
      border-bottom: 1px solid rgba(212,175,55,0.2);
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      transform: translateY(-110%);
      transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
      display: flex; flex-direction: column; gap: 18px;
    }
    .as-mobile-menu.open { transform: translateY(0); }
    .as-mobile-menu a {
      font-family: 'Poppins', sans-serif; font-size: 12px;
      font-weight: 500; letter-spacing: 2.5px; text-transform: uppercase;
      color: #0a0a0a; text-decoration: none;
      padding: 10px 0; border-bottom: 1px solid #f0f0f0;
      transition: color 0.3s; cursor: pointer;
    }
    .as-mobile-menu a:hover { color: #D4AF37; }
    .as-mobile-actions { display: flex; gap: 10px; padding-top: 4px; align-items: center; }

    /* Mobile search */
    .as-mobile-search {
      position: relative;
    }
    .as-mobile-search input {
      width: 100%; height: 42px;
      border: 1.5px solid rgba(212,175,55,0.35); border-radius: 40px;
      background: #fafaf8; font-family: 'Poppins', sans-serif;
      font-size: 12px; color: #0a0a0a; padding: 0 44px 0 18px;
      outline: none; transition: border-color 0.3s;
    }
    .as-mobile-search input:focus { border-color: #D4AF37; }
    .as-mobile-search input::placeholder { color: #aaa; }
    .as-mobile-search svg {
      position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
      color: #aaa; pointer-events: none;
    }

    /* ── SIDE CART ── */
    .as-cart-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.45);
      z-index: 1100; opacity: 0; pointer-events: none;
      transition: opacity 0.35s ease;
    }
    .as-cart-overlay.open { opacity: 1; pointer-events: all; }

    .as-side-cart {
      position: fixed; top: 0; right: 0; bottom: 0; z-index: 1101;
      width: 400px; max-width: 92vw;
      background: #fff; display: flex; flex-direction: column;
      transform: translateX(100%);
      transition: transform 0.42s cubic-bezier(0.4,0,0.2,1);
      box-shadow: -12px 0 48px rgba(0,0,0,0.14);
    }
    .as-side-cart.open { transform: translateX(0); }

    .as-side-cart-header {
      padding: 24px 24px 20px;
      border-bottom: 1px solid #f0f0f0;
      display: flex; align-items: center; justify-content: space-between;
      flex-shrink: 0;
    }
    .as-side-cart-title {
      font-family: 'Playfair Display', serif; font-size: 20px;
      font-weight: 600; color: #0a0a0a;
    }
    .as-side-cart-close {
      width: 36px; height: 36px; border-radius: 50%;
      border: 1.5px solid #e8e8e8; background: none;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.3s; color: #555;
    }
    .as-side-cart-close:hover { background: #0a0a0a; color: #fff; border-color: #0a0a0a; }

    .as-side-cart-body {
      flex: 1; overflow-y: auto; padding: 16px 24px;
    }
    .as-side-cart-empty {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; height: 100%; gap: 14px;
      color: #bbb; padding: 40px 0;
    }
    .as-side-cart-empty p {
      font-family: 'Playfair Display', serif; font-size: 18px;
      font-style: italic; color: #ccc;
    }

    .as-cart-item {
      display: flex; gap: 14px; padding: 14px 0;
      border-bottom: 1px solid #f5f5f5;
      animation: as-fade-in 0.3s ease;
    }
    @keyframes as-fade-in { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
    .as-cart-item-img {
      width: 72px; height: 80px; border-radius: 10px;
      object-fit: cover; flex-shrink: 0; background: #f5f4f0;
    }
    .as-cart-item-info { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 4px; }
    .as-cart-item-name {
      font-family: 'Playfair Display', serif; font-size: 14px;
      font-weight: 600; color: #0a0a0a; line-height: 1.3;
    }
    .as-cart-item-price {
      font-family: 'Poppins', sans-serif; font-size: 13px;
      font-weight: 600; color: #D4AF37;
    }
    .as-cart-item-remove {
      align-self: flex-start; background: none; border: none;
      cursor: pointer; color: #ccc; font-size: 18px; padding: 2px;
      transition: color 0.3s; line-height: 1;
    }
    .as-cart-item-remove:hover { color: #e74c3c; }

    .as-side-cart-footer {
      padding: 20px 24px; border-top: 1px solid #f0f0f0; flex-shrink: 0;
    }
    .as-cart-total-row {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 16px;
    }
    .as-cart-total-label {
      font-family: 'Poppins', sans-serif; font-size: 11px;
      font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #888;
    }
    .as-cart-total-val {
      font-family: 'Playfair Display', serif; font-size: 22px;
      font-weight: 700; color: #0a0a0a;
    }
    .as-cart-total-val span { color: #D4AF37; font-size: 14px; }
    .as-cart-checkout-btn {
      width: 100%; padding: 15px; background: #0a0a0a; color: #fff; border: none;
      font-family: 'Poppins', sans-serif; font-size: 11px;
      font-weight: 600; letter-spacing: 3px; text-transform: uppercase;
      cursor: pointer; border-radius: 40px;
      transition: background 0.3s, transform 0.2s, box-shadow 0.3s;
    }
    .as-cart-checkout-btn:hover {
      background: #D4AF37; transform: translateY(-2px);
      box-shadow: 0 10px 26px rgba(212,175,55,0.35);
    }
    .as-cart-view-btn {
      width: 100%; padding: 13px; background: transparent; color: #0a0a0a;
      border: 1.5px solid #e0e0e0;
      font-family: 'Poppins', sans-serif; font-size: 11px;
      font-weight: 500; letter-spacing: 2px; text-transform: uppercase;
      cursor: pointer; border-radius: 40px; margin-top: 10px;
      transition: border-color 0.3s, color 0.3s;
    }
    .as-cart-view-btn:hover { border-color: #D4AF37; color: #D4AF37; }

    /* ── ANNOUNCEMENT ── */
    .as-announce {
      background: #0a0a0a; color: #fff;
      text-align: center; padding: 10px 24px;
      font-family: 'Poppins', sans-serif; font-size: 10px;
      letter-spacing: 3px; text-transform: uppercase;
    }
    .as-announce span { color: #D4AF37; font-weight: 600; }

    /* ── HERO ── */
    .as-hero {
      position: relative; width: 100%; height: 90vh;
      min-height: 580px; overflow: hidden;
    }
    .as-hero-bg {
      position: absolute; inset: 0;
      background-size: cover; background-position: center;
      animation: as-zoom 18s ease-in-out infinite alternate;
      will-change: transform;
    }
    @keyframes as-zoom {
      from { transform: scale(1.04); }
      to   { transform: scale(1.10); }
    }
    .as-hero-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.72) 100%);
    }
    .as-hero-content {
      position: relative; z-index: 2; height: 100%;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      text-align: center; padding: 0 24px;
    }
    .as-hero-eyebrow {
      font-family: 'Poppins', sans-serif; font-size: 11px;
      letter-spacing: 8px; text-transform: uppercase; color: #D4AF37;
      margin-bottom: 20px; animation: as-up 0.9s ease both;
    }
    .as-hero-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(34px, 6.5vw, 76px);
      font-weight: 600; color: #fff;
      line-height: 1.12; max-width: 880px;
      animation: as-up 0.9s ease 0.15s both;
    }
    .as-hero-title em { color: #D4AF37; font-style: italic; }
    .as-hero-sub {
      font-family: 'Poppins', sans-serif; font-size: 14px;
      font-weight: 300; color: rgba(255,255,255,0.88);
      letter-spacing: 2px; margin-top: 18px;
      animation: as-up 0.9s ease 0.28s both;
    }
    .as-hero-sub strong { color: #D4AF37; font-weight: 600; }
    .as-hero-cta {
      margin-top: 40px; display: flex; gap: 18px; flex-wrap: wrap; justify-content: center;
      animation: as-up 0.9s ease 0.4s both;
    }
    .as-btn-gold {
      padding: 14px 44px; background: #D4AF37; color: #fff; border: none;
      font-family: 'Poppins', sans-serif; font-size: 11px;
      font-weight: 600; letter-spacing: 3px; text-transform: uppercase;
      cursor: pointer; transition: all 0.3s ease; border-radius: 40px;
    }
    .as-btn-gold:hover {
      background: #b8952a; transform: translateY(-3px);
      box-shadow: 0 12px 28px rgba(212,175,55,0.4);
    }
    .as-btn-ghost {
      padding: 14px 44px; background: transparent; color: #fff;
      border: 1.5px solid rgba(255,255,255,0.45);
      font-family: 'Poppins', sans-serif; font-size: 11px;
      font-weight: 600; letter-spacing: 3px; text-transform: uppercase;
      cursor: pointer; transition: all 0.3s ease; border-radius: 40px;
    }
    .as-btn-ghost:hover { border-color: #D4AF37; background: rgba(212,175,55,0.1); }
    .as-hero-scroll {
      position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      color: rgba(255,255,255,0.5); font-size: 9px; letter-spacing: 3px;
      text-transform: uppercase; z-index: 2;
      animation: as-fade 2s ease 1.2s both;
    }
    .as-scroll-line {
      width: 1px; height: 36px;
      background: linear-gradient(to bottom, #D4AF37, transparent);
      animation: as-pulse 2.2s ease-in-out infinite;
    }
    @keyframes as-pulse {
      0%,100% { opacity: 0.3; transform: scaleY(0.8); }
      50% { opacity: 1; transform: scaleY(1); }
    }
    @keyframes as-up {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes as-fade { from { opacity: 0; } to { opacity: 1; } }

    /* ── SECTION HEADERS ── */
    .as-sec-header { text-align: center; margin-bottom: 48px; }
    .as-sec-eye {
      font-family: 'Poppins', sans-serif; font-size: 10px;
      letter-spacing: 5px; text-transform: uppercase; color: #D4AF37; margin-bottom: 12px;
    }
    .as-sec-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(28px, 4.5vw, 44px); font-weight: 600; color: #0a0a0a; line-height: 1.2;
    }
    .as-sec-title em { color: #D4AF37; font-style: italic; }
    .as-sec-line { width: 56px; height: 2px; background: #D4AF37; margin: 18px auto 0; opacity: 0.55; }

    /* ── PRODUCTS SECTION ── */
    .as-products { padding: 80px 5%; background: #fff; }

    .as-filter-bar {
      display: flex; gap: 0; justify-content: center;
      margin-bottom: 52px; border-bottom: 1px solid #ebebeb; flex-wrap: wrap;
    }
    .as-filter-btn {
      padding: 12px 28px; background: none; border: none;
      border-bottom: 2px solid transparent; margin-bottom: -1px;
      font-family: 'Poppins', sans-serif; font-size: 11px;
      font-weight: 500; letter-spacing: 2px; text-transform: uppercase;
      color: #999; cursor: pointer; transition: all 0.3s;
    }
    .as-filter-btn:hover { color: #0a0a0a; }
    .as-filter-btn.active { color: #D4AF37; border-bottom-color: #D4AF37; }

    /* ── PRODUCT GRID ── */
    .as-product-grid {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 28px; max-width: 1400px; margin: 0 auto;
    }

    /* ── PRODUCT CARD ── */
    .as-product-card {
      background: #fff; border-radius: 18px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.07); overflow: hidden;
      cursor: pointer;
      transition: transform 0.38s cubic-bezier(0.2,0.9,0.4,1.1), box-shadow 0.38s ease;
      display: flex; flex-direction: column;
    }
    .as-product-card:hover {
      transform: translateY(-8px); box-shadow: 0 16px 40px rgba(0,0,0,0.13);
    }

    .as-prod-img-wrap {
      position: relative; width: 100%; height: 260px;
      overflow: hidden; background: #f5f4f0; flex-shrink: 0;
    }
    .as-prod-img-wrap img {
      width: 100%; height: 100%; object-fit: cover; object-position: center top;
      display: block; transition: transform 0.55s cubic-bezier(0.4,0,0.2,1);
    }
    .as-product-card:hover .as-prod-img-wrap img { transform: scale(1.07); }

    .as-prod-tag {
      position: absolute; top: 12px; left: 12px; z-index: 2;
      background: #D4AF37; color: #fff;
      font-family: 'Poppins', sans-serif; font-size: 8.5px;
      font-weight: 600; letter-spacing: 1.8px; text-transform: uppercase;
      padding: 4px 11px; border-radius: 30px;
    }
    .as-prod-tag.new { background: #0a0a0a; }

    .as-prod-overlay {
      position: absolute; inset: 0; z-index: 3;
      background: rgba(10,10,10,0.35);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.35s ease;
    }
    .as-product-card:hover .as-prod-overlay { opacity: 1; }
    .as-prod-quick-btn {
      background: #fff; color: #0a0a0a; border: none;
      font-family: 'Poppins', sans-serif; font-size: 9.5px;
      font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
      padding: 11px 26px; border-radius: 40px; cursor: pointer;
      transform: translateY(10px);
      transition: transform 0.35s ease, background 0.3s, color 0.3s;
    }
    .as-product-card:hover .as-prod-quick-btn { transform: translateY(0); }
    .as-prod-quick-btn:hover { background: #D4AF37; color: #fff; }

    .as-prod-info {
      padding: 18px 18px 20px; display: flex; flex-direction: column; gap: 8px; flex: 1;
    }
    .as-prod-meta { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
    .as-prod-name {
      font-family: 'Playfair Display', serif; font-size: 16px;
      font-weight: 600; color: #0a0a0a; line-height: 1.3; flex: 1;
    }
    .as-prod-price {
      font-family: 'Poppins', sans-serif; font-size: 15px;
      font-weight: 600; color: #D4AF37; white-space: nowrap;
    }

    .as-card-cart-btn {
      align-self: flex-end; width: 40px; height: 40px; border-radius: 50%;
      border: 1.5px solid #e0e0e0; background: #fafaf8;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.3s ease; flex-shrink: 0; color: #555;
    }
    .as-card-cart-btn svg { width: 16px; height: 16px; transition: transform 0.3s ease; }
    .as-card-cart-btn:hover {
      background: #D4AF37; border-color: #D4AF37; color: #fff;
      transform: scale(1.12); box-shadow: 0 4px 14px rgba(212,175,55,0.4);
    }
    .as-card-cart-btn:active { transform: scale(0.96); }

    /* ── EMPTY / LOADING ── */
    .as-empty {
      grid-column: 1 / -1; text-align: center; padding: 80px 20px;
      font-family: 'Playfair Display', serif; font-size: 22px; color: #ccc; font-style: italic;
    }
    .as-loading {
      display: flex; align-items: center; justify-content: center;
      padding: 80px 20px; gap: 14px;
      font-family: 'Poppins', sans-serif; font-size: 11px;
      letter-spacing: 2px; text-transform: uppercase; color: #bbb;
    }
    .as-spinner {
      width: 22px; height: 22px; border: 2px solid #eee;
      border-top-color: #D4AF37; border-radius: 50%;
      animation: as-spin 0.8s linear infinite;
    }
    @keyframes as-spin { to { transform: rotate(360deg); } }

    /* ── TOAST ── */
    .as-toast {
      position: fixed; bottom: 28px; right: 28px; z-index: 9999;
      background: #141414; color: #fff;
      font-family: 'Poppins', sans-serif; font-size: 12.5px;
      padding: 13px 22px; border-left: 3px solid #D4AF37;
      box-shadow: 0 8px 32px rgba(0,0,0,0.22);
      transform: translateY(90px) scale(0.96); opacity: 0;
      transition: all 0.38s cubic-bezier(0.4,0,0.2,1);
      border-radius: 8px; max-width: 300px;
    }
    .as-toast.show { transform: translateY(0) scale(1); opacity: 1; }

    /* ── FOOTER ── */
    .as-footer {
      background: #0a0a0a; color: rgba(255,255,255,0.42);
      padding: 60px 5% 28px; margin-top: 60px;
    }
    .as-footer-top {
      display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 44px;
      margin-bottom: 44px; padding-bottom: 44px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
    }
    .as-footer-brand {
      font-family: 'Playfair Display', serif; font-size: 24px;
      font-weight: 700; color: #fff; letter-spacing: 4px; margin-bottom: 12px;
    }
    .as-footer-brand span { color: #D4AF37; }
    .as-footer-desc { font-size: 11.5px; line-height: 1.8; max-width: 240px; margin-bottom: 20px; }
    .as-footer-socials { display: flex; gap: 10px; margin-top: 4px; }
    .as-social-link {
      width: 38px; height: 38px; border-radius: 50%;
      border: 1.5px solid rgba(255,255,255,0.15);
      display: flex; align-items: center; justify-content: center;
      text-decoration: none; color: rgba(255,255,255,0.5);
      transition: all 0.3s ease;
    }
    .as-social-link:hover {
      border-color: #D4AF37; color: #D4AF37;
      background: rgba(212,175,55,0.1);
      transform: translateY(-3px);
    }
    .as-social-link svg { width: 16px; height: 16px; }
    .as-footer-col-title {
      font-size: 9.5px; font-weight: 600; letter-spacing: 3px;
      text-transform: uppercase; color: #fff; margin-bottom: 16px;
    }
    .as-footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 9px; }
    .as-footer-col ul li a {
      color: rgba(255,255,255,0.42); text-decoration: none; font-size: 11.5px; transition: color 0.3s;
    }
    .as-footer-col ul li a:hover { color: #D4AF37; }
    .as-footer-bottom {
      display: flex; justify-content: space-between; align-items: center;
      font-size: 10.5px; flex-wrap: wrap; gap: 10px;
    }
    .as-footer-gold { color: #D4AF37; }
    .as-footer-credit { font-size: 9.5px; letter-spacing: 1px; }
    .as-footer-credit span { color: #D4AF37; font-weight: 600; }

    /* ── RESPONSIVE ── */
    @media (min-width: 1200px) { .as-product-grid { grid-template-columns: repeat(4, 1fr); } }
    @media (min-width: 900px) and (max-width: 1199px) { .as-product-grid { grid-template-columns: repeat(3, 1fr); gap: 22px; } }
    @media (min-width: 541px) and (max-width: 899px) {
      .as-product-grid { grid-template-columns: repeat(2, 1fr); gap: 18px; }
      .as-footer-top { grid-template-columns: 1fr 1fr; gap: 32px; }
      .as-prod-img-wrap { height: 220px; }
    }
    @media (max-width: 768px) {
      .as-navbar { padding: 0 18px; height: 62px; }
      .as-mobile-menu { top: 62px; }
      .as-nav-links { display: none !important; }
      .as-nav-actions .as-btn-admin, .as-nav-actions .as-search-wrap { display: none !important; }
      .as-hamburger { display: flex !important; }
      .as-hero { min-height: 480px; height: 78vh; }
      .as-hero-cta { gap: 10px; }
      .as-btn-gold, .as-btn-ghost { padding: 11px 26px; font-size: 10px; }
      .as-products { padding: 50px 16px; }
      .as-footer { padding: 38px 18px 22px; }
      .as-footer-top { grid-template-columns: 1fr; gap: 28px; }
      .as-footer-bottom { flex-direction: column; text-align: center; }
    }
    @media (max-width: 540px) {
      .as-product-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px; }
      .as-prod-img-wrap { height: 170px; }
      .as-prod-info { padding: 11px 10px 13px; gap: 6px; }
      .as-prod-name { font-size: 13px; }
      .as-prod-price { font-size: 12px; }
      .as-card-cart-btn { width: 34px; height: 34px; }
      .as-card-cart-btn svg { width: 14px; height: 14px; }
      .as-logo-text { font-size: 19px; }
      .as-filter-btn { padding: 8px 13px; font-size: 9.5px; }
    }
  `;
  document.head.appendChild(style);
};

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const CartIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const SearchIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CloseIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.82a4.85 4.85 0 01-1.07-.13z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// ─── MOCK FALLBACK DATA ───────────────────────────────────────────────────────
const FALLBACK_PRODUCTS = [
  { id: 1, name: "Oud Impérial", price: 450, category: "homme", image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80", tag: "Bestseller" },
  { id: 2, name: "Rose Éternelle", price: 380, category: "femme", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80", tag: "Nouveau" },
  { id: 3, name: "Nuit de Velours", price: 520, category: "homme", image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80", tag: "" },
  { id: 4, name: "Fleur de Soie", price: 420, category: "femme", image: "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=600&q=80", tag: "Exclusif" },
  { id: 5, name: "Atlas Cedar", price: 490, category: "mixte", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", tag: "Unisex" },
  { id: 6, name: "Jasmin Blanc", price: 360, category: "femme", image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&q=80", tag: "Bestseller" },
  { id: 7, name: "Santal Noir", price: 550, category: "mixte", image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e10?w=600&q=80", tag: "Unisex" },
  { id: 8, name: "Iris Précieux", price: 410, category: "femme", image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80", tag: "Nouveau" },
];

const FALLBACK_IMG = "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80";

// ─── SIDE CART COMPONENT ──────────────────────────────────────────────────────
function SideCart({ open, onClose, cartItems, onRemove, onCheckout }) {
  const total = cartItems.reduce((sum, item) => {
    return sum + Number(item.price || 0);
  }, 0);
  // Lock body scroll when cart is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div className={`as-cart-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`as-side-cart ${open ? "open" : ""}`} role="dialog" aria-label="Panier">
        <div className="as-side-cart-header">
          <h2 className="as-side-cart-title">Mon Panier</h2>
          <button className="as-side-cart-close" onClick={onClose} aria-label="Fermer le panier">
            <CloseIcon size={16} />
          </button>
        </div>

        <div className="as-side-cart-body">
          {cartItems.length === 0 ? (
            <div className="as-side-cart-empty">
              <CartIcon size={44} />
              <p>Votre panier est vide</p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={idx} className="as-cart-item">
                <img
                  className="as-cart-item-img"
                  src={item.image || FALLBACK_IMG}
                  alt={item.name}
                  onError={e => { e.target.src = FALLBACK_IMG; }}
                />
                <div className="as-cart-item-info">
                  <p className="as-cart-item-name">{item.name}</p>
                  <p className="as-cart-item-price">{item.price} DH</p>
                </div>
                <button className="as-cart-item-remove" onClick={() => onRemove(idx)} aria-label="Supprimer">
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="as-side-cart-footer">
            <div className="as-cart-total-row">
              <span className="as-cart-total-label">Total</span>
              <span className="as-cart-total-val">
                {total.toFixed(2)} <span>DH</span>
              </span>            </div>
            <button className="as-cart-checkout-btn" onClick={onCheckout}>
              Commander
            </button>
            <button className="as-cart-view-btn" onClick={onClose}>
              Continuer mes achats
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

// ─── HOME COMPONENT ───────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ msg: "", show: false });
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toastTimer = useRef(null);
  const productsRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => { injectStyles(); }, []);

  // ── Sync cart from localStorage ──
  const syncCart = useCallback(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(stored);
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

  // ── Scroll listener ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Focus search input when opened ──
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 80);
    }
  }, [searchOpen]);

  const showToast = useCallback((msg) => {
    clearTimeout(toastTimer.current);
    setToast({ msg, show: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2800);
  }, []);

  const addToCart = useCallback((e, product) => {
    e.stopPropagation();
    try {
      const stored = JSON.parse(localStorage.getItem("cart") || "[]");
      stored.push(product);
      localStorage.setItem("cart", JSON.stringify(stored));
      setCartItems(stored);
      showToast(`✓ ${product.name} ajouté au panier`);
      // Brief cart open hint on desktop
      setCartOpen(true);
    } catch { }
  }, [showToast]);

  const removeFromCart = useCallback((idx) => {
    try {
      const stored = JSON.parse(localStorage.getItem("cart") || "[]");
      stored.splice(idx, 1);
      localStorage.setItem("cart", JSON.stringify(stored));
      setCartItems([...stored]);
    } catch { }
  }, []);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ── Filter + Search logic ──
  const filteredProducts = (() => {
    let list = products;
    if (filter !== "tous") list = list.filter(p => p.category === filter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }
    return list;
  })();

  const cartCount = cartItems.length;

  return (
    <div style={{ background: "#fff" }}>

      {/* ── SIDE CART ── */}
      <SideCart
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onRemove={removeFromCart}
        onCheckout={() => { setCartOpen(false); navigate("/cart"); }}
      />

      {/* ── NAVBAR ── */}
      <nav className={`as-navbar ${scrolled ? "scrolled" : ""}`}>

        {/* Logo */}
        <a href="/" className="as-logo">
          <div className="as-logo-premium">
            <span className="as-logo-text">A<span>S</span></span>
          </div>
        </a>

        {/* Centered nav links */}
        <ul className="as-nav-links">
          <li><a onClick={scrollToProducts}>Parfums</a></li>
          <li>
            <a onClick={() => navigate("/notre-histoire")}>
              Notre Histoire
            </a>
          </li>
        </ul>

        {/* Right actions */}
        <div className="as-nav-actions">
          {/* Search */}
          <div className={`as-search-wrap ${searchOpen ? "open" : ""}`}>
            <input
              ref={searchRef}
              className="as-search-input"
              type="text"
              placeholder="Rechercher un parfum…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); } }}
            />
            <button
              className="as-search-toggle"
              aria-label={searchOpen ? "Fermer la recherche" : "Ouvrir la recherche"}
              onClick={() => {
                if (searchOpen) { setSearchQuery(""); }
                setSearchOpen(v => !v);
              }}
            >
              {searchOpen ? <CloseIcon size={15} /> : <SearchIcon size={16} />}
            </button>
          </div>

          {/* Cart */}
          <button
            className="as-cart-btn"
            onClick={() => setCartOpen(true)}
            aria-label="Ouvrir le panier"
          >
            <CartIcon size={18} />
            {cartCount > 0 && <span className="as-cart-badge">{cartCount}</span>}
          </button>

          {/* Admin */}
          <button className="as-btn-admin" onClick={() => navigate("/admin")}>
            Admin
          </button>
        </div>

        {/* Hamburger */}
        <button
          className={`as-hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div className={`as-mobile-menu ${menuOpen ? "open" : ""}`}>
        {/* Mobile search */}
        <div className="as-mobile-search">
          <input
            type="text"
            placeholder="Rechercher un parfum…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <SearchIcon size={15} />
        </div>

        <a onClick={() => { scrollToProducts(); setMenuOpen(false); }}>Parfums</a>
        <a href="/notre-histoire" onClick={() => setMenuOpen(false)}>Notre Histoire</a>

        <div className="as-mobile-actions">
          <button
            className="as-cart-btn"
            onClick={() => { setCartOpen(true); setMenuOpen(false); }}
            aria-label="Panier"
          >
            <CartIcon size={16} />
            {cartCount > 0 && <span className="as-cart-badge">{cartCount}</span>}
          </button>
          <button className="as-btn-admin" onClick={() => { navigate("/admin"); setMenuOpen(false); }}>
            Admin
          </button>
        </div>
      </div>

      {/* ── ANNOUNCEMENT (no margin-top, sits right after fixed navbar) ── */}
      <div className="as-announce" style={{ marginTop: 68 }}>
        Livraison partout au Maroc — seulement <span>35 DH</span>
      </div>

      {/* ── HERO (no margin-top: announcement is part of stacked flow) ── */}
      <section className="as-hero">
        <div className="as-hero-bg" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1600&q=85')"
        }} />
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
            <button
              className="as-btn-ghost"
              onClick={() => navigate("/notre-histoire")}
            >
              Notre Histoire
            </button>                    </div>
        </div>
        <div className="as-hero-scroll">
          <div className="as-scroll-line" />
          Défiler
        </div>
      </section>

      {/* ── PRODUCTS SECTION ── */}
      <section className="as-products" id="products" ref={productsRef}>
        <div className="as-sec-header">
          <p className="as-sec-eye">Notre Collection</p>
          <h2 className="as-sec-title">Nos <em>Parfums</em></h2>
          <div className="as-sec-line" />
        </div>

        {/* Filter tabs */}
        <div className="as-filter-bar">
          {[
            { key: "tous", label: "Tous" },
            { key: "homme", label: "Homme" },
            { key: "femme", label: "Femme" },
            { key: "mixte", label: "Unisex" },
            { key: "decante", label: "Decante" }, 

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

        {/* Grid */}
        {loading ? (
          <div className="as-loading">
            <div className="as-spinner" />
            Chargement des parfums…
          </div>
        ) : (
          <div className="as-product-grid">
            {filteredProducts.length === 0 ? (
              <p className="as-empty">
                {searchQuery ? `Aucun résultat pour "${searchQuery}".` : "Aucun parfum dans cette catégorie."}
              </p>
            ) : (
              filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="as-product-card"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="as-prod-img-wrap">
                    <img
                      src={product.image || FALLBACK_IMG}
                      alt={product.name}
                      loading="lazy"
                      onError={e => { e.target.src = FALLBACK_IMG; }}
                    />
                    {product.tag && (
                      <span className={`as-prod-tag ${product.tag === "Nouveau" ? "new" : ""}`}>
                        {product.tag}
                      </span>
                    )}
                    <div className="as-prod-overlay">
                      <button className="as-prod-quick-btn" onClick={e => addToCart(e, product)}>
                        Ajouter au panier
                      </button>
                    </div>
                  </div>

                  <div className="as-prod-info">
                    <div className="as-prod-meta">
                      <h3 className="as-prod-name">{product.name}</h3>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <p className="as-prod-price">{product.price} DH</p>
                      <button
                        className="as-card-cart-btn"
                        onClick={e => addToCart(e, product)}
                        aria-label={`Ajouter ${product.name} au panier`}
                      >
                        <CartIcon size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer className="as-footer">
        <div className="as-footer-top">
          <div>
            <div className="as-footer-brand">A<span>S</span></div>
            <p className="as-footer-desc">
              Des fragrances d'exception, façonnées pour ceux qui exigent le meilleur. Livraison dans tout le Maroc.
            </p>
            {/* Social Icons */}
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
            { title: "Service", links: ["Livraison", "Retours", "FAQ", "Contact"] },
            { title: "Légal", links: ["Mentions légales", "Confidentialité", "CGV"] },
          ].map(col => (
            <div key={col.title} className="as-footer-col">
              <p className="as-footer-col-title">{col.title}</p>
              <ul>
                {col.links.map(l => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="as-footer-bottom">
          <span>© 2026 AS FRAGRANCES. Tous droits réservés.</span>
          <span className="as-footer-gold">Livraison Maroc — 35 DH</span>
          <span className="as-footer-credit">Created by <span>HATIM ILYAS VITI</span></span>
        </div>
      </footer>

      {/* ── TOAST ── */}
      <div className={`as-toast ${toast.show ? "show" : ""}`}>
        {toast.msg}
      </div>

    </div>
  );
}
