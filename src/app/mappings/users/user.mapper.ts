import { UserType } from "./user.types";

export const mapUser = (user: any): UserType => ({
  user_id: user?.user_id,
  username: user?.username,
  email_confirmed: user?.email_confirmed,
  phone_number_confirmed: user?.phone_number_confirmed,
  two_factor_enabled: user?.two_factor_enabled,
  lockout_enabled: user?.lockout_enabled,
  access_failed_count: user?.access_failed_count,
  lockout_end: user?.lockout_end,
  change_password: user?.change_password,
  signature: user?.signature,
});

export const mapUsers = (users: any[]): UserType[] => users.map(mapUser);
