const router = require('express').Router();

const { getCollection, client } = require('../utils/utils');
const { validateOfferInfo } = require('../utils/helperFunctions');

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
        validateOfferInfo(req.body, 'full');
        req.body.quantity = new Int32(req.body.quantity);

        const result = await collection.insertOne(req.body);
        if(result.insertedId) res.status(201).json({ message: 'Offer successfully created!', offerId: result.insertedId });
    } catch(err) {
        console.error(err.message);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
});

router.put('/offers/:id/edit', async (req, res) => {
    const session = client.startSession();
    try {
        await validateOfferInfo(req.body);
        const updates = req.body;
        const collection = await getCollection('offers');

        const transactionResults = await session.withTransaction(async () => {
            for (const key in updates) {
                if (Object.hasOwnProperty.call(updates, key)) {
                    const update = await collection.updateOne(
                        { _id: new ObjectId(req.params.id) },
                        { $set: { [key]: updates[key] } }
                    );
                    if(!update.modifiedCount) throw new Error(`Error updating ${key}`);
                }
            }
            return 'Changes saved successfully!';
        })

        res.status(200).json({ message: transactionResults });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message || 'Failed to save changes' });
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