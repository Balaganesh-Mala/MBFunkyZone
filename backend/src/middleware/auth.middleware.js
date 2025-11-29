import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not Authorized, Token Missing");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = { id: decoded.id, role: decoded.role };

  const userExists = await User.findById(decoded.id);
  if (!userExists) {
    res.status(404);
    throw new Error("User no longer exists");
  }

  next();
});
