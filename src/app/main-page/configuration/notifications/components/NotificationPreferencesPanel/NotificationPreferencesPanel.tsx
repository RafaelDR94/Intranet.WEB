"use client";

import clsx from "clsx";
import { useState } from "react";

import { ToggleButton } from "@/app/components/ToogleButton/ToogleButton";

import {
  group,
  groupTitle,
  groups,
  panel,
  preferenceContent,
  preferenceDescription,
  preferenceRow,
  preferenceTitle,
  toggleContainer,
  toggleThumb,
  toggleThumbEnabled,
  toggleTrack,
  toggleTrackDisabled,
  toggleTrackEnabled,
} from "./styles";

type NotificationPreferenceItem = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

type NotificationPreferenceGroup = {
  id: string;
  title: string;
  item: NotificationPreferenceItem;
};

const initialPreferences: NotificationPreferenceGroup[] = [
  {
    id: "intranet",
    title: "Activación de notificaciones dentro de la intranet",
    item: {
      id: "intranet-push",
      title: "Solicitudes, respuestas y proyectos (push)",
      description:
        "Recibe notificaciones cuando te respondan a una solicitud o tengas solicitudes de tareas.",
      enabled: true,
    },
  },
  {
    id: "email",
    title: "Activación de notificaciones por correo electrónico",
    item: {
      id: "email-requests",
      title: "Solicitudes y respuestas",
      description:
        "Recibe un correo electrónico cuando te respondan a una solicitud o tengas solicitudes de tareas.",
      enabled: false,
    },
  },
  {
    id: "sms",
    title: "Activación de notificaciones por sms",
    item: {
      id: "sms-requests",
      title: "Solicitudes y respuestas",
      description:
        "Recibe un sms cuando te respondan a una solicitud o tengas solicitudes de tareas.",
      enabled: true,
    },
  },
];

const NotificationPreferencesPanel = () => {
  const [preferences, setPreferences] = useState(initialPreferences);

  const handleToggle = (groupId: string) => {
    setPreferences((currentPreferences) =>
      currentPreferences.map((groupItem) =>
        groupItem.id === groupId
          ? {
              ...groupItem,
              item: {
                ...groupItem.item,
                enabled: !groupItem.item.enabled,
              },
            }
          : groupItem,
      ),
    );
  };

  return (
    <section className={panel}>
      <div className={groups}>
        {preferences.map((groupItem) => (
          <article key={groupItem.id} className={group}>
            <h2 className={groupTitle}>{groupItem.title}</h2>

            <div className={preferenceRow}>
              <div className={preferenceContent}>
                <h3 className={preferenceTitle}>{groupItem.item.title}</h3>
                <p className={preferenceDescription}>
                  {groupItem.item.description}
                </p>
              </div>

              <ToggleButton
                checked={groupItem.item.enabled}
                onChange={() => handleToggle(groupItem.id)}
                ariaLabel={groupItem.item.title}
                className={toggleContainer}
                trackClassName={clsx(
                  toggleTrack,
                  groupItem.item.enabled
                    ? toggleTrackEnabled
                    : toggleTrackDisabled,
                )}
                thumbClassName={clsx(
                  toggleThumb,
                  groupItem.item.enabled ? toggleThumbEnabled : undefined,
                )}
                dataTestId={`${groupItem.id}-notification-toggle`}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default NotificationPreferencesPanel;
