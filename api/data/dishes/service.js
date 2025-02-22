function DishService(DishModel) {
  let service = {
    create,
    findAll,
    findById,
    update,
    remove,
    findByCategory,
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

  function findByCategory(category) {
    return new Promise((resolve, reject) => {
      DishModel.find({ categories: category }, function (err, dishes) {
        if (err) reject(err);
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
