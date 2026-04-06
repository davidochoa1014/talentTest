const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const  auth = require('../middleware/auth'); 

router.get('/get', auth, customerController.getCustomers);
router.post('/create', auth, customerController.postCustomer);
router.put('/update/:id', auth, customerController.updateCustomer);

module.exports = router;