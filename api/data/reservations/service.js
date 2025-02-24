const mongoose = require("mongoose");

function ReservationService(ReservationModel) {
  let service = {
    create,
    update,
    findById,
    findByUserId,
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

  function update(id, values) {
    return new Promise(function (resolve, reject) {
      ReservationModel.findByIdAndUpdate(
        id,
        values,
        function (err, reservation) {
          if (err) reject(err);
          resolve("Reservation updated successfully \n" + reservation);
        }
      );
    });
  }

  function findById(id) {
    return new Promise(function (resolve, reject) {
      ReservationModel.findById(id, function (err, reservation) {
        if (err) {
          reject(err);
          return;
        }

        if (!reservation) {
          reject(new Error("Reservation not found"));
          return;
        }

        console.log("Reservation found:", reservation);
        resolve(reservation);
      });
    });
  }

  function findByUserId(userId) {
    return new Promise(function (resolve, reject) {
      const userObjectId = mongoose.Types.ObjectId(userId);

      ReservationModel.find(
        {
          $or: [{ client: userObjectId }, { guest: userObjectId }],
        },
        function (err, reservations) {
          if (err) reject(err);
          resolve(reservations);
        }
      );
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
