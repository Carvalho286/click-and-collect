const config = require("../../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

function UserService(UserModel) {
  let service = {
    create,
    createToken,
    verifyToken,
    findUser,
    findOne,
    findAll,
    findById,
    update,
    removeById,
    authorize,
  };

  function create(user) {
    return createPassword(user).then((hashPassword, err) => {
      if (err) {
        return Promise.reject("Unsaved");
      }

      let newUserWithPassword = {
        ...user,
        password: hashPassword,
      };

      let newUser = UserModel(newUserWithPassword);
      return save(newUser);
    });
  }

  function save(newUser) {
    return new Promise(function (resolve, reject) {
      newUser.save(function (err) {
        if (err) reject(err);
        resolve("User created successfully");
      });
    });
  }

  function createToken(user) {
    let token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        role: user.role.scopes,
      },
      config.secret,
      {
        expiresIn: config.expiresPassword,
      }
    );

    return {
      auth: true,
      token,
    };
  }

  function verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          reject();
        }
        return resolve(decoded);
      });
    });
  }

  function findUser({ email, password }) {
    return new Promise(function (resolve, reject) {
      UserModel.findOne({ email }, function (err, user) {
        if (err) reject(err);

        if (!user) {
          reject("Invalid information");
        }

        resolve(user);
      });
    }).then((user) => {
      return comparePassword(password, user.password).then((match) => {
        if (!match) return Promise.reject("invalid user");
        return Promise.resolve(user);
      });
    });
  }

  function createPassword(user) {
    return bcrypt.hash(user.password, config.saltRounds);
  }

  function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  function authorize(scopes) {
    return (request, response, next) => {
      const { roleUser } = request;
      const hasAutorization = scopes.some((scope) => roleUser.includes(scope));

      if (roleUser && hasAutorization) {
        next();
      } else {
        response.status(403).json({ message: "Forbidden" });
      }
    };
  }

  function findAll() {
    return new Promise(function (resolve, reject) {
      UserModel.find({}, function (err, users) {
        if (err) reject(err);
        resolve(users);
      });
    });
  }

  function findById(id) {
    return new Promise(function (resolve, reject) {
      UserModel.findById(id, function (err, user) {
        if (err) reject(err);
        resolve(user);
      });
    });
  }

  function findOne(query) {
    return new Promise(function (resolve, reject) {
      UserModel.findOne(query, function (err, user) {
        if (err) reject(err);
        resolve(user);
      });
    });
  }

  function update(userId, userUpdates) {
    return new Promise(async (resolve, reject) => {
      try {
        if (userUpdates.password) {
          userUpdates.password = await createPassword(userUpdates.password);
        }
  
        let updatedUser = await UserModel.findByIdAndUpdate(userId, userUpdates, {
          new: true, // Return the updated user
          runValidators: true, // Ensure validation is applied
        });
  
        if (!updatedUser) {
          return reject(new Error("User not found"));
        }
  
        resolve(updatedUser);
      } catch (err) {
        reject(err);
      }
    });
  }
  

  function secondUpdate(id, newUser) {
    return new Promise(function (resolve, reject) {
      UserModel.findByIdAndUpdate(id, newUser, function (err, lol) {
        if (err) {
          reject(err);
        } else {
          resolve("User updated successfully with " + lol);
        }
      });
    });
  }

  function removeById(id) {
    return new Promise(function (resolve, reject) {
      UserModel.findByIdAndRemove(id, function (err) {
        console.log(err);
        if (err) reject(err);
        resolve();
      });
    });
  }

  return service;
}

module.exports = UserService;
