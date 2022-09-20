const asyncHandle = require("../../middleware/asyncHandle");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const mailer = require("../../utilities/mailer");

const userController = {
    //[POST] -> /user/change-password
    changePassword: asyncHandle(async (req, res, next) => {
        try {
            const { email, password, newPassword } = req.body;
            const userId = req.userId;

            const user = await User.findOne({ _id: userId, email: email });

            if (!user)
                return res.status(404).json({
                    status: "failed",
                    message: "Wrong email",
                });

            if (!bcrypt.compareSync(password, user.password))
                return res.status(404).json({
                    status: " failed",
                    message: "Incorrect password",
                });

            user.password = newPassword;

            await user.save();

            res.status(200).json({
                status: "success",
                message: "Change password successfully",
            });
        } catch (error) {
            res.status(500).json({
                status: "failed",
                message: error.message,
            });
        }
    }),

    //[GET] -> /user/info
    getInfoUser: asyncHandle(async (req, res, next) => {
        try {
            const userId = req.userId;

            const user = await User.findOne({ _id: userId });

            if (!user)
                return res.status(404).json({
                    status: "failed",
                    message: "User not found",
                });

            const { password, ...others } = user._doc;

            res.status(200).json({
                status: "success",
                data: others,
            });
        } catch (error) {
            res.status(500).json({
                status: "failed",
                message: error.message,
            });
        }
    }),

    //[GET] -> /user/verify
    verifyUser: asyncHandle(async (req, res, next) => {
        const email = req.query.email;

        const user = await User.findOne({ email: email });

        if (!user)
            return res.status(404).json({
                status: "Failed",
                message: "User not found",
            });

        if (user.isActive) {
            return res.status(400).json({
                status: "Failed",
                message: "User was active",
            });
        }

        await User.updateOne({ _id: user._id }, { isActive: true });

        res.status(200).json({
            status: "Success",
            message: "Active account successfully",
        });
    }),

    //[POST] -> /user/forgot-password
    forgotPassword: asyncHandle(async (req, res, next) => {
        try {
            const { email } = req.body;

            const user = await User.findOne({ email: email });

            if (!user)
                return res.status(404).json({
                    status: "failed",
                    message: "Wrong email",
                });

            bcrypt.hash(user.email, 10, function (error, hashedEmail) {
                if (error) {
                    return next(error);
                } else {
                    mailer.sendMail(
                        user.email,
                        "Thiết lập lại mật khẩu của tài khoản khách hàng",
                        `<div>Xin chào ${user.surname} ${user.name}</div>
                            <div>Anh/chị đã yêu cầu đổi mật khẩu tại <b>EGA Style</b>.</div>
                            <div>Anh/chị vui lòng truy cập vào liên kết dưới đây để thay đổi mật khẩu của Anh/chị nhé.</div>
                            <a href="${process.env.APP_URL}/api/v1/user/reset-password?email=${user.email}&token=${hashedEmail}"> Verify </a>
                            `
                    );
                }
            });

            res.status(200).json({
                status: "success",
                message: "Send email successfully",
            });
        } catch (error) {
            res.status(500).json({
                status: "failed",
                message: error.message,
            });
        }
    }),

    //[GET] -> /user/reset-password
    resetPassword: asyncHandle(async (req, res, next) => {
        const { newPassword } = req.body;
        const email = req.query.email;

        const user = await User.findOne({ email: email });

        if (!user)
            return res.status(404).json({
                status: "Failed",
                message: "User not found",
            });

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            status: "Success",
            message: "Your password has been reset successfully!",
        });
    }),
};

module.exports = userController;
