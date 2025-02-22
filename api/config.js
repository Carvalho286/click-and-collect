const config = {
  db: "mongodb://localhost/click-and-collect",
  secret: "supersecret",
  expiresPassword: 86400, //expira em 24h
  saltRounds: 10,
};

module.exports = config;
