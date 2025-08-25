import { changePasswordType } from "./changePassword.types";

export const changePasswordMap = (pass: any): changePasswordType => ({
    email: pass.email,
    newPassword: pass.newPassword,
    changePassword: pass.changePassword,
})