const express = require("express");
const router = express.Router();
const {
    addWishlistPlant,
    getwishlistPlant,
    getAllwishlistPlants,
    removewishlistPlant,
} = require("../controller/wishlist");
const { isSignedIn, isSelfOrAdmin } = require("../controller/auth");

router.post("/wishlist/create/:userId", isSignedIn, isSelfOrAdmin, addWishlistPlant);
router.get("/wishlist/:userId/:wishlistPlantId", isSignedIn, isSelfOrAdmin, getwishlistPlant);
router.get("/wishlist/:userId", isSignedIn, isSelfOrAdmin, getAllwishlistPlants);
router.delete("/wishlist/:userId/:wishlistPlantId", isSignedIn, isSelfOrAdmin, removewishlistPlant);

module.exports = router;
