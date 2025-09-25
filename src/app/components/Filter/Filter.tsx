import React from 'react';
import ContextMenu from '../ContextMenu/ContextMenu';
import FilterIcon from "@/assets/icons/organization/filter-alt.svg";

const Filter = () => {
    return (
        <ContextMenu
            title="Estados"
            trigger={<FilterIcon />}
            items={[
                { label: 'Vale Rosa', controlType: 'radio', controlSide: 'left',  onClick: () => console.log('Opción 1 seleccionada') },
                { label: 'Vale Azul', controlType: 'radio', controlSide: 'left', onClick: () => console.log('Opción 2 seleccionada') },
                { label: 'Validado', controlType: 'radio', controlSide: 'left', onClick: () => console.log('Opción 3 seleccionada') },
                { label: 'Rechazado', controlType: 'radio', controlSide: 'left', onClick: () => console.log('Opción 3 seleccionada') },
                { label: 'En Proceso', controlType: 'radio', controlSide: 'left', onClick: () => console.log('Opción 3 seleccionada') },
            ]}
        />
    );
}

export default Filter;