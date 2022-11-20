const Officer = require("../Models/officerModal");
const Admin = require("../Models/adminModel");
const User = require("../Models/authModel");
const Farmer = require("../Models/farmerModel");
const Buyer = require("../Models/buyerModel");
const validate = require('../utils/validation');

const jwt = require("jsonwebtoken");


const getadmin = async (req,res)=>{
  const adminId = req.params.adminId;
  console.log("adminId",adminId);
  const user = await Admin.find( { _id: adminId } );
  if (user) {
      return  res.status(200).json({ "adminId": adminId,"admin":user})
  }else{
      return  res.status(400).json({ "message": "Officer not found"})
  }
}

const getOfficers = async (req,res)=>{
  const officers_list = await Officer.find();
  if(officers_list){
      return  res.status(200).json({  "officers":officers_list})
  }else{
      return  res.status(400).json({ "message": "Officer not found"})
  }
}

const getUserDetails = async (req,res)=>{
  const buyersCount = await Buyer.count();
  const farmersCount = await Farmer.count();
  const officersCount = await Officer.count();
  const primeOfficersCount = await Officer.find( { prime_officer: "true"} ).count();
  const primeofficerPerc = Number(((primeOfficersCount/officersCount)*100).toFixed(1))
  const userDetails = {"farmerCount":farmersCount,"buyersCount":buyersCount,"officersCount":officersCount,"primeofficerPerc":primeofficerPerc}

  if(buyersCount && farmersCount && officersCount && primeOfficersCount){
      return  res.status(200).json({  "userDetails":userDetails})
  }else{
      return  res.status(400).json({ "message": "Officer not found"})
  }
}

const convertOfficers = async (req,res) =>{
  const {officerType,officer} = req.body;
  console.log("post req officer approval id: ",officer,officerType);
  //const user_exist = await User.Is_existuser(_id);
  const user_exist = true;
  const farmer = await Officer.updateOne( { _id:officer },{ $set:{prime_officer:officerType}, $currentDate: {lastModified:true}} )
  console.log("updated farmer: ",farmer);
  res.status(201).json({ "message":`successfully converted` });
}

const registerOfficer = async (req,res)=>{
  console.log("registering data: ",req.body);
  const {password1,password2} = req.body;

  //Validation
  if(password1!==password2){
    return res.status(401).json({ "message": `Passwords are not matching` });
  }
  const result = validate.register_vaidation(req.body);
  if (result?.error) {
      console.log("error :", result.error);
      return res.status(400).json({
          "message": result.error.details
      });
  }

  try {
    const {email,password1,password2} = req.body;
    const user_exist = await User.Is_existuser(email);
    
    if(!user_exist){
      const { firstname, lastname, birthday, nic_number, district,division, postal_Code, phone_number,prime_officer 
      } = req.body;
      const profilePicture = "https://firebasestorage.googleapis.com/v0/b/agri-mart-pid11.appspot.com/o/profilePictures%2FDefault%20profile%20picture%20green.png?alt=media&token=388b1552-9aca-451a-ab99-0e9a11985627"
      const officer = await Officer.create({ firstname, lastname, birthday, nic_number, district,division, postal_Code, phone_number,prime_officer,profilePicture });
      const typeId = officer._id;
      const password = password1;
      const userType = "officer";
      const user = await User.create({email,password,userType,typeId,});
      res.status(201).json({ "message":`successfully registered` });
    }else{
      return res.status(402).json({ "message": `User already exists...` });
    }

    } catch (err) {
      console.log(err.message);
      res.status(500).json({ "message": "Internal server error" });
    }
}

module.exports = {
    registerOfficer,
    getadmin,
    getOfficers,
    convertOfficers,
    getUserDetails
}