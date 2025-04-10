const express = require('express');
const { processPayment, sendStripeApiKey } = require('../controllers/paymentController');
const router = express.Router();
const { authUser } = require('../middleware/authMiddleware')


router.route('/process').post(authUser, processPayment)
router.route('/stripeapikey').get(authUser, sendStripeApiKey)
module.exports = router;