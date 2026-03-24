const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL Pool (FIXED)
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,

  ssl: {
    rejectUnauthorized: false
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ RETRY CONNECTION (BONUS 🔥)
const connectWithRetry = () => {
  db.getConnection((err, conn) => {
    if (err) {
      console.log("❌ DB failed... retry in 5 sec");
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log("✅ Connected to MySQL database");
      conn.release();
    }
  });
};

connectWithRetry();

// ✅ ROOT
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// GET ALL PRODUCTS
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products ORDER BY id DESC", (err, result) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// GET SINGLE PRODUCT
app.get("/products/:id", (req, res) => {
  db.query("SELECT * FROM products WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Product not found" });
    res.json(result[0]);
  });
});

// ADD PRODUCT
app.post("/add-product", (req, res) => {
  const { name, price, category, image, description, tag } = req.body;

  if (!name || !price || !category || !image) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const query = tag
    ? "INSERT INTO products (name, price, category, image, description, tag) VALUES (?, ?, ?, ?, ?, ?)"
    : "INSERT INTO products (name, price, category, image, description) VALUES (?, ?, ?, ?, ?)";

  const params = tag
    ? [name, price, category, image, description || "", tag]
    : [name, price, category, image, description || ""];

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("❌ MySQL Error:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json({ id: result.insertId });
  });
});

// UPDATE PRODUCT
app.put("/products/:id", (req, res) => {
  const { name, price, category, image, description, tag } = req.body;

  const query = tag
    ? "UPDATE products SET name=?, price=?, category=?, image=?, description=?, tag=? WHERE id=?"
    : "UPDATE products SET name=?, price=?, category=?, image=?, description=? WHERE id=?";

  const params = tag
    ? [name, price, category, image, description || "", tag, req.params.id]
    : [name, price, category, image, description || "", req.params.id];

  db.query(query, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "updated" });
  });
});

// DELETE PRODUCT
app.delete("/products/:id", (req, res) => {
  db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "deleted" });
  });
});

// ORDERS
app.post("/orders", (req, res) => {
  const { name, phone, address, products, total, subtotal, shipping, status } = req.body;

  db.query(
    "INSERT INTO orders (name, phone, address, products, total, subtotal, shipping, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [name, phone, address, JSON.stringify(products), total, subtotal || total, shipping || 35, status || "en cours"],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId });
    }
  );
});

app.get("/orders", (req, res) => {
  db.query("SELECT * FROM orders ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("🚀 Server running on port", PORT));