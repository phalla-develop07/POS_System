class BaseController {
  sendSuccess(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  sendError(next, error) {
    return next(error);
  }
}

module.exports.BaseController = BaseController;
