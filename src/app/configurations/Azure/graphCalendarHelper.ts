import { IPublicClientApplication, AccountInfo } from "@azure/msal-browser";
import { loginRequest } from "./authconfig";

export async function addEventToOutlookCalendar(
  reservation: {
    date: string;
    startTime: string;
    duration: number;
    subject: string;
    description: string;
    location?: string;
    attendees?: { email: string; name: string }[];
  },
  msalInstance: IPublicClientApplication,
  account?: AccountInfo
): Promise<string> { // ← ahora retorna string con el eventId
  try {
    const activeAccount = account || msalInstance.getAllAccounts()[0];
    const response = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: activeAccount,
    });

    const accessToken = response.accessToken;

    const startDateTime = `${reservation.date}T${reservation.startTime}`;
    const endDate = new Date(`${startDateTime}:00`);
    endDate.setMinutes(endDate.getMinutes() + reservation.duration);

    const pad = (n: number) => n.toString().padStart(2, "0");
    const formatDateTimeLocal = (d: Date) => {
      const year = d.getFullYear();
      const month = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      const hours = pad(d.getHours());
      const minutes = pad(d.getMinutes());
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const formattedEnd = formatDateTimeLocal(endDate);
    const event = {
      subject: reservation.subject,
      body: {
        contentType: "Text",
        content: reservation.description,
      },
      start: {
        dateTime: startDateTime,
        timeZone: "America/Mexico_City",
      },
      end: {
        dateTime: formattedEnd,
        timeZone: "America/Mexico_City",
      },
      location: {
        displayName: reservation.location || "Sala de Juntas",
      },
      attendees:
        reservation.attendees?.map((att) => ({
          emailAddress: {
            address: att.email,
            name: att.name,
          },
          type: "required",
        })) || [],
    };

    const res = await fetch("https://graph.microsoft.com/v1.0/me/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.error?.message || "Error al crear evento");
    }

    const responseData = await res.json();
    return responseData.id || ""; // ← devuelve el ID del evento
  } catch (err) {
    console.error("Error al agregar evento al calendario:", err);
    return ""; // ← en caso de error, regresa string vacío
  }
}

export async function removeEventFromOutlookCalendar(
  eventId: string,
  msalInstance: IPublicClientApplication,
  account?: AccountInfo
): Promise<boolean> {
  if (!eventId) {
    console.warn("No se proporcionó eventId");
    return false;
  }

  try {
    const activeAccount = account || msalInstance.getAllAccounts()[0];
    const response = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: activeAccount,
    });

    const accessToken = response.accessToken;

    const res = await fetch(`https://graph.microsoft.com/v1.0/me/events/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.status === 204) {
      return true; // Éxito
    } else {
      const errorData = await res.json();
      console.error("Error al eliminar evento:", errorData);
      return false;
    }
  } catch (error) {
    console.error("Error al eliminar evento del calendario:", error);
    return false;
  }
}