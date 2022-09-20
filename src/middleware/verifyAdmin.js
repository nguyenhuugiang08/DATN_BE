const checkAdmin = (req, res, next) => {
    const role = req.role;

    if (!role)
        return res.status(404).json({
            status: "falied",
            message: "Missing role",
        });

    if (role !== "admin")
        return res.status(401).json({
            status: "falied",
            message: "you're not allowed to perform this action",
        });

    next();
};

module.exports = checkAdmin;
