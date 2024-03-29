const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const sellProductSchema = new mongoose.Schema(
    {
        name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        },
        sciname:{
            type: String,
          },
        description: {
        type: String,
        trim: true,
        required: true,
        maxlength: 2000,
        },
        photo: {
        type: String,
        },
        askingPrice: {
        type: Number,
        default: 0,
        },
        user: {
        type: ObjectId,
        ref: "User", // Adjust based on your user schema
        },
    },
    { timestamps: true }
    );
    const comingSoonProductSchema = new mongoose.Schema(
        {
            name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            },
            sciname:{
                type: String,
              },
            description: {
            type: String,
            trim: true,
            required: true,
            maxlength: 2000,
            },
            photo: {
            type: String,
            },
            price: {
            type: Number,
            default: 0,
            },
            
            user: {
            type: ObjectId,
            ref: "User", // Adjust based on your user schema
            },
        },
        { timestamps: true }
        );
    //const SellProduct = mongoose.model("SellProduct", sellProductSchema);

    // module.exports = mongoose.model("SellProduct", sellProductSchema);
    const SellProduct = mongoose.model('SellProduct', sellProductSchema);
    const ComingSoonProduct = mongoose.model('ComingSoonProduct', comingSoonProductSchema);
    module.exports = { SellProduct, ComingSoonProduct };
