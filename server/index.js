// server/index.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DB_SOURCE = "database.db";

// Connect to SQLite and create tables if they don't exist
const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS customers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                phone_number TEXT NOT NULL UNIQUE
            )`, (err) => {
                if (err) console.error("Error creating customers table:", err.message);
                else console.log("Customers table is ready.");
            });

            db.run(`CREATE TABLE IF NOT EXISTS addresses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_id INTEGER NOT NULL,
                address_details TEXT NOT NULL,
                city TEXT NOT NULL,
                state TEXT NOT NULL,
                pin_code TEXT NOT NULL,
                FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
            )`, (err) => {
                if (err) console.error("Error creating addresses table:", err.message);
                else console.log("Addresses table is ready.");
            });
        });
    }
});

// === CUSTOMER API ENDPOINTS ===

// 1. POST /api/customers: Create a new customer
app.post("/api/customers", (req, res) => {
    const { first_name, last_name, phone_number } = req.body;

    // Server-side validation
    if (!first_name || !last_name || !phone_number) {
        return res.status(400).json({ "error": "Missing required fields: first_name, last_name, phone_number" });
    }

    const sql = `INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)`;
    const params = [first_name, last_name, phone_number];

    db.run(sql, params, function(err) {
        if (err) {
            // Handle specific errors, like a non-unique phone number
            if (err.message.includes("UNIQUE constraint failed")) {
                return res.status(409).json({ "error": "Phone number already exists." });
            }
            return res.status(400).json({ "error": err.message });
        }
        // Return the newly created customer with their ID
        res.status(201).json({
            "message": "success",
            "data": { id: this.lastID, ...req.body }
        });
    });
});

// 2. GET /api/customers: Get a list of all customers (with searching)
app.get("/api/customers", (req, res) => {
    // Basic search by first_name or last_name
    const { search } = req.query;
    
    let sql = "SELECT * FROM customers";
    let params = [];

    if (search) {
        sql += " WHERE first_name LIKE ? OR last_name LIKE ?";
        params = [`%${search}%`, `%${search}%`];
    }
    
    sql += " ORDER BY first_name"; // Default sorting

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// 3. GET /api/customers/:id: Get details for a single customer
app.get("/api/customers/:id", (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM customers WHERE id = ?";
    
    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        if (row) {
            res.json({ "message": "success", "data": row });
        } else {
            res.status(404).json({ "error": "Customer not found" });
        }
    });
});

// 4. PUT /api/customers/:id: Update a customer's information
app.put("/api/customers/:id", (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, phone_number } = req.body;

    if (!first_name || !last_name || !phone_number) {
        return res.status(400).json({ "error": "Missing required fields" });
    }

    const sql = `UPDATE customers SET 
                    first_name = ?, 
                    last_name = ?, 
                    phone_number = ? 
                 WHERE id = ?`;
    const params = [first_name, last_name, phone_number, id];

    db.run(sql, params, function(err) {
        if (err) {
            if (err.message.includes("UNIQUE constraint failed")) {
                return res.status(409).json({ "error": "Phone number already exists." });
            }
            return res.status(400).json({ "error": err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ "error": "Customer not found" });
        }
        res.json({
            "message": `Customer ${id} updated successfully.`,
            "changes": this.changes
        });
    });
});

// 5. DELETE /api/customers/:id: Delete a customer
app.delete("/api/customers/:id", (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM customers WHERE id = ?';

    db.run(sql, [id], function(err) {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ "error": "Customer not found" });
        }
        res.json({ "message": `Customer ${id} deleted`, "changes": this.changes });
    });
});


// === ADDRESS API ENDPOINTS WILL GO HERE ===


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// === ADDRESS API ENDPOINTS ===

// 1. POST /api/customers/:id/addresses: Add a new address for a specific customer
app.post("/api/customers/:id/addresses", (req, res) => {
    const customer_id = req.params.id;
    const { address_details, city, state, pin_code } = req.body;

    // Server-side validation
    if (!address_details || !city || !state || !pin_code) {
        return res.status(400).json({ "error": "Missing required address fields" });
    }

    const sql = `INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES (?, ?, ?, ?, ?)`;
    const params = [customer_id, address_details, city, state, pin_code];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        res.status(201).json({
            "message": "Address added successfully",
            "data": { id: this.lastID, customer_id, ...req.body }
        });
    });
});

// 2. GET /api/customers/:id/addresses: Get all addresses for a specific customer
app.get("/api/customers/:id/addresses", (req, res) => {
    const customer_id = req.params.id;
    const sql = "SELECT * FROM addresses WHERE customer_id = ?";
    
    db.all(sql, [customer_id], (err, rows) => {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// 3. PUT /api/addresses/:addressId: Update a specific address
app.put("/api/addresses/:addressId", (req, res) => {
    const { addressId } = req.params;
    const { address_details, city, state, pin_code } = req.body;

    if (!address_details || !city || !state || !pin_code) {
        return res.status(400).json({ "error": "All address fields are required" });
    }

    const sql = `UPDATE addresses SET 
                    address_details = ?, 
                    city = ?, 
                    state = ?, 
                    pin_code = ? 
                 WHERE id = ?`;
    const params = [address_details, city, state, pin_code, addressId];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ "error": "Address not found" });
        }
        res.json({
            "message": `Address ${addressId} updated successfully.`,
            "changes": this.changes
        });
    });
});

// 4. DELETE /api/addresses/:addressId: Delete a specific address
app.delete("/api/addresses/:addressId", (req, res) => {
    const { addressId } = req.params;
    const sql = 'DELETE FROM addresses WHERE id = ?';

    db.run(sql, [addressId], function(err) {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ "error": "Address not found" });
        }
        res.json({ "message": `Address ${addressId} deleted`, "changes": this.changes });
    });
});
