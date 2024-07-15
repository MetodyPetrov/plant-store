const router = require('express').Router();

const { getCollection } = require('../utils/utils');

const { ObjectId, Int32 } = require('mongodb');
const { isAuth } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/admin');

router.use(isAuth);
router.use(isAdmin);

router.put('/credit', async (req, res) => {
    try {
        const collection = await getCollection('accounts');
        const account = await collection.updateOne(
            { username: req.user.username },
            { $inc: { credit: req.body.credit * 1 } }
        );
        
        res.status(200).json({ message: `Successfuly increased credit by ${parseFloat(req.body.credit / 100).toFixed(2)}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/offers/create', async (req, res) => {
    try {
        const collection = await getCollection('offers');
        
        // NOTE: Image validation is part of the frontend
        const offer = {
            name: req.body.name,
            price: req.body.price,
            quantity: new Int32(req.body.quantity),
            type: req.body.type,
            url: req.body.url,
            description: req.body.description
        }

        for (const key in offer) {
            if (offer.hasOwnProperty(key)) {
                if(!offer[key]) throw new Error(`Undefined offer property: ${key}`);
            }
        }

        const validatePrice = /^\d{2}\.\d{2} lv\.$/;

        if(isNaN(offer.quantity)) throw new Error('Invalid offer quantity');
        if(isNaN(parseFloat(offer.price, 10).toFixed(2)) || !validatePrice.test(offer.price)) throw new Error('Invalid offer price');
        if(typeof offer.description !== 'string') throw new Error('Invalid offer description');

        const existingOffer = await collection.findOne({ name: req.body.name });
        if(existingOffer) throw new Error('Offer already exists');

        const result = await collection.insertOne(offer);
        if(result.insertedId) res.status(201).json({ message: 'Offer successfully created!', offerId: result.insertedId });
    } catch(err) {
        console.error(err.message);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
});

router.put('/offers/:id/increase-quantity', async (req, res) => {
    try {
        const collection = await getCollection('offers');
        const result = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $inc: { quantity: req.body.quantity * 1 } }
        );
        if(result.modifiedCount) return res.status(200).json({ message: 'Successful increase' });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Unsuccessful increase' });
    }
});

router.put('/offers/:id/decrease-quantity', async (req, res) => {
    try {
        const collection = await getCollection('offers');
        const offer = await collection.findOne({ _id: new ObjectId(req.params.id) });
        if(offer.quantity <= 0) {
            res.status(500).json({ message: 'Cannot decrease a product with a quantity of 0.' });
            return;
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $inc: { quantity: -req.body.quantity * 1 } }
        );
        if(result.modifiedCount) return res.status(200).json({ message: 'Successful decrease' });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Unsuccessful decrease' });
    }
});

module.exports = router;