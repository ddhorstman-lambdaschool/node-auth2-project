const express = require("express");
const server = express();
const helmet = require("helmet");
const cors = require("cors");
//require("dotenv").config();

server.use(helmet());
server.use(express.json());
server.use(cors());

const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const { custom404, errorHandling } = require("./errors");

server.use("/api/users", userRouter);
server.use("/api", authRouter);

server.all("*", custom404);
server.use(errorHandling);

module.exports = server;
