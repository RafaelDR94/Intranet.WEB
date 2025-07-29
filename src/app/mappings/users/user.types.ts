export type UserType = {
  user_id: string;
  username: string;
  email_confirmed: boolean;
  phone_number_confirmed: boolean;
  two_factor_enabled: boolean;
  lockout_enabled: boolean;
  access_failed_count: number;
  lockout_end: string | null;
  change_password: boolean;
  signature: string | null;
};
