const { authRegister, authLogin } = require("../controllers/authController");

const Router = require("express").Router();

// CREATE

Router.post("/register", authRegister);

// LOGIN

Router.post("/login", authLogin);


module.exports = Router