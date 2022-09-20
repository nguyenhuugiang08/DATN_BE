//dotenv
require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookies = require("cookie-parser");

const app = express();

const route = require("./routes");

const connection = require("./config/mongoDB");

app.use(morgan("combined"));

// conect database
connection();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use(cookies());

// Router
route(app);

app.listen(process.env.PORT || 5000);
