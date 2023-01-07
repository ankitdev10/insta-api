const User = require("../model/User");
const bcrypt = require("bcrypt");
const createError = require("../utils/createError");
const jwt = require("jsonwebtoken");

const authRegister = async (req, res, next) => {
  const user = req.body;
  try {
    // check if same email or username already exists
    const checkUser = await User.findOne({ username: user.username });
    if (checkUser) return next(createError(403, "Username already used"));

    const checkEmail = await User.findOne({ email: user.email });
    if (checkEmail) return next(createError(403, "Email already exists"));

    // hash pw
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);

    if(!user.username || !user.fullname || !user.email || !user.password ) {
      next(createError(403, "Please fill in all fields"))
    }
    // save user
    const saveUser = new User({ ...req.body, password: hashPassword });
    await saveUser.save();
    res.status(200).json("Registration Sucessful");
  } catch (error) {
    next(error);
  }
};

const authLogin = async (req, res, next) => {
  const { email } = req.body;
  try {
    // FIND USER BY EMAIL
    const user = await User.findOne({ email });
    // IF EMAIL DOES NOT EXIST
    if (!user) return next(createError(404, "Account not found"));
    //CHECK PW IF ACCOUNT FOUND
    const checkPass = await bcrypt.compare(req.body.password, user.password);
    if (!checkPass) return next(createError(403, "Wrong Credential"));

    const { password, ...others } = user._doc;
    //provide token if pw is corrent
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

    res
      .cookie("access_token", token, {
        httpOnly: false,
        sameSite: "none",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json(others);
  } catch (error) {}
};

module.exports = { authRegister, authLogin };
