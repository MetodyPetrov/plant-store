const router = require('express').Router();
const { getCollection, client } = require('../utils/utils');
const { ObjectId, Int32 } = require('mongodb');

const { isAuth } = require('../middlewares/auth');

router.use(isAuth);

router.get('/history', async (req, res) => {
    try {
        const collection = await getCollection('account-purchase-history');
        const history = await collection.find({ account: req.user.username }).toArray();
        for (let i = 0; i < history.length; i++) {
            history[i].date = new ObjectId(history[i]._id).getTimestamp();
        }
        res.status(200).json(history);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/buy', async (req, res) => {
    const accountsCollection = await getCollection('accounts');
    const offersCollection = await getCollection('offers');
    const historyCollection = await getCollection('account-purchase-history');
    const session = client.startSession();
    try {
        const transactionResults = await session.withTransaction(async () => {
            for (const purchase of req.body) {
                const account = await accountsCollection.findOne({ username: req.user.username }, {session} );
                const product = await offersCollection.findOne({ _id: new ObjectId(purchase.id) }, { session });

                product.price = parseFloat(product.price, 10).toFixed(2) * 100;

                if(product.quantity < purchase.amount) throw new Error('Instock product quantity is not enough.');
                if(account.credit - purchase.amount * product.price < 0) throw new Error('Insufficient funds.');
                await accountsCollection.updateOne(
                    { username: req.user.username },
                    { $inc: { credit: -(purchase.amount * product.price) } },
                    { session }
                );
                
                let currentResult = await offersCollection.updateOne(
                    { _id: new ObjectId(purchase.id) },
                    { $inc: { quantity: -purchase.amount } },
                    { session }
                );

                currentResult = await historyCollection.insertOne({ account: req.user.username, product: product.name, amount: new Int32(purchase.amount) }, { session });
            }
            return 'Successful purchase!';
        });
        res.status(200).json({ message: transactionResults });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    } finally {
        session.endSession();
    }
});

module.exports = router;