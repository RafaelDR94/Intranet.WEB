"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Redirección en cliente para evitar problemas de export/RSC (index.txt)
export default function MainPage() {
  const router = useRouter();
  useEffect(() => {
    // Deja que PermissionAgent del layout decida si manda a /login.
    router.replace("/main-page/home");
  }, [router]);
  return null;
}
