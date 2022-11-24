const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SchemaOrder = new mongoose.Schema({
    itemId: {
        type: String,
        required: [true, "itemId is Required"],
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
    orderDate: {
        type: String,
        required: [true, "orderDate is not Required"],
    },
    CheckUncheck: {
        type: String,
        required: [false, "CheckUncheck is not Required"],
    },
    itemObject:{
        type: Object,
        required: [true, "itemObject is  Required"],
    },
    buyerObject:{
        type: Object,
        required: [true, "buyerObject is  Required"],
    },
    farmerObject:{
        type: Object,
        required: [true, "farmerObject is  Required"],
    },
    note:{
        type: Object,
        required: [true, "note is Required"],
    }
});


module.exports = mongoose.model("orders", SchemaOrder);