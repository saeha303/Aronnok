// const Product = require('../models/product');
const {SellProduct,ComingSoonProduct}=require('../models/sell');
const { validationResult } = require('express-validator');
const User = require("../models/user");
const Notification = require("../models/notification");

exports.sellRequest = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    try {
        // console.log(req.body)
        const { name,sciname, description, photoName, ap} = req.body;
        // console.log(initialbid)
        const askingPrice = ap;
        // console.log(currentBid)
        const photo = "/" + photoName;
        // console.log(photo)
        const sellproduct = new SellProduct({
          name,
          sciname,
          description,
          photo,
          askingPrice,
          user: req.params.userId,
        });
    
        await sellproduct.save();
        // console.log(auctionProduct)
        // req.auction.auctionProducts.push(auctionProduct._id);
        // await req.auction.save();
    
        res.status(201).json({ message: 'Request sent to admin successfully!' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    
  };

  exports.getAllSellRequest = async(req, res) => {
    // console.log("here I come1");
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try{
    const sellRequests = await SellProduct.find({});
    const updatedRequests = await Promise.all(sellRequests.map(async (req) => {
    const userDetails = await User.findById(req.user);
    if (userDetails) {
        // console.log("here I come");
        username = userDetails.username;

        return {
          ...req.toObject(),
          username: username,
        };
      }
    }));
    res.status(201).json(updatedRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  };


  //==============================================================================================================================
  exports.requestApproval = async(req, res) => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  try{
    const requestId = req.params.reqId;
    const userId = req.params.userId;
    //const userId = await SellProduct.findById(requestId).user;
    const requestedProduct = await SellProduct.findById(requestId);
    if (!requestedProduct) {
        return res.status(404).json({ error: 'Requested product not found' });
      }
      const newComingSoonProduct = new ComingSoonProduct({
        name: requestedProduct.name,
        sciname:requestedProduct.sciname,
        description: requestedProduct.description,
        photo: requestedProduct.photo,
        price: requestedProduct.askingPrice,
        category: requestedProduct.category // You may need to adjust this based on your schema
    });
    await newComingSoonProduct.save();

        await SellProduct.findByIdAndDelete(requestId);
        res.status(201).json({ message: 'Request approved successfully!'});
        //notify that user that his request has been approved
        let notification = await Notification.findOne({ user: userId }).sort({ createdAt: -1 });

        if (!notification) {
          // If no notification exists for the user, create a new one
          notification = new Notification({ user: userId, messages: [] });
        }
  
        // Add the new message to the notification
        notification.messages.push({
          message: "Your request for selling "+requestedProduct.name+" has been approved by admin",
          type: "sellrequest",
          
          // Add link if needed
        });
  
        // Save the notification
        await notification.save();
        //find that user in notifications table and push message and type of notification
  }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  };