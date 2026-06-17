const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../models/db');
const logger = require('../logger');

// GET /api/secondchance/search - search items with optional filters
router.get('/', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('secondChanceItems');

        const { name, category, condition, age_more_than, age_less_than } = req.query;
        const query = {};

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        if (condition) {
            query.condition = { $regex: condition, $options: 'i' };
        }

        if (age_more_than) {
            query.age_days = { ...query.age_days, $gt: parseInt(age_more_than) };
        }

        if (age_less_than) {
            query.age_days = { ...query.age_days, $lt: parseInt(age_less_than) };
        }

        const items = await collection.find(query).toArray();
        res.json(items);
    } catch (error) {
        logger.error('Error searching items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
