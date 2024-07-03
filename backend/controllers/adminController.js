const router = require('express').Router();

const { getCollection } = require('../utils/utils');

const { ObjectId, Int32 } = require('mongodb');
const { isAuth } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/admin');

router.use(isAuth);
router.use(isAdmin);

router.put('/credit', isAuth, async (req, res) => {
    try {
        const collection = await getCollection('accounts');
        const account = await collection.updateOne(
            { username: req.user.username },
            { $inc: { credit: req.body.credit * 1 } }
        );
        
        res.status(200).json({ message: `Successfuly increased credit by ${req.body.credit}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;