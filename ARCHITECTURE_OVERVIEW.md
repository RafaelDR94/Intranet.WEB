## Visión general de la arquitectura

Este proyecto es una aplicación de Next.js organizada bajo el directorio `src/`. La carpeta `app/` contiene los segmentos de rutas, el estilo global y los componentes de UI utilizados en toda la aplicación.

---

### Componentes

Los componentes reutilizables de UI viven en `src/app/components`. Cada componente tiene su propia carpeta, por ejemplo `Button/`, `Alert/` o `DynamicForm/`. Una carpeta de componente básica suele contener:

- El archivo principal del componente React (`ComponentName.tsx`).
- Cuando corresponda, un archivo `*Catalog.tsx` para pruebas manuales o documentación.

**Importante:** en la carpeta de cada componente, los estilos deben ir en el archivo **`styles.ts`**.

Algunos componentes más complejos, como `DynamicForm`, incluyen además:

- **components/** – subcomponentes pequeños usados sólo por el componente padre.
- **hooks/** – hooks personalizados de React relacionados con ese componente (p. ej. `useDynamicForm.tsx`).
- **utilities/** – funciones auxiliares (helpers) usadas por el componente, como validadores o resolutores de campos.
- **types.ts** – tipos TypeScript compartidos entre el componente, sus hooks y sus utilidades.

El proyecto utiliza el alias de ruta `@/*` definido en `tsconfig.json` para importar archivos desde `src/`.

---

### Estilos con Tailwind CSS

Tailwind está configurado en `tailwind.config.js` e importado en `src/app/globals.css`. Los componentes se construyen con clases utilitarias en lugar de archivos CSS aislados. Los valores personalizados (colores, espaciados, tipografías, etc.) se definen en la configuración de Tailwind. Al crear un nuevo componente, usa clases de Tailwind y coloca cualquier estilo extra en su `styles.ts` dentro de la carpeta del componente.

---

### Hooks y utilidades

- Los hooks personalizados deben ir en la carpeta `hooks/` dentro del componente que los utiliza.
- Las funciones o módulos reutilizables independientes deben ir en `utilities/`.

Esto mantiene la lógica relacionada cerca de donde se usa, evitando archivos monolíticos.

---

### Cómo añadir nuevos componentes

1. Crea una carpeta en `src/app/components` con el nombre de tu componente.
2. Añade el archivo React principal (`ComponentName.tsx`).
3. Si necesitas estilos extra, crea `styles.ts` que exporte clases de Tailwind o helpers de estilo.
4. Define interfaces TypeScript reutilizables en `types.ts`.
5. Coloca los tests unitarios en `ComponentName.test.tsx` dentro de la misma carpeta.
6. Añade o actualiza un archivo `*Catalog.tsx` para ejemplos manuales, si es necesario.

Seguir esta guía garantiza una base de código consistente y fácil de mantener.
