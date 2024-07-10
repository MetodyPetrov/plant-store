const router = require('express').Router();
const { getCollection } = require('../utils/utils');

router.get('/', async (req, res) => {
    try {
        const collection = await getCollection('offers');
        const offers = await collection.find().toArray();
        if(req.user?.client === 'admin') res.status(200).json(offers);
        else res.status(200).json(offers.filter(offer => offer.quantity > 0));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;