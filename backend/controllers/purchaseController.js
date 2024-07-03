const router = require('express').Router();
const { getCollection, client } = require('../utils/utils');
const { ObjectId, Int32 } = require('mongodb');

const { isAuth } = require('../middlewares/auth');

router.use(isAuth);

// router.get('/', async (req, res) => {
// }); // purchase history...

router.post('/buy', async (req, res) => {
    const accountsCollection = await getCollection('offers');
    const offersCollection = await getCollection('offers');
    const historyCollection = await getCollection('account-purchase-history');
    const session = client.startSession();
    try {
        const transactionResults = await session.withTransaction(async () => {
            for (const purchase of req.body) {
                const account = await accountsCollection.findOne({ username: req.user.username }, {session} );
                const product = await offersCollection.findOne({ _id: new ObjectId(purchase.id) }, { session });

                product.price = parseFloat(product.price, 10).toFixed(2);
                
                if(account.credit - purchase.amount * product.price < 0 || product.quantity < purchase.amount) {
                    session.abortTransaction();
                    return;
                }
                await accountsCollection.updateOne(
                    { username: req.user.username },
                    { $inc: { credit: -(purchase.amount * product.price) } },
                    { session }
                );
                console.log(`Reduced credit of user ${req.user.username} by ${purchase.amount * product.price}`);
                
                await offersCollection.updateOne(
                    { _id: new ObjectId(purchase.id) },
                    { $inc: { quantity: -purchase.amount } },
                    { session }
                );
                console.log(`Reduced the quanitity of product with id: ${purchase.id}, by ${currentResult.matchedCount}`);

                currentResult = await historyCollection.insertOne({ account: req.user.username, product: product.name, amount: purchase.amount }, { session });
            }
        }); 
        if(transactionResults) res.status(200).json({ message: 'Successful purchase' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        session.endSession();
    }
});

module.exports = router;