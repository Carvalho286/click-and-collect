function ReservationService(ReservationModel) {
  let service = {
    create,
    findAll,
    changeStatus,
  };

  function create(reservation) {
    let newReservation = ReservationModel(reservation);
    return save(newReservation);
  }

  function save(newReservation) {
    return new Promise(function (resolve, reject) {
      newReservation.save(function (err) {
        if (err) reject(err);
        resolve("Reservation created successfully");
      });
    });
  }

  function findAll() {
    return new Promise(function (resolve, reject) {
      ReservationModel.find({}, function (err, reservations) {
        if (err) reject(err);
        resolve(reservations);
      });
    });
  }

  function changeStatus(id, status) {
    return new Promise((resolve, reject) => {
      const validStatuses = ["pending", "confirmed", "canceled", "completed"];

      if (!validStatuses.includes(status)) {
        return reject(new Error("Invalid status value"));
      }

      ReservationModel.findOneAndUpdate(
        { _id: id },
        { status: status },
        { new: true }
      )
        .exec()
        .then(resolve)
        .catch(reject);
    });
  }

  return service;
}

module.exports = ReservationService;
