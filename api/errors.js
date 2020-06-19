class AppError extends Error {
  constructor(message, status) {
    super(message);

    this.status = status;

    Error.captureStackTrace(this, this.constructor);
  }
}

const catchAsync = fn => (req, res, next) => {
  fn(req, res, next).catch(next);
};

function custom404(req, res, next) {
  next(
    new AppError(
      `${req.method} on ${req.originalUrl} is not a valid request.`,
      404
    )
  );
}

function errorHandling(error, req, res, next) {
  console.error(error);
  const { status = 500, message = "Error" } = error;
  return res.status(status).json({ message });
}

module.exports = { AppError, catchAsync, custom404, errorHandling };
