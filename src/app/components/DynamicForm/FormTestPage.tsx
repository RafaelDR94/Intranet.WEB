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
import Avatar from "../Avatar/Avatar";
import Pagination from "../Pagination/Pagination";

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
      <Avatar
        src=''
        alt = 'avatar'
        initials = 'A'
        size = 'xl'
        online = {true}
        className = '' 
        />
        <Avatar
        src=''
        alt = 'avatar'
        initials = 'A'
        size = 'lg'
        online = {true}
        className = '' 
        />
        <Avatar
        src=''
        alt = 'avatar'
        initials = 'A'
        size = 'md'
        online = {true}
        className = '' 
        />
        <Avatar
        src=''
        alt = 'avatar'
        initials = 'A'
        size = 'sm'
        online = {true}
        className = '' 
        />
        <Avatar
        src=''
        alt = 'avatar'
        initials = 'A'
        size = 'xs'
        online = {true}
        className = '' 
        />
        <Avatar
        src=''
        alt = 'avatar'
        initials = 'A'
        size = 'xxs'
        online = {true}
        className = '' 
        />
      <div className="mt-10">
        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
