const express = require('express');
const router = express.Router();
const {
    getUserNotifications,
    // getAuctionMessages,
    markNotificationAsRead,
    postUserNotifications,
    deleteUserNotifications,
} = require('../controller/notification');
const { isSignedIn, isSelfOrAdmin } = require("../controller/auth");

// Route for getting all notifications for a user
router.get('/notification/:userId', isSignedIn, isSelfOrAdmin, getUserNotifications);
// router.get('/:userId/getAuctionMsg',getAuctionMessages);
// Route for marking a notification as read
router.put('/notification/:notificationId/read', isSignedIn, markNotificationAsRead);
router.post('/notification/:userId', isSignedIn, postUserNotifications);
router.delete('/:userId/notification/delete/:notificationId', isSignedIn, isSelfOrAdmin, deleteUserNotifications);

module.exports = router;
