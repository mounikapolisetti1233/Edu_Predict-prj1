const facultyOrAdmin = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "Faculty" || req.user.role === "Admin")
  ) {
    return next();
  }

  return res.status(403).json({
    message: "Access denied. Faculty or Admin only.",
  });
};

module.exports = { facultyOrAdmin };