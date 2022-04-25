const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');





// get method for print hello node js as default routes
router.get('/', (req, res) => {
    res.send("hello Node js")
});

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(422).json({ error: "please fill all fields" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "please fill all fields" })
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
})

module.exports = router;