'use client';
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext"
import { Calendar } from "@/app/components/Calendar/Calendar";
import { Card } from "@/app/components/Card/Card";

const Announcements = () => {
    const { usePrincipalAlert } = usePrincipal();
    const { showAlert } = usePrincipalAlert;

    return (
        <>
            <Calendar></Calendar>
        </>
    );
}
export default Announcements