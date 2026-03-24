const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

require("dotenv").config();
const fs = require("fs");

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: true,
    },
});

// Test database connection
db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err);
    } else {
        console.log("✅ Connected to MySQL database");
    }
});

// GET SINGLE PRODUCT BY ID
app.get("/products/:id", (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM products WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error("Error fetching product:", err);
            return res.status(500).json({ error: err.message });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(result[0]);
    });
});

// GET ALL PRODUCTS
app.get("/products", (req, res) => {
    db.query("SELECT * FROM products ORDER BY id DESC", (err, result) => {
        if (err) {
            console.error("Error fetching products:", err);
            return res.status(500).json({ error: err.message });
        }
        res.send(result);
    });
});

// ADD PRODUCT (FIXED - with proper column handling)
app.post("/add-product", (req, res) => {
    console.log("📦 Received product data:", req.body);

    const { name, price, category, image, description, tag } = req.body;

    // Validate required fields
    if (!name || !price || !category || !image) {
        console.log("❌ Missing fields:", { name, price, category, image });
        return res.status(400).json({
            error: "Champs manquants. Veuillez remplir: nom, prix, catégorie, image"
        });
    }

    // Check if tag column exists, if not, use without tag
    const query = tag !== undefined
        ? "INSERT INTO products (name, price, category, image, description, tag) VALUES (?, ?, ?, ?, ?, ?)"
        : "INSERT INTO products (name, price, category, image, description) VALUES (?, ?, ?, ?, ?)";

    const params = tag !== undefined
        ? [name, price, category, image, description || "", tag]
        : [name, price, category, image, description || ""];

    db.query(query, params, (err, result) => {
        if (err) {
            console.error("❌ MySQL Error:", err);
            return res.status(500).json({
                error: "Erreur base de données",
                details: err.message,
                sqlMessage: err.sqlMessage
            });
        }

        console.log("✅ Product added successfully, ID:", result.insertId);
        res.json({
            id: result.insertId,
            message: "Produit ajouté avec succès"
        });
    });
});

// UPDATE PRODUCT
app.put("/products/:id", (req, res) => {
    const id = req.params.id;
    const { name, price, category, image, description, tag } = req.body;

    console.log(`📝 Updating product ${id}:`, req.body);

    // Check if tag column exists in the query
    const query = tag !== undefined
        ? "UPDATE products SET name=?, price=?, category=?, image=?, description=?, tag=? WHERE id=?"
        : "UPDATE products SET name=?, price=?, category=?, image=?, description=? WHERE id=?";

    const params = tag !== undefined
        ? [name, price, category, image, description || "", tag, id]
        : [name, price, category, image, description || "", id];

    db.query(query, params, (err, result) => {
        if (err) {
            console.error("❌ Error updating product:", err);
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        console.log("✅ Product updated successfully");
        res.json({ message: "Product updated successfully" });
    });
});

// DELETE PRODUCT
app.delete("/products/:id", (req, res) => {
    const id = req.params.id;

    console.log(`🗑️ Deleting product ${id}`);

    db.query("DELETE FROM products WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error("❌ Error deleting product:", err);
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        console.log("✅ Product deleted successfully");
        res.json({ message: "Product deleted successfully" });
    });
});

// ADD ORDER
app.post("/orders", (req, res) => {
    const { name, phone, address, products, total, subtotal, shipping, status } = req.body;

    console.log("📦 New order:", { name, phone, total });

    db.query(
        "INSERT INTO orders (name, phone, address, products, total, subtotal, shipping, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [name, phone, address, JSON.stringify(products), total, subtotal || total, shipping || 35, status || "en cours"],
        (err, result) => {
            if (err) {
                console.error("❌ Error adding order:", err);
                return res.status(500).json({ error: err.message });
            }
            console.log("✅ Order added successfully, ID:", result.insertId);
            res.json({ id: result.insertId, message: "Order added successfully" });
        }
    );
});

// UPDATE ORDER STATUS
app.put("/orders/:id", (req, res) => {
    const id = req.params.id;
    const { status } = req.body;

    db.query(
        "UPDATE orders SET status = ? WHERE id = ?",
        [status, id],
        (err, result) => {
            if (err) {
                console.error("❌ Error updating order:", err);
                return res.status(500).json({ error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Order not found" });
            }

            console.log("✅ Order status updated");
            res.json({ message: "Order status updated successfully" });
        }
    );
});

// GET ORDERS
app.get("/orders", (req, res) => {
    db.query("SELECT * FROM orders ORDER BY id DESC", (err, result) => {
        if (err) {
            console.error("Error fetching orders:", err);
            return res.status(500).json({ error: err.message });
        }
        res.send(result);
    });
});

// GET SINGLE ORDER
app.get("/orders/:id", (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM orders WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: "Order not found" });
        res.json(result[0]);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));