const User = require("../models/User");
const CryptoJS = require('crypto-js');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');




// getUser fnx :: Get method  :: Access
const getUser = asyncHandler(async (req, res) => {
    try {
        // find user by id
        const user = await User.findById(req.params.id)

        // destructuring
        const { password, ...others } = user._doc;

        // excluding the password
        res.status(200).json(others);
    } 
    catch (error) {
        res.status(500).json(error)
    }
})


// updateUsers fnx :: PUT method  :: Access
const updateUser = asyncHandler(async (req, res) => {
    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(
                req.body.password,
                process.env.PASS_SECRET
            ).toString();
        }
        

        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { $set: req.body,},
                { new: true }
            );
           
            const accessToken = jwt.sign(
                {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    isAdmin: updatedUser.isAdmin,
                },
                process.env.JWT_SECRET,
                {expiresIn: '3d'}
            )

            const { ...others } = updatedUser._doc;

            res.status(200).json({ ...others, token: accessToken, });
            
        } 
        catch (error) {
            res.status(500).json(error)
        }
    }
    else {
        res.status(404).send({ message: 'User not found' });
    }
    
})


// deleteUsers fnx :: DELETE method  :: Access
const deleteUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.remove();
            res.send({ message: 'User Deleted' });
        } else {
            res.status(404).send({ message: 'User Not Found' });
        }
    } 
    catch (error) {
        res.status(500).json(error)
    }
})


module.exports = {
    updateUser,
    deleteUser,
    getUser,
    /*login,
    register*/
}
