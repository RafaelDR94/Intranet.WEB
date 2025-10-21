export type External ={
    name:string,
    workposition:string,
}
export interface Authorized { state: boolean, signature: string | null ,external?:External}
export interface SignaturePopUpProps {
    open: boolean,
    onClose: () => void
    onAuthorization: (authorized: Authorized) => void; // Callback para manejar la autorización
    warningMessage?: string; // Mensaje de aviso opcional
    formDisabled?: boolean; // Controla si el formulario está bloqueado
    responsibleGuid: string;
    externalSignature?:boolean;
}
export interface UseSignaturePopUpProps {
    onAuthorization: (authorized: Authorized) => void; // Callback para manejar la autorización
    responsibleGuid: string;
    externalSignature?:boolean;
    onClose: () => void;
}