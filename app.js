/*
====================================================
🛒 Product CRUD System (Node.js + MongoDB + Mongoose)
====================================================
Overview:
- Node.js + Express.js server
- MongoDB using Mongoose
- Product model: name, price, category
- CRUD operations with validation and error handling
====================================================
*/

// 1️⃣ Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// 2️⃣ Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/productDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// 3️⃣ Define Product Model
const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Product name is required'] },
    price: { type: Number, required: [true, 'Product price is required'], min: [0, 'Price cannot be negative'] },
    category: { type: String, required: [true, 'Product category is required'] }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// 4️⃣ CRUD Routes

// Create new product
app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update product by ID
app.put('/api/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete product by ID
app.delete('/api/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5️⃣ Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

/*
====================================================
✅ Usage:

1. Start MongoDB locally
2. Run server: node app.js
3. Test API endpoints using Postman or curl:

POST   /api/products       -> Create product
GET    /api/products       -> Retrieve all products
GET    /api/products/:id   -> Get product by ID
PUT    /api/products/:id   -> Update product
DELETE /api/products/:id   -> Delete product
====================================================
*/
