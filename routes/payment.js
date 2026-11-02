const express = require('express');
const router = express.Router();

const { success, fail, successSell } = require('../controller/payment');

// These are called by the SSLCommerz gateway, not by the browser session,
// so they are intentionally not behind isSignedIn.
router.post('/payment/success/:transId', success);
router.post('/payment/success/sell/:transId', successSell);
router.post('/payment/fail/:transId', fail);
// Instant Payment Notification: acknowledge so the gateway stops retrying.
router.post('/payment/ipn', (req, res) => res.sendStatus(200));

module.exports = router;
