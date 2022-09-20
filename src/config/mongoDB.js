const mongoose = require("mongoose");

const connection = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.MONGODB_NAME}:${process.env.MONGODB_PASSWORD}@cluster0.twsrtoh.mongodb.net/ega-style-api?retryWrites=true&w=majority`
        );

        console.log("Connect successfully!");
    } catch (err) {
        console.log(err.message);
        console.log("Connect falure!");
    }
};

module.exports = connection;
