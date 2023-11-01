const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const protectLogin = require('../middleware/protectLogin')
const Jwt_Token = require('../keys/keys');



//jwt authentication


//token

const generateJWTToken = (user) => {
    // const tokenExpirationTime = Math.floor(Date.now() / 1000) + expiresIn;
    return jwt.sign({ ...user.toJSON() }, process.env.ACCESS_SECRET_KEY, { expiresIn: '15m' })
}

// refresh token

const generateRefreshToken = (user) => {
    return jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY, { expiresIn: '24h' })
}

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)

    return await bcrypt.hash(password, salt)
}

const verifyHashPassword = async (password, userPassword) => {
    return await bcrypt.compare(password, userPassword)
}



const logoutUser = async (request, response) => {
    const token = request.body.token;
    await Token.deleteOne({ token: token });

    response.status(204).json({ msg: 'logout successfull' });
}



const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Token = require('../models/token-model');


const authMiddleware = asyncHandler(async (req, res, next) => {

    let authHeader = req.headers['authorization']

    const token = authHeader && authHeader.split(' ')[1]
    // console.log(token, 'token')
    if (token == null) {
        return res.status(401).json({ msg: 'token is missing' });
    }

    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (error, user) => {
        if (error) {
            return res.status(403).json({ msg: 'Invalid token' })
        }
        req.user = user;
        // console.log(req.user, "user token")
        next()

    })
});


const createNewToken = asyncHandler(async (req, res) => {
    const refreshToken = req.body.token.split(' ')[1];
    console.log(refreshToken, "refreshToken")

    if (!refreshToken) {
        return res.status(401).json({ msg: 'Refresh token is missing' })
    }

    const token = await Token.findOne({ token: refreshToken });

    if (!token) {
        return res.status(404).json({ msg: 'Refresh token is not valid' });
    }

    jwt.verify(token.token, process.env.REFRESH_SECRET_KEY, (error, user) => {
        if (error) {
            res.status(500).json({ msg: 'invalid refresh token' });
        }

        const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_KEY, { expiresIn: '15m' });
        return res.status(200).json({ accessToken: accessToken })
    })

})

module.exports = { authMiddleware, createNewToken }



// crud for blog app
const Blog = require('../../models/blogs-model');
const asyncHandler = require('express-async-handler')
const User = require('../../models/auth-model');

//create blog api

const createBlog = asyncHandler(async (req, res) => {
    try {
        const blog = await new Blog(req.body);
        if (!blog) {
            return res.status(401).json({ message: "Failed to update user!! or blog not found" })
        }
        blog.save();
        res.status(200).json({ message: 'Blog saved successfully' });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})


//get all blog api

const getAllBlog = asyncHandler(async (req, res) => {
    try {
        const blogs = await Blog.find({});
        return res.status(200).json(blogs)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

//get single blog
const getBlogById = asyncHandler(async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        return res.status(200).json(blog);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

const updateBlog = asyncHandler(async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        if (!blog) {
            return res.status(401).json({ message: 'Blog not found!' })
        }
        await Blog.findByIdAndUpdate(req.params.id, { $set: req.body });
        return res.status(200).json({ message: 'Blog successfully Updated' });
    } catch (error) {
        return res.status(500).json({ message: error.message })

    }
})
const deleteBlog = asyncHandler(async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        if (!blog) {
            return res.status(401).json({ message: 'Blog not found!' })
        }
        await blog.delete();
        return res.status(200).json({ message: 'Blog successfully Deleted' });
    } catch (error) {
        return res.status(500).json({ message: error.message })

    }
})





module.exports = { createBlog, getAllBlog, getBlogById, updateBlog, deleteBlog }

//model for blog
const mongoose = require('mongoose');

const blogsSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments'
    }],
},
    {
        timestamps: true
    })


module.exports = mongoose.model('Blogs', blogsSchema)



// contact us code...
app.use('/api/auth', require('./routes/auth/auth-route')); //erver.js file..

router.post('/contact-us', contactUsAPI); // route file..
//  contact us

const contactUsAPI = asyncHandler(async (req, res) => { // controller file ..
    try {
        const { username, email, message } = req.body;

        console.log(username, email, message)

        transporter.sendMail(mailOptionContactFn(username, message, email), (error, info) => {
            if (error) {
                console.log("errr", error.message);
            } else {
                console.log("Mail has been sent on: ", email, info.response)
                res.status(200).json({ success: true, message: "Email sent successfully" });
            }
        })

    } catch (error) {
        res.status(500).json({ message: "An error occured while sending mail!" })

    }
})


//config file for nodemailer setup
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    requireTLS: true,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_EMAIL_PASSWORD
    }
});

const mailOptionResetPassFn = (username, email) => {
    return {
        from: process.env.USER_EMAIL,
        to: email,
        subject: "Reset Password!!",
        html: `<p>To reset your password,${username} please click or copy the following link: <a href="http://localhost:8000/api/auth/reset-password?email=${email}">link</a> and reset the password</p>`
    }
}
const mailOptionContactFn = (username, message) => {
    const subject = "Contact Us"
    return {
        from: process.env.USER_EMAIL,
        to: email,
        subject: subject,
        html: `<p>Username: ${username}\nSubject: ${subject}\nMessage: ${message}</p>`
    }
}



module.exports = { transporter, mailOptionResetPassFn, mailOptionContactFn }









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
// email send for otp
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
