const dotenv = require("dotenv");
const express = require("express");
const app = express();

// ! PROT & DB DECLARE
const port = process.env.PORT || 8080;

// ! DOTENV FILE REQUIRE
dotenv.config({ path: "./.env" });
// require("dotenv").config();

// info CONNECTING WITH CONN
require("./db/conn");

// ! FILE WITH EXPRESS.JSON()
app.use(express.json());

// @ MODEL CALLING
// const User = require("./model/userSchema");

// @ LINKING WITH ROUTER
app.use(require("./router/auth"));

// comments :- MIDDLEWARE
app.get("/home", (req, res) => {
  res.send({ message: "hello from home" });
  console.log("hello from home");
});

const middleware = (req, res, next) => {
  console.log("Hello world middleware");
  next();
};

// comments :- ABOUT ROUTE
app.get("/about", middleware, (req, res) => {
  try {
    res.status(200).send({
      message: "Hello from about route",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//comments :-  LISTEN
app.listen(port, async () => {
  console.log(`app listening of port ${port}`);
  //   await connectDB();
});
