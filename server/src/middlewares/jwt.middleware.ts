import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import UserAccount from "../models/user/user-account.model";
import UserType from "../models/user/user-type.model";
import passport from "passport";
import { IUserAccount } from "../interfaces/models";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "your_jwt_secret_key",
};

export const configureJwtStrategy = (passport: passport.PassportStatic) => {
  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        console.log('=== JWT Strategy ===');
        console.log('JWT Payload:', jwt_payload);
        
        const user = await UserAccount.findById(jwt_payload._id).populate({
          path: 'user_type_id',
          select: 'user_type_name'
        });
        
        if (user) {
          // Add user_type_name to the user object
          const userObj = user.toObject() as IUserAccount & { user_type_name: string };
          
          // Ensure we have the user type name
          if (!user.user_type_id || typeof user.user_type_id === 'string') {
            console.error('User type not properly populated:', user);
            return done(new Error('User type not found'), false);
          }
          
          userObj.user_type_name = (user.user_type_id as any).user_type_name;
          
          console.log('=== User Found ===');
          console.log('User ID:', userObj._id);
          console.log('User Type Name:', userObj.user_type_name);
          console.log('User Type ID:', userObj.user_type_id);
          console.log('Full User Object:', JSON.stringify(userObj, null, 2));
          
          return done(null, userObj);
        }
        
        console.log('No user found for JWT payload:', jwt_payload);
        return done(null, false);
      } catch (error) {
        console.error('JWT Strategy Error:', error);
        return done(error, false);
      }
    })
  );
};
