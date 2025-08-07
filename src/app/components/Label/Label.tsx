import React from "react";
import clsx from "clsx";

type LabelType = "valido" | "invalido" | "prohibido";

interface LabelProps {
  type: LabelType;
  text: string;
}

const Label: React.FC<LabelProps> = ({ type, text }) => {
  const baseClasses =
    "inline-block text-center font-semibold text-label px-3 py-1 rounded-full w-auto m-1";

  const variantClasses: Record<LabelType, string> = {
    valido:
      "bg-alert-green-10 text-alert-green-100 border border-alert-green-100",
    invalido:
      "bg-alert-yellow-10 text-alert-yellow-100 border border-alert-yellow-100",
    prohibido:
      "bg-alert-red-10 text-alert-red-100 border border-alert-red-100",
  };

  return <span className={clsx(baseClasses, variantClasses[type])}>{text}</span>;
};

export default Label;