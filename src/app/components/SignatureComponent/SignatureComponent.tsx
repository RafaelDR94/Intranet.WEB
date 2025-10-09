import SignaturePopUp from "../SignaturePopUp/SignaturePopUp"
import { SignaturePopUpProps } from "../SignaturePopUp/types"
import SignaturePad from "../SignaturePAD/SignaturePAD"
import useSignatureComponent from "./hooks/useSignatureComponent"
const SignatureComponent: React.FC<SignaturePopUpProps> = ({ open, onClose, onAuthorization, responsibleGuid,externalSignature }) => {
    const {externalInformation,openSignaturePopUp,showSignaturePad,handleAuthorization,handleSignatureSave,handleCancel,onPopUpClose}=useSignatureComponent({open, onClose, onAuthorization, responsibleGuid,externalSignature})
    return (<>
        {showSignaturePad && open && <SignaturePad onSignatureSave={handleSignatureSave} onCancel={handleCancel} name={externalInformation.name} workposition={externalInformation.workposition}/>}
        
        <SignaturePopUp open={openSignaturePopUp} onClose={onPopUpClose} responsibleGuid={responsibleGuid} onAuthorization={handleAuthorization} externalSignature={externalSignature} />
    </>)

}
export default SignatureComponent