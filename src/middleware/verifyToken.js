const jwt = require("jsonwebtoken");
const client = require("../config/redis");
const asyncHanle = require("./asyncHandle");

//VERIFY ACCESS TOKEN
const verifyAccessToken = asyncHanle(async (req, res, next) => {
    const token = req.headers.token;
    if (token) {
        const accessToken = token.split(" ")[1];
        jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, user) => {
            if (err) {
                return res.status(403).json("Token is not valid");
            }
            req.userId = user.userId;
            req.role = user.role;
            next();
        });
    } else {
        res.status(401).json("You're not authenticated!");
    }
});

//VERIFY REFESH TOKEN
const verifyRefeshToken = asyncHanle(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(401).json("You're not authenticated");

    try {
        const decodeRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

        const userId = decodeRefreshToken.userId;

        client.get(userId.toString(), (err, redisClientRefreshToken) => {
            if (err) {
                return res.status(500).json(err.message);
            }
            console.log(redisClientRefreshToken);
            // simple validate redisClientRefreshToken
            if (!redisClientRefreshToken) {
                return res.status(401).json("Refresh token not found in redis");
            }

            // compare refreshToken vs redisClientRefreshToken
            if (refreshToken !== redisClientRefreshToken) {
                return res.status(401).json("Refresh token not match with redis refresh token");
            }

            req.userId = userId;

            next();
        });
    } catch (error) {
        return res.status(401).json(error);
    }
});

module.exports = { verifyAccessToken, verifyRefeshToken };
