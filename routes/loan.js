const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const auth = require('../middleware/auth'); 


router.get('/get', auth, loanController.getLoans);
router.post('/create', auth, loanController.createLoan);
router.post('/return/:id', auth, loanController.returnLoan);
router.get('/active-by-book/:bookId', auth, loanController.getActiveLoan);

module.exports = router;