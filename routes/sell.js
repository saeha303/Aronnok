const express = require('express');
const router = express.Router();
const { check, validationResult, oneOf } = require("express-validator");
const{
    sellRequest,
    requestApproval,
    getAllSellRequest,
}= require('../controller/sell');
const { paymentSell } = require('../controller/payment');
const { getUserById } = require("../controller/user");
const { isSignedIn, isSelfOrAdmin, isAdmin } = require("../controller/auth");
router.param("userId", getUserById);
router.post('/sellRequest/:userId', isSignedIn, isSelfOrAdmin,sellRequest);
router.post('/requestApproval/:userId/:reqId', isSignedIn, isAdmin,requestApproval);
router.get('/sellRequest/getAll', isSignedIn, isAdmin,getAllSellRequest);
router.post('/sellRequest/:reqProductId/payment', isSignedIn, isAdmin, 
paymentSell);
module.exports = router;