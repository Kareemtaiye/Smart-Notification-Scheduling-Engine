import AppError from "../utilities/AppError.js";
export default function undhandledRouteHandler(req, res, next) {
  return next(
    new AppError(`The route (${req.originalUrl}) doesn't exist on the server`, 404),
  );
}
