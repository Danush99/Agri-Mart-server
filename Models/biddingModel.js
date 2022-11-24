const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SchemaBidding = new mongoose.Schema({
    itemId: {
        type: String,
        required: [true, "itemId is Required"],
    },
    farmerId: {
        type: String,
        required: [true, "farmerId is Required"],
    },
    itemName: {
        type: String,
        required: [true, "itemName is Required"],
    },    
    isSold: {
        type: String,
        required: [false, "itemName is Required"],
    },
    buyers: [{
        type: String,
        required: [false, "buyers is Required"],
    }],
    bidValues: [{
        type: String,
        required: [false, "bidValues is Required"],
    }],
});


module.exports = mongoose.model("biddings", SchemaBidding);