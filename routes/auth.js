const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const protectLogin = require('../middleware/protectLogin')
const Jwt_Token = require('../keys/keys');



router.post('/send-email', function (req, res) {
    email = req.body.email;
    const userData = User.findOne({email:email})
    if(!userData) return res.status(422).json({ error: "the email id is  not  exist!!" })

    var mailOptions = {
        to: req.body.email,
        subject: "Otp for registration is: ",
        html: `<html>
                    <h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>"${otp}</h1>
                </html>`
    };
    transporter.sendMail(mailOptions, (error, res) => {
        if (error) {
            return console.log(error);
        }
      
    });
});



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




// new++++
// email send
router.post('/email-send', async(req, res)=>{
    try {
        const email = req.body.email
        const userData = await User.findOne({email:email})
        if(!userData) return res.status(422).json({ error: "the email id is  not  exist!!" })

        // generate OTP
        let otpCode = Math.floor(100000 + Math.random() * 900000)
        console.log(otpCode)

    } catch (error) {
        console.log(error)
    }
})

router.post('/reset-password',(req,res)=>{
     crypto.randomBytes(32,(err,buffer)=>{
         if(err){
             console.log(err)
         }
         const token = buffer.toString("hex")
         User.findOne({email:req.body.email})
         .then(user=>{
             if(!user){
                 return res.status(422).json({error:"User dont exists with that email"})
             }
             user.resetToken = token
             user.expireToken = Date.now() + 3600000
             user.save().then((result)=>{
                 transporter.sendMail({
                     to:user.email,
                     from:"no-replay@insta.com",
                     subject:"password reset",
                     html:`
                     <p>You requested for password reset!!!</p>
                     <h5>click here <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
                     `
                 })
                 res.json({message:"check your email"})
             })

         })
     })
})


router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save().then((saveduser)=>{
               res.json({message:"password updated success"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})


// email send for  otp

var email;

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: 'gmail',
    port: 587,
    secureConnection: false,
    auth: {
      user: 'otpverify000@gmail.com',
      pass: 'Chetu@123',
    }
});

transporter.verify((error,success)=>{
    try {
    if(error){
        console.log(error,"transporter!!!!!")
    }else{
        console.log(success,"transporter")
    }
} catch (error) {
      console.log(error,"catch")  
}
})

router.post('/send-otp', async (req, res)=>{
    try {
        email = req.body.email;
        const userData = User.findOne({email:email})
        if(!userData) return res.status(422).json({ error: "the email id is  not  exist!!" })

            const otp = Math.floor(100000 + Math.random() * 900000)
            console.log(otp,"otp")

// hash otp
        const hashedOtp =  await bcrypt.hash(otp, 12)
        const newOtpVerification = await new otpVerification({
            userId: _id,
            otp: hashedOtp,
            createAt:Date.now(),
            expireAt:Date.now + 360000,
        });

 const otpResponse = await newOtpVerification.save();


let mailOptions = {
    from: 'otpverify000@gmail.com',
    to: 'zahidk@chetu.com',
    subject: 'Verify Your OTP',
    html: `<html> 
                <h1>Hi,</h1> 
                    <br/>
                <p style="color:grey; font-size:14px">Please use the below OTP code to complete your account</p>
                    <br><br>
                <h1 style="color:orange">${otp}</h1>
                </html>`
        }

  await newOtpVerification.save();

  await transporter.sendMail(mailOptions,(err, res)=>{

  });

  res.json({
      status:"PENDING",
      message:"Your 6 digit Otp sent",
      data:{
          userId:_id,
          email,
      },
  })

    } catch (error) {
         res.json({
             status:"FAILED",
             message:error.message,
         })     
    }
})



module.exports = router
