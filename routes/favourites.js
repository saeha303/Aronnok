const express = require("express");
const router = express.Router();
const {
    // getFavouritesById,
    addFavourite,
    getFavourite,
    getAllFavourites,
    removeFavourite,
    getIsFavourite,
} = require("../controller/favourites");

const { getUserById } = require("../controller/user");
const { isSignedIn, isSelfOrAdmin } = require("../controller/auth");
//all of params
// router.param("userId", getUserById);
// router.param("favouritePlantId", getFavouritesById);
//userId specifies a specific favourite list for a specific user
//favouritePlantId specifies one specific plant in one specific user's favourites
router.post(
    "/favourites/create/:userId", isSignedIn, isSelfOrAdmin,
    addFavourite
);

router.get("/favourites/:userId/:favouritePlantId", isSignedIn, isSelfOrAdmin, getFavourite);
router.get("/favourites/:userId", isSignedIn, isSelfOrAdmin, getAllFavourites);
router.get("/favourites/:userId/isFavourite/:productId", isSignedIn, isSelfOrAdmin, getIsFavourite);

//delete

router.delete(
    "/favourites/:userId/:favouritePlantId", isSignedIn, isSelfOrAdmin,
    removeFavourite
);

module.exports = router;