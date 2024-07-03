const router = require('express').Router();
const { Int32 } = require('mongodb');

const { isAuth } = require('../middlewares/auth');
const { getCollection, getAuthResults } = require('../utils/utils');

const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
    try {
        const collection = await getCollection('accounts');
        let account = await collection.findOne({ username: req.body.username });
        if(account) res.status(200).json({ message: 'Account name taken!' });
        else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            account = {
                username: req.body.username,
                password: hashedPassword,
                client: 'user',
                credit: new Int32(200)
            };
            await collection.insertOne(account);
            
            const result = getAuthResults(account);
            res.status(200).json({ message: 'Account Successfully created!', data: result, authorization: account.client, credit: 200 });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });    
    }
});

router.post('/login', async (req, res) => {
    try {
        const collection = await getCollection('accounts');
        const account = await collection.findOne({ username: req.body.username });
        let passwordMatching = false;

        if(account) passwordMatching = await bcrypt.compare(req.body.password, account.password);
        
        if(passwordMatching === true) {
            const result = getAuthResults(account);
            res.status(200).json({ message: 'Successful login!', data: result, authorization: account.client, credit: account.credit });
        }
        else res.status(200).json({ message: 'Wrong credentials.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// router.get('/credit', isAuth, async (req, res) => {
//     try {
//         const collection = await getCollection('accounts');
//         const account = await collection.findOne({ username: req.user.username });
        
//         res.status(200).json(account.credit);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

module.exports = router;