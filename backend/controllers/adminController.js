const router = require('express').Router();

const { getCollection } = require('../utils/utils');

const { ObjectId } = require('mongodb');
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