
import { useState } from "react"
const useInput = (type:string) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type && type === 'password'
    return {isPassword,showPassword,setShowPassword}
}
export default useInput;