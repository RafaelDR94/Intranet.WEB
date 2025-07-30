"use client";
import { useState } from "react";
// import { DynamicForm, FieldModel } from './DynamicForm(Original)';
import { SelectOption } from "../Select/types";
import { DynamicForm } from "./DynamicForm";
import { FieldModel } from "./types";
import { Tooltip } from "../Tooltip/Tooltip";
import { Control } from "../Control/Control";
import PaginationDots from "../PaginationDots/PaginationDots";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import CustomRadio from "../CustomRadio/CustomRadio";

const colorOptions: SelectOption[] = [
  { label: "Rojo", value: "rojo" },
  { label: "Azul", value: "azul" },
  { label: "Verde", value: "verde" },
];

const languageOptions: SelectOption[] = [
  { label: "Español", value: "es" },
  { label: "Inglés", value: "en" },
  { label: "Francés", value: "fr" },
  { label: "Latín", value: "la" }, 
];

const fields: FieldModel[] = [
  {
    type: "input",
    name: "nombre",
    label: "Nombre",
    value: "",
    validations: [
      { type: "required" },
      { type: "minLength", value: 3 },
      { type: "maxLength", value: 20 },
    ],
    warningRules: [
      { type: "minLengthWarning", value: 5 },
      { type: "maxLengthWarning", value: 10 },
    ],
  },
  {
    type: "email",
    name: "correo",
    label: "Correo electrónico",
    value: "",
    validations: [{ type: "required" }, { type: "email" }],
    warningRules: [{ type: "deprecatedEmailDomain" }],
  },
  {
    type: "password",
    name: "contrasena",
    label: "Contraseña",
    value: "",
    validations: [{ type: "required" }, { type: "minLength", value: 6 }],
    warningRules: [{ type: "weakPassword" }],
  },
  {
    type: "number",
    name: "edad",
    label: "Edad",
    value: "",
    validations: [
      { type: "required" },
      { type: "min", value: 1 },
      { type: "max", value: 120 },
    ],
    warningRules: [{ type: "ageIsLowButValid" }, { type: "ageIsHighButValid" }],
  },

  // ✅ NUEVO: checkbox para controlar "colorFavorito"
  {
    type: "checkbox",
    name: "mostrarColor",
    label: "¿Mostrar selección de color favorito?",
    value: false,
  },
  {
    type: "select",
    name: "colorFavorito",
    label: "Color Favorito",
    value: "",
    options: colorOptions,
    validations: [{ type: "required" }],
    showIf: (values) => values.mostrarColor === true,
  },

  // ✅ NUEVO: toggle para controlar "idiomas"
  {
    type: "toggle",
    name: "mostrarIdiomas",
    label: "¿Mostrar idiomas?",
    value: false,
  },
  {
    type: "multiSelect",
    name: "idiomas",
    label: "Idiomas que hablas",
    value: [],
    options: languageOptions,
    validations: [{ type: "required" }],
    warningRules: [{ type: "unverifiedLanguage" }],
    showIf: (values) => values.mostrarIdiomas === true,
  },
];

export default function FormTestPage() {
  const [activeTab, setActiveTab] = useState<number | null>(0);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 8;
  const totalPages2 = 4;
  const levels = [0, 20, 40, 60, 80, 100];
  const [selected, setSelected] = useState('opcion2');

  return (
    <div className="min-h-screen py-10 px-4 bg-white-100">
      <DynamicForm
        fields={fields}
        submitLabel="Enviar"
        onSubmit={(values) => {
          alert("Datos enviados:\n" + JSON.stringify(values, null, 2));
        }}
        showSubmitIf={(values) =>
          values.edad >= 18 && values.nombre?.length >= 3
        }
        showSecondaryButtonIf={(values) => values.edad >= 18}
        onSecondaryButtonClick={(values) => {
          console.log("Botón secundario clickeado con valores:", values);
        }}
        secondaryButtonLabel="Previsualizar"
      />
      <div className="flex items-center">
        <Tooltip text="Este es un Tooltip" position="bottom">
          <button className="bg-gray-70 text-white px-4 py-2 rounded">Abajo</button>
        </Tooltip>
      </div>
      <div className="flex items-center mt-4">
        <Tooltip text="Este es un Tooltip" position="top">
          <button className="bg-gray-70 text-white px-4 py-2 rounded">Arriba</button>
        </Tooltip>
      </div>
      <div className="flex items-center mt-4">
        <Tooltip text="Este es un Tooltip" position="right">
          <button className="bg-gray-70 text-white px-4 py-2 rounded">Izquierda</button>
        </Tooltip>
      </div>
      <div className="flex items-center mt-4">
        <Tooltip text="Este es un Tooltip" position="left">
          <button className="bg-gray-70 text-white px-4 py-2 rounded">Derecha</button>
        </Tooltip>
      </div>
      <div className="mt-10">
        <Control
          value={5}
          onIncrement={() => console.log("Incrementar")}
          onDecrement={() => console.log("Decrementar")}
          variant="outlined"
        />
      </div>
      <div className="mt-10">
        <Control
          value={5}
          onIncrement={() => console.log("Incrementar")}
          onDecrement={() => console.log("Decrementar")}
          variant="filled"
        />
      </div>
      <div className="mt-10">
        <PaginationDots
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      </div>
      <div className="mt-10">
        <PaginationDots
        totalPages={totalPages2}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      </div>
      <div className="grid grid-cols-2 gap-x-8 mt-10">
        <ProgressBar value={60} showPercentage={true} />
        <ProgressBar value={75} label="Avance" />
    </div>
    <div className="flex flex-col mt-10">
      {['opcion1', 'opcion2', 'opcion3', 'opcion4'].map((val, idx) => (
        <CustomRadio
          key={val}
          id={`radio-${val}`}
          name="grupo1"
          label={`Texto`}
          value={val}
          checked={selected === val}
          onChange={setSelected}
          disabled={val === 'opcion4'}
        />
      ))}
    </div>
    </div>
  );
}
