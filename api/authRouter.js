const router = require("express").Router();
const db = require("../data/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets");
const { catchAsync } = require("./errors");

router.post(
  "/register",
  validateUserDoesNotExist,
  validateUserObject,
  validateDepartment,
  catchAsync(async (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);
    const saved = await db.addUser(user);
    const token = generateToken(saved);
    res.status(201).json({ user: { ...saved, password: "••••••••••" }, token });
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
    const token = generateToken(await db.getUser({ username }));
    res.status(200).json({ message: "Logged in", token });
  })
);

/*----------------------------------------------------------------------------*/
/* Middleware
/*----------------------------------------------------------------------------*/
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    department: user.department,
  };
  const options = {
    expiresIn: "7d",
  };
  return jwt.sign(payload, secrets.jwtSecret, options);
}

function validateUserObject(req, res, next) {
  const { username, password } = req.body;
  username && password
    ? next()
    : res.status(400).json({
        message: "User object requires both 'username' and 'password' fields",
      });
}

function validateDepartment(req, res, next) {
  const { department } = req.body;
  if (!department) {
    return res.status(400).json({
      message:
        "You must include a department name when registering a new user.",
    });
  }
  db.getDepartment({ name: department }).then(dept => {
    if (!dept) {
      return res.status(400).json({
        message: `'${department}' is not a valid department name.`,
      });
    }
    req.body.department_id = dept.id;
    delete req.body.department;
    next();
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
