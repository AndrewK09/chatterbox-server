const logger = (req, res, next) => {
  console.log(
    `Serving: ${req.protocol}://${req.get("host")}${req.originalUrl}`
  );
  next();
};

exports.logger = logger;
