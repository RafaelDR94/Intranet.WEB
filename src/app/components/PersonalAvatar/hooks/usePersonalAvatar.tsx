'use client'
import { useAuth } from "@/app/context/AuthContext/AuthContext"
import { useEffect, useState } from "react"
import { getInitials } from "../../Avatar/utilities/getInitials"

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