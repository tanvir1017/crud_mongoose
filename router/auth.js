const express = require("express");
const router = express.Router();

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
router.get("/users", (req, res) => {
  User.find()
    .then((data) => {
      res.status(201).send({
        message: "Data found successfully",
        data,
      });
    })
    .catch((err) =>
      res.status(500).send({ err: `Failed to find user ${err}` })
    );
});

router.post("/register", (req, res) => {
  const { name, email, phone, work, password, cPassword } = req.body;
  if (!name || !email || !phone || !work || !password || !cPassword) {
    return res.status(422).send({
      message: "Please filed the field properly",
    });
  }

  User.findOne({ email: email })
    .then((userExist) => {
      if (userExist) {
        return res.status(422).send({
          message: "Email already exist",
        });
      }

      const user = new User({
        name,
        email,
        phone,
        work,
        password,
        cPassword,
      });
      user
        .save()
        .then(() => {
          res
            .status(201)
            .send({ message: "user register successfully", data: user });
        })
        .catch((err) =>
          res.status(500).send({ err: `Failed to register and ${err}` })
        );
    })
    .catch((err) => console.log(err));
});

module.exports = router;
