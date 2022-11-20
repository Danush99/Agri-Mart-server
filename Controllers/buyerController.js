const jwt = require("jsonwebtoken");
const Farmer = require("../Models/farmerModel");
const Buyer = require("../Models/buyerModel");
const Officer = require("../Models/officerModal");
const MarketPlace = require("../Models/marketPlaceModal");
const User = require("../Models/authModel");
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

const BuyerRegister = async (req,res)=>{
    console.log("registering data: ",req.body);
    const {password1,password2} = req.body;
  
    //Validation
    if(password1!==password2){
      return res.json({ "message": [
        {"message": "Passwords are not matching","path": ["password1"]},
        {"message": "Passwords are not matching","path": ["password2"]},
    ] });
    }
    const result = validate.buyer_register_vaidation(req.body);
    if (result?.error) {
        console.log("error :", result.error);
        return res.json({success: false,"message": result.error.details });
    }
  
    try {
      const {email,password1,password2} = req.body;
      const user_exist = await User.Is_existuser(email);
      
      if(!user_exist){
        const { firstname, lastname, phone_number
        } = req.body;
        const approval = "Idle"
        const district = req.body.District
        const profilePicture = "https://firebasestorage.googleapis.com/v0/b/agri-mart-pid11.appspot.com/o/profilePictures%2FDefault%20profile%20picture%20green.png?alt=media&token=388b1552-9aca-451a-ab99-0e9a11985627"
        const buyer = await Buyer.create({ firstname, lastname, phone_number,profilePicture });
        const typeId = buyer._id;
        const password = password1;
        const userType = "buyer";
        const user = await User.create({email,password,userType,typeId,});
        return res.json({ success: true, message: 'successfully registered',buyer:buyer })
      }else{
        return res.json({ "message": `User already exists...`,success: false })
      }
  
      } catch (err) {
        console.log(err.message);
        return res.json({ "message": "Internal server error",success: false });
      }
  }

  const getBuyer = async (req,res)=>{
    const _id = req.body._id
    const buyer = await Buyer.findOne({ _id:_id});
    if(buyer){
      res.json({ buyer:buyer,"message": "Buyer getting failed",success: true });
    }else{
      res.json({ "message": "Buyer getting failed",success: false });
    }
  }

module.exports = {
    BuyerRegister,
    getBuyer
}