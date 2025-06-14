export interface IRegisterResponse {
  user: {
    user_type: string;
    [key: string]: any;
  };
  token: string;
  message: string;
}
