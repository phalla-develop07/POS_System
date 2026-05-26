function errorHandler(err, _req, res, _next) {
  if (err && typeof err.statusCode === 'number') {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
}

module.exports.errorHandler = errorHandler;
