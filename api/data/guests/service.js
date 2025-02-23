function GuestService(GuestModel) {
  let service = {
    create,
    findAll,
    findById,
    findByField,
    removeById,
    clear
  };

  function create(guest) {
    return new Promise(function (resolve, reject) {
      GuestModel.create(guest, function (err, newGuest) {
        if (err) reject(err);
        resolve(newGuest);
      });
    });
  }

  function findAll() {
    return new Promise(function (resolve, reject) {
      GuestModel.find({}, function (err, guests) {
        if (err) reject(err);
        resolve(guests);
      });
    });
  }

  function findById(id) {
    return new Promise(function (resolve, reject) {
      GuestModel.findById(id, function (err, guest) {
        if (err) reject(err);
        resolve(guest);
      });
    });
  }

  function findByField(field, value) {
    return new Promise((resolve, reject) => {
      if (typeof value !== "string") {
        return reject(new Error(`Invalid ${field} parameter`));
      }

      const regex = new RegExp(value, "i");

      if (!["name", "email", "phone"].includes(field)) {
        return reject(new Error("Invalid search field"));
      }

      GuestModel.find({ [field]: { $regex: regex } }, function (err, guests) {
        if (err) return reject(err);
        resolve(guests);
      });
    });
  }

  function removeById(id) {
    return new Promise(function (resolve, reject) {
      GuestModel.findByIdAndRemove(id, function (err) {
        if (err) reject(err);
        resolve();
      });
    });
  }

  function clear() {
    return new Promise(function (resolve, reject) {
      GuestModel.deleteMany({}, function (err) {
        if (err) reject(err);
        resolve();
      });
    });
  }

  return service;
}

module.exports = GuestService;
