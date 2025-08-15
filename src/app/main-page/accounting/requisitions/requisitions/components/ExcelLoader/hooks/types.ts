/**
 * Representa la función de envío del archivo Excel.
 * Puede ser síncrona o retornar una promesa.
 */
export type SubmitFn = () => void | Promise<void>;