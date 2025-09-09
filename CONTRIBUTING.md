# Contributing

¡Gracias por querer contribuir! Este repositorio sigue el flujo de trabajo **GitFlow** y utiliza **Vitest** para las pruebas.

## Flujo de trabajo

1. **Ramas principales**  
   - `main`: rama de producción.  
   - `staging`: rama de preproducción para pruebas e integración.  
   - `dev`: rama de desarrollo donde se integran las características diarias.

2. **Crear una rama**  
   Deriva siempre de `dev`. Usa un nombre descriptivo, por ejemplo:  
   ```
   feature/nueva-funcionalidad
   fix/correccion-error
   ```

3. **Hacer cambios y commits**  
   - Mantén los commits enfocados y descriptivos.  
   - Sigue la convención de mensajes:
     ```
     Título breve en modo imperativo

     Why is change necessary?

     - Explicación de por qué es necesario el cambio.

     Where were the changes made?

     - Archivo1.tsx
     - Archivo2.ts
     - Carpeta/Archivo3.ts

     Does it affect other systems?
     - NA
     ```

4. **Pruebas y validaciones locales**  
   Antes de abrir el pull request, ejecuta:
   ```bash
   npm install      # instalar dependencias
   npm run build    # asegurar que el proyecto compile
   npm run test     # ejecutar pruebas con Vitest
   ```

5. **Pull Request**  
   - Haz push de tu rama y abre el PR **contra** `dev`.  
   - Una vez aprobado, se fusiona en `dev`, luego se promueve a `staging` y finalmente a `main`.


## 🧪 Control de calidad por commit

Cada nueva funcionalidad debe incluir los siguientes elementos para ser revisada y aceptada:

### ✅ Test unitario obligatorio
- Cada nuevo componente debe tener su archivo `ComponentName.test.tsx` usando **Vitest**.
- Las pruebas deben validarse con:
  ```bash
  npm run test
  ```

### ✅ Documentación con Storybook
- Agrega o actualiza el archivo `ComponentName.stories.tsx` en formato **CSF3**.
- Para no renderizables como hooks y 
- Inicia Storybook para verificar:
  ```bash
  npm run storybook
  ```

### ✅ Cobertura de modos claro/oscuro
- Todas las historias deben mostrar tanto `data-theme="light"` como `data-theme="dark"`.
- Usa decoradores o componentes de envoltura si es necesario.

### ✅ Tipado y estilo
- Usa tipos con JSDoc en `types.ts` para permitir la generación automática de documentación (`autodocs`).
- Mantén los estilos organizados en `styles.ts`.

## 🔄 Validación de mappings y tipos

Al agregar un nuevo dominio (como `users`, `projects`, `devices`, etc.), asegúrate de:

1. Crear una carpeta con el nombre del dominio en `mappings/`
2. Agregar un archivo `*.types.ts` con todos los tipos estrictos necesarios.
3. Agregar un archivo `*.mapper.ts` con funciones como `mapUserFromApi()` o similares.
4. Validar que no se utilice `any` implícito en ninguna parte del mapeo.
5. Importar siempre los tipos desde `*.types.ts`, nunca definir tipos en el archivo de mapper.
6. Evita archivos `index.ts` en esta estructura, para claridad por dominio.

## Actualización de CHANGELOG y versión

Por cada cambio relevante:

1. **Abre el Pull Request** y obtén el número asignado (p. ej. `#123`).
2. **Actualiza `CHANGELOG.md`**:
   - Añade una sección para la nueva versión.
   - Usa el formato:
     ```markdown
     ## [X.Y.Z] Feature- YYYY-MM-DD
     Feature: *Fix si es que es que fuese un Error
     - Descripción de la nueva funcionalidad. (Autor) [#123](https://github.com/tu-org/tu-repo/pull/123)
     ```
3. **Actualiza la versión** en `package.json` (campo `"version"`).
4. **Commit de CHANGELOG y versión** en la misma rama antes de fusión.
5. **Fusiona** el PR; así el historial refleja el cambio de versión y el registro en el changelog.

# Contributing - PWA

## Para modificar el Service Worker

1. Edita `src/sw.ts` con las rutas y estrategias deseadas.
2. El build lo transformará automáticamente en `public/sw.js`.

## Notificaciones Push

- El SW ya está preparado para usar Firebase Messaging en background.
- Asegúrate de tener el SDK cargado y configurado.

## Recomendaciones

- Usa `NetworkFirst` para recursos críticos (API, JS).
- Usa `StaleWhileRevalidate` para imágenes.
- Limita el tamaño de caché con `ExpirationPlugin`.

## Debug

- Usa DevTools → Application → Service Workers.
- Verifica mensajes en consola `[SW]`.


Un PR que no incluya pruebas, documentación o typings no será aprobado.

## 🚀 Cómo crear un nuevo componente

1. Crea una carpeta dentro de `components/`.
2. Agrega el archivo principal `ComponentName.tsx`.
3. Define las props en `types.ts`.
4. Estilos adicionales en `styles.ts`.
5. Hook personalizado en `hooks/useComponentLogic.ts`.
6. Helpers extensos en `utilities/` si aplica.
7. Archivo de pruebas `ComponentName.test.tsx`.
8. Historias de Storybook `ComponentName.stories.tsx`.


## 📄 Cómo agregar una nueva página al layout principal

Sigue estos pasos para integrar correctamente una nueva sección en el sistema de navegación y permisos de la Intranet:

---

### 1. Crear la carpeta de la nueva página

Ubicación:
```
src/app/main-page/<nueva-pagina>/
```

Archivos sugeridos:
- `page.tsx`: punto de entrada principal.
- `components/`: subcomponentes locales si aplica.
- `context/`: lógica de estado local (opcional).
- `styles.ts`, `types.ts`, `*.test.tsx`, `*.stories.tsx`

> Sigue la arquitectura modular descrita en `ARCHITECTURE_OVERVIEW.md`.

---

### 2. Agregar la navegación lateral

Editar:
```
src/app/main-page/components/MainLayoutClient/hooks/useMainPage.tsx
```

Agregar un objeto al arreglo `sidebarRoutes`:
```ts
{
  label: 'Nombre visible',
  path: '/main-page/nueva-pagina',
  icon: IconComponent, // opcional
  subroutes: []        // si aplica
}
```

---

### 3. Configurar tabs (si aplica)

Editar:
```
src/app/main-page/components/MainLayoutClient/utilities/getTabsFromPath.ts
```

Agregar una nueva entrada al mapeo:
```ts
'/main-page/nueva-pagina': [
  { label: 'Tab 1', path: '/main-page/nueva-pagina/tab-1' },
  { label: 'Tab 2', path: '/main-page/nueva-pagina/tab-2' }
]
```

---

### 4. Registrar permisos en Firebase

Desde la consola Firebase:

1. Ir a **Realtime Database > Permissions > Model**
2. Crear un nuevo nodo con el path `/main-page/nueva-pagina`
3. Establecer todas las propiedades `Access` y `Permissions` en `false`
4. Luego, en **Permissions > Roles > [Nombre de rol]**, activar los permisos necesarios por rol
5. Validar que `validatePermissionsbyroute` refleje los cambios


## Cómo implementar un nuevo CRUD** (para formularios y tablas) siguiendo el patrón oficial de acceso a APIs.
---
## 1 Modelos y mapeos
- Crear/actualizar `mappings/<dominio>/<dominio>.types.ts` con los modelos TypeScript.
- Crear `mappings/<dominio>/<dominio>.mapper.ts` con funciones puras (`FooMap`, `FoosMap`, etc.).
- **No** mezclar mapeo con UI ni con acciones.

## 2 Store del dominio
En `src/app/stores/<dominio>/`:

**types.ts**
```ts
// JSDoc requerido en todas las firmas
export type State = {
  items: Foo[]
  loading: boolean
  error?: string
  // flags por operación si aplica...
  creating?: boolean
}

export type Set = (p: Partial<State> | ((s: State) => Partial<State>)) => void
export type Get = () => State
```

**utilities/** (una acción por archivo)
```ts
/**
 * Carga lista de Foos desde la API.
 * @param set Zustand setter
 * @param get Zustand getter
 * @param force Ignora cache local si `true`
 */
export const fetchFoos = async (set: Set, get: Get, force = false) => {
  if (get().items.length > 0 && !force) return
  set({ loading: true, error: undefined })
  try {
    const http = requireGateway('get')
    const res = await pGet(http)('/api/foos?IsActive=true')
    const mapped = FoosMap(res.data?.data ?? [])
    set({ items: mapped, loading: false })
  } catch (err) {
    const e = normalizeApiError(err)
    set({ error: e.message, loading: false })
  }
}
```

**use<Domino>Store.ts**
```ts
export const useFooStore = createWithEqualityFn<State>()(
  devtools((set, get) => ({
    items: [],
    loading: false,
    error: undefined,
    fetchFoos: (force = false) => fetchFoos(set, get, force),
    // createFoo, updateFoo, deleteFoo, ...
    reset: () => set({ items: [], error: undefined })
  }))
)
```

## 3 UI: Formularios
- Si el formulario es dinámico, usar `useFormFieldsStore` (por `formId`) para opciones/estado de campos.
- En `onSubmit`, armar el `payload` con ayuda de los catálogos (ej. employees/proyects).
- Llamar la acción del store (`createFoo`, `updateFoo`, …).
- Spinners/alerts:
  - `showSpinner` mientras `creating|updating|removing` estén activos.
  - `showAlert` de éxito o error. **Errores** siempre provienen de `state.error` (ya normalizado).

**Fragmento típico**
```ts
const { createFoo, creating, error, resetFlags } = useFooStore(s => ({
  createFoo: s.createFoo,
  creating: s.creating,
  error: s.error,
  resetFlags: s.resetFlags,
}), shallow)

useEffect(() => {
  if (creating) showSpinner({ message: 'Guardando…' })
  else hideSpinner()
  if (error) showAlert({ type: 'error', description: error })
}, [creating, error])
```

## 4 UI: Tablas
- Prefetch con `useEffect(() => fetchFoos(), [])` o botón “Refrescar”.
- Acciones por fila (editar/eliminar) con confirmación y spinners.
- Borrar:
  - Confirmar con `showAlert`.
  - `await deleteFoo(id)`. Evaluar resultado y notificar.

## 5 Rango HTTP
- `promisifyIntranet` usa OK **200–299** por defecto.
- Si un endpoint requiere otro rango, puedes extender `promisify` en el futuro. Mantener el default simplifica la mayoría de casos.

## 6 Errores enriquecidos
- Todas las acciones deben envolver errores con `normalizeApiError(err)` y guardar en `state.error` **solo el `message`**.
- Si la API retorna detalles útiles en un 200 (ej. `rowsWithMissingData`), formatea un mensaje para la UI:
  ```ts
  const miss = res.data?.data?.rowsWithMissingData as string[] | undefined
  const extra = miss?.length ? `\nDetalles:\n- ${miss.join('\n- ')}` : ''
  set({ error: extra ? `Operación incompleta.${extra}` : undefined })
  ```

## 7 Selectores y rendimiento
- Usar **selectores finos** con `shallow` para reducir renders:
  ```ts
  const { items, loading } = useFooStore(s => ({ items: s.items, loading: s.loading }), shallow)
  ```
- Evitar hooks “orquestadores” que reexpongan todo el store.

## 8 Tests y documentación de utilities (por dominio)
- Colocar **un solo archivo de tests** para todas las utilities del dominio:
  - `src/app/stores/<dominio>/utilities/utilities.test.ts`
  - Usar Vitest. Mockear `requireGateway` para emitir respuestas/errores controlados.
  - Casos mínimos: éxito 200/201, error >=400, edge-cases.
- Colocar **un solo archivo MDX** de documentación para las utilities del dominio:
  - `src/app/stores/<dominio>/utilities/utilities.docs.mdx`
  - Incluir overview, tabla de acciones, contratos, ejemplos de UI.
- **Obligatorio**: todas las utilities deben incluir **JSDoc** detallado (descripción, params, returns y, si aplica, ejemplos).

## Pruebas y validaciones locales (ampliar)**
```md
Antes del PR:
```bash
npm install
npm run lint        # obligatorio (fallará el PR si hay errores)
npm run build
npm run test
```
## ⚙️ CI/CD Pipeline

El repositorio cuenta con pipelines de **GitHub Actions** configurados en `.github/workflows/`:

- `ci.yml` → Integración continua (ejecuta build, lint y pruebas en cada push o PR hacia `dev`).
- `cd-dev.yml` → Despliegue automático al entorno **dev** cuando se actualiza la rama `dev`.
- `cd-staggin.yml` → Despliegue automático al entorno **staging** cuando se actualiza la rama `staging`.
- `cd-main.yml` → Despliegue automático al entorno **producción** cuando se actualiza la rama `main`.

### Flujo esperado

1. Trabaja siempre desde una rama basada en `dev`.  
2. Abre un PR hacia `dev`.  
3. El pipeline de CI (`ci.yml`) validará tu código (lint, build, tests).  
4. Al aprobarse y mergearse:
   - `dev` → se despliega automáticamente en **entorno de desarrollo**.  
   - `staging` → se despliega automáticamente en **preproducción**.  
   - `main` → se despliega automáticamente en **producción**.

⚠️ Importante: No fuerces despliegues manuales a producción. Todos los cambios deben fluir por el pipeline.