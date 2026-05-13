import React from "react";
import { PermissionRedirect } from "@/app/components/PermissionRedirect/PermissionRedirect";

export default function OrganigramaPage() {
  return (
    <PermissionRedirect
      routes={[
        "/main-page/organigrama/departments",
        "/main-page/organigrama/generaldirectory",
      ]}
    />
  );
}
