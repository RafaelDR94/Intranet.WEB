export const LoginUrl = process.env.NEXT_PUBLIC_LOGIN_URL ?? "/Login";
export const AuthValidate = process.env.NEXT_PUBLIC_AUTHVALIDATE ?? "/Auth/AuthValidate";
export const AuthFirebaseConfiguration = process.env.NEXT_PUBLIC_AUTHFIREBASECONFIGURATION ?? "/Auth/FirebaseConfiguration";
export const AuthChangeNIP = process.env.NEXT_PUBLIC_AUTHCHANGENIP ?? "/Auth/ChangeNIP";
export const AuthChangePassword = process.env.NEXT_PUBLIC_AUTHCHANGEPASSWORD ?? "/Auth/ChangePassword";
export const VerifyOTP = process.env.NEXT_PUBLIC_VERIFY_OTP ?? "/VerifyOTP";

export const Enterprises = process.env.NEXT_PUBLIC_ENTERPRISES ?? "/Enterprises";
export const Departments = process.env.NEXT_PUBLIC_DEPARTMENTS ?? "/Enterprises/Departments";
export const Areas = process.env.NEXT_PUBLIC_AREAS ?? "/Enterprises/Areas";
export const Persons = process.env.NEXT_PUBLIC_PERSONS ?? "/Persons";
export const Transport = process.env.NEXT_PUBLIC_TRANSPORT ?? "/Transport";
export const WorkPosition = process.env.NEXT_PUBLIC_WORK_POSITION ?? "/Enterprises/WorkPosition";

export const TransportGetAssigment = process.env.NEXT_PUBLIC_TRANSPORT_GET_ASSIGMENT ?? "/Transport/GetAssigment";
export const CreateAssigment = process.env.NEXT_PUBLIC_CREATE_ASSIGMENT ?? "/Transport/CreateAssigment";
export const CreateUpdateAssigment = process.env.NEXT_PUBLIC_CREATE_UPDATE_ASSIGMENT ?? "/Transport/UpdateAssigment";

export const Employees = process.env.NEXT_PUBLIC_EMPLOYEES ?? "/Employees";
export const EmployeesById = process.env.NEXT_PUBLIC_EMPLOYEESBYID ?? "/Employees/ById";
export const EmployeesActive = process.env.NEXT_PUBLIC_EMPLOYEES_ACTIVE_ID ?? "/Employees/Activate";
export const EmployeesIsActive = process.env.NEXT_PUBLIC_EMPLOYEES_IS_ACTIVE ?? "Employees/EmployeesActive";

export const SaveVehicleTracking = process.env.NEXT_PUBLIC_SAVE_VEHICLE_TRACKING ?? "/Transport/SaveVehicleTracking";
export const GetAssigmentInfo = process.env.NEXT_PUBLIC_GET_ASSIGMENT_INFO ?? "/Transport/GetAssigmentInfo";

export const HMRequisitions = process.env.NEXT_PUBLIC_HM_REQUISITIONS ?? "/HumanResources/PersonalRequisitions";
export const HMRequisitionsStatuses = process.env.NEXT_PUBLIC_HM_REQUISITIONSSTATUSES ?? "/HumanResources/PersonalRequisitions/Statuses";
export const HMRequisitionsById = process.env.NEXT_PUBLIC_HM_REQUISITIONSBYID ?? "/HumanResources/PersonalRequisitionByID";
export const HMRequisitionsAssignment = process.env.NEXT_PUBLIC_HM_REQUISITIONSASSIGNMENT ?? "/HumanResources/PersonalRequisitionsAssignment";
export const HMRequisitionsStatus = process.env.NEXT_PUBLIC_HM_REQUISITIONSSTATUS ?? "/HumanResources/PersonalRequisitionsStatus";
export const HMRequisitioninfo = process.env.NEXT_PUBLIC_HM_REQUISITIONSINFO ?? "/HumanResources/PersonalRequisitionInfo";

export const HMTalents = process.env.NEXT_PUBLIC_HM_TALENTS ?? "/HumanResources/Talents";
export const HMTalentStatus = process.env.NEXT_PUBLIC_HM_TALENTSSTATUS ?? "/HumanResources/TalentStatus";
export const HMTalentStatuses = process.env.NEXT_PUBLIC_HM_TALENTSSTATUSES ?? "/HumanResources/Statuses";
export const HMTalentsById = process.env.NEXT_PUBLIC_HM_TALENTSBYID ?? "/HumanResources/Talents/ById";
export const HMTalentsApplication = process.env.NEXT_PUBLIC_HM_TALENTSAPPLICATION ?? "/HumanResources/TalentsApplication";
export const HMTalentsActive = process.env.NEXT_PUBLIC_HM_TALENTSACTIVE ?? "/HumanResources/TalentsActive";

export const HMPRComments = process.env.NEXT_PUBLIC_HM_PRCOMMENTS ?? "/HumanResources/PRComments";
export const HMEmployeeTalents = process.env.NEXT_PUBLIC_HM_EMPLOYEETALENTS ?? "/HumanResources/EmployeesTalents";

export const ReportsProyects = process.env.NEXT_PUBLIC_REPORTS_PROYECTS ?? "/Reports/Proyects";
export const ReportsTypesReports = process.env.NEXT_PUBLIC_REPORTS_TYPESREPORTS ?? "/Reports/TypesReports";
export const ReportsCategories = process.env.NEXT_PUBLIC_REPORTS_REPORTSCATEGORIES ?? "/Reports/ReportCategories";
export const ReportsCategoriesByIdType = process.env.NEXT_PUBLIC_REPORTS_REPORTSCATEGORIESBYIDTYPE ?? "/Reports/ReportCategoriesByIdType";
export const ReportsDevices = process.env.NEXT_PUBLIC_REPORTS_DEVICES ?? "/Reports/DevicesExternal";
export const ReportsLocation = process.env.NEXT_PUBLIC_REPORTS_LOCATION ?? "/Reports/Location";
export const LocationProyect = process.env.NEXT_PUBLIC_LOCATION_REPORTS ?? "/Reports/ProyectLocation";
export const ReportsLocationProyect = process.env.NEXT_PUBLIC_REPORTS_LOCATIONPROYECT ?? "/Reports/LocationProyect";
export const ReportsAllReports = process.env.NEXT_PUBLIC_REPORTS_ALLREPORTS ?? "/Reports/AllReports";
export const ReportsByID = process.env.NEXT_PUBLIC_REPORTS_BYID ?? "/Reports/ReportsByID";
export const ReportsAllReportsByIdProyect = process.env.NEXT_PUBLIC_REPORTS_ALLREPORTSBYIDPROYECT ?? "/Reports/AllReportsByIdProyect";
export const ReportsReportsDevices = process.env.NEXT_PUBLIC_REPORTS_REPORTDEVICES ?? "/Reports/ReportDevices";
export const Reports = process.env.NEXT_PUBLIC_REPORTS ?? "/Reports";

export const BudgetCategory = process.env.NEXT_PUBLIC_BUDGETS_CATEGORY ?? "/Budget/BudgetCategory";
export const AllBudgets = process.env.NEXT_PUBLIC_ALL_BUDGETS ?? "/Budget";
export const BudgetsByIdBudget = process.env.NEXT_PUBLIC_BUDGET_BY_BUDGET_ID ?? "/Budget/GetCategoriesBudgetByIdBudget";
export const CategoriesByBudget = process.env.NEXT_PUBLIC_CATEGORIES_BY_BUDGET ?? "Budget/CategoriesByBudget";
export const BudgetDetails = process.env.NEXT_PUBLIC_BUDGET_DETAILS ?? "Budgets/BudgetDetails";

export const Brands = process.env.NEXT_PUBLIC_DEVICES_BRAND ?? "/Assets/DeviceBrand";
export const Status = process.env.NEXT_PUBLIC_DEVICES_STATUS ?? "/Assets/DeviceStatus";
export const Types = process.env.NEXT_PUBLIC_DEVICES_TYPE ?? "/Assets/DeviceType";
export const Reviews = process.env.NEXT_PUBLIC_DEVICE_REVIEW ?? "/Assets/DeviceReview";
export const Assigment = process.env.NEXT_PUBLIC_DEVICES_ASSIGMENT ?? "/Assets/DeviceAssigment";
export const AllDevices = process.env.NEXT_PUBLIC_ALL_DEVICES ?? "/Assets/AllDevices";
export const DeviceById = process.env.NEXT_PUBLIC_ASSETS_DEVICES_BYID ?? "/Assets/Device/ById";

export const DocumentType = process.env.NEXT_PUBLIC_DOCUMENT_TYPE ?? "/Documents/DocumentType";
export const Documents = process.env.NEXT_PUBLIC_DOCUMENTS ?? "/Documents";

export const Releases = process.env.NEXT_PUBLIC_RELEASES ?? "/Releases/Reaction";
export const ReleasesReaction = process.env.NEXT_PUBLIC_RELEASES_REACTION ?? "/Releases/Reaction";
export const ReleasesReactionPerson = process.env.NEXT_PUBLIC_RELEASES_REACTIONPERSON ?? "/Releases/ReactionPerson";

export const ActiveBrand = process.env.NEXT_PUBLIC_ACTIVATE_BRAND ?? "/Assets/ActivateBrand";
export const ActivateStatus = process.env.NEXT_PUBLIC_ACTIVATE_BRAND ?? "/Assets/ActivateStatus"; // <-- Podría ser error
export const ActivateType = process.env.NEXT_PUBLIC_ACTIVATE_TYPE ?? "/Assets/ActivateType";
export const ActivateDevice = process.env.NEXT_PUBLIC_ACTIVATE_DEVICE ?? "/Assets/ActivateDevice";

export const DevicesAssigned = process.env.NEXT_PUBLIC_DEVICES_ASSIGNED ?? "/Assets/DevicesAssigned";
export const Devices = process.env.NEXT_PUBLIC_DEVICES ?? "/Assets/Devices";

export const Users = process.env.NEXT_PUBLIC_USERS ?? "/Users";
export const UsersSignature = process.env.NEXT_PUBLIC_USERSSIGNATURE ?? "/Users/Signature";
export const Visitor = process.env.NEXT_PUBLIC_VISITOR ?? "/GeneralServices/Visitor";
export const UsersRoles = process.env.NEXT_PUBLIC_USERS_ROLES ?? "/Users/Roles";

export const GeneralServicesMeetingRoom = process.env.NEXT_PUBLIC_GENERALSERVICES ?? "/GeneralServices/MeetingRoom";
export const GeneralServicesMeetingRoomCalendarEventId = process.env.NEXT_PUBLIC_GENERALSERVICES_CALENDAREVENTID ?? "/GeneralServices/MeetingRoom/CalendarEventId";

export const NotificationsSendPush = process.env.NEXT_PUBLIC_NOTIFICATIONS_SENDPUSH ?? "/Notifications/SendPushNotification";

export const BillingRequisition = process.env.NEXT_PUBLIC_BILLINGS_REQUISITION ?? "/Billings/BillingRequisition";
export const BillingRequisitionByExcel = process.env.NEXT_PUBLIC_BILLINGS_REQUISITIONBYEXCEL ?? "/Billings/BillingRequisitionByExcel";
export const BillingRequisitionByIdEmployee = process.env.NEXT_PUBLIC_BILLINGS_REQUISITIONBYIDEMPLOYEE ?? "/Billings/BillingRequisitionByIdEmployee";
export const BillingRequisitionByDate = process.env.NEXT_PUBLIC_BILLINGS_REQUISITIONBYDATE ?? "/Billings/BillingRequisitionByDate";
export const BillingImages = process.env.NEXT_PUBLIC_BILLINGS_BILLINGIMAGES ?? "/Billings/BillingImages";
export const BillingImagesById = process.env.NEXT_PUBLIC_BILLINGS_BILLINGIMAGESBYID ?? "/Billings/BillingImages/ById";
