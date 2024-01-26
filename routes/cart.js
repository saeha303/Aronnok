const express = require("express");
const router = express.Router();
const {
    getCartById,
    addToCart,
    viewCart,
    updateCartItem,
    deleteCartItem,
    removeCart,
    buyNow
} = require('../controller/cart');
const {
    createOrder
} = require("../controller/order");
const { isSignedIn, isAuthenticated } = require("../controller/auth");
router.param("userId", getCartById);
router.post('/cart/add/:userId/:productId',
    // isSignedIn, 
    addToCart);
router.get('/cart/viewCart/:userId',
    // isSignedIn, 
    viewCart);
router.put('/cart/update/:userId/:productId',
    // isSignedIn, 
    updateCartItem);
router.delete('/cart/deleteItem/:userId/:productId',
    // isSignedIn, 
    deleteCartItem);
router.delete('/cart/clear/:userId',
    // isSignedIn, 
    removeCart
    );
router.put('/cart/buynow/:userId',
    // isSignedIn,
    buyNow,
    createOrder
    );

module.exports = router;
