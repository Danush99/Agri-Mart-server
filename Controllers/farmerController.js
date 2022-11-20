const jwt = require("jsonwebtoken");
const Farmer = require("../Models/farmerModel");
const Officer = require("../Models/officerModal");
const MarketPlace = require("../Models/marketPlaceModal");
const User = require("../Models/authModel");
const Item = require("../Models/itemModel");
const Order = require("../Models/orderModel");
const Bid = require("../Models/biddingModel");
const validate = require('../utils/validation');



// const farmerRegister = async (req,res)=>{
//     const Allitems = await MarketPlace.find( {} );
//     const VegiItems = await MarketPlace.find( {category:"Veg"} );
//     const FruitItems = await MarketPlace.find( {category:"fruit"} );
//     const DirectBItems = await MarketPlace.find( {bid:"0"} );
//     const BidItems = await MarketPlace.find( {bid:"1"} );
    
//     if(!Allitems||!VegiItems||!FruitItems||!DirectBItems||!BidItems){
//         return res.json({ success: false, message: 'Items not found', });
//     }else{
//         return  res.json({ success: true, Allitems:Allitems, VegiItems:VegiItems, FruitItems:FruitItems, DirectBItems:DirectBItems, BidItems:BidItems });
//     }
// }

const farmerRegister = async (req,res)=>{
    console.log("registering data: ",req.body);
    const {password1,password2} = req.body;
  
    //Validation
    if(password1!==password2){
        return res.json({ success: false,"message": [
          {"message": "Passwords are not matching","path": ["password1"]},
          {"message": "Passwords are not matching","path": ["password2"]},
      ] });
      }
    const allData = Object.assign({}, req.body, {approval:"Idle"});
    const result = validate.farmer_register_vaidation(allData);
    if (result?.error) {
        console.log("error :", result.error);
        return res.json({success: false,"message": result.error.details });
    }
  
    try {
      const {email,password1,password2} = req.body;
      const user_exist = await User.Is_existuser(email);
      
      if(!user_exist){
        const { firstname, lastname, nic_number, District,division, postal_Code, phone_number,address
        } = req.body;
        const approval = "Idle"
        const district = req.body.District
        const profilePicture = "https://firebasestorage.googleapis.com/v0/b/agri-mart-pid11.appspot.com/o/profilePictures%2FDefault%20profile%20picture%20green.png?alt=media&token=388b1552-9aca-451a-ab99-0e9a11985627"
        const farmer = await Farmer.create({ firstname, lastname, nic_number, district,division, postal_Code, phone_number,approval,address,profilePicture });
        const typeId = farmer._id;
        const password = password1;
        const userType = "farmer";
        const user = await User.create({email,password,userType,typeId,});
        return res.json({ success: true, message: 'successfully registered',farmer:farmer })
      }else{
        return res.json({ success: false,"message": [{"message":"User already exists...","path": ["email"]}]  })
      }
  
      } catch (err) {
        console.log(err.message);
        return res.json({ success: false,"message":[{"message":"User already exists...","path": ["email"]}]   });
      }
  }

const getProducts = async (req,res) =>{
  const {_id} = req.body;
  const products = await Item.find({ farmerID:_id });
  if(products){
    const OrderCounts=[]
    for(let x=0;x<products.length;x++){
      const item = products[x]
      const count = await Order.find({ itemId:item._id }).count();
      OrderCounts.push(count)
    }
    return res.json({ success: true, message: 'Getting farmer items is success',Items:products,countList:OrderCounts })
  }else{
    return res.json({ success: false, message: 'Getting farmer items is failed'})
  }
}

const addItem = async(req,res)=>{
  const fData = req.body.data
  var bid="0"
  if(req.body.IsBid){
    bid="1"
  }
  const bPeriod = fData.bidPeriodD*60*60*24
  const dateObject = new Date()
  const StringDate = dateObject.toString()
  const NewItem = {name:fData.name, Desc:fData.Desc, bid:bid, farmerID:req.body.farmerID, bidPeriod:bPeriod, price:fData.price, category:fData.category, availableAmount:fData.availableAmount, unit:fData.unit,img:[],postedDate:StringDate}
  const item = await Item.create(NewItem);
  console.log("BackEnd",item)
  if(item){
    if(req.body.IsBid){
      const bidObject = await Bid.create({bidValues:[], buyers:[], itemName:fData.name, itemId:item._id, farmerId:req.body.farmerID});
      console.log("bidObject;;; ",bidObject)
      if(bidObject){
        return res.json({ success: true, message: 'Successfully Add an item to the market and started the bidding auction!', NewItem:item})
      }
      return res.json({ success: true, message: 'Successfully Add an item and to the market but error in bidding auction!', NewItem:item})
    }
    return res.json({ success: true, message: 'Successfully Add an item', NewItem:item})
  }else{
    return res.json({ success: false, message: 'Adding item is failed'})
  }
}

const deleteItem = async(req,res)=>{
  const ItemID = req.body.itemId
  console.log("Item Id to Delete::::::::: ",ItemID)
  const deletedItem = await Item.deleteOne( { _id: ItemID });
  const deletedBidding = await Bid.deleteOne( { itemId: ItemID });

  if(deletedItem.acknowledged){
    return res.json({ success: true, message: 'Successfully delete the item'})
  }else{
    return res.json({ success: false, message: 'Delete item failed' })
  }
}

const updateItem = async(req,res)=>{
  const ItemID = req.body.itemId
  const fData = req.body.data
  const IsBiding = req.body.IsBiding
  var bPeriod = "Nan"
  if(IsBiding){
    bPeriod = (fData.bidPeriodD*60*60*24)
  }
  const NewItem = {name:fData.name, Desc:fData.Desc, bidPeriod:bPeriod, price:fData.price, category:fData.category, availableAmount:fData.availableAmount, unit:fData.unit}
  const updatedItem = await Item.updateOne( { _id: ItemID },{$set: NewItem, $currentDate: {lastModified:true} });
  const updatedBidItem = await Bid.updateOne( { itemId: ItemID },{$set: {itemName:fData.name}, $currentDate: {lastModified:true} });
  if(updatedItem.acknowledged){
    return res.json({ success: true, message: 'Successfully update the item'})
  }else{
    return res.json({ success: false, message: 'Update item failed' })
  }
}

const updateItemImage = async(req,res)=>{
  const URL = req.body.URL
  const ItemID = req.body.ItemId
  const item = await Item.findOne({_id:ItemID});
  if(item){
    var imgArray = item.img
    if(imgArray){
      imgArray.push(URL)
    }else{
      imgArray=[]
      imgArray.push(URL)
    }
    const updatedItem = await Item.updateOne( { _id: ItemID },{$set: {img: imgArray}, $currentDate: {lastModified:true} });
    if(updatedItem.acknowledged){
      return res.json({ success: true, message: 'Successfully add an image to the item'})
    }else{
      return res.json({ success: false, message: 'Adding an image to the item is failed @ 2' })
    }
  }else{
    return res.json({ success: false, message: 'Adding an image to the item is failed @ 1'})
  }
}

const getFarmer = async (req,res)=>{
  const _id = req.body._id
  const farmer = await Farmer.findOne({ _id:_id});
  if(buyer){
    res.json({ farmer:farmer,"message": "Farmer getting failed",success: true });
  }else{
    res.json({ "message": "Farmer getting failed",success: false });
  }
}

module.exports = {
    farmerRegister,
    getProducts,
    addItem,
    deleteItem,
    updateItem,
    updateItemImage,
    getFarmer
}