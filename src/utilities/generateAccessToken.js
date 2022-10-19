const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role,
        },
        process.env.ACCESS_TOKEN,
        {
            expiresIn: "2d",
        }
    );
};

module.exports = generateAccessToken;
