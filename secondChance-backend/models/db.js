const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;
let client;

async function connectToDatabase() {
    if (db) {
        return db;
    }

    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
    const dbName = process.env.MONGO_DB || 'secondChance';

    client = new MongoClient(mongoUrl);
    await client.connect();

    db = client.db(dbName);
    console.log('Connected to MongoDB:', dbName);
    return db;
}

async function closeConnection() {
    if (client) {
        await client.close();
    }
}

module.exports = { connectToDatabase, closeConnection };
