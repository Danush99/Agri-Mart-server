const mongoose = require('mongoose');
const  uri = process.env.ATLAS_URI
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('AgriMart db is connected');
  })
  .catch(err => console.log(err.message));
