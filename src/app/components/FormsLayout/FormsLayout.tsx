import { ReactNode } from "react"
import { Button } from "../Button/Button"
import CollapsibleSection from "../CollapsibleSection/CollapsibleSection"

type FormsLayoutProps = {
    title: string
    buttonLabel: string
    onButtonClick?: () => void
    buttonDisabled?: boolean
    children: ReactNode
    enableCollapse?:boolean
    showDivider?:boolean
}

const FormsLayout = ({
    title,
    buttonLabel,
    onButtonClick,
    buttonDisabled = false,
    enableCollapse=true,
    showDivider=true,
    children
    
}: FormsLayoutProps) => {
    return (
        <div className="flex flex-col gap-4">
            {/* Título y botón */}
            <CollapsibleSection
                title={title}
                enableCollapse={enableCollapse}
                showDivider={showDivider}
                rightContent={<Button
                    onClick={onButtonClick}
                    disabled={buttonDisabled}
                    hideIcon
                >
                    {buttonLabel}
                </Button>}>
                <div className="flex bg-white-100 p-6 rounded-lg shadow-md gap-6">

                    {children}

                </div>
            </CollapsibleSection>
            {/* <div className="flex justify-between items-center">
                <h2 className="text-blue-60 text-b4 font-medium">{title}</h2>

            </div> */}

            {/* Contenedor del formulario + imagen */}

        </div>
    )
}

export default FormsLayout