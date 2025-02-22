const bodyParser = require("body-parser");
const express = require("express");
const Users = require("../data/users");
const cookieParser = require("cookie-parser");
const verifyToken = require("../middleware/token");

function AuthRouter() {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.json({ limit: "100mb", extended: true }));

  router.route("/register").post(async function (req, res) {
    try {
      const body = req.body;

      const existingEmail = await Users.findOne({ email: body.email });
      if (existingEmail) {
        return res.status(400).json({ error: "Email already in use" });
      }

      const existingPhone = await Users.findOne({ phone: body.phone });
      if (existingPhone) {
        return res.status(400).json({ error: "Phone already in use" });
      }

      const validScopes = ["admin", "chef", "employee", "client"];
      if (!body.role?.scopes.every((scope) => validScopes.includes(scope))) {
        return res.status(400).json({ error: "Invalid role or scope" });
      }

      const user = await Users.create(body);
      return res.status(201).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.route("/login").post(function (req, res, next) {
    let body = req.body;

    return Users.findUser(body)
      .then((user) => {
        return Users.createToken(user);
      })
      .then((login) => {
        res.cookie("token", login.token, { httpOnly: true });
        res.status(200);
        res.send(login);
      })
      .catch((err) => {
        console.log(err.message);
        res.status(500);
        res.send(err);
        next();
      });
  });

  router.use(cookieParser());
  router.use(verifyToken);

  router.route("/me").get(function (req, res, next) {
    let token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "No token provided." });
    }

    return Users.verifyToken(token)
      .then((decoded) => {
        res.status(202).send({ auth: true, decoded });
      })
      .catch((err) => {
        res.status(500);
        res.send(err);
        console.log(err);
        next();
      });
  });

  router.route("/whoami").get(function (req, res, next) {
    let token = req.cookies.token;

    Users.verifyToken(token)
      .then((decoded) => {
        res.send(decoded);
        next();
      })
      .catch(() => {
        res.status(401).send({ auth: false, message: "Not authorized" });
      });
  });

  router.route("/logout").get(function (req, res, next) {
    res.cookie("token", req.cookies.token, { httpOnly: true, maxAge: 0 });
    res.status(200);
    res.send({ logout: true });
    next();
  });

  return router;
}

module.exports = AuthRouter;
