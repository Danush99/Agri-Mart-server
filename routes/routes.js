const express = require('express');
const router = express.Router();
const {
    validateUserSignUp,
    userVlidation,
    validateUserSignIn,
  } = require('../utils/mobileAppValidation');
const adminCont = require('../Controllers/adminController');
const authController = require('../Controllers/authController');
const offCont = require('../Controllers/officerController');
const marketController = require('../Controllers/marketController')
const farmerController = require('../Controllers/farmerController')
const buyerController = require('../Controllers/buyerController')

const verifyRoles = require('../Middlewares/verifyRoles');
const verifyJWT = require('../Middlewares/verifyJWT');

//WEB



// router.post("/", checkUser); 
// router.post("/admin/register", adminCont.registerOfficer);
// router.post("/login", login);

router
    .post('/', authController.handleLogin)
    .post("/admin", verifyJWT,adminCont.registerOfficer)
    .post("/admin/register", adminCont.registerOfficer)
    .get("/admin/getOfficers", adminCont.getOfficers)
    .get("/admin/getUserStats", adminCont.getUserDetails)
    .post("/admin/convertOfficer", adminCont.convertOfficers)
    .post("/officer/farmerVerify", offCont.verifyFarmer)
    .get("/officer/farmerbio/:officerId", offCont.getfarmers)
    .get("/officer/:officerId", offCont.getofficer)
    .get("/admin/:adminId", adminCont.getadmin)
    .get('/logout', authController.handleLogout)
    //.post('/register', verifyJWT, verifyRoles(process.env.ADMIN_ROLE), authController.handleNewUser)
    // .get('/new-token', authController.handleNewAccessToken)
    // .get('/user-types', verifyJWT, verifyRoles(process.env.ADMIN_ROLE), authController.getUserTypes);
    .get("/market/getItems", marketController.getItems) //Mobile Routes
    .post("/auth/registerFarmer",farmerController.farmerRegister)
    .post("/auth/registerBuyer",buyerController.BuyerRegister)
    .post("/auth/login",authController.handleLogin)
    .post("/user/proPicUpload",authController.uploadProfilePic)
    .post("/user/getProfile",authController.getProfile)
    .post("/user/updateProfile",authController.updateProfile)
    .post("/farmer/getProducts",farmerController.getProducts)
    .post("/user/getBiddings",authController.GetBiddings)
    .post("/farmer/addItem",farmerController.addItem)
    .post("/farmer/deleteItem",farmerController.deleteItem)
    .post("/farmer/updateItem",farmerController.updateItem)
    .post("/farmer/updateItemImg",farmerController.updateItemImage)
    .post("/market/directBuy",marketController.directBuy)
    .post("/market/bidOrder",marketController.bidOrder)
    .post("/buyer/getBuyer",buyerController.getBuyer)
    .post("/buyer/getFarmer",farmerController.getFarmer)
    .post("/market/orders",marketController.getOrders)

    

module.exports = router;
//officer/farmerVerify
///user/updateProfile