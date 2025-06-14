export interface IUserAccount {
  _id: string;
  user_type_id: string;
  user_type_name?: string;
  email: string;
  password: string;
  date_of_birth?: Date;
  gender?: string;
  is_active?: boolean;
  contact_number?: string;
  sms_notification_active?: boolean;
  email_notification_active?: boolean;
  user_image?: string;
  registration_date: Date;
  createdAt: Date;
  updatedAt: Date;
} 