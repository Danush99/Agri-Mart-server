const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SchemaOrder = new mongoose.Schema({
    itemId: {
        type: String,
        required: [true, "itemId is Required"],
    },
    buyerId: {
        type: String,
        required: [true, "buyerId is Required"],
    },
    isDelivery: {
        type: String,
        required: [true, "isDelivery is not Required"],
    },
    amount: {
        type: String,
        required: [true, "amount is Required"],
    },
    totalBill: {
        type: String,
        required: [true, "totalBill is Required"],
    },
    deliveryAddress: {
        type: String,
        required: [false, "deliveryAddress is not Required"],
    },
    farmerId: {
        type: String,
        required: [true, "farmerId is not Required"],
    },
    itemObject:{
        type: Object,
        required: [true, "farmerId is not Required"],
    }
});


module.exports = mongoose.model("orders", SchemaOrder);