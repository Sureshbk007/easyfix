import { ApiError } from "./ApiError.js";

const GlobalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json(new ApiError(statusCode, message, err.errors));
};

const PageNotFound = (req, res) => {
  res.status(404).json(new ApiError(404, "Page Not Found"));
};
export { GlobalErrorHandler, PageNotFound };
