const jwt = require("jsonwebtoken");
const Farmer = require("../Models/farmerModel");
const Officer = require("../Models/officerModal");
//const MarketPlace = require("../Models/marketPlaceModal");
const Item = require("../Models/itemModel");
const User = require("../Models/authModel");
const Order = require("../Models/orderModel")


const getItems = async (req,res)=>{
    const Allitems = await Item.find( {} );
    const VegiItems = await Item.find( {category:"Vegetable"} );
    const FruitItems = await Item.find( {category:"fruit"} );
    const DirectBItems = await Item.find( {bid:"0"} );
    const BidItems = await Item.find( {bid:"1"} );

    if(!Allitems||!VegiItems||!FruitItems||!DirectBItems||!BidItems){
        return res.json({ success: false, message: 'Items not found', });
    }else{
        return  res.json({ success: true, Allitems:Allitems, VegiItems:VegiItems, FruitItems:FruitItems, DirectBItems:DirectBItems, BidItems:BidItems });
    }
}

const directBuy = async (req,res)=>{
    const data = req.body.data
    const item = req.body.item
    const userTypeId = req.body.UserTypeId
    const totalBill=(data.amount/1000)*item.price
    console.log("data",data)
    const order = await Order.create( {itemObject:item, itemId:item._id, buyerId:userTypeId, farmerId:item.farmerID, amount:data.amount, totalBill:totalBill, deliveryAddress:data.address, isDelivery:data.IsDelivery} );
    if(order){
        return res.json({ success: true, message: 'Order create success'});
    }else{
        return res.json({ success: false, message: 'Orders create fail' });
    }
}

const bidOrder = async (req,res)=>{
    const Allitems = await Order.create( {} );
}

const getOrders = async (req,res)=>{
    console.log("data",req.body)
    const userId = req.body.userId;
    const userType = req.body.userType;
    if(userType=="buyer"){
        const orders = await Order.find( {buyerId:userId} );
        if(orders){
            return res.json({ success: true, message: 'Orders get success',orders:orders });
        }else{
            return res.json({ success: false, message: 'Orders get fail' });
        }
    }else{
        const orders = await Order.find( {farmerId:userId} );
        if(orders){
            return res.json({ success: true, message: 'Orders get success',orders:orders });
        }else{
            return res.json({ success: false, message: 'Orders get fail' });
        }
    }

}

module.exports = {
    getItems,
    bidOrder,
    directBuy,
    getOrders
}