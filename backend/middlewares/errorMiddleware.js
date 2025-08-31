module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message: err.message || 'Internal server error',
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.error = err;
  }

  // Customize some common errors
  if (err.name === 'ValidationError') {
    response.message = Object.values(err.errors).map(val => val.message).join(', ');
  } else if (err.name === 'CastError') {
    response.message = `Resource not found: Invalid ${err.path}`;
  } else if (err.code === 11000) {
    response.message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(', ')}`;
  } else if (err.name === 'JsonWebTokenError') {
    response.message = 'JSON Web Token is invalid. Please login again.';
  } else if (err.name === 'TokenExpiredError') {
    response.message = 'JSON Web Token has expired. Please login again.';
  }

  res.status(statusCode).json(response);
};