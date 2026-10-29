
function errorHandler(err, req, res, next) {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      success: false,
      message: "A record with this value already exists"
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.status
      ? err.message
      : "Internal server error"
  });
}

module.exports = errorHandler;
