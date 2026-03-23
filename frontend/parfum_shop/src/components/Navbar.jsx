import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
      background: "white",
      padding: "20px 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #eee"
    }}>

      <h2 style={{
        color: "#D4AF37",
        fontFamily: "Playfair Display",
        fontSize: "28px"
      }}>
        Parfum Luxe
      </h2>

      <div style={{ display: "flex", gap: "25px" }}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/" style={linkStyle}>Homme</Link>
        <Link to="/" style={linkStyle}>Femme</Link>
        <Link to="/cart" style={linkStyle}>Panier</Link>
      </div>
    </nav>
  );
}

const linkStyle = {
  textDecoration: "none",
  color: "black",
  fontFamily: "Poppins",
  fontWeight: "500"
};