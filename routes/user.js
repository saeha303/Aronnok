const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  userPurchaseList,
  getAllUser,
  userInfoForAdmin,
  userAuctionInfoForAdmin

} = require("../controller/user");
const { isSignedIn, isSelfOrAdmin, isAdmin } = require("../controller/auth");


router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isSelfOrAdmin, 
getUser);

router.get("/getAllUser", isSignedIn, isAdmin, getAllUser);

router.put("/user/:userId", isSignedIn, isSelfOrAdmin, 
updateUser);

// router.get(
//   "/orders/user/:userId",
//   userPurchaseList
// );
router.get("/userinfoforadmin/:userId", isSignedIn, isAdmin, userInfoForAdmin);
router.get("/userauctioninfoforadmin/:userId", isSignedIn, isSelfOrAdmin, userAuctionInfoForAdmin);

module.exports = router;
