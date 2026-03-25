import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── INJECT STYLES ─────────────────────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById("as-story-styles")) return;
  const style = document.createElement("style");
  style.id = "as-story-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Poppins:wght@300;400;500;600;700&display=swap');

    /* ── BASE ── */
    .as-story-page {
      background: #fff;
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* ── BACK BUTTON ── */
    .as-story-back {
      position: fixed;
      top: 28px;
      left: 32px;
      z-index: 100;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: rgba(255,255,255,0.96);
      backdrop-filter: blur(12px);
      border: 1.5px solid rgba(212,175,55,0.3);
      border-radius: 50px;
      font-family: 'Poppins', sans-serif;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #0a0a0a;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
      text-decoration: none;
      box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    }
    .as-story-back:hover {
      border-color: #D4AF37;
      background: #D4AF37;
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(212,175,55,0.25);
    }
    .as-story-back svg {
      transition: transform 0.3s ease;
    }
    .as-story-back:hover svg {
      transform: translateX(-4px);
    }

    /* ── HERO SECTION ── */
    .as-story-hero {
      position: relative;
      width: 100%;
      height: 85vh;
      min-height: 600px;
      max-height: 900px;
      overflow: hidden;
      background: #0a0a0a;
    }
    .as-story-hero-bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      will-change: transform;
      animation: as-story-zoom 28s ease-in-out infinite alternate;
    }
    @keyframes as-story-zoom {
      from { transform: scale(1.0); }
      to { transform: scale(1.08); }
    }
    .as-story-hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%);
    }
    .as-story-hero-content {
      position: relative;
      z-index: 2;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 0 24px;
    }
    .as-story-eyebrow {
      font-family: 'Poppins', sans-serif;
      font-size: 11px;
      letter-spacing: 8px;
      text-transform: uppercase;
      color: #D4AF37;
      margin-bottom: 24px;
      animation: as-story-fade-up 1s ease both;
    }
    .as-story-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(44px, 8vw, 88px);
      font-weight: 700;
      color: #fff;
      line-height: 1.1;
      max-width: 900px;
      margin-bottom: 24px;
      animation: as-story-fade-up 1s ease 0.2s both;
    }
    .as-story-title em {
      color: #D4AF37;
      font-style: italic;
    }
    .as-story-sub {
      font-family: 'Poppins', sans-serif;
      font-size: clamp(14px, 1.8vw, 18px);
      font-weight: 300;
      color: rgba(255,255,255,0.85);
      letter-spacing: 1.5px;
      max-width: 700px;
      margin: 0 auto;
      line-height: 1.6;
      animation: as-story-fade-up 1s ease 0.4s both;
    }
    .as-story-scroll {
      position: absolute;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: rgba(255,255,255,0.5);
      font-size: 9px;
      letter-spacing: 4px;
      text-transform: uppercase;
      z-index: 2;
      animation: as-story-fade 2s ease 1s both;
    }
    .as-story-scroll-line {
      width: 1px;
      height: 48px;
      background: linear-gradient(to bottom, #D4AF37, transparent);
      animation: as-story-pulse 2.5s ease-in-out infinite;
    }
    @keyframes as-story-pulse {
      0%,100% { opacity: 0.25; transform: scaleY(0.7); }
      50% { opacity: 1; transform: scaleY(1); }
    }
    @keyframes as-story-fade-up {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes as-story-fade {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* ── STORY SECTION ── */
    .as-story-section {
      padding: 100px 8%;
      max-width: 1300px;
      margin: 0 auto;
    }
    .as-story-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
    }
    .as-story-text {
      animation: as-story-fade-right 1s ease both;
    }
    @keyframes as-story-fade-right {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .as-story-text-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(28px, 3.5vw, 42px);
      font-weight: 600;
      color: #0a0a0a;
      margin-bottom: 28px;
      line-height: 1.2;
    }
    .as-story-text-title span {
      color: #D4AF37;
    }
    .as-story-text p {
      font-family: 'Poppins', sans-serif;
      font-size: 15px;
      line-height: 1.8;
      color: #555;
      margin-bottom: 20px;
    }
    .as-story-quote {
      margin: 32px 0;
      padding: 24px 0 24px 32px;
      border-left: 3px solid #D4AF37;
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      font-style: italic;
      color: #0a0a0a;
      line-height: 1.5;
    }
    .as-story-image {
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 20px 48px rgba(0,0,0,0.12);
      animation: as-story-fade-left 1s ease 0.2s both;
    }
    @keyframes as-story-fade-left {
      from { opacity: 0; transform: translateX(30px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .as-story-image img {
      width: 100%;
      height: auto;
      display: block;
      transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
    }
    .as-story-image:hover img {
      transform: scale(1.03);
    }

    /* ── VALUES SECTION ── */
    .as-values-section {
      background: #fafaf8;
      padding: 100px 8%;
    }
    .as-section-header {
      text-align: center;
      margin-bottom: 60px;
    }
    .as-section-eyebrow {
      font-family: 'Poppins', sans-serif;
      font-size: 10px;
      letter-spacing: 6px;
      text-transform: uppercase;
      color: #D4AF37;
      margin-bottom: 16px;
    }
    .as-section-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(28px, 3.5vw, 44px);
      font-weight: 600;
      color: #0a0a0a;
      line-height: 1.2;
    }
    .as-section-title em {
      color: #D4AF37;
      font-style: italic;
    }
    .as-values-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .as-value-card {
      text-align: center;
      padding: 32px 24px;
      background: #fff;
      border-radius: 24px;
      transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
      border: 1px solid rgba(212,175,55,0.1);
      animation: as-story-fade-up 0.8s ease both;
    }
    .as-value-card:hover {
      transform: translateY(-8px);
      border-color: rgba(212,175,55,0.3);
      box-shadow: 0 20px 40px rgba(0,0,0,0.08);
    }
    .as-value-icon {
      width: 72px;
      height: 72px;
      margin: 0 auto 20px;
      background: rgba(212,175,55,0.08);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #D4AF37;
      transition: all 0.3s ease;
    }
    .as-value-card:hover .as-value-icon {
      background: #D4AF37;
      color: #fff;
      transform: scale(1.05);
    }
    .as-value-title {
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      font-weight: 600;
      color: #0a0a0a;
      margin-bottom: 12px;
    }
    .as-value-desc {
      font-family: 'Poppins', sans-serif;
      font-size: 13px;
      line-height: 1.6;
      color: #777;
    }

    /* ── MISSION SECTION ── */
    .as-mission-section {
      padding: 100px 8%;
      background: #0a0a0a;
      color: #fff;
      text-align: center;
    }
    .as-mission-container {
      max-width: 900px;
      margin: 0 auto;
    }
    .as-mission-icon {
      margin-bottom: 32px;
      color: #D4AF37;
    }
    .as-mission-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(32px, 4vw, 52px);
      font-weight: 600;
      margin-bottom: 28px;
      line-height: 1.2;
    }
    .as-mission-title span {
      color: #D4AF37;
    }
    .as-mission-text {
      font-family: 'Poppins', sans-serif;
      font-size: 16px;
      line-height: 1.9;
      color: rgba(255,255,255,0.8);
      margin-bottom: 32px;
    }
    .as-mission-quote {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      font-style: italic;
      color: #D4AF37;
      margin-top: 40px;
      padding-top: 32px;
      border-top: 1px solid rgba(212,175,55,0.2);
    }

    /* ── CTA SECTION ── */
    .as-cta-section {
      padding: 80px 8%;
      text-align: center;
      background: #fff;
    }
    .as-cta-btn {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 16px 44px;
      background: #0a0a0a;
      color: #fff;
      border: none;
      border-radius: 50px;
      font-family: 'Poppins', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.4s ease;
      text-decoration: none;
    }
    .as-cta-btn:hover {
      background: #D4AF37;
      transform: translateY(-3px);
      box-shadow: 0 12px 28px rgba(212,175,55,0.35);
    }
    .as-cta-btn svg {
      transition: transform 0.3s ease;
    }
    .as-cta-btn:hover svg {
      transform: translateX(6px);
    }

    /* ── RESPONSIVE ── */
    @media (max-width: 1024px) {
      .as-values-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 30px;
      }
      .as-story-grid {
        gap: 40px;
      }
    }
    @media (max-width: 768px) {
      .as-story-back {
        top: 20px;
        left: 20px;
        padding: 8px 18px;
        font-size: 10px;
      }
      .as-story-hero {
        height: 70vh;
        min-height: 500px;
      }
      .as-story-section {
        padding: 60px 6%;
      }
      .as-story-grid {
        grid-template-columns: 1fr;
        gap: 40px;
      }
      .as-story-text {
        order: 2;
      }
      .as-story-image {
        order: 1;
      }
      .as-values-section {
        padding: 60px 6%;
      }
      .as-values-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }
      .as-mission-section {
        padding: 60px 6%;
      }
      .as-cta-section {
        padding: 50px 6%;
      }
      .as-story-quote {
        font-size: 18px;
        padding-left: 20px;
      }
    }
    @media (max-width: 480px) {
      .as-story-eyebrow {
        letter-spacing: 4px;
        font-size: 9px;
      }
      .as-value-card {
        padding: 24px 20px;
      }
      .as-mission-text {
        font-size: 14px;
      }
      .as-mission-quote {
        font-size: 18px;
      }
    }
  `;
  document.head.appendChild(style);
};

// ─── ICONS ─────────────────────────────────────────────────────────────────────
const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const DiamondIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
);

const LeafIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8 2 4 5 4 9c0 5 8 13 8 13s8-8 8-13c0-4-4-7-8-7z"/>
    <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
  </svg>
);

const TargetIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const QuoteIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 11h-4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v6c0 2.667-1.333 4-4 4"/>
    <path d="M21 11h-4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v6c0 2.667-1.333 4-4 4"/>
  </svg>
);

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function NotreHistoire() {
  const navigate = useNavigate();
  const sectionsRef = useRef([]);

  useEffect(() => {
    injectStyles();

    // Scroll reveal animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const animatedElements = document.querySelectorAll(
      ".as-story-text, .as-story-image, .as-value-card, .as-mission-container"
    );
    animatedElements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="as-story-page">
      {/* Back Button */}
      <button className="as-story-back" onClick={() => navigate("/")}>
        <ArrowLeftIcon />
        Retour
      </button>

      {/* Hero Section */}
      <section className="as-story-hero">
        <div
          className="as-story-hero-bg"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1800&q=85')",
          }}
        />
        <div className="as-story-hero-overlay" />
        <div className="as-story-hero-content">
          <p className="as-story-eyebrow">L'Art de la Parfumerie Marocaine</p>
          <h1 className="as-story-title">
            Notre <em>Histoire</em>
          </h1>
          <p className="as-story-sub">
            Deux amis, une passion, un rêve : révéler l'essence du luxe à travers des fragrances uniques,<br />
            inspirées par le Maroc et destinées au monde.
          </p>
        </div>
        <div className="as-story-scroll">
          <div className="as-story-scroll-line" />
          Découvrir
        </div>
      </section>

      {/* Story Section */}
      <section className="as-story-section">
        <div className="as-story-grid">
          <div className="as-story-text">
            <h2 className="as-story-text-title">
              Une vision portée par <span>deux âmes</span>
            </h2>
            <p>
              <strong>Saad Hatim</strong> et <strong>Mohamed Amin Waka</strong> se sont rencontrés dans les ruelles animées de Casablanca, 
              unis par une même conviction : le parfum est bien plus qu'un simple accessoire, c'est une signature, 
              une mémoire, une émotion qui traverse le temps.
            </p>
            <p>
              Issus de parcours différents mais complémentaires, ils ont décidé de mettre en commun leur expertise 
              et leur amour des matières nobles pour créer <strong>AS Fragrances</strong>. Leur ambition ? 
              Faire entendre leur voix, partager leur vision et offrir au Maroc des parfums d'exception 
              qui rivalisent avec les plus grandes maisons internationales.
            </p>
            <div className="as-story-quote">
              <QuoteIcon />
              <p>
                "Nous voulons que chaque fragrance raconte une histoire, celle de notre terre, de notre culture, 
                mais aussi de notre modernité. Le Maroc est une terre d'inspiration infinie, et nous en sommes fiers."
              </p>
              <p style={{ marginTop: 12, fontSize: 14, fontWeight: 500 }}>— Saad & Mohamed Amin</p>
            </div>
            <p>
              Aujourd'hui, AS Fragrances incarne l'alliance parfaite entre tradition et modernité. Chaque parfum 
              est pensé comme une œuvre d'art, élaboré avec des ingrédients d'exception et un savoir-faire artisanal 
              qui rend hommage aux richesses olfactives du Royaume.
            </p>
          </div>
          <div className="as-story-image">
            <img
              src="https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&q=85"
              alt="Artisan parfumeur marocain"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="as-values-section">
        <div className="as-section-header">
          <p className="as-section-eyebrow">Ce qui nous anime</p>
          <h2 className="as-section-title">
            Nos <em>valeurs</em>
          </h2>
        </div>
        <div className="as-values-grid">
          <div className="as-value-card">
            <div className="as-value-icon">
              <HeartIcon />
            </div>
            <h3 className="as-value-title">Passion</h3>
            <p className="as-value-desc">
              Une dévotion sans faille pour l'art de la parfumerie, où chaque création est une véritable déclaration d'amour.
            </p>
          </div>
          <div className="as-value-card">
            <div className="as-value-icon">
              <DiamondIcon />
            </div>
            <h3 className="as-value-title">Qualité</h3>
            <p className="as-value-desc">
              Des ingrédients d'exception sélectionnés avec rigueur pour des fragrances qui transcendent le temps.
            </p>
          </div>
          <div className="as-value-card">
            <div className="as-value-icon">
              <LeafIcon />
            </div>
            <h3 className="as-value-title">Authenticité</h3>
            <p className="as-value-desc">
              Une identité forte, ancrée dans la culture marocaine, sans jamais renier ses racines.
            </p>
          </div>
          <div className="as-value-card">
            <div className="as-value-icon">
              <TargetIcon />
            </div>
            <h3 className="as-value-title">Ambition</h3>
            <p className="as-value-desc">
              Faire rayonner le savoir-faire marocain à travers le monde, une fragrance à la fois.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="as-mission-section">
        <div className="as-mission-container">
          <div className="as-mission-icon">
            <TargetIcon />
          </div>
          <h2 className="as-mission-title">
            Une mission : <span>faire rayonner le Maroc</span>
          </h2>
          <p className="as-mission-text">
            Notre objectif est clair : toucher chaque recoin du Maroc, de Tanger à Laâyoune, en passant par Fès et Marrakech. 
            Nous voulons créer une identité forte, une marque qui porte haut les couleurs de notre pays et qui rende le parfum 
            de luxe accessible à tous ceux qui aspirent à l'excellence.
          </p>
          <p className="as-mission-text">
            Avec AS Fragrances, le luxe n'est plus une illusion lointaine. Il devient une réalité tangible, une expérience 
            sensorielle qui vous accompagne au quotidien. Nous croyons que chaque Marocain mérite de se sentir unique, 
            de porter une fragrance qui lui ressemble et qui raconte son histoire.
          </p>
          <div className="as-mission-quote">
            "Du Maroc au monde, nous portons l'essence de notre terre."
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="as-cta-section">
        <button className="as-cta-btn" onClick={() => navigate("/")}>
          Découvrir nos parfums
          <ArrowRightIcon />
        </button>
      </section>
    </div>
  );
}