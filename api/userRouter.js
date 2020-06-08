const router = require("express").Router();
const db = require("../data/userModel");
const { catchAsync } = require("./errors");

router.use(restrictAccess);

router.get(
  "/",
  catchAsync(async (req, res) => {
    res.status(200).json(await db.getUsers());
  })
);

/*----------------------------------------------------------------------------*/
/* Restricted access middleware
/*----------------------------------------------------------------------------*/
function restrictAccess(req, res, next) {
  req.session && req.session.user
    ? next()
    : res.status(403).json({ message: "You must be logged in to do that" });
}

module.exports = router;
