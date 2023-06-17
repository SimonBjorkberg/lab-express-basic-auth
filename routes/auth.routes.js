const { Router } = require("express");
const router = new Router();

const User = require("../models/User.model");

const bcrypt = require("bcryptjs");
const salt = 10;

router.get("/signup", (req, res, next) => {
  res.render("./auth/sign-up");
});

router.post("/signup", (req, res, next) => {
  let { username, password } = req.body;
  User.findOne({ username }).then((existingUser) => {
    if (existingUser) {
      return res.render("./auth/sign-up", {
        errorMessage: "Username taken",
      });
    }
  });

  bcrypt
    .genSalt(salt)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username: username,
        password: hashedPassword,
      });
    })
    .then((user) => {
      console.log("new user", user);
      res.redirect("/login");
    })
    .catch((err) => console.log("err", err));
});

router.get("/login", (req, res) => {
  res.render("./auth/login");
});

router.get("/userProfile", (req, res) => {
  res.render("users/user-profile", { userInSession: req.session.currentUser });
});

router.post("/login", (req, res) => {
  console.log("session ====>", req.session);
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.render("/login", {
      errorMessage: "both fields required",
    });
    return;
  }
  User.findOne({ username }).then((user) => {
    if (!user) {
      res.render("/login", { errorMessage: "username not found" });
      return;
    } else if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect("/userProfile");
    } else {
      res.render("auth/login", { errorMessage: "wrong password" });
    }
  });
});

router.post("/logout", (req, res, next) => {
    req.session.destroy((err) => {
      if (err) next(err);
      res.redirect("/");
    });
  });

module.exports = router;
