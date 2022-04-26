const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const Jwt_Token = require('../keys/keys');
const protectLogin = require('../middleware/protectLogin')





// get method for print hello node js as default routes
router.get('/', (req, res) => {
    res.send("hello Node js")
});

// protected router
router.get('/protected', protectLogin, (req, res) => {
    res.send("hello User")
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
            bcrypt.hash(password, 6)
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
                        return res.status(422).json({ error: "Invalid email or password" })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        })
})

module.exports = router;
