const express = require("express");
const router = express.Router();
const {
    getCartById,
    addToCart,
    viewCart,
    updateCartItem,
    deleteCartItem,
    removeCart,
    buyNow,
    getQuantity
} = require('../controller/cart');
const { updateStock } = require("../controller/product");
const {
    createOrder
} = require("../controller/order");

const { paymentOrder } = require("../controller/payment");
const { isSignedIn, isSelfOrAdmin } = require("../controller/auth");
router.param("userId", getCartById);
router.post('/cart/add/:userId/:productId', isSignedIn, isSelfOrAdmin,
    addToCart);
router.get('/cart/viewCart/:userId', isSignedIn, isSelfOrAdmin,
    viewCart);
router.put('/cart/update/:userId/:productId', isSignedIn, isSelfOrAdmin,
    updateCartItem);
router.delete('/cart/deleteItem/:userId/:productId', isSignedIn, isSelfOrAdmin,
    deleteCartItem);
router.delete('/cart/clear/:userId', isSignedIn, isSelfOrAdmin,
    removeCart
);
router.put('/cart/buynow/:userId', isSignedIn, isSelfOrAdmin,
    
    buyNow,
    updateStock,
    createOrder,
    paymentOrder,
);
router.get('/cart/getQuantity/:userId/:productId', isSignedIn, isSelfOrAdmin,
    getQuantity);

module.exports = router;
