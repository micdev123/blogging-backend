const jwt = require('jsonwebtoken')


const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
};


// verify token
const verifyToken = (req, res, next) => {
    // Target requester header token
    const requesterHeader = req.headers.token;

    // Checking if available
    if(requesterHeader) {
        // split and get the token value
        const token = requesterHeader.split(" ")[1];

        // verify
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err) {
                res.status(403).json({message: "Invalid token!"})
            }
            else {
                req.user = user;
                // console.log(user);
                next();
            }
        })
    }
    else {
        res.status(401).json({message: "Unauthorized!"})
    }
}

const authorizedToken = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user._id === req.params._id) {
            // console.log("yah");
            next();
        }
        else {
            res.status(403).json({message: "Unauthorized"})
        }
    })
}

module.exports = {
    generateToken,
    verifyToken,
    authorizedToken,
}