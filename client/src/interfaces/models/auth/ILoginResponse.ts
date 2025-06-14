export interface ILoginResponse {
  user: {
    _id: string;
    email: string;
    user_type_name: string;
    user_type?: string;
    [key: string]: any;
  };
  token: string;
  message?: string;
}
