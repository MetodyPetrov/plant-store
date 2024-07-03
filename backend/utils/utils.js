const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

const { SECRET } = require('./config');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { replicaSet: rs }); // https://stackoverflow.com/questions/51461952/mongodb-v4-0-transaction-mongoerror-transaction-numbers-are-only-allowed-on-a

async function getCollection(type) {
    try {
        const db = client.db('Store');
        const collection = db.collection(type);
        return collection;
    } catch (err) {
        throw new Error(`Error accessing ${type} collection: ` + err.message);
    }
}

function getAuthResults(user) {
    const payload = {
        _id: user._id,
        username: user.username,
        client: user.client
    };
    
    const token = jwt.sign(payload, SECRET, { expiresIn: '6h' });

    const result = {
        _id: user._id,
        username: user.username,
        accessToken: token
    };

    return result;
}

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db('Store');
    } catch (err) {
        throw new Error('Error connecting to MongoDB: ' + err.message);
    }
}

module.exports = { connectToMongoDB, getCollection, getAuthResults, client };