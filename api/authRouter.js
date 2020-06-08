const router = require("express").Router();
const db = require("../data/userModel");
const bcrypt = require("bcryptjs");
const { catchAsync } = require("./errors");

router.post(
  "/register",
  validateUserDoesNotExist,
  validateUserObject,
  catchAsync(async (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);
    const saved = await db.addUser(user);
    res.status(201).json({ ...saved, password: "••••••••••" });
  })
);

router.post(
  "/login",
  validateUserExists,
  validateUserObject,
  catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const { password: passwordHash } = req.user;
    if (!bcrypt.compareSync(password, passwordHash)) {
      return res.status(401).json({ message: "Invalid password" });
    }
    req.session.user = req.user;
    res.status(200).json({ message: "Logged in" });
  })
);

router.get(
  "/logout",
  catchAsync(async (req, res, next) => {
    if (req.session.user) {
      res.clearCookie("node-auth1-session");
      req.session.destroy(err =>
        err ? next(err) : res.status(200).json({ message: "Logged out" })
      );
    } else {
      res.status(400).json({ message: "You are not logged in." });
    }
  })
);

/*----------------------------------------------------------------------------*/
/* Middleware
/*----------------------------------------------------------------------------*/
function validateUserObject(req, res, next) {
  const { username, password } = req.body;
  username && password
    ? next()
    : res.status(400).json({
        message: "User object requires both 'username' and 'password' fields",
      });
}

function validateUserExists(req, res, next) {
  const { username } = req.body;
  db.getUser({ username }).then(user => {
    if (!user) {
      return res.status(404).json({
        message: `No user with username '${username}' exists`,
      });
    }
    req.user = user;
    return next();
  });
}

function validateUserDoesNotExist(req, res, next) {
  const { username } = req.body;
  db.getUser({ username }).then(user => {
    if (user) {
      return res.status(400).json({
        message: `A user with username '${username}' already exists.`,
      });
    }
    return next();
  });
}

/* Export --------------------------------------------------------------------*/
module.exports = router;
