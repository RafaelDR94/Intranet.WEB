
# 📐 Architecture Overview

Este proyecto es una aplicación de **Next.js** organizada bajo el directorio `src/`. La carpeta principal `app/` contiene la estructura de rutas, estilos globales y todos los componentes y estructuras que componen la UI y lógica compartida.

Se incluyen configuraciones relevantes para la funcionalidad PWA y uso de `service worker` personalizado.


---

## 📁 Estructura General del Proyecto

### `components/`
Componentes reutilizables de UI. Cada uno vive en su propia carpeta:

- `ComponentName.tsx`: componente principal.
- `types.ts`: tipos TypeScript del componente.
- `styles.ts`: estilos en Tailwind.
- `hooks/`: hooks específicos del componente.
- `utilities/`: helpers internos del componente.
- `*.test.tsx`: pruebas unitarias.
- `*.stories.tsx`: documentación en Storybook.


### `configurations/`
Configuración de librerías externas:

- `Axios/`: cliente HTTP centralizado.
- `Azure/`: autenticación u otros servicios de Microsoft.
- `FirebaseContext/`: inicialización y configuración de Firebase.
- `DataBase/`: configuración local de Dexie para IndexedDB.

> Exponen instancias listas para usarse en cualquier parte de la app.

### `context/`
Contextos globales para compartir estado en la aplicación. Cada contexto puede incluir:

- `ContextName.tsx`: implementación del `Provider`.
- `types.ts`: tipos de datos del contexto.
- `hooks/`: lógica reutilizable relacionada al contexto (`useContextName.ts`, `useLogic.ts`).
- `utilities/`: funciones auxiliares internas.
- `*.test.tsx`: pruebas unitarias del contexto.
- `*.docs.mdx`: documentación técnica en Storybook.

> También puede incluir ejemplos en `*.stories.tsx` o solo `*.docs.mdx` si es una lógica sin UI.

---

## 🔧 Mocks y compatibilidad cross-entorno (Vitest + Storybook)

### 🦪 Mocks globales en pruebas unitarias (Vitest)

Todos los mocks comunes están definidos en `vitest.setup.tsx` y se aplican automáticamente a todos los tests. Entre ellos:

- `next/image` → reemplazado por un span
- Imágenes (`logo.png`, SVGs) → mock como string o SVG



Esto permite que los componentes funcionen en test sin errores del router o dependencias externas.

### 📖 Mocks manuales en Storybook


### ✅ Reglas de consistencia


- Tests usan `vi.mock()` y `.mockReturnValue()` para simular navegación.



```

> Este patrón garantiza que todos los hooks, componentes y páginas sean compatibles con testeo y documentación sin errores del router o del entorno de Next.js.

---

## Configuración PWA
```ts
const withPWA = require("next-pwa")({
  dest: "public",
  register: false,
  skipWaiting: true,
  disable: false,
  sw: 'sw.js',
  swSrc: 'src/sw.ts',
});
```
## Estructura relevante
- `/public/manifest.webmanifest`: define el manifiesto web PWA.
- `/public/sw.js`: archivo de salida del service worker.
- `/src/sw.ts`: archivo fuente del service worker personalizado.
- `/components/ServiceWorkerRegister/ServiceWorkerRegister.tsx`: registra dinámicamente el SW.
- `next.config.js`: configuración de `next-pwa` con `injectManifest`.

## Consideraciones importantes
- Modo `injectManifest` permite controlar completamente el comportamiento del service worker.
- El SW escucha `CACHE_ONLY_MODE` desde la app para cambiar estrategias de caché.
- Se usa Workbox con estrategias: `NetworkFirst`, `StaleWhileRevalidate`, `ExpirationPlugin`.

## Firebase
- Se configura `firebase-messaging` directamente en el SW.
- Soporte para notificaciones push (background).


### Contextos por página (locales)

Cada página en `app/` puede tener su propio contexto localizado en `app/<ruta>/context/`.

Estos contextos locales deben seguir la misma arquitectura modular definida para los contextos globales:

```
app/
└── dashboard/
    ├── context/
    │   ├── DashboardContext.tsx
    │   ├── types.ts
    │   ├── hooks/
    │   │   └── useDashboard.ts
    │   └── utilities/
    │       └── helpers.ts
    ├── layout.tsx
    └── page.tsx
```


**Reglas:**
- Se utiliza solo para manejar estado y lógica que solo aplica a esa página y sus subrutas.
- No se debe usar para compartir estado entre módulos no relacionados.
- Puede importar servicios externos, utilidades y mappers según necesidad.

### `hooks/`
Hooks globales reutilizables independientes de componentes o contextos. Cada hook debe vivir en su propia carpeta:

```
hooks/
└── useAuth/
    ├── useAuth.ts
    ├── useAuth.test.ts
    └── useAuth.docs.mdx
```

> Si el hook es específico de un contexto o componente, colócalo en su carpeta respectiva (`hooks/` local).

Cada hook debe tener:

- `*.ts`: implementación.
- `*.test.ts`: pruebas unitarias con mocks.
- `*.docs.mdx`: documentación técnica (uso, props, retorno, errores esperados).

---

### `utilities/`
Funciones globales reutilizables. Deben ser puras, sin estado y no deben depender de componentes.

- Ej: `dateHelper.ts`, `pictureHelper.ts`, `formatPermissions.ts`.
- Documentadas con JSDoc.
- Si son funciones críticas o compartidas, deben tener su archivo `.test.ts` y `.docs.mdx`.

Estructura sugerida para cada utilidad compartida:

```
utilities/
└── pictureHelper/
    ├── index.ts
    ├── pictureHelper.test.ts
    └── pictureHelper.docs.mdx
```

Cada componente o contexto también puede tener su carpeta `utilities/` si la lógica solo aplica en ese ámbito.

### `mappings/`
Cada dominio tiene su propia carpeta que contiene:

```
mappings/
├── users/
│   ├── user.types.ts
│   └── user.mapper.ts
├── employees/
│   ├── employee.types.ts
│   └── employee.mapper.ts
├── departments/
│   ├── department.types.ts
│   └── department.mapper.ts
...
```

**Ventajas:**
- Tipos y funciones de mapeo separados.
- Claridad por dominio.
- Escalable y mantenible a largo plazo.

> Toda transformación de datos del backend debe hacerse a través de los archivos de `*.mapper.ts`. Los tipos deben ser consumidos desde `*.types.ts`.

## 🧪 Testing con Vitest

Todos los módulos reutilizables deben tener pruebas unitarias:

| Tipo               | Archivo requerido      |
|--------------------|------------------------|
| Componentes        | `Component.test.tsx`   |
| Contextos          | `Context.test.tsx`     |
| Hooks              | `useX.test.ts`         |
| Utilities críticas | `utility.test.ts`      |

> Los tests deben incluir mocks necesarios para aislamiento. Usa `vi.mock(...)` para Axios, Dexie, etc.

---

## 📖 Documentación con Storybook `.docs.mdx`

Todos los módulos reutilizables deben incluir documentación técnica en Storybook:

| Tipo               | Archivo requerido      |
|--------------------|------------------------|
| Componentes        | `Component.docs.mdx`   |
| Contextos          | `Context.docs.mdx`     |
| Hooks              | `useX.docs.mdx`        |
| Utilities clave    | `utility.docs.mdx`     |

> Si el módulo no tiene UI (como `AuthService`), se documenta solo con `.docs.mdx`, sin necesidad de `*.stories.tsx`.

### 📄 Documentación de hooks por página

Los hooks que están **estrechamente ligados a una página o layout específico**, como `useMainPage`, deben documentarse dentro de su misma jerarquía en Storybook para mantener la trazabilidad clara.

📍 Ejemplo:

- Hook global reutilizable → `Hooks/usePermissions`
- Hook vinculado a una vista → `Pages/MainLayout/hooks/useMainPage`

> Esto permite entender **qué hook pertenece a qué vista** y evita que se mezclen hooks locales con los reutilizables.

Además, deben seguir las reglas generales de documentación:

- Archivo `useX.docs.mdx`
- Exportar el hook como `default`
- Usar `Meta title="Pages/NombreVista/hooks/useX"` en `.mdx`
- Incluir comportamiento esperado, dependencias, tipos retornados y ejemplo de uso

#### 📘 Reglas de documentación para hooks

| Tipo de hook               | Ruta sugerida en Storybook              |
|----------------------------|-----------------------------------------|
| Global y reutilizable      | `Hooks/useNombreHook`                   |
| Acoplado a una página      | `Pages/NOMBRE_PAGINA/hooks/useHook`     |
| Local a un componente      | `Components/NOMBRE/hooks/useHook`       |

Hooks globales reutilizables independientes de componentes o contextos. Cada hook debe vivir en su propia carpeta:

```
hooks/
└── useAuth/
    ├── useAuth.ts
    ├── useAuth.test.ts
    └── useAuth.docs.mdx
```

> Si el hook es específico de un contexto o componente, colócalo en su carpeta respectiva (`hooks/` local).

Cada hook debe tener:

- `*.ts`: implementación.
- `*.test.ts`: pruebas unitarias con mocks.
- `*.docs.mdx`: documentación técnica (uso, props, retorno, errores esperados).

📄 Documentación de utilities por contexto, componente o página
Las funciones utilitarias (utilities/) deben documentarse según su nivel de uso:

📍 Ejemplo:

Utilidad global reutilizable → Utilities/dateHelper

Utilidad acoplada a una página → Pages/MainLayout/utilities/useLocalMapper

Utilidad interna de un componente → Components/Button/utilities/buttonLogic

Esto permite distinguir funciones puras globales de aquellas que solo aplican a un ámbito local.

📘 Reglas de documentación para utilities
Tipo de utilidad	Ruta sugerida en Storybook
Global y reutilizable	Utilities/utilityName
Acoplada a una página	Pages/NOMBRE_PAGINA/utilities/funcion
Interna de un componente	Components/NOMBRE/utilities/funcion

Cada utilidad debe tener su propio folder si es significativa, con la siguiente estructura:

ts
Copiar
Editar
utilities/
└── formatPermissions/
    ├── index.ts
    ├── formatPermissions.test.ts
    └── formatPermissions.docs.mdx
Y cumplir con:

index.ts: implementación de la función (sin estado, pura).

.test.ts: pruebas unitarias con casos comunes y edge cases.

.docs.mdx: documentación técnica del comportamiento esperado, ejemplos de entrada/salida y errores esperados.

Las funciones que dependen de contextos deben documentarse localmente (no en Utilities/ raíz).

---
## 🧠 Manejo de Estado con Zustand

Zustand es una alternativa ligera y eficiente a React Context para manejar estado global o compartido entre componentes. Se recomienda usar Zustand cuando:

- Se requiere compartir estado entre componentes no relacionados jerárquicamente.
- Se necesita mantener un estado reactivo fuera del árbol de React.
- Se busca evitar el re-render innecesario de componentes por cambios en el estado.
- Se prefiere una solución sin boilerplate ni `useContext`.

---

### 📦 Instalación

```bash
npm install zustand
```

---

## Patrón de acceso a APIs
**Objetivo:** centralizar el wiring del cliente HTTP, estandarizar el manejo de errores y mantener **stores de Zustand delgados**, delegando la lógica de red a **acciones puras** en `utilities/`.

### Componentes clave

1) **Intranet Gateway (global)**
   - Se registra una vez en el layout raíz con un componente cliente `IntranetGatewayInit`.
   - Publica `get / post / put / delete` en `useIntranetGatewayStore`.
   - Cualquier módulo puede consumirlos indirectamente vía `requireGateway()` (ver abajo).

2) **requireGateway**
   - Helper mínimo para obtener una función del gateway (`get`, `post`, `put`, `delete`).
   - Si el gateway aún no está listo, **lanza un error legible** (evita estados ambiguos).
   - Firma:
     ```ts
     export function requireGateway<K extends 'get'|'post'|'put'|'delete'>(k: K): (...args: any[]) => void
     ```

3) **promisifyIntranet**
   - Adapta nuestras funciones por callback del gateway a Promesas: `pGet`, `pPost`, `pPut`, `pDelete`.
   - Considera **OK por defecto 200–299** (incluye 204). Cualquier otra respuesta se rechaza.
   - Permite ajustar el rango si fuera necesario.
   - Ventajas: `async/await` limpio, errores normalizados y menos “paja” en stores.

4) **normalizeApiError**
   - Convierte `AxiosResponse | AxiosError | Error | unknown` al shape estándar:
     ```ts
     type NormalizedError = { message: string; status?: number; code?: string; details?: unknown }
     ```
   - Lee campos frecuentes de nuestra API (`error_Message`, `error_Code`, etc.).
   - Todos los stores guardan **solo `error: string`** para simplificar la UI.

5) **Stores delgados + Actions puras**
   - El store **solo** declara estado y delega en acciones importadas desde `utilities/`.
   - Cada acción es una función pura que recibe `set` / `get`, llama `pGet/pPost/...`, aplica `mappings/` y actualiza estado.
   - Transformaciones de datos **siempre** en `mappings/<dominio>`.

### Flujo (alto nivel)
```
UI (Formulario/Tabla)
  └─ llama store.accion()
       ├─ stores/<dominio>/utilities/<accion>.ts
       │   ├─ const http = requireGateway('get'|'post'|'put'|'delete')
       │   ├─ const res = await pGet|pPost|pPut|pDelete(http)(url[, data])
       │   ├─ mapea datos (mappings/*)
       │   └─ set(...) en el store
       └─ set(...) dispara rerender de quien seleccionó esa slice
```

### Estructura de carpetas (por dominio)
```
src/app/stores/<dominio>/
  ├─ types.ts                        // State, Set/Get, firmas de acciones
  ├─ use<Domino>Store.ts             // Store delgado (Zustand)
  └─ utilities/
     ├─ fetch<Domino>.ts
     ├─ create<Domino>.ts
     ├─ update<Domino>.ts
     ├─ delete<Domino>.ts
     ├─ (otros).ts
     ├─ utilities.test.ts            // ÚNICO archivo de tests para todas las utilities del dominio
     └─ utilities.docs.mdx           // ÚNICO archivo MDX para documentar las utilities del dominio
```

> **Requisito de documentación**: todas las utilities deben incluir **JSDoc** dentro del código (descripción, params, returns, ejemplos).

### Rendimiento (Zustand)
- Usar **selectores finos** + comparación superficial:
  ```ts
  import { shallow } from 'zustand/shallow'
  const { creating, error } = useStore(s => ({
    creating: s.creating,
    error: s.error,
  }), shallow)
  ```
- Para objetos “grandes”, usar `createWithEqualityFn`.
- No crear hooks “gordos” que reexpongan todo el store; preferir selectores.

### Flags & UX
- Flags por operación (por ejemplo: `creating`, `updating`, `removing`, `updatingExcel`).
- `PrincipalContext` para spinners/alerts consistentes.
- Si la API incluye detalles dentro de un 200 (p.ej. `rowsWithMissingData`), formatearlos:
  ```ts
  const missing = res.data?.data?.rowsWithMissingData as string[] | undefined
  const detail = missing?.length ? `\nDetalles:\n- ${missing.join('\n- ')}` : ''
  ```

### Testing
- Tests unitarios para **cada dominio** en un **único** archivo `utilities.test.ts` dentro de `stores/<dominio>/utilities/`.
- Mockear `requireGateway` para controlar respuestas.
- Casos: éxito (200/201), error (>=400), edge-cases (payload vacío, etc.).

### Docs (MDX)
- Documentación de las utilities por **dominio** en un **único** `utilities.docs.mdx` en la misma carpeta.
- Incluir ejemplo de uso desde UI (form/tabla), shape del state y contrato de cada acción.
- El código debe estar comentado con **JSDoc** (obligatorio).


Zustand permite simplificar el manejo de estado global o compartido sin la sobrecarga de Context API o Redux. Es ideal para UI simples, toggles, filtros, o sincronización entre módulos.

## 🎨 Estilos con Tailwind CSS

La arquitectura de estilos utiliza Tailwind CSS extendido con una configuración personalizada definida en `tailwind.config.js`. La configuración está vinculada a `globals.css` mediante clases utilitarias, usando variables CSS para los temas `light` y `dark` controlados por `data-theme`.

### Personalizaciones clave:

- **Paleta de colores**: todas las categorías (`black`, `white`, `blue`, `green`, `turquoise`, `gray`, `alert-*`) se definen con niveles (`10` a `100`) y se vinculan con variables CSS para soportar temas.
- **Tipografías**: se utilizan las fuentes `Montserrat` y `Nulshock`, definidas como variables CSS y aplicadas con la utilidad `fontFamily`.
- **Sombras, espaciado y radios personalizados**: definidos como `boxShadow`, `spacing` y `borderRadius` en el `theme.extend`.
- **Tamaños de fuente semánticos**: como `h1`, `h2`, `b1`, `c2`, `cta-large`, etc., definidos en `fontSize` con sus respectivas `lineHeight`.

### Buenas prácticas:

- Cada componente debe usar clases utilitarias de Tailwind para estilos base.
- Los estilos adicionales deben agruparse en `styles.ts` dentro de la carpeta del componente.
- Evitar clases CSS globales a menos que sea estrictamente necesario (como fuentes o color de fondo del `body`).

---

## ✍️ Convenciones de Nombres

| Elemento                  | Convención                      | Ejemplo                        |
|---------------------------|----------------------------------|-------------------------------|
| Componentes               | `PascalCase`                    | `DynamicForm`, `Alert`        |
| Hooks                     | `camelCase` con `use`           | `useSelect`, `useAuthContext` |
| Tipos TypeScript          | `PascalCase`                    | `UserType`, `FieldModel`      |
| Funciones utilitarias     | `camelCase`                     | `formatDate`, `getInitials`   |
| Tests                     | `Nombre.test.tsx`               | `Button.test.tsx`             |
| Ejemplos manuales         | `NombreCatalog.tsx`             | `InputCatalog.tsx`            |
| Estilos                   | `styles.ts`                     | `checkboxStyles`              |

---

## ✅ Reglas de Calidad y Validación

1. **Tests unitarios con Vitest**
   - Archivo `*.test.tsx` obligatorio por componente.

2. **Historias en Storybook**
   - Al menos una en modo claro y otra en modo oscuro usando `data-theme`.

3. **Tipado completo con TypeScript**
   - Tipos en `types.ts`, sin `any` implícito.

4. **Estilos encapsulados**
   - Solo Tailwind, con estilos extra en `styles.ts`.

5. **Separación de lógica**
   - Lógica dentro de hooks (`useX.ts`) separados del render.

6. **Uso de contextos por página o funcionalidad**
   - Cada página o módulo importante debe tener su propio contexto si maneja estados compartidos.

7. **Funciones reutilizables largas → `utilities/`**
   - Cuando la lógica es extensa o se reutiliza en varios lugares.

8. **Transformación de datos → `mappings/<dominio>/<dominio>.mapper.ts`**
   - Toda respuesta del backend debe pasar por su respectivo mapper.
9. **Codigo con anotaciones JSDoc**
   - Todo componente, hook, contexto y utilidad deben tener anotaciones JSDoc
> Para más detalles sobre pruebas, commits y control de calidad por PR, consulta [`CONTRIBUTING.md`](./CONTRIBUTING.md).

---


## 🤩 Patrones de Composición Recomendados

Estos patrones ayudan a construir componentes más reutilizables, legibles y escalables. A continuación se resumen los principales, indicando si ya se aplican en este proyecto, si se recomienda su uso, y en qué contextos aplican mejor.

### 📊 Tabla Resumen

| Patrón | ¿Aplicado? | ¿Recomendado? | Aplicar en… |
| ------ | ---------- | ------------- | ----------- |
|        |            |               |             |

| **Custom Hooks**                  | ✅ Sí       | ✅ Muy alto | Lógica reutilizable: auth, formularios, fetch  |
| --------------------------------- | ---------- | ---------- | ---------------------------------------------- |
| **Container-Presenter**           | ✅ Sí       | ✅ Muy alto | Separar lógica y presentación visual           |
| **Compound Components**           | 🔶 Parcial | ✅ Muy alto | Tabs, Dropdown, Form, Modal, etc.              |
| **Control Props**                 | 🔶 Parcial | ✅ Muy alto | Modal, Inputs complejos, Select, Toggle        |
| **Controlled/Uncontrolled**       | ✅ Sí       | ✅ Medio    | Formularios y campos de entrada                |
| **Higher-Order Components (HOC)** | ❌ No       | ⚠️ Bajo    | Evitar salvo casos excepcionales               |
| **Render Props**                  | ❌ No       | ⚠️ Bajo    | Solo cuando sea necesaria flexibilidad extrema |

---

### 📘 Descripción de Patrones

#### ✅ 1. **Custom Hooks**

**¿Qué es?**\
Encapsula lógica reutilizable en funciones `useX()` para separar responsabilidades y evitar duplicación.

**¿Cómo usarlo?**\
Ubicar los hooks en `hooks/useX/` o dentro del componente/contexto que lo usa.

```tsx
// hooks/useUser.ts
export const useUser = () => {
  const [user, setUser] = useState(null);
  // lógica...
  return { user, setUser };
};
```

---

#### ✅ 2. **Container-Presenter Pattern**

**¿Qué es?**\
Separa la lógica del componente (estado, efectos, servicios) del componente de presentación (solo props y JSX).

**¿Cómo usarlo?**

```tsx
// UserContainer.tsx
const UserContainer = () => {
  const { data } = useFetchUsers();
  return <UserList users={data} />;
};

// UserList.tsx
const UserList = ({ users }) => <ul>{users.map(u => <li>{u.name}</li>)}</ul>;
```

---

#### ✅ 3. **Compound Components**

**¿Qué es?**\
Agrupa múltiples componentes que comparten un mismo estado/contexto en una API declarativa.

**¿Cómo usarlo?**

```tsx
<Tabs>
  <Tabs.List>
    <Tabs.Trigger value="tab1" />
    <Tabs.Trigger value="tab2" />
  </Tabs.List>
  <Tabs.Content value="tab1" />
</Tabs>
```

**¿Dónde aplicarlo?**\
Ideal en `Tabs`, `Select`, `Accordion`, `Form`.

---

#### ✅ 4. **Control Props**

**¿Qué es?**\
Permite al consumidor controlar el estado del componente desde afuera (por ejemplo `isOpen`, `value`), manteniendo la opción de control interno por defecto.

**¿Cómo usarlo?**

```tsx
const Modal = ({ isOpen: controlledOpen, onClose }) => {
  const [internalOpen, setOpen] = useState(false);
  const isOpen = controlledOpen ?? internalOpen;

  return isOpen ? <div onClick={onClose}>...</div> : null;
};
```

---

#### ✅ 5. **Controlled vs Uncontrolled Components**

**¿Qué es?**

- **Controlado:** el estado lo maneja el padre vía props (`value`, `onChange`).
- **No controlado:** usa `ref` interno para leer valores.

**Ejemplo controlado:**

```tsx
<input value={name} onChange={e => setName(e.target.value)} />
```

**Ejemplo no controlado:**

```tsx
<input ref={inputRef} />
```

---

#### ⚠️ 6. **Higher-Order Components (HOC)**

**¿Qué es?**\
Función que recibe un componente y devuelve un nuevo componente con lógica añadida.

**¿Por qué evitarlo?**\
Más difícil de testear y tipar que hooks. Usa `useX()` o contextos en su lugar.

**Ejemplo típico (no recomendado hoy):**

```tsx
const withLogger = (Component) => (props) => {
  useEffect(() => console.log('Mounted'));
  return <Component {...props} />;
};
```

---

#### ⚠️ 7. **Render Props**

**¿Qué es?**\
Pasa una función `render` como prop para permitir renderizado personalizado desde el consumidor.

**¿Por qué evitarlo?**\
Genera nesting excesivo y es menos legible que `custom hooks` o `Compound Components`.

**Ejemplo:**

```tsx
<MouseTracker render={({ x, y }) => <p>Posición: {x}, {y}</p>} />
```

---

> ⚠️ Usa HOC y Render Props solo cuando no sea posible lograrlo con `custom hooks` o `context`.


---


## 🚀 Infraestructura CI/CD

Este proyecto implementa un flujo completo de **Integración y Despliegue Continuo** con GitHub Actions.

### Archivos relevantes
- `.github/workflows/ci.yml` → Validación de build, lint y pruebas en cada push/PR a `dev`.
- `.github/workflows/cd-dev.yml` → Despliegue automático al entorno **dev**.
- `.github/workflows/cd-staggin.yml` → Despliegue automático al entorno **staging**.
- `.github/workflows/cd-main.yml` → Despliegue automático al entorno **producción**.

###  Reglas de Calidad y Validación” (añade bullets)

- **ESLint**: `next lint` con reglas para TS/React/Imports.
- **Prettier**: formato consistente y orden de clases Tailwind (v4) vía `prettier-plugin-tailwindcss`.
- Scripts: `lint`, `lint:fix`, `format`.


### Flujo de ramas y despliegues
```mermaid
graph TD
A[feature/* o fix/*] -->|PR| B(dev)
B -->|CI + merge| C[Entorno dev]
C --> D(staging)
D --> E(main)


Seguir esta guía garantiza una base de código modular, coherente y fácil de escalar en el tiempo. 🎯
