"use client";

import FormsLayout from "@/app/components/FormsLayout/FormsLayout";

import NotificationPreferencesPanel from "./components/NotificationPreferencesPanel/NotificationPreferencesPanel";

const NotificationsPage = () => {
  return (
    <FormsLayout
      title="Configuración de notificaciones"
      primaryLabel=""
      showPrimaryButton={false}
      enableCollapse={false}
    >
      <NotificationPreferencesPanel />
    </FormsLayout>
  );
};

export default NotificationsPage;
