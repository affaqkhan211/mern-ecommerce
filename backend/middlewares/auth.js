import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const isAuthenticatedUser = async (req, res, next) => {
  const { token } = req.cookies;

  console.log(req.cookies);
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Please login first",
    });
  }

  console.log(token);

  const decodeData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decodeData.id);

  next();
};

export const authrizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: FontFaceSetLoadEvent,
        message: "User is not allowed to do that",
      });
    }

    next();
  };
};
