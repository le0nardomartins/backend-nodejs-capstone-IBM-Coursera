const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { connectToDatabase } = require('../models/db');
const { ObjectId } = require('mongodb');
const logger = require('../logger');

// Multer storage configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mime = allowedTypes.test(file.mimetype);
        if (ext && mime) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// GET /api/secondchance/items - fetch all items
router.get('/', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('secondChanceItems');
        const items = await collection.find({}).toArray();
        res.json(items);
    } catch (error) {
        logger.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/secondchance/items/:id - fetch single item by id
router.get('/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('secondChanceItems');
        const id = req.params.id;

        const item = await collection.findOne({ id });
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        logger.error('Error fetching item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/secondchance/items - create a new item (with optional file upload)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('secondChanceItems');

        const lastItem = await collection.find().sort({ id: -1 }).limit(1).toArray();
        const newId = lastItem.length > 0 ? (parseInt(lastItem[0].id) + 1).toString() : '1';

        const newItem = {
            id: newId,
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            condition: req.body.condition,
            age_days: req.body.age_days ? parseInt(req.body.age_days) : 0,
            age_years: req.body.age_years ? parseFloat(req.body.age_years) : 0,
            contact_details: req.body.contact_details,
            date_added: new Date().toISOString().split('T')[0],
        };

        if (req.file) {
            newItem.image = `/uploads/${req.file.filename}`;
        } else if (req.body.image) {
            newItem.image = req.body.image;
        }

        const result = await collection.insertOne(newItem);
        res.status(201).json({ ...newItem, _id: result.insertedId });
    } catch (error) {
        logger.error('Error creating item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/secondchance/items/:id - update an existing item
router.put('/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('secondChanceItems');
        const id = req.params.id;

        const updateData = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            condition: req.body.condition,
            age_days: req.body.age_days ? parseInt(req.body.age_days) : 0,
            age_years: req.body.age_years ? parseFloat(req.body.age_years) : 0,
            contact_details: req.body.contact_details,
        };

        const result = await collection.findOneAndUpdate(
            { id },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (!result) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json(result);
    } catch (error) {
        logger.error('Error updating item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/secondchance/items/:id - delete an item
router.delete('/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('secondChanceItems');
        const id = req.params.id;

        const result = await collection.deleteOne({ id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        logger.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
