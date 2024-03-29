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
const { isSignedIn, isAuthenticated } = require("../controller/auth");
const { paymentOrder } = require("../controller/payment");
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
    updateStock,
    createOrder,
    paymentOrder,
);
router.get('/cart/getQuantity/:userId/:productId',
    // isSignedIn, 
    getQuantity);

module.exports = router;
