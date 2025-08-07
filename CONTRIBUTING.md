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

---
