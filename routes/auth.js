const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const User = require("../model/User");

const router = express.Router();

// Server side validation for user signup

const SignupSchema = Joi.object({
  fname: Joi.string().required(),

  lname: Joi.string().required(),

  phone: Joi.number().required(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),

  repeat_password: Joi.ref("password"),
});

router.post("/api/signup", async (req, res, next) => {
  try {
    // Server side validaiton

    let { error } = SignupSchema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error?.details) {
      res.status(400).send({
        errors: error?.details,
      });
      return;
    }

    // Password hashing

    let hashed = await bcrypt.hash(req.body.password, 10);

    let user = await User.create({ ...req.body, password: hashed });
    res.send(user);
  } catch (err) {
    next(err);
  }
});

// Server side validation for user signin

const SigninSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

// User signin endpoint

router.post("/api/signin", async (req, res, next) => {
  try {
    let { error } = SigninSchema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error?.details) {
      res.status(400).send({
        errors: error?.details,
      });
      return;
    }

    let user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );

    if (user) {
      let matched = await bcrypt.compare(req.body.password, user.password);
      if (matched) {
        res.send({
          msg: "Logged in successfully",
        });
        return;
      }
    }
    res.status(401).send({
      msg: "Invalid credentials",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
