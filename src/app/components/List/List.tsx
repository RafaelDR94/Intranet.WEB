import React from "react";
import CustomRadio from "../CustomRadio/CustomRadio";
import { Checkbox } from "../CheckBox/CheckBox";
import { ToggleButton } from "../ToogleButton/ToogleButton";
import { Button } from "../Button/Button";
import { Control } from "../Control/Control";
import PersonalAvatar from "../PersonalAvatar/PersonalAvatar";
import { listStyles } from "./styles";
import type { ListProps } from "./types";

/**
 * Lista presentacional que muestra elementos con:
 * - **Avatar opcional** a la izquierda.
 * - **Etiqueta (label)** del ítem.
 * - Un **control contextual** a la derecha, determinado por `controlType`
 *   (`details`, `badge`, `arrow`, `toggle`, `radio`, `checkbox`, `control`).
 *
 * @remarks
 * - Esta implementación es **puramente visual**: los controles de la derecha
 *   usan handlers vacíos/estados fijos (por ejemplo `checked={false}`).
 *   Conéctalos a tu estado global (Zustand/Formik/etc.) pasando props reales
 *   o extendiendo el tipo `ListItem` con `controlProps`.
 * - `listStyles` agrupa las clases Tailwind/CSS para mantener consistencia.
 *
 * @accessibility
 * - El `label` visible comunica el propósito del ítem.
 * - Considera añadir `aria-label` a los botones/íconos (por ejemplo:
 *   “Ver detalles de {label}”) si el contexto no es obvio.
 * - Los inputs nativos (`checkbox`/`radio`) dentro de los subcomponentes ya
 *   manejan rol y foco; asegúrate de que sus `label`/`name` sean significativos.
 *
 * @example
 * ```tsx
 * const items = [
 *   { id: 1, label: 'Usuario A', controlType: 'details', showAvatar: true },
 *   { id: 2, label: 'Usuario B', controlType: 'toggle',  showAvatar: false },
 * ];
 *
 * <List items={items} />
 * ```
 */

const List: React.FC<ListProps> = ({ items }) => {
  return (
    <div className={listStyles.Container}>
      {items.map((item) => (
        <div key={item.id} className={listStyles.Item}>
          <div className={listStyles.ItemLeft}>
            {item.showAvatar && <PersonalAvatar />}
            <span className={listStyles.Label}>{item.label}</span>
          </div>

          <div>
            {item.controlType === "details" && (
              <Button
                variant="outline"
                size="small"
                className={listStyles.DetailsButton}
              >
                Details
              </Button>
            )}

            {item.controlType === "badge" && (
              <button aria-label="arrow" className={listStyles.BadgeButton}>
                Details
              </button>
            )}

            {item.controlType === "arrow" && (
              <Button
                iconOnly
                variant="outline"
                className={listStyles.ArrowButton}
              />
            )}

            {item.controlType === "toggle" && (
              <div className={listStyles.ControlWrapper}>
                <ToggleButton checked={false} onChange={() => {}} disabled={false} label="" labelPosition="right" labelColor="" className=""  />
              </div>
            )}

            {item.controlType === "radio" && (
              <div className={listStyles.ControlWrapper}>
                <CustomRadio id="" name="" label="" value="" checked={false} disabled={false} onChange={() => {}}/>
              </div>
            )}

            {item.controlType === "checkbox" && (
              <div className={listStyles.ControlWrapper}>
                <Checkbox checked={false} onChange={() => {}} indeterminate={false} disabled={false} label="" labelPosition="right" name="" className="" />
              </div>
            )}

            {item.controlType === "control" && <Control onIncrement={() => {}} onDecrement={() => {}} variant="filled" />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default List;
