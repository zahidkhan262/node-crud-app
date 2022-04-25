const express = require('express');
const router = express.Router()

router.get('/', (req, res) => {
    res.send("hello Node js")
});

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        res.status(422).json({ error: "please fill all fields" })
    }
    res.json({ message: "Successfully Posted Data" })
})

module.exports = router;