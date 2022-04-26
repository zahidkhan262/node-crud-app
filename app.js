const express = require('express');
const { json } = require('express/lib/response');
const app = express();
const mongoose = require('mongoose');
const {MONGO_DATABASE,MONGO_PASS, MONGO_USER} = require('./keys/keys');
require('dotenv').config()

require('./models/user');

app.use(express.json())
app.use(require('./routes/auth'));



mongoose.connect(
    `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.qs4sz.mongodb.net/${MONGO_DATABASE}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    // .then(() => {
    //     console.log('Connected to database !!');
    // })
    // .catch((err) => {
    //     console.log('Connection failed !!' + err.message);
    // });




mongoose.connection.on('connected', () => {
    console.log('connected to data base');
})
mongoose.connection.on('error', (err) => {
    console.log("Getting error", err)
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("server is live on this port", PORT)
})