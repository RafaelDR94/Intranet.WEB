"use client"

import clsx from "clsx";
import Image from "next/image";
import React from "react";

import { Button } from "@/app/components/Button/Button";
import SignatureComponent from "@/app/components/SignatureComponent/SignatureComponent";

import { useSignature } from "./hooks/useSignature";
import {
  card,
  description,
  emptyMessage,
  header,
  previewContainer,
  previewImage,
  title,
} from "./styles";
import type { SignatureProps } from "./types";

const Signature: React.FC<SignatureProps> = ({ className }) => {
  const {
    open,
    preview,
    hasSignature,
    responsibleGuid,
    isButtonDisabled,
    handleOpen,
    handleClose,
    handleAuthorization,
  } = useSignature();

  return (
    <section className={clsx(card, className)}>
      <header className={header}>
        <h3 className={title}>Firma Digital</h3>
        <p className={description}>
          La firma se insertará en los documentos después de haber autorizado una acción
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <div className={previewContainer}>
          {hasSignature ? (
            <Image
              src={preview}
              width={100}
              height={100}
              alt="Firma digital"
              className={previewImage}
            />
          ) : (
            <span className={emptyMessage}>Aún no tienes una firma registrada.</span>
          )}
        </div>

        <Button
          onClick={handleOpen}
          variant="solid"
          hideIcon
          disabled={isButtonDisabled}
        >
          Actualizar Firma
        </Button>
      </div>

      <SignatureComponent
        open={open}
        onClose={handleClose}
        onAuthorization={handleAuthorization}
        responsibleGuid={responsibleGuid}
        skipAuthorization
        fullScreenPad
      />
    </section>
  );
};

export default Signature;
