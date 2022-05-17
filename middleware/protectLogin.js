const jwt = require('jsonwebtoken')
const { Jwt_Token } = require('../keys/keys')
const mongoose = require('mongoose')
const User = mongoose.model("User");



module.exports = (req, res, next) => {
    const { autherization } = req.headers
    if (!autherization) {
        return res.status(401).json({ error: "You must be logged in++" })
    }
    const token = autherization.replace("Bearer ", "")
    jwt.verify(token, Jwt_Token, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "you must be logged in" })
        }
        const { _id } = payload
        User.findById(_id).then(userdata => {
            req.user = userdata
        })
        next()
    })
}


// new

require('dotenv').config();
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const User = mongoose.model("User");

module.exports = async (req, res, next) => {
    const { authorization } =  req.headers
     
   await jwt.verify(authorization, process.env.JWT_SECRET, async(err, payload) => {
        if (err) {
            return res.status(401).json({ error: "You must be logged in.." })
        }
        const { _id } = payload
        const findUserData = await User.findById(_id)
        req.user = findUserData
        next()
    })

}
