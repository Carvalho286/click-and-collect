const bodyParser = require("body-parser");
const express = require("express");
const Guests = require("../data/guests");
const Users = require("../data/users");
const scopes = require("../data/users/scopes");
const VerifyToken = require("../middleware/token");
const cookieParser = require("cookie-parser");

function GuestRouter() {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  router.route("/register").post(function (req, res) {
    let guest = req.body;
    Guests.create(guest)
      .then((newGuest) => {
        res.status(201).send(newGuest); // Send response and complete the request cycle
      })
      .catch((err) => {
        res.status(400).send({ error: "Bad request" }); // Handle error response
      });
  });

  router.use(cookieParser());
  router.use(VerifyToken);

  router
    .route("/")
    .get(
      Users.authorize([scopes["admin"], scopes["chef"], scopes["employee"]]),
      function (req, res) {
        Guests.findAll()
          .then((guests) => {
            res.status(200).send(guests); // Send response and complete the request cycle
          })
          .catch((err) => {
            res.status(404).send({ error: "Guests not found" }); // Handle error response
          });
      }
    )
    .post(
      Users.authorize([scopes["admin"], scopes["chef"], scopes["employee"]]),
      function (req, res) {
        let guest = req.body;
        Guests.create(guest)
          .then((newGuest) => {
            res.status(201).send(newGuest); // Send response and complete the request cycle
          })
          .catch((err) => {
            res.status(400).send({ error: "Bad request" }); // Handle error response
          });
      }
    );

  router
    .route("/clear")
    .delete(Users.authorize([scopes["admin"]]), function (req, res) {
      Guests.clear()
        .then(() => {
          res.status(204).send("Guests deleted successfully"); // Send response and complete the request cycle
        })
        .catch((err) => {
          res.status(404).json({ error: "Failed to delete guests" }); // Handle error response
        });
    });

  router
    .route("/:guestId")
    .get(
      Users.authorize([scopes["admin"], scopes["chef"], scopes["employee"]]),
      function (req, res) {
        let guestId = req.params.guestId;

        Guests.findById(guestId)
          .then((guest) => {
            res.status(200).send(guest); // Send response and complete the request cycle
          })
          .catch((err) => {
            res.status(404).send({ error: "Guest not found" }); // Handle error response
          });
      }
    )
    .delete(Users.authorize([scopes["admin"]]), function (req, res) {
      let guestId = req.params.guestId;
      Guests.removeById(guestId)
        .then(() => {
          res.status(204).send(); // Send response and complete the request cycle
        })
        .catch((err) => {
          res.status(404).send({ error: "Failed to delete guest" }); // Handle error response
        });
    });

  return router;
}

module.exports = GuestRouter;
