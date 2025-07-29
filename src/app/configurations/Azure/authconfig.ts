export const msalConfig = {
  auth: {
    clientId: "70a5fe46-6f19-4250-9a65-769f7584aacf",
    authority: "https://login.microsoftonline.com/eaa4dd04-365e-401c-a379-ec7e9089c16e",
    redirectUri: "https://intranetdr-50f9e--devpreproductive-xz8xgt6c.web.app/PrincipalMenu/GeneralServices/MeetingRoom", 
    //redirectUri: "http://localhost:5173",
  },
};

export const loginRequest = {
  scopes: ["User.Read", "Calendars.ReadWrite"],
};