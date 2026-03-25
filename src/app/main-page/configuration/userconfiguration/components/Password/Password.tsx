"use client"

import clsx from "clsx";
import React from "react";

import { Button } from "@/app/components/Button/Button";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import { Input } from "@/app/components/Input/Input";

import { usePassword } from "./hooks/usePassword";
import { actions, card, content, description, header, title } from "./styles";
import type { PasswordProps } from "./types";

const Password: React.FC<PasswordProps> = ({ className }) => {
  const {
    isEditing,
    startEditing,
    displayPassword,
    fields,
    valuesVersion,
    handleSubmit,
  } = usePassword();

  return (
    <section className={clsx(card, className)}>
      <header className={header}>
        <h3 className={title}>Contraseña</h3>
        <p className={description}>Ajuste y/o cambio de contraseña</p>
      </header>

      {isEditing ? (
        <DynamicForm
          fields={fields}
          onSubmit={handleSubmit}
          submitLabel="Guardar Contraseña"
          marginButton="15px"
          responsiveLayoutMatrix={{ sm: [[10], [10]], md: [[10], [10]] }}
          valuesVersion={valuesVersion}
        />
      ) : (
        <div className={content}>
          <Input
            label="Contraseña actual"
            type="password"
            value={displayPassword}
            readOnly
            disabled
          />

          <div className={actions}>
            <Button hideIcon className="w-full" onClick={startEditing}>
              Cambiar Contraseña
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Password;
