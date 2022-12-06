const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("../db/conn");
const User = require("../model/userSchema");

router.get("/", (req, res) => {
  try {
    console.log("connecting....");
    res.status(200).send({
      message: "From the router home page",
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

// GET
router.get("/users", async (req, res) => {
  const dataCount = await User.find().countDocuments();
  User.find()
    .then((data) => {
      res.status(200).send({
        message: "Data found successfully",
        data,
        totalCount: dataCount,
      });
    })
    .catch((err) =>
      res.status(500).send({ err: `Failed to find user ${err}` })
    );
});

// usingPromises
// router.post("/register", (req, res) => {
//   const { name, email, phone, work, password, cPassword } = req.body;
//   if (!name || !email || !phone || !work || !password || !cPassword) {
//     return res.status(422).send({
//       message: "Please filed the field properly",
//     });
//   }

//   User.findOne({ email: email })
//     .then((userExist) => {
//       if (userExist) {
//         return res.status(422).send({
//           message: "Email already exist",
//         });
//       }

//       const user = new User({
//         name,
//         email,
//         phone,
//         work,
//         password,
//         cPassword,
//       });
//       user
//         .save()
//         .then(() => {
//           res
//             .status(201)
//             .send({ message: "user register successfully", data: user });
//         })
//         .catch((err) =>
//           res.status(500).send({ err: `Failed to register and ${err}` })
//         );
//     })
//     .catch((err) => console.log(err));
// });

// with the help of async await
router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cPassword } = req.body;
  if (!name || !email || !phone || !work || !password || !cPassword) {
    return res.status(422).send({
      message: "Please filed the field properly",
    });
  }
  try {
    const existUser = await User.findOne({ email: email });
    const user = new User({
      name,
      email,
      phone,
      work,
      password,
      cPassword,
    });
    if (existUser) {
      return res.status(422).send({
        message: "Email already exist",
      });
    } else if (password !== cPassword) {
      res.status(401).send({
        message: "Password didn't matched with confirm password",
      });
    } else {
      // before save register info password will help to hash
      const userRegister = await user.save();

      if (userRegister) {
        res
          .status(201)
          .send({ message: "user register successfully", data: user });
      } else {
        res.status(500).send({ message: "user register failed " });
      }
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal server error while register user" });
  }
});

// Login
router.get("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(422)
        .send({ message: "Please fullfil the required field" });
    }

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
      return res.status(400).send({ message: "wrong credential" });
    } else {
      const checkPass = await bcrypt.compare(password, userInfo.password);

      const token = await userInfo.generateAuthToken();

      res.cookie("mern_jwtoken", token, {
        expires: new Date(Date.now() + 604800),
        httpOnly: true,
      });

      console.log(token);
      if (!checkPass) {
        return res.status(400).send({
          message: "wrong credential",
        });
      } else {
        res.status(200).send({
          message: "user signin successfully",
          data: userInfo,
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error,
    });
  }
});

module.exports = router;
