const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectToDatabase } = require('../models/db');
const logger = require('../logger');

const JWT_SECRET = process.env.JWT_SECRET || 'secondchance_secret_key';

// POST /api/auth/register - register a new user
router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');

        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        };

        const result = await collection.insertOne(user);

        const token = jwt.sign(
            { userId: result.insertedId, email, firstName, lastName },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            token,
            userId: result.insertedId,
            firstName,
            lastName,
            email,
        });
    } catch (error) {
        logger.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/auth/login - login a user
router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await collection.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });
    } catch (error) {
        logger.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/auth/update - update user information
router.put('/update', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const { firstName, lastName, password } = req.body;

        const updateData = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const result = await collection.findOneAndUpdate(
            { email: decoded.email },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'User updated successfully',
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
        });
    } catch (error) {
        logger.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
