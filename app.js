const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MONGOURI } = require('./keys/keys');
const PORT = 7000;

mongoose.connect(MONGOURI)
mongoose.connection.on('connected', () => {
    console.log('connected to data base');
})
mongoose.connection.on('error', (err) => {
    console.log("Getting error", err)
})


// const customeMiddleWare = (res, req, next) => {
//     console.log("middleware")
//     next()
// }

// app.use(customeMiddleWare)

app.get('/', (res, req) => {

    res.send('hello world')
    res.end("end program")
    console.log("zahid khan")
});
// create middle for about so inclide as second parameter in app.get
// app.get('/about', customeMiddleWare, (res, req) => {
//     console.log("zahid khan")
//     res.send('My name is Zahid khan I am frontend React js developer')
// })

app.listen(PORT, () => {
    console.log(`server is live on this port...${PORT}`)
})