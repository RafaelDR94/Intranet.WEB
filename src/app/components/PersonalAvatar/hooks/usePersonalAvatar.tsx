'use client'
import { useAuth } from "@/app/context/AuthContext/AuthContext"
import { useEffect, useState } from "react"
import { getInitials } from "../../Avatar/utilities/getInitials"
/**
 * Custom hook para obtener la información visual del avatar personal del usuario autenticado.
 *
 * Este hook utiliza el contexto de autenticación (`useAuth`) para acceder al `user`,
 * y genera las iniciales y la ruta de la imagen del perfil con base en su `fullName` y `imageProfile`.
 *
 * @returns {Object} avatarInit - Contiene las iniciales (`initials`) y el `src` de la imagen del avatar.
 *
 * @example
 * const { avatarInit } = usePersonalAvatar();
 * console.log(avatarInit.initials); // "JD"
 * console.log(avatarInit.src); // "img.png"
 */
const usePersonalAvatar =()=>{
    const [avatarInit,setAvatarInit]=useState({initials:"",src:""})
    const {user}=useAuth();
    useEffect(()=>{
        if(user?.fullName){
            setAvatarInit({initials:getInitials(user.fullName),src:user?.imageProfile||""})
        }
    },[user])

    return {avatarInit}
      
}
export default usePersonalAvatar;