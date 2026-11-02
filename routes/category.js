const express = require("express");
const router = express.Router();
const {
    getCategoryById,
    addCategory,
    getCategory,
    getAllCategory,
    updateCategory,
    removeCategory,
} = require("../controller/category");

const { getUserById } = require("../controller/user");
const { isSignedIn, isAdmin } = require("../controller/auth");
//all of params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

router.post(
    "/category/create/:userId", isSignedIn, isAdmin,
    isAdmin,
    addCategory
);

router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);
//update
router.put(
    "/category/:categoryId/:userId", isSignedIn, isAdmin,
    isAdmin,
    updateCategory
);

//delete

router.delete(
    "/category/:categoryId/:userId", isSignedIn, isAdmin,
    isAdmin,
    removeCategory
);

module.exports = router;