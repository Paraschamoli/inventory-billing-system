import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  console.log(req);

  const token =
    req.cookies?.jwt ||
    (req.header("Authorization")?.startsWith("Bearer") &&
      req.header("Authorization").replace("Bearer ", ""));
  console.log(token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
 console.log(decoded);
 
    const user = await User.findById(decoded?.id).select("-password");
console.log(user);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Unauthorized, invalid or expired token" });
  }
});
