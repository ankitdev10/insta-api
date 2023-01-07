const jwt = require("jsonwebtoken");
const  createError  = require("./createError");

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(createError(403, "Unauthorized"));

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return next(createError(403, "Invalid Token"));
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
