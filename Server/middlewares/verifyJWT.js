import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler((req, res, next) => {
  const incomingToken = req.headers?.authorization?.split(" ")[1];
  if (!incomingToken)
    throw new ApiError(401, "Access Denied. No token provided");

  const decodedToken = jwt.verify(incomingToken, process.env.AUTH_TOKEN);
  req.user = decodedToken;
  next();
});

export { verifyJWT };
