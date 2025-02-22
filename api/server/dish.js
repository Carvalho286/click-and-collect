const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const Dishes = require("../data/dishes");
const Users = require("../data/users");
const scopes = require("../data/users/scopes");
const VerifyToken = require("../middleware/token");
const upload = require("../middleware/multerConfig");

function DishRouter() {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.json({ limit: "100mb", extended: true }));
  router.use(cookieParser());

  router
    .route("/")
    .get(function (req, res, next) {
      Dishes.findAll()
        .then((dishes) => {
          res.send(dishes);
          next();
        })
        .catch((err) => {
          next();
        });
    })
    .post(
      VerifyToken,
      Users.authorize([scopes["admin"], scopes["chef"]]),
      upload.single("image"),
      function (req, res, next) {
        const body = req.body;

        if (req.file) {
          body.imageUrl = "/images/" + req.file.filename;
        }

        Dishes.create(body)
          .then((dish) => {
            res.status(201).send(dish);
            next();
          })
          .catch((err) => {
            res.status(500).send(err);
            next();
          });
      }
    );

  router
    .route("/:dishId")
    .get(function (req, res, next) {
      let dishId = req.params.dishId;

      Dishes.findById(dishId)
        .then((dish) => {
          res.status(200);
          res.send(dish);
          next();
        })
        .catch((err) => {
          res.status(404);
          next();
        });
    })
    .put(
      VerifyToken,
      Users.authorize([scopes["admin"], scopes["chef"]]),
      function (req, res, next) {
        let dishId = req.params.dishId;
        let body = req.body;

        Dishes.update(dishId, body)
          .then((dish) => {
            res.status(200);
            res.send(dish);
            next();
          })
          .catch((err) => {
            res.status(404);
            next();
          });
      }
    )
    .delete(
      VerifyToken,
      Users.authorize([scopes["admin"], scopes["chef"]]),
      function (req, res, next) {
        let dishId = req.params.dishId;

        Dishes.removeById(dishId)
          .then(() => {
            res.send("Apagado com sucesso");
            res.status(200).json();
            next();
          })
          .catch((err) => {
            res.status(404);
            next();
          });
      }
    );

  router.route("/search").get(function (req, res, next) {
    const query = req.query.name || ""; 

    if (!query) {
      return res.status(400).json({ message: "Search term is required" });
    }

    Dishes.findByName(query)
      .then((dishes) => {
        res.status(200).json(dishes);
      })
      .catch((err) => {
        console.error("Error searching dishes:", err);
        res
          .status(500)
          .json({ message: "Error searching dishes", error: err.message });
      });
  });

  router.route("/category").get(async function (req, res) {
    try {
      let categories = req.query.categories?.split(",") || [];

      if (categories.length === 0) {
        return res.status(400).json({ error: "No categories provided" });
      }

      let dishes = await Dishes.findByCategory(categories);

      return res.status(200).json(dishes);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  return router;
}

module.exports = DishRouter;
