const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const auctionProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        description: {
            type: String,
            trim: true,
            required: true,
            maxlength: 2000
        },
        photo: {
            type: String
        },
        isSold: {
            type: Boolean,
            default: false // Set default to false, assuming the product is not sold by default
        },
        highestBidder: {
            type: ObjectId,
            ref: "User" // Adjust based on your user schema
        },
        currentBid: {
            type: Number,
            default: 0
        },
        bids: [
            {
                bidder: {
                    type: ObjectId,
                    ref: "User"
                },
                bidAmount: {
                    type: Number
                },
                timestamp: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    { timestamps: true }
);

const auctionSchema = new mongoose.Schema(
    {
        // Add other fields related to the auction
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 100
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        auctionProducts: [
            {
                type: ObjectId,
                ref: "AuctionProduct"
            }
        ]
    },
    { timestamps: true }
);

const AuctionProduct = mongoose.model('AuctionProduct', auctionProductSchema);
const Auction = mongoose.model('Auction', auctionSchema);

module.exports = { AuctionProduct, Auction };
