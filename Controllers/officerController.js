const jwt = require("jsonwebtoken");
const Farmer = require("../Models/farmerModel");
const Officer = require("../Models/officerModal");
const User = require("../Models/authModel");

const getfarmers = async (req,res)=>{
    const officerId = req.params.officerId;
    const officer_a = await Officer.findOne( { _id: officerId } );

    if(officer_a.prime_officer==="true"){
        const farmers_list = await Farmer.find();
        if(farmers_list){
            return  res.status(200).json({  "farmers":farmers_list})
        }else{
            return  res.status(400).json({ "message": "Officer not found"})
        }
    }else{
        if (officer_a) {
            const farmers_list = await Farmer.find( { district: officer_a.district , division:officer_a.division} );
            if(farmers_list){
                return  res.status(200).json({  "farmers":farmers_list})
            }else{
                return  res.status(400).json({ "message": "Officer not found"})
            }
        }else{
            return  res.status(400).json({ "message": "Officer not found"})
        }
    }
}

const getofficer = async (req,res)=>{
    const officerId = req.params.officerId;
    const user = await Officer.find( { _id: officerId } );
    if (user) {
        return  res.status(200).json({ "OfficerID": officerId,"officer":user})
    }else{
        return  res.status(400).json({ "message": "Officer not found"})
    }
}

const verifyFarmer = async (req,res) =>{
    const {officer,approval,_id} = req.body;
    console.log("post req officer approval id: ",officer,approval,_id);
    //const user_exist = await User.Is_existuser(_id);
    const user_exist = true;
    const farmer = await Farmer.updateOne( { _id:_id },{ $set:{officer:officer,approval:approval}, $currentDate: {lastModified:true}} )
    console.log("updated farmer: ",farmer);
    res.status(201).json({ "message":`successfully ${approval}` });
}

module.exports = {
    getfarmers,
    getofficer,
    verifyFarmer
}