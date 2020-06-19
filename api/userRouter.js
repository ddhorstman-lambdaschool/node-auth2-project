const router = require("express").Router();
const db = require("../data/userModel");
const authorize = require("./authorizationMiddleware");
const { catchAsync } = require("./errors");

router.get(
  "/",
  authorize,
  catchAsync(async (req, res) => {
    const { department } = req.data;
    res.status(200).json(await db.getUsersByDepartment(department));
  })
);

module.exports = router;
