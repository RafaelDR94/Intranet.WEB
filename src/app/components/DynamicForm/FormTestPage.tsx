'use client';

import { PopUp } from '../PopUp/PopUp';
// import { DynamicForm, FieldModel } from './DynamicForm(Original)';
import { SelectOption } from '../Select/types';
import { DynamicForm } from './DynamicForm';
import { FieldModel} from './types';

const colorOptions: SelectOption[] = [
    { label: 'Rojo', value: 'rojo' },
    { label: 'Azul', value: 'azul' },
    { label: 'Verde', value: 'verde' },
];

const languageOptions: SelectOption[] = [
    { label: 'Español', value: 'es' },
    { label: 'Inglés', value: 'en' },
    { label: 'Francés', value: 'fr' },
    { label: 'Latín', value: 'la' }, // Warning esperado
];

const fields: FieldModel[] = [
    {
        type: 'input',
        name: 'nombre',
        label: 'Nombre',
        value: '',
        validations: [
            { type: 'required' },
            { type: 'minLength', value: 3 },
            { type: 'maxLength', value: 20 },
        ],
        warningRules: [
            { type: 'minLengthWarning', value: 5 },
            { type: 'maxLengthWarning', value: 10 },
        ],
    },
    {
        type: 'email',
        name: 'correo',
        label: 'Correo electrónico',
        value: '',
        validations: [
            { type: 'required' },
            { type: 'email' },
        ],
        warningRules: [
            { type: 'deprecatedEmailDomain' },
        ],
    },
    {
        type: 'password',
        name: 'contrasena',
        label: 'Contraseña',
        value: '',
        validations: [
            { type: 'required' },
            { type: 'minLength', value: 6 },
        ],
        warningRules: [
            { type: 'weakPassword' },
        ],
    },
    {
        type: 'number',
        name: 'edad',
        label: 'Edad',
        value: '',
        validations: [
            { type: 'required' },
            { type: 'min', value: 1 },
            { type: 'max', value: 120 },
        ],
        warningRules: [
            { type: 'ageIsLowButValid' },
            { type: 'ageIsHighButValid' },
        ],
    },

    // ✅ NUEVO: checkbox para controlar "colorFavorito"
    {
        type: 'checkbox',
        name: 'mostrarColor',
        label: '¿Mostrar selección de color favorito?',
        value: false,
    },
    {
        type: 'select',
        name: 'colorFavorito',
        label: 'Color Favorito',
        value: '',
        options: colorOptions,
        validations: [{ type: 'required' }],
        showIf: (values) => values.mostrarColor === true,
    },

    // ✅ NUEVO: toggle para controlar "idiomas"
    {
        type: 'toggle',
        name: 'mostrarIdiomas',
        label: '¿Mostrar idiomas?',
        value: false,
    },
    {
        type: 'multiSelect',
        name: 'idiomas',
        label: 'Idiomas que hablas',
        value: [],
        options: languageOptions,
        validations: [{ type: 'required' }],
        warningRules: [{ type: 'unverifiedLanguage' }],
        showIf: (values) => values.mostrarIdiomas === true,
    },
];

export default function FormTestPage() {
    return (
        <div className="min-h-screen py-10 px-4">
            <DynamicForm
            
                fields={fields}
                submitLabel="Enviar"
                onSubmit={(values) => {
                    alert('Datos enviados:\n' + JSON.stringify(values, null, 2));
                }}
                showSubmitIf={(values) => values.edad >= 18 && values.nombre?.length >= 3}
                showSecondaryButtonIf={(values) => values.edad >= 18}
                onSecondaryButtonClick={(values) => {
                    console.log('Botón secundario clickeado con valores:', values);
                }}
                secondaryButtonLabel="Previsualizar"
            />
        </div>
    );
}
