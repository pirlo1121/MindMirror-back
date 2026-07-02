const csrfProtection = (req, res, next) => {
  next();
};

module.exports = { csrfProtection };
