"use client"

import clsx from "clsx";
import React from "react";

import DynamicForm from "@/app/components/DynamicForm/DynamicForm";

import { useNip } from "./hooks/useNip";
import { card, description, header, title } from "./styles";
import type { NipProps } from "./types";

const Nip: React.FC<NipProps> = ({ className }) => {
  const { fields, handleSubmit, valuesVersion } = useNip();

  return (
    <section className={clsx(card, className)}>
      <header className={header}>
        <h3 className={title}>NIP</h3>
        <p className={description}>
          El NIP autoriza acciones sin firmar digitalmente
        </p>
      </header>

      <DynamicForm
        fields={fields}
        onSubmit={handleSubmit}
        marginButton="90px"
        submitLabel="Cambiar NIP"
        responsiveLayoutMatrix={{ sm: [[10]], md: [[10]] }}
        valuesVersion={valuesVersion}
      />
    </section>
  );
};

export default Nip;
