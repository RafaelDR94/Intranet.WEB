import { recoverPasswordType } from "./recoverPassword.types";

export const recoverPasswordMap = (user: any): recoverPasswordType => {
    return({
        username: user?.username ?? "",
    })
}

