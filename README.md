# DR Security Intranet

Este repositorio contiene el código front-end de **DR Security Intranet**, una aplicación web construida con [Next.js](https://nextjs.org/) y [Tailwind CSS](https://tailwindcss.com/). Está escrita en TypeScript y provee un conjunto de componentes de UI reutilizables, incluyendo un poderoso sistema de formularios dinámicos.

---

## 📋 Requisitos previos

- **Node.js** v20 o superior
- Un gestor de paquetes: **npm**, **yarn** o **pnpm**

---

## 🚀 Instalación

Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/tu-org/tu-repo.git
cd tu-repo
npm install
```

---

## 🛠️ Desarrollo

Arranca el servidor en modo desarrollo:

```bash
npm run dev
```

Abre tu navegador en [http://localhost:3000](http://localhost:3000) para ver la aplicación.  
Los cambios en los archivos se recargarán automáticamente.

---

## 📦 Build y Producción

Genera una versión optimizada para producción:

```bash
npm run build
```

Inicia el servidor de producción:

```bash
npm start
```

---

## ✨ Despliegue

Pendiente

---


## 📘 Storybook – Catálogo de componentes

Este proyecto incluye [Storybook](https://storybook.js.org/) como herramienta de documentación interactiva.

### Ejecutar Storybook localmente

```bash
npm run storybook
```

Luego abre [http://localhost:6006](http://localhost:6006)

### Agregar historias nuevas

Crea un archivo `ComponentName.stories.tsx` en formato **CSF3** junto al componente. Asegúrate de incluir variantes con `data-theme="light"` y `"dark"` si el componente depende del color.

Los archivos `.stories.tsx` se documentan automáticamente si las props tienen comentarios JSDoc.

---

## 🧪 Pruebas unitarias con Vitest

El proyecto usa [Vitest](https://vitest.dev/) para pruebas unitarias:

### Ejecutar pruebas

```bash
npm run test
```

### Escribir pruebas

Crea un archivo `ComponentName.test.tsx` junto al componente. Usa `describe`, `it`, y `expect` de Vitest y Testing Library para verificar:

- Renderizado correcto
- Props y comportamiento
- Accesibilidad (cuando aplique)

Las pruebas deben mantenerse en la misma carpeta del componente para facilitar el mantenimiento.

## 📁 Estructura del proyecto

    src/
    └── app/
        ├── globals.css      # Estilos globales y Tailwind importado
        ├── components/
        │   ├── Button/
        │   │   ├── Button.tsx
        │   │   ├── styles.ts          # Clases de Tailwind para este componente
        │   │   ├── types.ts
        │   │   ├── Button.test.tsx
        │   │   └── ButtonCatalog.tsx
        │   └── DynamicForm/
        │       ├── DynamicForm.tsx
        │       ├── styles.ts
        │       ├── types.ts
        │       ├── DynamicForm.test.tsx
        │       ├── components/         # Subcomponentes (p. ej. FieldRenderer)
        │       ├── hooks/              # useDynamicForm, etc.
        │       └── utilities/          # helpers de validación, initialValues, variantes
        └── page.tsx

- **Alias `@/*`** configurado en `tsconfig.json` para importar desde `src/`.
- Todos los componentes usan **PascalCase** y exportan el componente por defecto.
- Los estilos específicos van en el archivo `styles.ts` de cada componente, con clases de Tailwind.

---
## 🧠 Arquitectura de mapeo de datos

Toda transformación de datos que proviene del backend debe hacerse dentro de la carpeta `mappings/`.

La estructura es por dominio:

```
mappings/
├── users/
│   ├── user.types.ts     # Tipos TypeScript (UserType, etc.)
│   └── user.mapper.ts    # Funciones de mapeo desde el backend
├── employees/
│   ├── employee.types.ts
│   └── employee.mapper.ts
...
```

- No se usan archivos `index.ts` en esta arquitectura.
- Cada carpeta agrupa el tipo y la lógica de transformación para facilitar la escalabilidad y separación de responsabilidades.
- No debe haber `any` en los tipos exportados.
- Todo acceso de datos que viene del backend debe pasar por su `*.mapper.ts`.

**Ejemplo:**

```ts
// employees/employee.mapper.ts

export const mapEmployee = (data: any): EmployeeType => ({
  employee_id: data.id,
  fullname: `${data.firstname} ${data.lastname}`,
  ...
});
```

## 🔄 Flujo de trabajo (GitFlow)

Este proyecto adopta GitFlow:

1. **Ramas principales**

   - `main` → producción
   - `staging` → preproducción
   - `dev` → desarrollo continuo

2. **Crear ramas de trabajo**  
   Siempre parte de `dev`. Usa prefijos:

   - `feature/nueva-funcionalidad`
   - `fix/correccion-error`

3. **Commits**  
   Mensajes claros y enfocados. Sigue la plantilla:

   ```
   Título breve en imperativo

   Why is change necessary?
   - Explicación.

   Where were the changes made?
   - Archivo1.tsx
   - Carpeta/Archivo2.ts

   Does it affect other systems?
   - NA
   ```

4. **Antes del Pull Request**

   ```bash
   npm install
   npm run lint
   npm run build
   npm run test
   ```

5. **Pull Request**
   - Base: `dev`
   - Tras aprobación, se fusiona en `dev`, luego se promueve a `staging` y finalmente a `main`.

---

## 📝 CHANGELOG y versiones

Cada vez que prepares un release:

1. Abre el PR y anota su número (p. ej. `#123`).
2. Edita `CHANGELOG.md`:

   ```markdown
   ## [X.Y.Z] - YYYY-MM-DD

   ### Feature

   - Descripción de la característica. (Autor) [#123](https://github.com/tu-org/tu-repo/pull/123)
   ```

3. Actualiza la propiedad `version` en `package.json`.
4. Haz commit de ambos cambios en la misma rama.

---

## 🤝 Contribuir

Para más detalles sobre cómo contribuir, revisa **CONTRIBUTING.md**.

---

¡Gracias por tu aporte! 😊
