const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SchemaItem = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is Required"],
    },
    Desc: {
        type: String,
        required: [true, "Desc is Required"],
    },
    bid: {
        type: String,
        required: [true, "bid is not Required"],
    },
    farmerID: {
        type: String,
        required: [true, "farmerID is Required"],
    },
    bidPeriod: {
        type: String,
        required: [true, "bidPeriod is Required"],
    },
    price: {
        type: String,
        required: [true, "price is Required"],
    },
    category: {
        type: String,
        required: [true, "category is Required"],
    },
    availableAmount: {
        type: String,
        required: [true, "availableAmount is Required"],
    },
    unit: {
        type: String,
        required: [true, "unit is not Required"],
    },
    img: [{
        type: String,
        required: [false, "img is Required"],
    }],
    postedDate: {
        type: String,
        required: [true, "postedDate is not Required"],
    },
});


module.exports = mongoose.model("items", SchemaItem);