const express = require('express');
require('dotenv').config()
const userDo = require('./modules/userDo.js');
const {usersignUp, usersingIn} = require('./modules/usersign');
const cors = require('cors')
const multer = require('multer');
const path = require('path');
const connectDB = require('./modules/db/connect');
const errorHandlerMiddleware = require('./middleware/errorHandler');
const userDoRoutes = require('./routes/userDoRoutes');

const app = express();
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use(cors()); 
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use('/' , express.static(path.join(__dirname, 'modules/data/uploaded_images')) )

app.use(errorHandlerMiddleware);

// function formdataToJSON(req, res, next){
//     req.body = JSON.parse(req.body.document);
//     next();
// }


app.post("/api/commerce/signin", usersingIn);
app.post("/api/commerce/signup", usersignUp);

app.use('/api/commerce', userDoRoutes);



app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });



const PORT= process.env.PORT || 3001;


const start = async () => {
    try {
      // connectDB
        await connectDB(process.env.DB_URL, {dbName: process.env.dbName})
        app.listen(PORT, ()=> {
            console.log(`The server is running on Port ${PORT}`);
        })
    } catch (error) {
      console.log(error)
    }
  }
  
start()

// module.exports = app;