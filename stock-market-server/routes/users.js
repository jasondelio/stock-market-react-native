var express = require("express");
var router = express.Router();

const {
  hashPassword,
  comparePassword,
} = require("../middleware/password-encryption");
const {
  requestValidate,
  tokenValidate,
} = require("../middleware/users-middleware");
const jwt = require("jsonwebtoken");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//Route for login
router.post("/login", requestValidate, async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  const queryUsers = await req.db
    .from("users")
    .select("*")
    .where("email", "=", email);

  if (queryUsers.length === 0) {
    console.log("User does not exist");
    res.status(400).json({ error: true, message: "User does not exist" });
    return;
  }

  const user = queryUsers[0];
  let match = await comparePassword(password, user.hash);

  if (!match) {
    console.log("Password doesn't match");
    res.status(400).json({ error: true, message: "Password does not match" });
    return;
  }

  const secretKey = process.env.SECRET_KEY;
  const expires_in = 60 * 60 * 24;
  const exp = Date.now() + expires_in * 1000;
  const token = jwt.sign({ email, exp }, secretKey);

  res.json({ error: false, token_type: "Bearer", token, expires_in });
});

//Route for register
router.post("/register", requestValidate, async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  const queryUsers = await req.db
    .from("users")
    .select("*")
    .where("email", "=", email);

  if (queryUsers.length > 0) {
    console.log("User already exists");
    res.status(400).json({ error: true, message: "User already registered" });
    return;
  }

  const hash = await hashPassword(password);

  await req.db.from("users").insert({ email, hash, watchList: "[]" });

  res.status(201).json({ error: false, message: "User created" });
});

//Route for getting the watch list
router.get("/watch-list", tokenValidate, async function (req, res, next) {
  const token = req.headers["authorization"];
  const decodedToken = jwt.decode(token.replace("Bearer ", ""));

  const queryUsers = await req.db
    .from("users")
    .select("*")
    .where("email", "=", decodedToken.email);

  const user = queryUsers[0];

  if (queryUsers.length === 0) {
    console.log("User does not exist");
    res.json({ error: true, message: "User does not exist" });
    return;
  }

  res.json({ error: false, watchList: user.watchList });
});

//Route for updating the watch list
router.post("/watch-list", tokenValidate, async function (req, res, next) {
  const token = req.headers["authorization"];
  const decodedToken = jwt.decode(token.replace("Bearer ", ""));

  const updatedWatchList = req.body.watchList;

  if (!updatedWatchList) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete - watchList needed",
    });
    return;
  }

  const queryUsers = await req.db
    .from("users")
    .select("*")
    .where("email", "=", decodedToken.email);

  if (queryUsers.length === 0) {
    console.log("User does not exist");
    res.json({ error: true, message: "User does not exist" });
    return;
  }

  await req.db
    .from("users")
    .where("email", "=", decodedToken.email)
    .update({ watchList: updatedWatchList });

  res.json({ error: false, message: "Watchlist updated" });
});

module.exports = router;
