"use client";
import { useSearchParams } from "next/navigation";

import AuthorizationDetail from "./components/AuthorizationDetail/AuthorizationDetail";
import AuthorizationList from "./components/AuthorizationList/AuthorizationList";

const AuthorizationListPage = () => {
  const searchParams = useSearchParams();
  const authorizationId =
    searchParams.get("authorization_id") ?? searchParams.get("id");

  if (authorizationId) return <AuthorizationDetail />;
  return <AuthorizationList />;
};

export default AuthorizationListPage;
