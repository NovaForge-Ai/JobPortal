import { IUserAccount } from "../../interfaces/models";

declare global {
  namespace Express {
    interface Request {
      user?: IUserAccount;
    }
  }
} 