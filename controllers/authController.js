const asyncHandler = require('express-async-handler');
const CryptoJS = require('crypto-js');
const User = require('../models/User');
const { generateToken } = require('../middleware/authMiddleware');



// Create user :: Email Login
const registerUser = asyncHandler(async (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        // using crypto-js:: hashing password
        password: CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASS_SECRET
        ).toString(),
        userUrl: req.body.userUrl
    });

    // Saving user in database
    try {
        const savedUser = await newUser.save();

        const { ...others } = savedUser._doc;

        // Sending the following if status code == 200
        res.status(200).json({ ...others, accessToken: generateToken(savedUser) })
    } 
    catch (error) {
        res.status(500).json(error)
    }
   
})


// Login User
const loginUser = asyncHandler(async (req, res) => {
    try {
        // finding user in database
        const user = await User.findOne({ email: req.body.email })

        // If user not found
        !user && res.status(401).json({message: "Wrong credentials"})

        // decrypting password
        const decryptPassword = CryptoJS.AES.decrypt(
            user.password, 
            process.env.PASS_SECRET
        ).toString(CryptoJS.enc.Utf8);

        // If after decrypting the password but doesn't match the inputed password return this
        decryptPassword !== req.body.password && res.status(401).json({message: "Wrong credentials"})

        // destructuring
        const { password, ...others } = user._doc; // ._doc is used with a document

        // If everything is correct return everything else except password
        res.status(200).json({...others, accessToken: generateToken(user)})
    } 
    catch (error) {
        res.status(500).json(error)
    }
})


module.exports = {
    registerUser,
    loginUser
}

