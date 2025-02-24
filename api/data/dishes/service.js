function DishService(DishModel) {
  let service = {
    create,
    find,
    findAll,
    findById,
    update,
    remove,
    findByCategory,
    findByName,
    changeAvailability,
  };

  function create(dish) {
    let newDish = DishModel(dish);
    return save(newDish);
  }

  function save(newDish) {
    return new Promise(function (resolve, reject) {
      newDish.save(function (err) {
        if (err) reject(err);
        resolve("Dish created successfully");
      });
    });
  }

  function find(query) {
    return new Promise(function (resolve, reject) {
      DishModel.find(query, function (err, dishes) {
        if (err) reject(err);
        resolve(dishes);
      });
    });
  }

  function findAll() {
    return new Promise(function (resolve, reject) {
      DishModel.find({}, function (err, dishes) {
        if (err) reject(err);
        resolve(dishes);
      });
    });
  }

  function findById(id) {
    return new Promise(function (resolve, reject) {
      DishModel.findById(id, function (err, dish) {
        if (err) reject(err);
        resolve(dish);
      });
    });
  }

  function update(id, values) {
    return new Promise(function (resolve, reject) {
      DishModel.findByIdAndUpdate(id, values, function (err, dish) {
        if (err) reject(err);
        resolve("Dish updated successfully \n" + dish);
      });
    });
  }

  function remove(id) {
    return new Promise(function (resolve, reject) {
      DishModel.findByIdAndRemove(id, function (err) {
        if (err) reject(err);
        resolve("Dish removed successfully");
      });
    });
  }

  function findByCategory(categories) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(categories) && categories.length > 0) {
        DishModel.find(
          {
            categories: {
              $in: categories.map((cat) => new RegExp(`^${cat}$`, "i")),
            },
          },
          function (err, dishes) {
            if (err) return reject(err);
            resolve(dishes);
          }
        );
      } else {
        reject(new Error("Invalid categories array"));
      }
    });
  }

  function findByName(name) {
    return new Promise((resolve, reject) => {
      if (typeof name !== "string") {
        return reject(new Error("Invalid name parameter"));
      }

      const regex = new RegExp("^" + name, "i");

      DishModel.find({ name: { $regex: regex } }, function (err, dishes) {
        if (err) return reject(err);
        resolve(dishes);
      });
    });
  }

  function changeAvailability(id, availability) {
    return new Promise((resolve, reject) => {
      const validAvailability = [true, false];
      if (!validAvailability.includes(availability)) {
        return reject(new Error("Invalid availability value"));
      }

      DishModel.findOneAndUpdate(
        { _id: id },
        { availability: availability },
        { new: true }
      )
        .exec()
        .then(resolve)
        .catch(reject);
    });
  }

  return service;
}

module.exports = DishService;
