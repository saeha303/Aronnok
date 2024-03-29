const express = require("express");
const router = express.Router();

const multer = require('multer');
// Set up Multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  getProductById,
  getcsProductById,
  imageHelper,
  addPlant,
  getProduct,
  photo,
  deleteProduct,
  updateProduct,
  getAllProducts,
  recommendations,
  trending,
  getComingSoon,
  category_stock,
  getNewArrivals,
  getPlantaByTag,
  getPlantByName,
  getPlantByCategory,
  getBestSellers,
  giveRating,
  getRating,
  getComingSoonProduct,
  //   getAllUniqueCategories,
} = require("../controller/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controller/auth");
const { getUserById } = require("../controller/user");

//all of params
router.param("userId", getUserById);
router.param("productId", getProductById);
router.param("csProductId", getcsProductById);
// router.param("keyword",getPlantaByTag,getPlantByName,getPlantByCategory);
//all of actual routes
// /admin/:userId/addPlant
router.post(
  "/product/create/:userId",
  // upload.single('photo'),
  // isSignedIn,
  // isAuthenticated,
  // isAdmin,
  // imageHelper,
  addPlant
);

// // read routes
router.get("/product/:userId/:productId", getProduct);
router.get("/comingsoon/:userId/:csProductId", getComingSoonProduct);
router.get("/product/photo/:productId", photo);

// delete route
router.delete(
  "/product/:productId/:userId",
  // isSignedIn,
  // isAuthenticated,
  isAdmin,
  deleteProduct
);

// update route
router.put(
  "/product/:productId/:userId",
  // isSignedIn,
  // isAuthenticated,
  // isAdmin,
  updateProduct
);

// listing route for user
router.get("/products/:userId", getAllProducts);
router.get("/product/newarrival", getNewArrivals);
router.get("/product/comingsoon", getComingSoon);

// router.get("/products/categories", getAllUniqueCategories);

// Search route
router.post('/search',
  // getPlantaByTag,
  getPlantByName,
  // getPlantByCategory,
);
//recommended for you
router.get('/recommend/:userId',
recommendations,
trending,
);
//trending
router.get('/trending',
trending,
);

//get category wise 
router.get('/category_stock',
category_stock,
);
//user will give rating here
 router.post('/anyproduct/giverating/:productId', giveRating);
 router.get('/anyproduct/getrating/:productId', getRating);

router.get("/products/get/bestSellers", getBestSellers);

module.exports = router;
