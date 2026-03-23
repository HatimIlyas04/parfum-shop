import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const addToCart = (e) => {
    e.stopPropagation();
    
    // Get existing cart from localStorage
    const existingCart = localStorage.getItem("cart");
    let cart = existingCart ? JSON.parse(existingCart) : [];
    
    // Add product to cart
    cart.push(product);
    
    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Optional: Show feedback (you can add a toast notification later)
    console.log(`${product.name} ajouté au panier`);
  };

  const handleCardClick = () => {
navigate(`/product/${product.id || product.product_id}`)  };

  return (
    <div 
      onClick={handleCardClick}
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s ease-in-out",
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
      }}
    >
      {/* Image Container */}
      <div style={{
        width: "100%",
        height: "250px",
        overflow: "hidden",
        background: "#f8f8f8"
      }}>
        <img 
          src={product.image || "https://via.placeholder.com/300x250?text=Parfum"} 
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        />
      </div>
      
      {/* Product Info */}
      <div style={{
        padding: "1.25rem",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem"
      }}>
        <h3 style={{
          fontFamily: "Playfair Display, serif",
          fontSize: "1.1rem",
          fontWeight: "600",
          color: "#1a1a1a",
          margin: 0,
          lineHeight: 1.3
        }}>
          {product.name}
        </h3>
        
        <p style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: "1.2rem",
          fontWeight: "600",
          color: "#D4AF37",
          margin: 0
        }}>
          {product.price} DH
        </p>
        
        <button
          onClick={addToCart}
          style={{
            marginTop: "0.75rem",
            padding: "0.75rem 1rem",
            background: "transparent",
            border: "1.5px solid #D4AF37",
            borderRadius: "30px",
            fontFamily: "Poppins, sans-serif",
            fontSize: "0.75rem",
            fontWeight: "600",
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "#D4AF37",
            cursor: "pointer",
            transition: "all 0.3s ease",
            width: "100%"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#D4AF37";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#D4AF37";
          }}
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
};

export default ProductCard;