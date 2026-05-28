"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";

import { ToggleButton } from "@/app/components/ToogleButton/ToogleButton";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext";
import {
  NotificationPreferences,
  buildNotificationPreferencesPath,
  defaultNotificationPreferences,
} from "@/app/context/FirebaseContext/notificationPaths";

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
  enabledKey: keyof NotificationPreferences;
};

type NotificationPreferenceGroup = {
  id: string;
  title: string;
  item: NotificationPreferenceItem;
};

const preferenceGroups: NotificationPreferenceGroup[] = [
  {
    id: "intranet",
    title: "Activación de notificaciones dentro de la intranet",
    item: {
      id: "intranet-push",
      title: "Solicitudes, respuestas y proyectos (push)",
      description:
        "Recibe notificaciones cuando te respondan a una solicitud o tengas solicitudes de tareas.",
      enabledKey: "pushEnabled",
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
      enabledKey: "emailEnabled",
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
      enabledKey: "smsEnabled",
    },
  },
];

const NotificationPreferencesPanel = () => {
  const { user } = useAuth();
  const { firebaserealtime } = useFirebase();
  const [preferences, setPreferences] = useState(defaultNotificationPreferences);

  useEffect(() => {
    if (!user?.idUser || !firebaserealtime) return;

    const preferencesPath = buildNotificationPreferencesPath(user.idUser);
    let cancelled = false;

    void firebaserealtime.getData(preferencesPath).then((storedPreferences) => {
      if (cancelled || !storedPreferences) return;

      setPreferences((currentPreferences) => ({
        ...currentPreferences,
        ...storedPreferences,
      }));
    });

    return () => {
      cancelled = true;
    };
  }, [firebaserealtime, user?.idUser]);

  const handleToggle = (enabledKey: keyof NotificationPreferences) => {
    setPreferences((currentPreferences) => {
      const nextPreferences = {
        ...currentPreferences,
        [enabledKey]: !currentPreferences[enabledKey],
      };

      if (user?.idUser && firebaserealtime) {
        const preferencesPath = buildNotificationPreferencesPath(user.idUser);
        void firebaserealtime.updateData(preferencesPath, {
          [enabledKey]: nextPreferences[enabledKey],
        });
      }

      return nextPreferences;
    });
  };

  return (
    <section className={panel}>
      <div className={groups}>
        {preferenceGroups.map((groupItem) => (
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
                checked={preferences[groupItem.item.enabledKey]}
                onChange={() => handleToggle(groupItem.item.enabledKey)}
                ariaLabel={groupItem.item.title}
                className={toggleContainer}
                trackClassName={clsx(
                  toggleTrack,
                  preferences[groupItem.item.enabledKey]
                    ? toggleTrackEnabled
                    : toggleTrackDisabled,
                )}
                thumbClassName={clsx(
                  toggleThumb,
                  preferences[groupItem.item.enabledKey]
                    ? toggleThumbEnabled
                    : undefined,
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
