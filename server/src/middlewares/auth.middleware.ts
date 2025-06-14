import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("jwt", function (err: any, user: any, info: any) {
    if (err) {
      console.error('Auth middleware error:', err);
      return next(err);
    }

    if (!user) {
      console.log('No user found in auth middleware');
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    console.log('User found in auth middleware:', {
      userId: user._id,
      userType: user.user_type_name,
      userTypeId: user.user_type_id,
      fullUser: user
    });

    // Ensure user_type_name is set
    if (!user.user_type_name) {
      console.error('User type name not found in user object:', user);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "User type not found" });
    }

    req.user = user;
    next();
  })(req, res, next);
};
