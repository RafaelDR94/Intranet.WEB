
import { Spinner } from "../Spinner/Spinner"
import Avatar from "../Avatar/Avatar"
import usePersonalAvatar from "./hooks/usePersonalAvatar"
import { PersonalAvatarProps } from "./types"

const PersonalAvatar:React.FC<PersonalAvatarProps> = ({size})=>{
    const {avatarInit}=usePersonalAvatar();
    return(<>
      {avatarInit.initials ?<Avatar initials={avatarInit.initials} size={size} src={avatarInit.src} online/>:<Spinner size="medium"/>}
    </>)
}
export default PersonalAvatar;