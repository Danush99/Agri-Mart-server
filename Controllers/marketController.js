const jwt = require("jsonwebtoken");
const Officer = require("../Models/officerModal");
//const MarketPlace = require("../Models/marketPlaceModal");
const Item = require("../Models/itemModel");
const User = require("../Models/authModel");
const Order = require("../Models/orderModel")
const Farmer = require("../Models/farmerModel");
const Buyer = require("../Models/buyerModel");
const Bid = require("../Models/biddingModel");



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

const checkOrder = async (req,res)=>{
    const CheckUncheck = req.body.CheckUncheck
    console.log("checkUncheck:: ",CheckUncheck)
    const OrderId = req.body.OrderId
    const updateOrder = await Order.updateOne( { _id:OrderId},{$set: {CheckUncheck:CheckUncheck} });
    if(updateOrder.acknowledged){
        return res.json({ success: true, message: 'Order checking is success', });
    }else{
        return res.json({ success: false, message: 'Order checking is failed', });
    }
}

const directBuy = async (req,res)=>{
    const data = req.body.data
    const item = req.body.item
    const farmer = req.body.Farmer
    const buyer = req.body.UserProfile
    const userTypeId = req.body.UserTypeId
    const date = new Date()
    
    console.log("data::::::::",data)
    console.log("item::::::::",item)
    console.log("farmer::::::::",farmer)
    console.log("buyer::::::::",buyer)
    console.log("userTypeId::::::::",userTypeId)
    
    if(item.bid=="1"){
        var totalBill = 0
        if(item.unit=="kg"){
            totalBill=(item.availableAmount/1000)*item.price
            console.log("totalBill::::::::",totalBill)
        }else{
            totalBill=(item.availableAmount)*item.price
            console.log("totalBill::::::::",totalBill)
        }
        const order = await Order.create( { itemId:item._id,itemObject:item, buyerObject:buyer, farmerObject:farmer, amount:item.availableAmount, totalBill:totalBill, deliveryAddress:data.address,note:data.desc, isDelivery:data.IsDelivery,orderDate:date,CheckUncheck:"false"} );
        const updateBidItem = await Bid.updateOne( { itemId:item._id},{$set: {isSold:"true"}, $currentDate: {lastModified:true} });
        const deletedItem = await Item.deleteOne( { _id: item._id });
        const deletedBidding = await Bid.deleteOne( { itemId: item._id });
        if(order){
            return res.json({ success: true, message: 'Order create success'});
        }else{
            return res.json({ success: false, message: 'Orders create fail' });
        }
    }else{
        var totalBill = 0
        if(item.unit=="kg"){
            totalBill=(data.amount/1000)*item.price
            console.log("totalBill::::::::",totalBill)
        }else{
            totalBill=(data.amount)*item.price
            console.log("totalBill::::::::",totalBill)
        }
        const order = await Order.create( { itemId:item._id,itemObject:item, buyerObject:buyer, farmerObject:farmer, amount:data.amount, totalBill:totalBill, deliveryAddress:data.address,note:data.desc, isDelivery:data.IsDelivery,orderDate:date,CheckUncheck:"false"} );
        if(order){
            return res.json({ success: true, message: 'Order create success'});
        }else{
            return res.json({ success: false, message: 'Orders create fail' });
        }
    }
}

const getItemBidDetails = async (req,res)=>{
    const itemId = req.body.itemId
    const buyerId = req.body.buyerId
    const bidDetails = await Bid.findOne({ itemId:itemId});
    const buyerBid = await Bid.find({ itemId:itemId , buyers:{$all: [buyerId]} });

    if(bidDetails){
        var totalBidderCount =0
        try{
            totalBidderCount = (bidDetails.buyers==null?"0":bidDetails.buyers.length)
        }catch{
            totalBidderCount =0
        }
        const buyerBidValueArray = bidDetails.bidValues
        const maxBidValue = (buyerBidValueArray.length==0?"0":Math.max(...buyerBidValueArray))
    
        if(buyerBid.length==0){
            return res.json({ success: true, message: 'get bid details success',buyerAlreadyBid:false,BidData:{maxBidValue:maxBidValue,totalBidderCount:totalBidderCount}});
        }else{
            var buyerBidValue=0
            const buyerIdArray = bidDetails.buyers
            for(let x=0;x<buyerIdArray.length;x++){
                if(buyerId!=buyerIdArray[x]){
                    continue
                }else{
                    buyerBidValue=buyerBidValueArray[x]
                }
            }
            return res.json({ success: true, message: 'get bid details success',buyerAlreadyBid:true,bidObject:bidDetails,BidData:{buyerBidValue:buyerBidValue,maxBidValue:maxBidValue,totalBidderCount:totalBidderCount}});
        }
    }else{
        return res.json({ success: false, message: 'There are i bidding details' });
    }

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

const GetOrderCompletePercentage = async (req,res)=>{
    console.log("data",req.body)
    const userId = req.body.userId;
    const userType = req.body.userType;
    if(userType=="buyer"){
        const orders = await Order.find( {buyerId:userId} );
        const CompOrder = await Order.find( {buyerId:userId,CheckUncheck:"true"} );
        if(orders){
            const orderCount = orders.length
            const CompOrderCount = CompOrder.length
            const cpm = CompOrderCount/orderCount
            return res.json({ success: true, message: 'Orders get success',cpm:cpm });
        }else{
            return res.json({ success: false, message: 'Orders get fail' });
        }
    }else{
        const orders = await Order.find( {farmerId:userId} );
        const CompOrder = await Order.find( {farmerId:userId,CheckUncheck:"true"} );
        if(orders){
            const orderCount = orders.length
            const CompOrderCount = CompOrder.length
            const cpm = CompOrderCount/orderCount
            return res.json({ success: true, message: 'Orders get success',cpm:cpm });
        }else{
            return res.json({ success: false, message: 'Orders get fail' });
        }
    }

}

const bidOnItem = async (req,res) =>{
    console.log("data",req.body)
    const item = req.body.item;
    const submitAmount = req.body.submitAmount;
    const farmerID = req.body.farmerID;
    const buyerID = req.body.buyerID;
    console.log("ItemObject: ",item,"\namount: ",submitAmount,"farmerId: ",farmerID,"buyerId: ",buyerID)
    const bidDetails = await Bid.findOne({ itemId:item._id});
    var buyers = []
    var bidValues = []
    if(bidDetails){
        buyers=bidDetails.buyers
        bidValues=bidDetails.bidValues

        const bI=CheckItemInArray(buyerID,buyers)
        if(bI){
            buyers.splice(bI, 1)
            buyers.push(buyerID)
        }else{
            buyers.push(buyerID)
        }

        const bV=CheckItemInArray(submitAmount,bidValues)
        if(bI){
            bidValues.splice(bI, 1)
            bidValues.push(submitAmount)
        }else{
            bidValues.push(submitAmount)
        }
        
        const updateBidItem = await Bid.updateOne( { itemId:item._id},{$set: {buyers: buyers,bidValues:bidValues}, $currentDate: {lastModified:true} });
        if(updateBidItem.acknowledged){
            return res.json({ success: true, message: 'successfully uploaded bidding item' })
        }else{
            return res.json({ "message": "bid item upload failed",success: false })
        }
    }else{
        buyers.push(buyerID)
        bidValues.push(submitAmount)
        const newBidItem = await Bid.create({ itemId:item._id,itemName:item.item,farmerId:farmerID,buyers:buyers,bidValues:bidValues,isSold:"false",});
        if(newBidItem){
            return res.json({ success: true, message: 'bid create success'});
        }else{
            return res.json({ success: false, message: 'bid create fail' });
        }
    }
}

const CheckItemInArray = (element,myArray) => {
    for(let x=0;x<myArray.length;x++){
        if(element==myArray[x]){
            return x
        }
    }
    return false
}

module.exports = {
    getItems,
    getItemBidDetails,
    directBuy,
    getOrders,
    bidOnItem,
    checkOrder,
    GetOrderCompletePercentage
}