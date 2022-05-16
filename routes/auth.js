const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const protectLogin = require('../middleware/protectLogin')
const Jwt_Token = require('../keys/keys');





// get method for print hello node js as default routes
router.get('/', (req, res) => {
    res.send("hello Node js")
});


// protected router
router.get('/protected', protectLogin, (req, res) => {
    res.send("hello developer")
});


// for signup
router.post('/signup', (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(422).json({ error: "please fill all fields" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "email is already exists" })
            }
            bcrypt.hash(password, 8)
                .then(hashedPassword => {
                    const user = new User({
                        email,
                        password: hashedPassword,
                        name
                    })
                    user.save()
                        .then(user => {
                            res.json({ message: "Saved successfully..." })
                        })
                        .catch(err => {
                            console.log(err, "getting errror");
                        })
                })
        })
        .catch(err => {
            console.log(err);
        })
});



// for sign In
router.post('/signin', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: 'Please fill Email and Password' })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid Email or Password" })
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        // res.json({ message: "Yeah You are successfully logged in.." })
                        const Jwt_Token = require('../keys/keys');
                        const token = jwt.sign({ _id: savedUser._id }, Jwt_Token);
                        res.json({ token })
                    } else {
                        return res.status(422).json({ error: "Invalid emailID or password" })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        })
})

module.exports = router;




// new router

const express = require('express');
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

require('dotenv').config();



router.post('/signup', async (req, res) => {
    try {

        const { firstname, lastname, email, password } = req.body

        if (!firstname || !lastname || !email || !password) {
            return res.status(422).json({ error: "Please fill all the fields" });
        }
        const userData = await User.findOne({ email: email });

        if (userData) return res.status(422).json({ error: "the email id is already exsist!!" })

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await User.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashedPassword
        })
        if (user) return res.json({
            data: user,
            message: "Saved successfully"
        })
    } catch (err) {
        console.log(err)
        res.send({
            error: err
        })
    }
})

router.post('/signin', async (req, res) => {

    try {
        const { email, password } = req.body

        if (!email && !password) {
            return res.status(422).json({ err: "Please add email and password" })
        }

        const savedUser = await User.findOne({ email: email })

        if (!savedUser) return res.status(422).json({ error: "Invalid Email or password" })

        const checkPassword = await bcrypt.compare(password, savedUser.password)

        if (!checkPassword) {
            return res.status(422).json({ error: "Invalid user name and password" })
            
        }
        else{
            const token = await jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);
            const { firstname, lastname, email, password } = savedUser;
            res.json({ token, user: { firstname, lastname, email, password }, message:"successfully signed in" })

            // res.json({message:"successfully signed in"})
        }

    } catch (err) {
        console.log(err)
        res.send({
            error: err
        })
    }

})

module.exports = router
