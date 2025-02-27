const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const Reservations = require("../data/reservations");
const Users = require("../data/users");
const Guests = require("../data/guests");
const scopes = require("../data/users/scopes");
const Dishes = require("../data/dishes");
const cookieParser = require("cookie-parser");
const verifyToken = require("../middleware/token");

function ReservationRouter() {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.json({ limit: "100mb", extended: true }));

  router.route("/regist").post(async (req, res) => {
    try {
      const { client, guest, dishes, reservationTime } = req.body;

      if (!client && !guest) {
        return res.status(400).json({
          message: "Either client (userId) or guest (guestId) is required",
        });
      }
      if (client && guest) {
        return res
          .status(400)
          .json({ message: "Provide either client or guest, not both" });
      }

      if (client) {
        const userExists = await Users.findById(client);
        if (!userExists)
          return res.status(404).json({ message: "Client not found" });
      } else {
        const guestExists = await Guests.findById(guest);
        if (!guestExists)
          return res.status(404).json({ message: "Guest not found" });
      }

      if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
        return res
          .status(400)
          .json({ message: "At least one dish is required" });
      }

      const formattedDishes = dishes.map((dish) => ({
        dishId: new mongoose.Types.ObjectId(dish.dishId),
        quantity: dish.quantity,
      }));

      const dishIds = formattedDishes.map((dish) => dish.dishId);
      const foundDishes = await Dishes.find({ _id: { $in: dishIds } });

      if (foundDishes.length !== dishIds.length) {
        return res
          .status(404)
          .json({ message: "One or more dishes not found" });
      }

      const totalPrice = formattedDishes.reduce((total, item) => {
        const dish = foundDishes.find((d) => d._id.equals(item.dishId));
        return total + dish.price * item.quantity;
      }, 0);

      const newReservation = {
        dishes: formattedDishes,
        client: client ? new mongoose.Types.ObjectId(client) : undefined,
        guest: guest ? new mongoose.Types.ObjectId(guest) : undefined,
        totalPrice,
        reservationTime: new Date(reservationTime),
      };

      await Reservations.create(newReservation);

      res.status(201).json(newReservation);
    } catch (error) {
      console.error("Error creating reservation:", error);
      res.status(500).json({
        message: "Error creating reservation",
        error: error.message,
      });
    }
  });

  router.use(cookieParser());
  router.use(verifyToken);

  router
    .route("/")
    .get(
      Users.authorize([scopes["admin"], scopes["chef"], scopes["employee"]]),
      function (req, res, next) {
        Reservations.findAll()
          .then((reservations) => {
            res.status(200).send(reservations);
            next();
          })
          .catch((err) => {
            next();
          });
      }
    )
    .post(
      Users.authorize([
        scopes["admin"],
        scopes["chef"],
        scopes["employee"],
        scopes["client"],
      ]),
      async (req, res) => {
        try {
          const { client, guest, dishes, reservationTime } = req.body;

          if (!client && !guest) {
            return res.status(400).json({
              message: "Either client (userId) or guest (guestId) is required",
            });
          }
          if (client && guest) {
            return res
              .status(400)
              .json({ message: "Provide either client or guest, not both" });
          }

          if (client) {
            const userExists = await Users.findById(client);
            if (!userExists)
              return res.status(404).json({ message: "Client not found" });
          } else {
            const guestExists = await Guests.findById(guest);
            if (!guestExists)
              return res.status(404).json({ message: "Guest not found" });
          }

          if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
            return res
              .status(400)
              .json({ message: "At least one dish is required" });
          }

          const formattedDishes = dishes.map((dish) => ({
            dishId: new mongoose.Types.ObjectId(dish.dishId),
            quantity: dish.quantity,
          }));

          const dishIds = formattedDishes.map((dish) => dish.dishId);
          const foundDishes = await Dishes.find({ _id: { $in: dishIds } });

          if (foundDishes.length !== dishIds.length) {
            return res
              .status(404)
              .json({ message: "One or more dishes not found" });
          }

          const totalPrice = formattedDishes.reduce((total, item) => {
            const dish = foundDishes.find((d) => d._id.equals(item.dishId));
            return total + dish.price * item.quantity;
          }, 0);

          const newReservation = {
            dishes: formattedDishes,
            client: client ? new mongoose.Types.ObjectId(client) : undefined,
            guest: guest ? new mongoose.Types.ObjectId(guest) : undefined,
            totalPrice,
            reservationTime: new Date(reservationTime),
          };

          await Reservations.create(newReservation);

          res.status(201).json(newReservation);
        } catch (error) {
          console.error("Error creating reservation:", error);
          res.status(500).json({
            message: "Error creating reservation",
            error: error.message,
          });
        }
      }
    );

  router
    .route("/:reservationId")
    .put(
      Users.authorize([scopes["admin"], scopes["chef"], scopes["employee"]]),
      function (req, res, next) {
        let reservationId = req.params.reservationId;
        let body = req.body;

        Reservations.update(reservationId, body)
          .then((reservation) => {
            res.status(200);
            res.send(reservation);
            next();
          })
          .catch((err) => {
            res.status(404);
            next();
          });
      }
    );

  router
    .route("/status/:reservationId")
    .put(
      Users.authorize([scopes["admin"], scopes["chef"], scopes["employee"]]),
      async (req, res) => {
        try {
          const { reservationId } = req.params;
          const { status } = req.body;

          if (!status) {
            return res.status(400).json({ message: "Status is required" });
          }

          const updatedReservation = await Reservations.changeStatus(
            reservationId,
            status
          );

          res.status(200).json({
            message: "Reservation status updated successfully",
            reservation: updatedReservation,
          });
        } catch (error) {
          console.error("Error updating reservation status:", error);
          res.status(500).json({
            message: "Error updating reservation status",
            error: error.message,
          });
        }
      }
    );

  router
    .route("/user/search")
    .get(
      Users.authorize([
        scopes["admin"],
        scopes["chef"],
        scopes["employee"],
        scopes["client"],
      ]),
      async (req, res, next) => {
        try {
          const { field, value } = req.query;

          if (!field || !value) {
            return res.status(400).json({
              message: "Field (name, email, or phone) and value are required",
            });
          }

          const validFields = ["name", "email", "phone"];
          if (!validFields.includes(field)) {
            return res.status(400).json({
              message: `Invalid search field. Valid fields are: ${validFields.join(
                ", "
              )}`,
            });
          }

          const users = await Users.findByField(field, value);

          if (!users.length) {
            return res.status(404).json({ message: "No users found" });
          }

          const user = users[0];

          Reservations.findByUserId(user._id)
            .then((reservations) => {
              if (!reservations.length) {
                return res
                  .status(404)
                  .json({ message: "No reservations found for this user" });
              }
              res.status(200).json(reservations);
            })
            .catch((err) => {
              res.status(500).json({
                message: "Error fetching reservations",
                error: err.message,
              });
            });
        } catch (error) {
          res.status(500).json({
            message: "Error processing the request",
            error: error.message,
          });
        }
      }
    );

  router
    .route("/user/:userId")
    .get(
      Users.authorize([
        scopes["admin"],
        scopes["chef"],
        scopes["employee"],
        scopes["client"],
      ]),
      function (req, res, next) {
        const userId = req.params.userId;

        Reservations.findByUserId(userId)
          .then((reservations) => {
            console.log("Reservations found:", reservations);

            if (!reservations.length) {
              return res
                .status(404)
                .json({ message: "No reservations found for this user" });
            }
            res.status(200).json(reservations);
          })
          .catch((err) => {
            res.status(500).json({
              message: "Error fetching reservations",
              error: err.message,
            });
          });
      }
    );

  return router;
}

module.exports = ReservationRouter;
