
import { Suspense } from "react";
import AccesRequestClient from "./AccesRequestClient";

export default function AccesRequestPage() {
    return (
        <Suspense>
            <AccesRequestClient />
        </Suspense>
    );
}

