const express = require("express");
var db = require("../models");
var User = db.user;
var Role = db.role;
var RoleAssigned = db.role_assigned;
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");
const { userHasRole } = require("../middleware/helper");

const router = express.Router();
const jwt_key = "This is a secret key";

//  signup user
router.post("/createUser", async (req, res) => {
  let success = false;
  try {
    var roles = req.body.roles;
    console.log("Roles ====", roles);
    let user = await User.findOne({ where: { email: req.body.email } });
    console.log("User === ", user);
    if (user) {
      return res
        .status(400)
        .json({ success, error: "User with email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(req.body.password, salt);
    console.log("Reaching here");
    user = await User.create({
      name: req.body.name,
      password: secPassword,
      email: req.body.email,
    });

    console.log(user);
    const payload = {
      user: {
        id: user.id,
      },
    };
    const jwt_token = jwt.sign(payload, jwt_key);
    // console.log(jwt_token)
    success = true;
    console.log("Roles ======== ", roles);
    for (var role of roles) {
      console.log("Role ==== ", role);
      var roleDetails = await Role.findOne({
        where: {
          name: role,
        },
      });
      await RoleAssigned.create({
        user_id: user.id,
        role_id: roleDetails?.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return res.json({ success, data: user, roles, jwt_token });
  } catch (error) {
    return res
      .status(500)
      .json({ success, error: "Some Error has occurred", msg: error.message });
  }
});

// sign in user

router.post("/login", async (req, res) => {
  let success = false;
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res
        .status(400)
        .json({ success, error: "please enter correct details" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      return res
        .status(400)
        .json({ success, error: "please enter correct details" });
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    const jwt_token = jwt.sign(payload, jwt_key);
    success = "true";
    return res.json({ success, jwt_token });
  } catch (error) {
    return res.status(500).json({ success, error: "some error has occured" });
  }
});

// fetch all users

router.get("/fetchAllUser", fetchUser, async (req, res) => {
  let success = false;

  try {
    const isAdmin = await userHasRole(req.user.id, 1);
    console.log("isAdmin ==== ", isAdmin);
    if (!isAdmin) {
      return res.json({ success: false, error: "User not authorized" });
    }
    const data = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    if (!data) {
      return res.send({ data: "user not exists" });
    }
    res.status(200).json({ data: data });
  } catch (err) {
    return res
      .status(500)
      .json({ success, err: "Some Error has occurred", msg: err.message });
  }
});

// fetch by id
router.get("/fetchById/:id", fetchUser, async (req, res) => {
  let success = false;

  try {
    const isAdmin = await userHasRole(req.user.id, 1);
    console.log(isAdmin);
    const data = await User.findAll({
      attributes: { exclude: ["password"] },
      where: {
        id: req.params.id,
      },
    });
    if (!data) {
      return res.send({ data: "user not exists" });
    }
    res.status(200).json({ data: data });
  } catch (err) {
    return res
      .status(500)
      .json({ success, err: "Some Error has occurred", msg: err.message });
  }
});

// update user
router.get("/updateUserById", fetchUser, async (req, res) => {});

module.exports = router;
