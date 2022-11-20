// helpers
//const prisma = require('../config/client');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const validate = require('../utils/validation');
const token = require('../utils/token');
const jwt = require('jsonwebtoken');
const User = require("../Models/authModel");
const Farmer = require("../Models/farmerModel");
const Buyer = require("../Models/buyerModel");
const Officer = require("../Models/officerModal");
const Bid = require("../Models/biddingModel");

// functions 
const loginData_Compare = async (email,password) => {
    const user = await User.findOne({ email });
    const compareData = {obj:"",msg:"",status:""}
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      //console.log("line 17: ",auth)
      if (auth) {
        compareData.obj=user;
        compareData.status=200;
        compareData.msg="success";
        return compareData;
      }
      compareData.obj=false;
      compareData.status=402;
      compareData.msg=`The password that you've entered is incorrect.`;
      return compareData;
    }
    compareData.obj=false;
    compareData.status=401;
    compareData.msg=`The email address you entered isn't connected to an account.`;
    return compareData;
  };

const handleLogin = async (req, res) => {
    console.log(req.body);
    const { email, password, userType ,mobile} = req.body; 
    const validation = validate.login_validation({ email, password });
    if (validation.error) {
        if(mobile){
            return res.json({
                "message": validation.error.details,"success":false
            });
        }else{
            return res.status(400).json({
                "message": validation.error.details,"success":false
            });
        }
    }

    //----------Tried to use "prisma" ::::
    // const auth = await Officer.login(email, password);
    // if (!auth) {
    //     return res.status(404).json({ "message": `User :${email} does not exist...` });
    // }
    //const authObject = await getAuthObject(auth);
    // const result = await prisma.Auth.update({
    //     where: {
    //         id: user_id
    //     },
    //     data: {
    //         refresh_token,
    //         logged_at: new Date()
    //     }
    // });
    // console.log(result)

    // const auth = User.login(email, password);
    // const access_token = token.getAccessToken(auth);
    // const refresh_token = token.getRefreshToken(auth);
    // res.cookie('jwt', refresh_token, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
    // return res.status(200).json({
    //     "message": "Login successful",
    //     "access_token": access_token,
    //     "user_type":auth.userType,
    //     "user_Id":auth._id
    // });

    //------------- login
    const compareData = await loginData_Compare(email,password);
    if(!compareData.obj){
        console.log("compareData : ",compareData);
        if(mobile){
            return  res.json({ "message": [
                {"message": compareData.msg,"path": [compareData.status==402?"password":"email"]},
            ] })
        }else{
            return  res.status(compareData.status).json({ "message": compareData.msg,"success":false})
        }
    }else{
        const auth = compareData.obj;
        console.log("author is :",auth);
        const access_token = token.getAccessToken(auth);
        const refresh_token = token.getRefreshToken(auth);
        res.cookie('jwt', refresh_token, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        if(mobile){
            return res.json({
                "message": "Mobile Login successful",
                "access_token": access_token,
                "user_type":auth.userType,
                "user_Id":auth._id,
                "user":auth,
                "success":true
            });
        }else{
            return res.status(200).json({
                "message": "Browser Login successful",
                "access_token": access_token,
                "user_type":auth.userType,
                "user_Id":auth._id,
                "user":auth,
                "success":true
            });
        }
    }
}

const handleLogout = async (req, res) => {
    // const { user_id } = req.body;
    const cookies = req.cookies;
    console.log("cookiee value :", cookies);

    if (!cookies?.jwt) {
        return res.status(204).json({ "message": "No token found" });
    }

    const refresh_token = cookies.jwt;

    const auth = await prisma.Auth.findUnique({
        where: {
            refresh_token
        }
    })

    if (!auth) {
        return res.status(404).json({ "message": `User does not exist...` });
    }

    const result = await prisma.Auth.update({
        where: {
            refresh_token
        },
        data: {
            refresh_token: null,
        }
    });

    console.log(result)

    res.clearCookie('jwt');
    return res.status(200).json({
        "message": "Logout successful",
    });
}

const uploadProfilePic = async (req,res)=>{
    const {userType,userID,imgUrl} = req.body
    if(userType=="farmer"){
        const farmer = await Farmer.updateOne( { _id: userID },{$set: {proPicUrl: imgUrl}, $currentDate: {lastModified:true} });
        // const farmer = await Farmer.updateOne( { _id:_id },{ $set:{officer:officer,approval:approval}, $currentDate: {lastModified:true}} )
        if(farmer.acknowledged){
            return res.json({ success: true, message: 'successfully uploaded profile picture' })
        }else{
            return res.json({ "message": "upload failed",success: false })
        }
    }else if(userType=="buyer"){
        const buyer = await Buyer.updateOne( { _id: userID },{$set: {proPicUrl: imgUrl}, $currentDate: {lastModified:true} });
        if(buyer.acknowledged){
            return res.json({ success: true, message: 'successfully uploaded profile picture' })
        }else{
            return res.json({ "message": "upload failed",success: false })
        }
    }else if(userType=="officer"){
        const officer = await Officer.updateOne( { _id: userID },{$set: {proPicUrl: imgUrl}, $currentDate: {lastModified:true} });
        if(officer.acknowledged){
            return res.json({ success: true, message: 'successfully uploaded profile picture' })
        }else{
            return res.json({ "message": "upload failed",success: false })
        }
    }
}

const updateProfile = async (req,res)=>{
    const {district,_id} = req.body
    if(district){
        const farmer = await Farmer.updateOne( { _id: _id },{$set: req.body , $currentDate: {lastModified:true} });
        if(farmer.acknowledged){
        const newFarmer = await Farmer.findOne( { _id: _id });
            return res.json({ success: true, message: 'profile updating is success',user:newFarmer })
        }else{
            return res.json({ "message": "profile updating req failed",success: false })
        }
    }else{
        const buyer = await Buyer.updateOne( { _id: _id },{$set: req.body , $currentDate: {lastModified:true} });
        if(buyer.acknowledged){
            const newBuyer = await Buyer.findOne( { _id: _id });
            return res.json({ success: true, message: 'profile updating is success',user:newBuyer })
        }else{
            return res.json({ "message": "profile updating req failed",success: false })
        }
    }
}

const getProfile = async (req,res)=>{
    const {userType,typeId} = req.body
    //const {userType,typeId} = {"userType":"farmer","typeId":"633387f60ccdcbe5404f3690"}
    console.log("need backend data for. ",userType,typeId)
    if(userType=="farmer"){
        const farmer = await Farmer.findOne( { _id: typeId });
        // const farmer = await Farmer.updateOne( { _id:_id },{ $set:{officer:officer,approval:approval}, $currentDate: {lastModified:true}} )
        if(farmer){
            console.log("here we go again: ",farmer)
            return res.json({ success: true, message: 'profile getting is success',user:farmer })
        }else{
            return res.json({ "message": "profile getting req failed",success: false })
        }
    }else if(userType=="buyer"){
        const buyer = await Buyer.findOne( { _id: typeId });
        if(buyer){
            return res.json({ success: true, message: 'profile getting is success',user:buyer })
        }else{
            return res.json({ "message": "profile getting req failed",success: false })
        }
    }else if(userType=="officer"){
        const officer = await Officer.findOne( { _id: typeId });
        if(officer){
            return res.json({ success: true, message: 'profile getting is success',user:officer })
        }else{
            return res.json({ "message": "profile getting req failed",success: false })
        }
    }else{
        return res.json({ "message": "profile getting req failed",success: false })
    }
}

const GetBiddings = async (req,res) =>{
    const _id = req.body._id;
    console.log("ID-------------->",_id)
    const UserType = req.body.UserType;
    if(UserType=="farmer"){
        const biddings = await Bid.find({ farmerId:_id });
        if(biddings){
            return res.json({ success: true, message: 'Getting biddings is success', biddings:biddings})
        }else{
            return res.json({ success: false, message: 'Getting biddings  is failed'})
        }
    }else if(UserType=="buyer"){
        const biddings = await Bid.find({ buyers:{$all: [_id]} });
        console.log("Biddings:::",biddings)
        if(biddings){
            return res.json({ success: true, message: 'Getting biddings is success', biddings:biddings})
        }else{
            return res.json({ success: false, message: 'Getting biddings is failed'})
        }
    }
  }


module.exports = {
    handleLogin,
    handleLogout,
    uploadProfilePic,
    getProfile,
    updateProfile,
    GetBiddings
}

