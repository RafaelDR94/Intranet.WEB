### 1.47.49 Tools template resilience 29-10-2025

Fix:
- Refuerza la generación de la plantilla de herramientas para que funcione en entornos parciales y evita errores de tipado al procesar valores de Excel. (Agente IA) [#]()

### 1.47.48 External persons alert flow 29-10-2025

Fix:
- Habilita el botón de agregar solo tras elegir una persona y asegura el autocierre de alertas al registrar o actualizar datos de personas externas. (Agente IA) [#]()

### 1.47.47 Tools template single header 28-10-2025

Fix:
- Ajusta la plantilla de herramientas para mostrar una sola tabla con encabezado azul #002a41, aumenta el tamaño del logo y mantiene la limpieza del formato al regenerar el archivo. (Agente IA) [#]()

### 1.47.46 Tools template branding 28-10-2025

Feat:
- Añade branding en azul, título y logo de DR a la plantilla de herramientas para descarga y carga masiva, manteniendo columnas consistentes. (Agente IA) [#]()

### 1.47.45 Tools template header alignment 27-10-2025

Fix:
- Quita la columna de consecutivo de la plantilla de herramientas y permite importar archivos con encabezados en cualquier fila sin errores. (Agente IA) [#]()

### 1.47.44 Tools template without sample rows 27-10-2025

Fix:
- Descarga la plantilla de herramientas sin filas de ejemplo y permite cargar los datos capturados en Excel para mostrarlos en el formulario. (Agente IA) [#]()

### 1.47.43 Tools serial number import 27-10-2025

Feat:
- Agrega el número de serie a herramientas y habilita la descarga/carga masiva mediante plantilla de Excel para poblar el formulario. (Agente IA) [#]()

### 1.47.42 External person picture persistence 26-10-2025

Fix:
- Guarda el archivo de la foto de la persona en el primer envío del formulario de personal externo para que no vuelva a marcarse como requerido y se suba junto con las otras imágenes. (Agente IA) [#]()

### 1.47.41 External person images mapping 26-10-2025

Fix:
- Alinea los nombres de los campos de imágenes en el registro de personal externo para que la foto, INE y licencia se validen y carguen correctamente desde el primer envío. (Agente IA) [#]()

### 1.47.40 Vehicle insurance fields 25-10-2025

Feat:
- Añade campos de aseguradora, expedición de póliza, tipo de pago, cobertura y color en el registro de vehículos para enviarlos en las peticiones correspondientes. (Agente IA) [#]()

### 1.47.39 Acces history vehicles table 25-10-2025

Fix:
- Muestra los vehículos asociados en el panel de historial cargando el detalle del acceso seleccionado y presentando la tabla con acciones para editar la solicitud. (Agente IA) [#]()

### 1.47.38 User NIP persistence sync 25-10-2025

Fix:
- Sincroniza el NIP actualizado con el estado de autenticación y el almacenamiento local para reflejar el cambio tras recargar la configuración de usuario. (Agente IA) [#]()

### 1.47.37 Request documents operational tab 25-10-2025

Feat:
- Agrega una pestaña de Documentos Operativos en solicitudes para consultar y descargar los archivos con la misma tabla que Documentos Gerenciales. (Agente IA) [#]()

### 1.47.36 Document registry storage naming 25-10-2025

Fix:
- Genera nombres de archivo con sello de tiempo antes de la extensión y desactiva el sufijo automático de Firebase para conservar rutas válidas al previsualizar documentos de Office en las tablas gerenciales y operativas. (Agente IA) [#]()

### 1.47.35 User password display sync 25-10-2025

Fix:
- Sincroniza el campo de contraseña mostrada con el valor actualizado en el store inmediatamente después de guardar la nueva contraseña. (Agente IA) [#]()

### 1.47.34 User signature pad popup bypass 25-10-2025

Fix:
- Evita que el flujo de actualización de firma en configuración de usuario vuelva a mostrar el popup de autorización y asegura que el SignaturePad se muestre inmediatamente en modo de pantalla completa. (Agente IA) [#]()

### 1.47.33 User configuration signature pad 25-10-2025

Fix:
- Permite actualizar la firma del usuario sin solicitar autorización previa y muestra el SignaturePad en pantalla completa para facilitar la captura. (Agente IA) [#]()

### 1.47.32 Human resources hook stories canvas 25-10-2025

Fix:
- Ajusta las historias de hooks de documentos de Recursos Humanos para usar solo vistas Canvas de Storybook sin autodocs. (Agente IA) [#]()

### 1.47.31 Human resources document hooks 25-10-2025

Feature:
- Documenta los hooks de documentos operativos, gerenciales y registro en Storybook con estados controlables y proveedores simulados. (Agente IA) [#]()

### 1.47.30 Human resources documents coverage 25-10-2025

Feature:
- Refuerza los hooks de documentos operativos, gerenciales y registro con pruebas que validan refresco y estados, y agrega historias de Storybook junto con tests de página para los flujos de Recursos Humanos. (Agente IA) [#]()

### 1.47.29 Human resources document actions 25-10-2025

Feature:
- DocumentActionsMenuCell cuenta con historias de Storybook, pruebas unitarias para el componente, hook y utilidades de permisos. (Agente IA) [#]()

### 1.47.28 Document registry edit flow 25-10-2025

Fix:
- Use PUT when editing existing documents, preserve the stored file, and keep the form valid with preloaded attachments. (Agente IA) [#]()

### 1.47.27 Document registry department arrays 25-10-2025

Feature:
- Allow document registry to submit department identifiers as arrays and populate the checklist from Enterprises/Departments. (Agente IA) [#]()

### 1.47.26 Document registry submission 25-10-2025

Feature:
- Trigger Documents endpoint POST from document registry form submission with payload mapping and alerts. (Agente IA) [#]()

### 1.47.25 Operational documents listing 24-10-2025

Feature:
- Create OperationalDocuments page leveraging management documents table data. (Agente IA) [#]()

### 1.47.24 Management documents listing 24-10-2025

Feature:
- Add /Documents mapping, store, and management documents page with DataTable integration. (Agente IA) [#]()

### 1.47.23 SAT invoices SAP redirect 23-10-2025

Feature:
- Update SAT invoice submission to use BillingDocumentsSendToSAP and redirect to administración SAP after confirmation. (Agente IA) [#]()

### First Commit 25-07-2025

- First Commit.
  (Bruno Mendoza) [#]()

### 1.0.0 First Documentation 25-07-2025

Feature:
-To describe architecture, well practices, gitflow, ChangeLog use and proyect information
(Bruno Mendoza) [#1](https://github.com/DR-Mexico/dr.intranet.web/pull/1)

### 1.1.0 First Test 25-07-2025

Feature:
-To get all components tested with vitest
(Bruno Mendoza) [#2](https://github.com/DR-Mexico/dr.intranet.web/pull/2)

### 1.2.0 Story Book configuration 28-07-2025

Feature:
-To be able to make components documentation. To have a better quality control
(Bruno Mendoza) [#3](https://github.com/DR-Mexico/dr.intranet.web/pull/3)

### 1.3.0 Creating a Dynamic Tab Component 28-07-2025

Feature:

- To display tabs based on their interaction
  (Katherine Negrete A) [#6](https://github.com/DR-Mexico/dr.intranet.web/pull/6)

### 1.4.0 Proyect Configuration and context documentation 28-07-2025

Feature:

- To have principal proyect configuration and a guide to generate documentation.
  (Bruno Mendoza Ruiz) [#7](https://github.com/DR-Mexico/dr.intranet.web/pull/7)

### 1.5.0 Hooks and utilities tests 29-07-2025

Feature:

- Added tests and MDX documentation for hooks, contexts and utilities.
  (Agente IA) [#8] (https://github.com/DR-Mexico/dr.intranet.web/pull/8)

### 1.6.0 Service Worker configuration 29-07-2025

Feature:

- To be able to recibe push notifications and to manage pwa
  (Bruno Mendoza) [#9] (https://github.com/DR-Mexico/dr.intranet.web/pull/9)

### 1.7.0 Creating the Tooltip Component 29-07-2025

Feature:

- To display a tooltip
  (Katherine Negrete A) [#10] (https://github.com/DR-Mexico/dr.intranet.web/pull/10)

### 1.8.0 Creating ProgressBar, PaginationDots, Control, and CustomRadio components 30-07-2025

Feature:

- Reusable components were created for page creation.
  (Katherine Negrete A) [#13] (https://github.com/DR-Mexico/dr.intranet.web/pull/13)

### 1.9.0 Login hook and docs 30-07-2025

Feature:

- Refactored LoginPage using useLogin hook with tests and documentation.
  (Bruno Mendoza) [#12](https://github.com/DR-Mexico/dr.intranet.web/pull/12)

### 1.10.0 Avatar and Pagination components 30-07-2025

Feature:

- Refactored Avatar and Pagination components following project architecture.
  (Katherine Negrete A) [#15](https://github.com/DR-Mexico/dr.intranet.web/pull/15)

### 1.11.0 Tests are added to Avatar and Pagination hooks 30-07-2025

Feature:

- To perform hook testing and prevent errors.
  (Katherine Negrete A) [#16](https://github.com/DR-Mexico/dr.intranet.web/pull/16)

### 1.12.0 PopUp catalog and tests update 2025-08-31

Feature:

- Added PopUpCatalog component and extended PopUp tests. (Agente IA) [#]()

### 1.12.0 PermissionsAgent and PersonalAvatar docs 2025-08-30

Feature:

- Added tests and Storybook stories for PermissionsAgent and PersonalAvatar.
- Ensured components follow project architecture with types and styles.
  (Agente IA) [#17](https://github.com/DR-Mexico/dr.intranet.web/pull/17)

### 1.12.0 Main layout tests and docs 2025-08-30

Feature:

- Added tests and Storybook stories for main-page layout and its utilities.
  (Agente IA) [#18](https://github.com/DR-Mexico/dr.intranet.web/pull/18)

### 1.12.0 PrincipalContext docs and tests 2025-07-30

Feature:

- Added documentation and tests for PrincipalContext, useAlert hook and ThemeInitializer utility.
  (Agente IA) [#20](https://github.com/DR-Mexico/dr.intranet.web/pull/20)

### 1.13.0 Main page layout refactor 2025-08-31

Feature:

- Split main layout into MainSidebar and MainTabs components with tests and stories.
  (Agente IA) [#22](https://github.com/DR-Mexico/dr.intranet.web/pull/22)

### 1.14.0 Separate main layout logic 2025-08-31

Feature:

- Extracted useMainPage hook and styles for main layout with tests.
  (Agente IA) [#23](https://github.com/DR-Mexico/dr.intranet.web/pull/23)

### 1.15.0 Principal Layout 2025-08-04

Feature:

- To manage routes renderization and provide a global layout
  (Bruno Mendoza) [#24](https://github.com/DR-Mexico/dr.intranet.web/pull/24)

### 1.16.0 FileUploader initial file support 2025-08-06

Feature:

- Added ability to preload files via URL or base64 in FileUploader.
  (Agente IA) [#]()

### 1.17.0 DynamicForm file uploader support 2025-08-06

Feature:

- Added FileUploader field type to DynamicForm.
  (Agente IA) [#]()

### 1.18.0 DynamicForm external submit support 2025-08-06

Feature:

- Added optional external submit control to DynamicForm.
  (Agente IA) [#]()

### 1.19.0 Customizable form fields and FileUploader placeholder 2025-08-06

Feature:

- Enabled `className` styling for DynamicForm fields.
- Improved FileUploader with placeholder, top label, and full-width default.
  (Agente IA) [#]()

### 1.20.0 DataTable documentation and tests 2025-08-06

Feature:

- Added comprehensive documentation, stories and tests for DataTable.
  (Agente IA) [#]()

### 1.21.0 DataTable documentation and tests 2025-08-06

Feature:

- Added comprehensive documentation, stories and tests for DataTable.
  (Agente IA) [#]()

### 1.22.0 DynamicForm catalog and documentation 2025-08-06

Feature:

- Added catalog page and enhanced documentation for DynamicForm.
  (Agente IA) [#]()

### 1.23.0 DynamicForm catalog and documentation 2025-08-06

Feature:

- Added catalog page and enhanced documentation for DynamicForm.
  (Agente IA) [#]()

### 1.24.0 Button, Checkbox and CollapsibleSection docs 2025-08-07

Feature:

- Added catalogs and extended stories for Button, Checkbox and CollapsibleSection.
  (Agente IA) [#]()

### 1.25.0 Button, Checkbox and CollapsibleSection docs 2025-08-07

Feature:

- Added catalogs and extended stories for Button, Checkbox and CollapsibleSection.
  (Agente IA) [#]()

### 1.26.0 Accounting Module struchture, table component and dynamicForm features 2025-08-07

Feature:
-Because many modules and componentes are going to use tables and Forms
(Bruno Mendoza) [#32](https://github.com/DR-Mexico/dr.intranet.web/pull/32)

### 1.27.0 Component architecture fixes 2025-08-07

Feature:

- Added missing tests, stories, catalogs, hooks and utilities for Calendar, Card, ContextMenu, Label, List and ServiceWorkerRegister components.
  (Agente IA) [#]()

### 1.28.0 Add missing architecture files for new components 2025-08-08

Feature:

- Several components lacked required tests, stories, types, hooks and utilities.
  (Katherine Negrete A) [#34](https://github.com/DR-Mexico/dr.intranet.web/pull/34)

### 1.29.0 DataTable subcomponent docs 2025-08-08

Feature:

- Added tests, stories and catalogs for DataTableLayout and DataTableContent to comply with architecture standards.
  (Agente IA) [#]()

### 1.30.0 Ensure viewport height and table scroll 2025-08-08

Feature:

- Maintains 100vh layout with internal page and table scrolling.
  (Agente IA) [#]()

### 1.31.0 Document and test stores 2025-08-12

Feature:

- Added documentation and tests for global stores and their utilities.
  (Agente IA) [#]()

### 1.32.0 Http and names utilities tests 2025-08-12

Feature:

- Added tests and documentation for Http helpers and NamesUtilities.
  (Agente IA) [#]()

### 1.32.0 Separate Excel/PDF utility types and styles 2025-08-14

Feature:

- Extracted types and styles into dedicated files for Excel and PDF utilities, added documentation and tests.
  (Agente IA) [#]()

### 1.33.0 Document Excel and PDF utilities 2025-08-14

Feature:

- Separated remaining Excel interfaces, added Storybook docs y JSDoc para utilidades de Excel y PDF.
  (Agente IA) [#]()

### 1.34.0 Component Adjustments 2025-08-14

Feature:

- To reuse components for each different design
  (Katherine Negrete A) [#47](https://github.com/DR-Mexico/dr.intranet.web/pull/47)

### 1.35.0 Requisition form tests and docs 2025-08-14

Feature:

- Added tests, Storybook stories and MDX docs for RequisitionsForm, hook and utilities.
  (Agente IA) [#]()

### 1.36.0 Final Request Features 2025-08-15

Feature:
-Because it needs fine details
(Bruno Mendoza) [#56](https://github.com/DR-Mexico/dr.intranet.web/pull/56)

### 1.37.0 BillingImages store 2025-08-15

Feature:

- Added BillingImages store with CRUD utilities, documentation and tests.
  (Agente IA) [#](https://github.com/DR-Mexico/dr.intranet.web/pull/)

### 1.38.0 BillingDocuments store 2025-08-18

Feature:

- Added BillingDocuments store with CRUD utilities, documentation and tests. (Agente IA) [#](https://github.com/DR-Mexico/dr.intranet.web/pull/)

### 1.39.0 Invoices form with Firebase upload 2025-08-18

Feature:

- Added useInvoicesForm hook and Firebase file upload for invoices. (Agente IA) [#](https://github.com/DR-Mexico/dr.intranet.web/pull/)

### 1.40.0 BillingHistory store 2025-08-18

Feature:

- Added BillingHistory store with fetch utility and mapping. (Agente IA) [#](https://github.com/DR-Mexico/dr.intranet.web/pull/)

### 1.40.1 Test stability improvements 2025-08-22

Fix:

- Added missing mocks for layout, billing documents and requisitions tests and removed obsolete snapshot. (Agente IA) [#]()

### 1.41.1 Invoices Details 2025-08-25

Fix:

- To improve Invoices Module.
  (Bruno Mendoza) [#65](https://github.com/DR-Mexico/dr.intranet.web/pull/65)

### 1.42.2 Auth store 2025-08-26

Feature:

- Added authentication store utilities for login, validation and NIP flows. (Agente IA) [#PR]()

### 1.43.1 Permissions features 2025-08-27

Feature:

- Because we need to control Proyect Permissions.
  (Bruno Mendoza) [#77](https://github.com/DR-Mexico/dr.intranet.web/pull/77)

### 1.43.2 Test fixes 2025-08-27

Fix:

- Added missing context mocks for stable unit tests. (Agente IA) [#]()

### 1.44.0 DynamicForm NumberControl support 2025-08-27

Feature:

- Added NumberControl field type to DynamicForm with tests and docs. (Agente IA) [#]()

### 1.44.1 AuthContext migrated to store 2025-08-27

Refactor:

- Migrated authentication context logic into global store. (Agente IA) [#]()

### 1.44.2 Requisition details tests and docs 2025-09-03

Fix:

- Added tests and Storybook docs for requisition detail components and hooks. (Agente IA) [#]()

### 1.45.0 Personal invoices tests and docs 2025-09-03

Feature:

- Added tests and Storybook stories for personal invoices forms, hooks and side menu. (Agente IA) [#]()

### 1.46.0 Responsive design added 2025-09-04

Feature:
- To display information seamlessly on mobile devices.
(Katherine Negrete A) [#100](https://github.com/DR-Mexico/dr.intranet.web/pull/100)

### 1.46.1 Accounting redirects by permissions 2025-09-05

Fix:

- Added client-side permission checks to accounting and invoices pages for secure redirects. (Agente IA) [#]()


### 1.46.2 Reusable permission redirect component 2025-09-05

Fix:

- Centralized permission checks with reusable component and home navigation. (Agente IA) [#]()

### 1.46.3 Show Excel download button on mobile and desktop 2025-09-08

Fix:

- To show the Excel download button. (Katherine Negrete) [#109](https://github.com/DR-Mexico/dr.intranet.web/pull/109)
### 1.46.4 Style Fixes 2025-09-09

Fix:

- To display designs according to Figma (Katherine Negrete) [#113](https://github.com/DR-Mexico/dr.intranet.web/pull/113)
### 1.47.4 Add data-testid support to DynamicForm and components 2025-09-10

Fix:

- Enabled data-testid prop across DynamicForm, FieldRenderer, and related controls to improve Playwright testing. (Agente IA) [#]()


### 1.47.5 Billing petty cash store implementation 2025-09-10

Feature:

- Implemented `useBillingPettyCash` store with utilities, mappings, and tests. (Agente IA) [#]()

### 1.47.6 Petty cash voucher form 2025-09-11

Feature:

- Switched VoucherPink form logic to use petty cash voucher store. (Agente IA) [#]()

### 1.47.7 Voucher forms refactor 2025-09-12

Feature:

- Refactored VoucherPink and VoucherBlue forms to align with TicketForm and InvoicesForm architecture, adding stories and hook tests. (Agente IA) [#]()

### 1.47.8 Voucher forms data edit support 2025-09-13

Feature:

- Enabled dataEdit prefill for VoucherPink and VoucherBlue forms. (Agente IA) [#]()

### 1.47.9 Petty cash context provider 2025-09-12

Feature:

- Added shared petty cash context for voucher forms. (Agente IA) [#]()

### 1.47.10 Independent petty cash voucher submissions 2025-09-14

Bug Fix:

- Prevent VoucherPink and VoucherBlue from triggering each other's requests and loading states. (Agente IA) [#]()

### 1.47.11 Voucher forms employee and file support 2025-09-15

Fix:

- Send authenticated employee IDs and preserve XML/PDF files when editing petty cash vouchers. (Agente IA) [#]()

### 1.47.12 Petty cash voucher file upload 2025-09-16

Fix:

- Upload XML/PDF files for petty cash vouchers and auto-fill employee data. (Agente IA) [#]()

### 1.47.13 Voucher form project reload fix 2025-09-17

Fix:

- Repopulate project options after sending petty cash vouchers to prevent endless loading. (Agente IA) [#]()

### 1.47.14 Petty cash SideMenu edit fix 2025-09-17

Fix:

- Ensure petty cash SideMenu resubmissions use PUT and preload concept and project fields. (Agente IA) [#]()

### 1.47.15 Petty cash edit date refresh 2025-09-18

Fix:

- Normalize petty cash edit dates and refresh vouchers after resubmission. (Agente IA) [#]()

### 1.47.16 Petty cash edit success loop fix 2025-09-18

Fix:

- Stop repeated petty cash voucher resets after editing and keep success refreshes scoped to the updated record. (Agente IA) [#]()

### 1.47.17 Petty cash rejection comment popup 2025-09-30

Fix:

- Request a rejection comment before rejecting petty cash vouchers from the treasury control side menu. (Agente IA) [#]()

### 1.47.18 Petty cash rejection focus improvement 2025-09-30

Fix:

- Close the side menu when the rejection comment popup opens so the confirmation dialog is the only visible focus. (Agente IA) [#]()

### 1.47.19 Petty cash rejection popup layering 2025-09-30

Fix:

- Render the rejection popup through a portal with a higher z-index so it always overlays the treasury control panel. (Agente IA) [#]()

### 1.47.20 Petty cash history form disabling 2025-09-30

Fix:

- Disable petty cash history voucher forms when the record status is not editable and resync the toggle whenever the status changes. (Agente IA) [#]()

### 1.47.21 Petty cash blue voucher amount display 2025-09-30

Fix:

- Show the requested amount for blue petty cash vouchers in the edit side menu and suppress redundant loading errors after updating the amount. (Agente IA) [#]()

### 1.47.22 SAP details panels testing 2025-09-30

Fix:

- Add unit coverage for SAP administration and operations panels, extract shared logic into a reusable hook, and validate their supporting hooks. (Agente IA) [#]()
