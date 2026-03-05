"use client"

import { useSearchParams } from "next/navigation";

import AuthorizationDetail from "./components/AuthorizationDetail/AuthorizationDetail";
import AuthorizationList from "./components/AuthorizationList/AuthorizationList";
import useTutorialAutoRun from "@/tutorials/engine/useTutorialAutoRun";

const AuthorizationListPage = () => {
  const searchParams = useSearchParams();
  const authorizationId =
    searchParams.get("authorization_id") ?? searchParams.get("id");

  useTutorialAutoRun({
    moduleId: authorizationId ? "" : "authorizations-list",
    tutorialId: authorizationId ? "" : "authorizations:list",
  });

  if (authorizationId) return <AuthorizationDetail />;
  return <AuthorizationList />;
};

export default AuthorizationListPage;
