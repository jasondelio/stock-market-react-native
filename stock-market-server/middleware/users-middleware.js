const jwt = require("jsonwebtoken");

//Function for validating the request body for login and register
const requestValidate = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const mailformat =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete - email and password needed",
    });
    return;
  }
  if (!mailformat.test(email)) {
    res.status(400).json({
      error: true,
      message: "Invalid email",
    });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({
      error: true,
      message: "Password length must be greater than 8",
    });
    return;
  }
  next();
};

//Function for validating the jwt token
const tokenValidate = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token || token.search("Bearer ") < 0) {
    console.log("Invalid or missing token")
    res.status(400).json({
      error: true,
      message: "Invalid or missing token",
    });
    return;
  }

  const decodedToken = jwt.decode(token.replace("Bearer ", ""));
  
  let currentDate = new Date();

  if (decodedToken.exp < currentDate.getTime()) {
    console.log("Token is expired")
    res.status(403).json({
      error: true,
      message: "Token is expired",
    });
    return;
  }
  next();
};

module.exports = { requestValidate, tokenValidate };
