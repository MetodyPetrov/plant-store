const router = require('express').Router();

const offersController = require('./controllers/offersController');
const accountsController = require('./controllers/accountsController');
const adminController = require('./controllers/adminController');
const purchaseController = require('./controllers/purchaseController');

router.use('/offers', offersController);
router.use('/accounts', accountsController);
router.use('/admin', adminController);
router.use('/purchase', purchaseController);

module.exports = router;