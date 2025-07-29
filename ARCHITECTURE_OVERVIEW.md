
# 📐 Architecture Overview

Este proyecto es una aplicación de **Next.js** organizada bajo el directorio `src/`. La carpeta principal `app/` contiene la estructura de rutas, estilos globales y todos los componentes y estructuras que componen la UI y lógica compartida.

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
- `*Catalog.tsx`: ejemplos manuales opcionales.

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

---

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

> Para más detalles sobre pruebas, commits y control de calidad por PR, consulta [`CONTRIBUTING.md`](./CONTRIBUTING.md).

---

## 🚀 Cómo crear un nuevo componente

1. Crea una carpeta dentro de `components/`.
2. Agrega el archivo principal `ComponentName.tsx`.
3. Define las props en `types.ts`.
4. Estilos adicionales en `styles.ts`.
5. Hook personalizado en `hooks/useComponentLogic.ts`.
6. Helpers extensos en `utilities/` si aplica.
7. Archivo de pruebas `ComponentName.test.tsx`.
8. Historias de Storybook `ComponentName.stories.tsx`.


---

Seguir esta guía garantiza una base de código modular, coherente y fácil de escalar en el tiempo. 🎯
