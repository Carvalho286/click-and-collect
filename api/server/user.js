const bodyParser = require("body-parser");
const express = require("express");
const Users = require("../data/users");
const scopes = require("../data/users/scopes");
const VerifyToken = require("../middleware/token");
const cookieParser = require("cookie-parser");

function UserRouter() {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  router.use(cookieParser());
  router.use(VerifyToken);
  router
    .route("/")
    .get(Users.authorize([scopes["admin"]]), function (req, res, next) {
      Users.findAll()
        .then((users) => {
          res.send(users);
          next();
        })
        .catch((err) => {
          next();
        });
    });

  router
    .route("/:userId")
    .get(
      Users.authorize([scopes["admin"], scopes["chef"], scopes["employee"]]),
      function (req, res, next) {
        let userId = req.params.userId;

        Users.findById(userId)
          .then((lol) => {
            res.status(200);
            res.send(lol);
            next();
          })
          .catch((err) => {
            res.status(404);
            next();
          });
      }
    )
    .put(Users.authorize([scopes["admin"]]), function (req, res, next) {
      let userId = req.params.userId;
      let body = req.body;
      Users.update(userId, body)
        .then((user) => {
          res.status(200);
          res.send(user);
          next();
        })
        .catch((err) => {
          res.status(404);
          next();
        });
    })
    .delete(Users.authorize([scopes["admin"]]), function (req, res, next) {
      let userId = req.params.userId;
      Users.removeById(userId)
        .then(() => {
          res.send("Apagado com sucesso");
          res.status(200).json();
          next();
        })
        .catch((err) => {
          console.log(err);
          res.status(404);
          next();
        });
    });

  router.route("/search").get(function (req, res, next) {
    const { field, value } = req.query;

    if (!field || !value) {
      return res
        .status(400)
        .json({ message: "Both 'field' and 'value' are required" });
    }

    if (!["name", "email", "phone"].includes(field)) {
      return res.status(400).json({
        message: "Invalid search field. Use 'name', 'email', or 'phone'.",
      });
    }

    Users.findByField(field, value)
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => {
        console.error("Error searching users:", err);
        res
          .status(500)
          .json({ message: "Error searching users", error: err.message });
      });
  });

  router
    .route("/me")
    .get(function (req, res, next) {
      let token = req.cookies.token;
      if (!token) {
        return res
          .status(401)
          .json({ auth: false, message: "No token provided." });
      }

      Users.verifyToken(token)
        .then((decoded) => {
          return Users.findById(decoded.id);
        })
        .then((user) => {
          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }
          res.status(200).json(user);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: "Internal Server Error" });
        });
    })
    .put(function (req, res, next) {
      let token = req.cookies.token;
      if (!token) {
        return res
          .status(401)
          .json({ auth: false, message: "No token provided." });
      }

      Users.verifyToken(token)
        .then((decoded) => {
          return Users.update(decoded.id, req.body);
        })
        .then((updatedUser) => {
          res.status(200).json(updatedUser);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: "Unable to update user" });
        });
    })
    .delete(function (req, res, next) {
      let token = req.cookies.token;
      if (!token) {
        return res
          .status(401)
          .json({ auth: false, message: "No token provided." });
      }

      Users.verifyToken(token)
        .then((decoded) => {
          return Users.removeById(decoded.id);
        })
        .then(() => {
          res.status(200).json({ message: "Account deleted successfully" });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: "Unable to delete user" });
        });
    });

  return router;
}

module.exports = UserRouter;
