const router = require("express").Router();
const db = require("../data/userModel");
const authorize = require("./authorizationMiddleware");
const { catchAsync } = require("./errors");


router.get(
  "/",
  authorize,
  catchAsync(async (req, res) => {
    res.status(200).json(await db.getUsers());
  })
);



module.exports = router;
