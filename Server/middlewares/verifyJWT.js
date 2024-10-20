import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler((req, res, next) => {
  const incomingToken = req.headers?.authorization?.split(" ")[1];
  if (!incomingToken) throw new ApiError(400, "Token is missing");

  const decodedToken = jwt.verify(incomingToken, process.env.AUTH_TOKEN);
  if (!decodedToken) throw new ApiError(500, "Jwt token expired");

  req.user = decodedToken.id;
  next();
});

export { verifyJWT };
