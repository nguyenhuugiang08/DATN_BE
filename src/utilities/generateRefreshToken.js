const jwt = require("jsonwebtoken");
const client = require("../config/redis");

const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign(
        {
            userId: user._id,
            role: user.role,
        },
        process.env.REFRESH_TOKEN,
        {
            expiresIn: "365d",
        }
    );

    const userId = user._id || user.userId;

    client.set(userId.toString(), refreshToken, (err) => {
        if (err) {
            return res.status(400).json(err);
        }
        console.log("Stored refreshToken");
    });

    return refreshToken;
};

module.exports = generateRefreshToken;
