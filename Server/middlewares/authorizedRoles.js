import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const authorizeRoles = (...roles) =>
  asyncHandler((req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Access denied. Insufficient privileges");
    }
    next();
  });

export { authorizeRoles };
