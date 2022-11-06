const checkAdminToken = (req, res, next) => {
  if (!req.headers.cookie) return res.status(403).send("Unauthorized.");
  next();
};

module.exports = checkAdminToken;
