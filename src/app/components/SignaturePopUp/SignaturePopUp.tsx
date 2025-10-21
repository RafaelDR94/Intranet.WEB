import DynamicForm from "../DynamicForm/DynamicForm"
import { PopUp } from "../PopUp/PopUp"
import { SignaturePopUpProps } from "./types"
import useSignaturePopUp from "./hooks/useSignaturePopUp"
const SignaturePopUp: React.FC<SignaturePopUpProps> = ({ open, onClose, onAuthorization, responsibleGuid ,externalSignature}) => {

    const { fields, handleSubmit } = useSignaturePopUp({ onClose, onAuthorization, responsibleGuid, externalSignature});
    return (
        <PopUp open={open} onClose={onClose} title="Firmar" content="Ingresa tu firma para validar">
            <DynamicForm fields={fields} onSubmit={handleSubmit} submitLabel="Aceptar" />

        </PopUp>

    )

}
export default SignaturePopUp