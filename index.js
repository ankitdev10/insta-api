const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path")
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/user");
const postRoute = require("./routes/post");
const cors = require("cors")

app.use(cors({ credentials: true, origin: "https://instagram-clone-epnm.onrender.com" }))
app.use(express.json());
app.use(cookieParser());
dotenv.config();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin',"https://instagram-clone-epnm.onrender.com" );
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// DATABASE CONNECTION
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });
// ROUTES
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/posts", postRoute);
console.log(__dirname, "../client/build/index.html")
// error handling
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status: status,
    message: message,
  });
});



app.listen("4000", () => {
  console.log("Backend running");
});
