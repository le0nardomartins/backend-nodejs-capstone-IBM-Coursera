require('dotenv').config();
const { MongoClient } = require('mongodb');
const items = require('./items.json');

async function seedDatabase() {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
    const dbName = process.env.MONGO_DB || 'secondChance';

    const client = new MongoClient(mongoUrl);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('secondChanceItems');

        await collection.deleteMany({});
        const result = await collection.insertMany(items);

        console.log(`Successfully imported ${result.insertedCount} documents`);
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await client.close();
    }
}

seedDatabase();
