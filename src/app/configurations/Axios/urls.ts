export const LoginUrl = process.env.NEXT_PUBLIC_LOGIN_URL ?? "/Login";
export const AuthValidate = process.env.NEXT_PUBLIC_AUTHVALIDATE ?? "/Auth/AuthValidate";
export const AuthFirebaseConfiguration = process.env.NEXT_PUBLIC_AUTHFIREBASECONFIGURATION ?? "/Auth/FirebaseConfiguration";
export const AuthChangeNIP = process.env.NEXT_PUBLIC_AUTHCHANGENIP ?? "/Auth/ChangeNIP";
export const AuthChangePassword = process.env.NEXT_PUBLIC_AUTHCHANGEPASSWORD ?? "/Auth/ChangePassword";
export const AuthRecoverPassword = process.env.NEXT_PUBLIC_AUTHRECOVERPASSWORD ?? "/Auth/RecoverPassword";
export const AuthChangeNIPStatusByIdUser = process.env.NEXT_PUBLIC_AUTHCHANGENIPSTATUSBYIDUSER ?? "/Auth/ChangeNIPStatusByIdUser";
export const AuthCreateNIP = process.env.NEXT_PUBLIC_AUTHCREATENIP ?? "/Auth/CreateNIP";
export const VerifyOTP = process.env.NEXT_PUBLIC_VERIFY_OTP ?? "/VerifyOTP";
export const AuthorizationTypes =
  process.env.NEXT_PUBLIC_AUTHORIZATION_TYPES ?? "/Auth/AuthorizationTypes";
export const Authorizations =
  process.env.NEXT_PUBLIC_AUTHORIZATIONS ?? "/Auth/Authorizations";
export const AuthorizationByIdAuthorizer =
  process.env.NEXT_PUBLIC_AUTHORIZATION_BY_ID_AUTHORIZER ?? "/Auth/GetAuthorizationByIdAuthorizer";
export const AuthorizationApprove =
  process.env.NEXT_PUBLIC_AUTHORIZATION_APPROVE ?? "/Auth/AuthorizationApprove";
export const AuthorizationReject =
  process.env.NEXT_PUBLIC_AUTHORIZATION_REJECT ?? "/Auth/AuthorizationReject";
export const AuthorizationChangeAuthorizer =
  process.env.NEXT_PUBLIC_AUTHORIZATION_CHANGE_AUTHORIZER ?? "/Auth/changeAuthorizer";
export const AuthorizationRequisitionHistory =
  process.env.NEXT_PUBLIC_AUTH_REQUISITION_AUTHORIZATIONS_HISTORY ??
  "/Auth/RequisitionAuthorizationsHistory";
export const AuthorizationBillingDocuments =
  process.env.NEXT_PUBLIC_AUTHORIZATION_BILLING_DOCUMENTS ??
  "/Auth/AuthorizationBillingDocuments";

export const Enterprises = process.env.NEXT_PUBLIC_ENTERPRISES ?? "/Enterprises";
export const EnterprisesExternal = process.env.NEXT_PUBLIC_ENTERPRISESEXTERNAL ?? "/Enterprises/External";
export const Departments = process.env.NEXT_PUBLIC_DEPARTMENTS ?? "/Enterprises/Departments";

export const CustomAccessControler = process.env.NEXT_PUBLIC_CUSTOMACCESCONTROLER??"/CustomsAccessControler/ExternalPersonnel"
export const CustomAccessControlerByEnterprise = process.env.NEXT_PUBLIC_CUSTOMACCESCONTROLERBYENTERPRISE??"/CustomsAccessControler/ExternalPersonnel/ByIdEnterprise"
export const CustomAccessControlerById = process.env.NEXT_PUBLIC_CUSTOMACCESCONTROLERBYID??"/CustomsAccessControler/ExternalPersonnel/ByID"
export const CustomAccessControlerAccesRequirement =process.env.NEXT_PUBLIC_CUSTOMACCESCONTROLERACCESREQUIRMENT||"/CustomsAccessControler/AccessRequirement"
export const CustomAccessControlerAccesRequirementInternalComments = process.env.NEXT_PUBLIC_CUSTOMACCESCONTROLERACCESREQUIRMENT_INTERNALCOMMENTS || "/CustomsAccessControler/AccessRequirementInternalComments"
export const CustomAccessControlerAccesRequirementExternalComments = process.env.NEXT_PUBLIC_CUSTOMACCESCONTROLERACCESREQUIRMENT_EXTERNALCOMMENTS || "/CustomsAccessControler/AccessRequirementExternalComments"
export const CustomAccessControlerTemplate = process.env.NEXT_PUBLIC_CUSTOMACCESCONTROLER_TEMPLATE || "/CustomsAccessControler/Template"
export const Persons = process.env.NEXT_PUBLIC_PERSONS ?? "/Persons";
export const WorkPosition = process.env.NEXT_PUBLIC_WORK_POSITION ?? "/Enterprises/WorkPosition";

export const Transport = process.env.NEXT_PUBLIC_TRANSPORT ?? "/Transport";
export const TransportGetAssigment = process.env.NEXT_PUBLIC_TRANSPORT_GET_ASSIGMENT ?? "/Transport/GetAssigment";
export const CreateAssigment = process.env.NEXT_PUBLIC_CREATE_ASSIGMENT ?? "/Transport/CreateAssigment";
export const CreateUpdateAssigment = process.env.NEXT_PUBLIC_CREATE_UPDATE_ASSIGMENT ?? "/Transport/UpdateAssigment";
export const SaveVehicleTracking = process.env.NEXT_PUBLIC_SAVE_VEHICLE_TRACKING ?? "/Transport/SaveVehicleTracking";
export const GetAssigmentInfo = process.env.NEXT_PUBLIC_GET_ASSIGMENT_INFO ?? "/Transport/GetAssigmentInfo";
export const TransportAssigment = process.env.NEXT_PUBLIC_TRANSPORT_ASSIGMENT ?? "/Transport/Assigment";
export const TransportAssigments = process.env.NEXT_PUBLIC_TRANSPORT_ASSIGMENTS ?? "/Transport/Assigments";
export const TransportAssigmentInfo = process.env.NEXT_PUBLIC_TRANSPORT_ASSIGMENT_INFO ?? "/Transport/AssigmentInfo";
export const TransportVehicleTracking = process.env.NEXT_PUBLIC_TRANSPORT_VEHICLE_TRACKING ?? "/Transport/VehicleTracking";
export const TransportVehicleTrackingById = process.env.NEXT_PUBLIC_TRANSPORT_VEHICLE_TRACKING_BYID ?? "/Transport/VehicleTracking/ById";
export const TransportByEnterprise = process.env.NEXT_PUBLIC_TRANSPORT_BY_ENTERPRISE ?? "/Transport/TransportByIdEnterprise";
export const TransportExternal = process.env.NEXT_PUBLIC_TRANSPORT_EXTERNAL ?? "/Transport/External";
export const TransportChangeDriver =
  process.env.NEXT_PUBLIC_TRANSPORT_CHANGE_DRIVER ?? "/Transport/ChangeDriver";
export const TransportVehicleReassignmentReject =
  process.env.NEXT_PUBLIC_TRANSPORT_VEHICLE_REASSIGNMENT_REJECT ??
  "/Transport/VehicleReassignmentReject";
export const TransportVehicleReassignmentApprove =
  process.env.NEXT_PUBLIC_TRANSPORT_VEHICLE_REASSIGNMENT_APPROVE ??
  "/Transport/VehicleReassignmentApprove";
export const TransportVehicleReassignmentByEmployee =
  process.env.NEXT_PUBLIC_TRANSPORT_VEHICLE_REASSIGNMENT_BY_EMPLOYEE ??
  "/Transport/VehicleReassignment/Employee";

export const Employees = process.env.NEXT_PUBLIC_EMPLOYEES ?? "/Employees";
export const EmployeesById = process.env.NEXT_PUBLIC_EMPLOYEESBYID ?? "/Employees/ById";
export const EmployeesByIdDepartment =
  process.env.NEXT_PUBLIC_EMPLOYEES_BY_ID_DEPARTMENT ?? "/Employees/ByIdDepartment";
export const EmployeesActive = process.env.NEXT_PUBLIC_EMPLOYEES_ACTIVE_ID ?? "/Employees/Activate";
export const EmployeesIsActive = process.env.NEXT_PUBLIC_EMPLOYEES_IS_ACTIVE ?? "Employees/EmployeesActive";

export const Statuses = process.env.NEXT_PUBLIC_STATUS ?? "/Status";
export const StatusByType = process.env.NEXT_PUBLIC_STATUSBYTYPE ?? "/Status/ByType";

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
export const ReportsDevicesByLocation = process.env.NEXT_PUBLIC_REPORTS_DEVICESBYLOCATION ?? "/Reports/DevicesByProyectLocationId";
export const ReportsLocation = process.env.NEXT_PUBLIC_REPORTS_LOCATION ?? "/Reports/Location";
export const LocationProyect = process.env.NEXT_PUBLIC_LOCATION_REPORTS ?? "/Reports/ProyectLocation";
export const ReportsLocationProyect = process.env.NEXT_PUBLIC_REPORTS_LOCATIONPROYECT ?? "/Reports/LocationProyect";
export const ReportsAllReports = process.env.NEXT_PUBLIC_REPORTS_ALLREPORTS ?? "/Reports/AllReports";
export const ReportsByID = process.env.NEXT_PUBLIC_REPORTS_BYID ?? "/Reports/ReportsByID";
export const ReportsAllReportsByIdProyect = process.env.NEXT_PUBLIC_REPORTS_ALLREPORTSBYIDPROYECT ?? "/Reports/AllReportsByIdProyect";
export const ReportsReportsDevices = process.env.NEXT_PUBLIC_REPORTS_REPORTDEVICES ?? "/Reports/ReportDevices";
export const Reports = process.env.NEXT_PUBLIC_REPORTS ?? "/Reports";
export const ReportsDelete = process.env.NEXT_PUBLIC_REPORTS_DELETE ?? "/Reports";

export const BudgetCategory = process.env.NEXT_PUBLIC_BUDGETS_CATEGORY ?? "/Budget/BudgetCategory";
export const AllBudgets = process.env.NEXT_PUBLIC_ALL_BUDGETS ?? "/Budget";
export const BudgetsByIdBudget = process.env.NEXT_PUBLIC_BUDGET_BY_BUDGET_ID ?? "/Budget/GetCategoriesBudgetByIdBudget";
export const CategoriesByBudget = process.env.NEXT_PUBLIC_CATEGORIES_BY_BUDGET ?? "Budget/CategoriesByBudget";
export const BudgetDetails = process.env.NEXT_PUBLIC_BUDGET_DETAILS ?? "Budgets/BudgetDetails";

export const Brands = process.env.NEXT_PUBLIC_DEVICES_BRAND ?? "/Assets/DeviceBrand";
export const Status = process.env.NEXT_PUBLIC_DEVICES_STATUS ?? "/Assets/DeviceStatus";
export const Types = process.env.NEXT_PUBLIC_DEVICES_TYPE ?? "/Assets/DeviceType";
export const Reviews = process.env.NEXT_PUBLIC_DEVICE_REVIEW ?? "/Assets/DeviceReview";
export const Assigment = process.env.NEXT_PUBLIC_DEVICES_ASSIGMENT ?? "/Assets/DeviceAssignment";
export const AllDevices = process.env.NEXT_PUBLIC_ALL_DEVICES ?? "/Assets/AllDevices";
export const DeviceById = process.env.NEXT_PUBLIC_ASSETS_DEVICES_BYID ?? "/Assets/Device/ById";
export const DeviceByIdProyect = process.env.NEXT_PUBLIC_ASSETS_DEVICES_BYIDPROYECT ?? "/Assets/Device/ByIdProyect";
export const ReviewDevices = process.env.NEXT_PUBLIC_REVIEW_DEVICES ?? "/Assets/RevieWDevices";
export const DeviceTypeById = process.env.NEXT_PUBLIC_DEVICE_TYPE_BYID ?? "/Assets/DeviceType/ById";
export const DeviceStatusById = process.env.NEXT_PUBLIC_DEVICE_STATUS_BYID ?? "/Assets/DeviceStatus/ById";
export const DeviceBrandById = process.env.NEXT_PUBLIC_DEVICE_BRAND_BYID ?? "/Assets/DeviceBrand/ById";
export const DeviceReviewByDeviceId =
  process.env.NEXT_PUBLIC_DEVICE_REVIEW_BY_DEVICE_ID ?? "/Assets/DeviceReview/ByDeviceId";
export const DeviceAssigmentById =
  process.env.NEXT_PUBLIC_DEVICE_ASSIGMENT_BYID ?? "/Assets/DeviceAssignment/ById";
export const DeviceAssignmentHistoryByDeviceId =
  process.env.NEXT_PUBLIC_DEVICE_ASSIGNMENT_HISTORY_BY_DEVICE_ID ??
  "/Assets/DeviceAssignment/History";
export const DeviceAssignmentResponsiveUrl =
  process.env.NEXT_PUBLIC_DEVICE_ASSIGNMENT_RESPONSIVE_URL ??
  "/Assets/DeviceAssignment/ResponsiveUrl";

export const DocumentType = process.env.NEXT_PUBLIC_DOCUMENT_TYPE ?? "/Documents/DocumentType";
export const Documents = process.env.NEXT_PUBLIC_DOCUMENTS ?? "/Documents";

export const Releases = process.env.NEXT_PUBLIC_RELEASES ?? "/Releases/Reaction";
export const ReleasesReaction = process.env.NEXT_PUBLIC_RELEASES_REACTION ?? "/Releases/Reaction";
export const ReleasesReactionPerson = process.env.NEXT_PUBLIC_RELEASES_REACTIONPERSON ?? "/Releases/ReactionPerson";

export const ActiveBrand = process.env.NEXT_PUBLIC_ACTIVATE_BRAND ?? "/Assets/ActivateBrand";
export const ActivateStatus = process.env.NEXT_PUBLIC_ACTIVATE_STATUS ?? "/Assets/ActivateStatus";
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
export const BillingRequisitionImageUrl =
  process.env.NEXT_PUBLIC_BILLINGS_REQUISITION_IMAGE_URL ?? "/Billings/BillingRequisition/ImageUrl";
export const BillingRequisitionWithEmployees =
  process.env.NEXT_PUBLIC_BILLINGS_REQUISITION_WITH_EMPLOYEES ??
  "/Billings/BillingRequisitionWithEmployees";
export const BillingRequisitionByExcel = process.env.NEXT_PUBLIC_BILLINGS_REQUISITIONBYEXCEL ?? "/Billings/BillingRequisitionByExcel";
export const BillingRequisitionByIdEmployee = process.env.NEXT_PUBLIC_BILLINGS_REQUISITIONBYIDEMPLOYEE ?? "/Billings/BillingRequisitionByIdEmployee";
export const BillingRequisitionByDate = process.env.NEXT_PUBLIC_BILLINGS_REQUISITIONBYDATE ?? "/Billings/BillingRequisitionByDate";
export const BillingImages = process.env.NEXT_PUBLIC_BILLINGS_BILLINGIMAGES ?? "/Billings/BillingImages";
export const BillingImagesById = process.env.NEXT_PUBLIC_BILLINGS_BILLINGIMAGESBYID ?? "/Billings/BillingImages/ById";
export const BillingImagesByIdEmployee = process.env.NEXT_PUBLIC_BILLINGS_BILLINGIMAGESBYIDEMPLOYEE ?? "/Billings/BillingImages/ByIdEmployee";
export const BillingDocument = process.env.NEXT_PUBLIC_BILLINGS_BILLINGDOCUMENT ?? "/Billings/BillingDocument";
export const BillingDocumentById = process.env.NEXT_PUBLIC_BILLINGS_BILLINGDOCUMENTBYID ?? "/Billings/BillingDocument/ById";
export const BillingDocumentsPendingByEmployee =
  process.env.NEXT_PUBLIC_BILLINGS_BILLINGDOCUMENTS_PENDING_BY_EMPLOYEE ??
  "/Billings/BillingDocumentsPendingByEmployee";
export const BillingAllDocumentByIdEmployee =
  process.env.NEXT_PUBLIC_BILLINGS_BILLING_ALL_DOCUMENT_BY_ID_EMPLOYEE ??
  "/Billings/BillingAllDocumentByIdEmployee";
export const BillingAllDocumentByIdRequisition =
  process.env.NEXT_PUBLIC_BILLINGS_BILLING_ALL_DOCUMENT_BY_ID_REQUISITION ??
  "/Billings/BillingAllDocumentByIdRequisition";
export const BillingImagesPendingByEmployee =
  process.env.NEXT_PUBLIC_BILLINGS_BILLINGIMAGES_PENDING_BY_EMPLOYEE ??
  "/Billings/BillingImagesPendingByEmployee";
export const BillingDocumentByIdIdRequisition = process.env.NEXT_PUBLIC_BILLINGS_BILLINGDOCUMENTBYIDREQUISITION||"/Billings/BillingDocument/ByIdRequisition"
export const BillingHistory = process.env.NEXT_PUBLIC_BILLINGS_BILLINGHISTORY ?? "/Billings/UserDocumentsHistory/ByIdEmployee";
export const BillingValidateBillingDocumentOperations = process.env.NEXT_PUBLIC_BILLINGS_VALIDATEBILLINGDOCUMENTOPERATIONS||"/Billings/ValidateBillingDocumentOperations"
export const BillingValidateBillingDocument = process.env.NEXT_PUBLIC_BILLINGS_VALIDATEBILLINGDOCUMENT ?? "/Billings/UserDocumentsHistory/ByIdEmployee"
export const BillingRejectBillingDocument = process.env.NEXT_PUBLIC_BILLINGS_REJECTBILLINGDOCUMENT??"/Billings/RejectBillingDocument"
export const BillingBillingDocumentByFilter = process.env.NEXT_PUBLIC_BILLINGS_BILLINGDOCUMENTSBYFILTER??"/Billings/BillingDocumentByFilter"
export const BillingSATBillingDocument = process.env.NEXT_PUBLIC_BILLINGS_SATBILLINGDOCUMENTS??"/Billings/GetAllSATBillingDocuments"
export const BillingSATBillingDocumentByEmployee =
  process.env.NEXT_PUBLIC_BILLINGS_SATBILLINGDOCUMENTS_BY_EMPLOYEE ??
  "/Billings/GetAllSATBillingDocumentsByEmployee"
export const BillingSATBillingDocumentByRequisition =
  process.env.NEXT_PUBLIC_BILLINGS_SATBILLINGDOCUMENTS_BY_REQUISITION ??
  "/Billings/GetAllSATBillingDocumentsByRequisition"
export const BillingImagesReject = process.env.NEXT_PUBLIC_BILLINGS_BILLINGIMAGESREJECT??"/Billings/BillingImagesReject"
export const BillingInvoiceReject = process.env.NEXT_PUBLIC_BILLINGS_INVOICE_REJECT ?? "/Billings/Invoice/Reject"
export const BillingDocumentsSendToSAP = process.env.NEXT_PUBLIC_BILLINGS_SENDTOSAPBILLINGDOCUMENTS??"/Billings/SendToSAPBillingDocuments"
export const BillingRequisitionsByID= process.env.NEXT_PUBLIC_BILLINGS_REQUISITIONBYID??"/Billings/BillingRequisitionById"
export const BillingCategories= process.env.NEXT_PUBLIC_BILLINGS_BILLINGCATEGORIES??"/Billings/BillingCategory"
export const BillingDescription= process.env.NEXT_PUBLIC_BILLINGS_BILLINGDESCRITION??"/Billings/BillingDescription"
export const BillingDocuments= process.env.NEXT_PUBLIC_BILLINGS_BILLINGDOCUMENTS??"/Billings/BillingDocuments"
export const BillingJsonSap = process.env.NEXT_PUBLIC_BILLINGS_JSONSAP ?? "/Billings/JsonSap"
export const BillingDocumentNotDeductible = process.env.NEXT_PUBLIC_BILLINGS_BILLINGDOCUMENTNOTDEDUCTIBLE ?? "/Billings/BillingDocumentNotDeductible"
export const BillingReport= process.env.NEXT_PUBLIC_BILLINGS_REQUISITIONREPORT??"/Billings/BillingReport"
export const BillingPettyCashFund = process.env.NEXT_PUBLIC_BILLINGS_PETTYCASHFUND ?? "/Billings/PettyCashFund";
export const BillingPettyCashFundById = process.env.NEXT_PUBLIC_BILLINGS_PETTYCASHFUND_BYID ?? "/Billings/PettyCashFund/ById";
export const BillingCashOnHand = process.env.NEXT_PUBLIC_BILLINGS_CASHONHAND ?? "/Billings/CashOnHand";
export const BillingPettyCashVoucher = process.env.NEXT_PUBLIC_BILLINGS_PETTYCASHVOUCHER ?? "/Billings/PettyCashVoucher";
export const BillingPettyCashVoucherById = process.env.NEXT_PUBLIC_BILLINGS_PETTYCASHVOUCHER_BYID ?? "/Billings/PettyCashVoucher/ById";
export const BillingPettyCashVoucherReject = process.env.NEXT_PUBLIC_BILLINGS_PETTYCASHVOUCHER_REJECT ?? "/Billings/PettyCashVoucher/Reject";
export const BillingPettyCashVoucherRejectAuthorizationEvidence =
  process.env.NEXT_PUBLIC_BILLINGS_PETTYCASHVOUCHER_REJECTAUTHORIZATIONEVIDENCE ??
  "/Billings/PettyCashVoucher/RejectAuthorizationEvidence";
export const BillingPettyCashVoucherValidate = process.env.NEXT_PUBLIC_BILLINGS_PETTYCASHVOUCHER_VALIDATE ?? "/Billings/PettyCashVoucher/Validate";
export const BillingPettyCashVoucherByIdEmployee = process.env.NEXT_PUBLIC_BILLINGS_PETTYCASHVOUCHER_BYIDEMPLOYEE ?? "/Billings/PettyCashVoucher/ByIdEmployee"
export const BillingPettyCashVoucherHistoryAmount = process.env.NEXT_PUBLIC_BILLINGS_PETTYCASHVOUCHER_HISTORYAMOUNT ?? "/Billings/PettyCashVoucher/HistoryAmount"
export const BillingsSAPPendingDocuments = process.env.NEXT_PUBLIC_BILLINGS_SAP_PENDING_DOCUMENTS ?? "/Billings/SAPPendingDocuments";
export const BillingsCompleteProcessToSAP = process.env.NEXT_PUBLIC_BILLINGS_BILLINGDOCUMENT_COMPLETEPROCESSTOSAP ?? "/Billings/BillingDocument/CompleteProcessToSAP"
export const ExpenseTypeCatalog = process.env.NEXT_PUBLIC_EXPENSE_TYPE_CATALOG ?? "/ExpenseTypeCatalog"
