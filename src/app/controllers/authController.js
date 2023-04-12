const User = require("../../models/User");
const asyncHandle = require("../../middleware/asyncHandle");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateAccessToken = require("../../utilities/generateAccessToken");
const generateRefreshToken = require("../../utilities/generateRefreshToken");
const client = require("../../config/redis");
const mailer = require("../../utilities/mailer");

const authController = {
    // [POST] /auth/register
    register: asyncHandle(async (req, res) => {
        try {
            const newUser = new User(req.body);
            await newUser.save();

            bcrypt.hash(newUser.email, 10, function (error, hashedEmail) {
                if (error) {
                    return next(error);
                } else {
                    mailer.sendMail(
                        newUser.email,
                        "Xác thực tài khoản của khách hàng",
                        `<div>Xin chào ${newUser.surname} ${newUser.name}</div>
                        <div>Anh/chị đã đăng ký thành công tài khoản tại <b>EGA Style</b>.</div>
                        <div>Anh/chị vui lòng truy cập vào liên kết dưới đây để kích hoạt tài khoản của Anh/chị nhé.</div>
                        <button><a href="${process.env.APP_URL}/api/v1/user/verify?email=${newUser.email}&token=${hashedEmail}"> Verify </a></button>
                        `
                    );
                }
            });

            res.status(200).json({
                status: "success",
                message: "Register successfully",
            });
        } catch (error) {
            res.status(500).json({
                status: "failed",
                message: error.message,
            });
        }
    }),

    //[POST] /auth/login
    login: asyncHandle(async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                res.status(404).json({
                    status: "Failed",
                    message: "Wrong email",
                });
            }

            if (!user.isActive)
                return res.status(400).json({
                    status: "Failed",
                    message: "Your account is inactive!",
                });

            if (bcrypt.compareSync(req.body.password, user.password)) {
                const accessToken = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    path: "/",
                    sameSite: "strict",
                });

                const { password, ...others } = user._doc;

                res.status(200).json({
                    status: "success",
                    data: { ...others, accessToken },
                });
            } else {
                res.status(404).json({
                    status: "Failed",
                    message: "Wrong password",
                });
            }
        } catch (error) {
            res.status(500).json({
                status: "failed",
                message: error.message,
            });
        }
    }),

    // [POST] /auth/refesh
    requestRefreshToken: asyncHandle(async (req, res, next) => {
        const userId = req.userId;

        const user = await User.findById(userId);

        if (!user)
            return res.status(404).json({
                status: "failed",
                message: "User not found",
            });

        // create new acccess token and refresh token
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: "strict",
        });

        res.status(200).json({ accessToken: newAccessToken });
    }),

    //[POST] /auth/logout
    logout: asyncHandle(async (req, res, next) => {
        res.clearCookie("refreshToken");
        res.status(200).json({
            status: "success",
            message: "logged out successfully!",
        });
    }),

    //[GET] /auth
    getUsers: asyncHandle(async (req, res, next) => {
        try {
            const users = await User.find();

            res.status(200).json({
                status: "Success",
                result: users.length,
                data: {
                    users,
                },
            });
        } catch (error) {
            res.status(500).json({
                status: "failed",
                message: error.message,
            });
        }
    }),
};

module.exports = authController;
