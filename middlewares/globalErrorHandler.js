export default function globalErrorHandler(err, _, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  console.log("Error", err);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
  });
}
