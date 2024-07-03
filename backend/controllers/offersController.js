const router = require('express').Router();
const { getCollection } = require('../utils/utils');
const { ObjectId } = require('mongodb');

router.get('/', async (req, res) => {
    try {
        const collection = await getCollection('offers');
        const offers = await collection.find().toArray();
        res.status(200).json(offers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;