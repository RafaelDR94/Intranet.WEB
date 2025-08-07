import React from "react";
import CustomRadio from "../CustomRadio/CustomRadio";
import { Checkbox } from "../CheckBox/CheckBox";
import { ToggleButton } from "../ToogleButton.tsx/ToogleButton";
import { Button } from "../Button/Button";
import { Control } from "../Control/Control";
import PersonalAvatar from "../PersonalAvatar/PersonalAvatar";
import { listStyles } from "./styles";

export interface ListItem {
  id: number;
  label: string;
  controlType:
    | "details"
    | "badge"
    | "arrow"
    | "toggle"
    | "radio"
    | "checkbox"
    | "control";
  checked?: boolean;
  showAvatar: boolean;
}

interface ListComponentProps {
  items: ListItem[];
}

// Helper mínimo para componer clases sin dependencias
const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const List: React.FC<ListComponentProps> = ({ items }) => {
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
