import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import UserAccount from "../models/user/user-account.model";
import passport from "passport";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "your_jwt_secret_key",
};

export const configureJwtStrategy = (passport: passport.PassportStatic) => {
  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        const user = await UserAccount.findById(jwt_payload._id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        return done(err, false, { message: "Server error" });
      }
    })
  );
};
