function GuestService(GuestModel) {
  let service = {
    create,
    findAll,
    findById,
    removeById,
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

  function removeById(id) {
    return new Promise(function (resolve, reject) {
      GuestModel.findByIdAndRemove(id, function (err) {
        if (err) reject(err);
        resolve();
      });
    });
  }

  return service;
}

module.exports = GuestService;
