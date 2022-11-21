const express = require("express");
require('dotenv').config();
require('./db');
const userRouter = require('./routes/routes');
const app = express();
app.use(express.json());
app.use(userRouter);
const port = process.env.PORT || 5000;




// const bodyParser = require('body-parser');
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// // app.use(
// //     cors({
// //       origin: ["exp:/test/192.168.43.113:19000"],
// //       methods: ["GET", "POST"],
// //       credentials: true,
// //     })
// //   );
// app.use(cors());
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser());
// app.use(express.json());



app.get('/test', (req, res) => {
    res.json({ success: true, message: 'Welcome to backend zone!',items:"items nane mahattayoo" });
});
  
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Welcome to backend zone!' });
});
  
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});



