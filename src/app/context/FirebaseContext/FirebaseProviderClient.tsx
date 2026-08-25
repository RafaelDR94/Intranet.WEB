"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const FirebaseProvider = dynamic(
  () => import("./FirebaseContext").then((mod) => mod.FirebaseProvider),
  { ssr: false },
);

export default function FirebaseProviderClient({
  children,
}: {
  children: ReactNode;
}) {
  return <FirebaseProvider>{children}</FirebaseProvider>;
}
