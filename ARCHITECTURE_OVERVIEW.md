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
- **styles.ts** – estilos extra del componente.
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
7. Para la logica dentro del componente siemore usamos hook personalizados alacenados en `hooks`dentro de la carpeta del componente. 

## Convenciones de nomenclatura

Para mantener la coherencia y facilitar la navegación por el código, seguimos estas reglas:

- **Componentes**  
  - Nombre en **PascalCase**, por ejemplo `Button`, `DynamicForm`, `Alert`.  
  - Carpeta: `src/app/components/ComponentName/`.  
  - Archivo principal: `ComponentName.tsx`.  
  - Tests co-localizados: `ComponentName.test.tsx`.

- **Hooks personalizados**  
  - Nombre en **camelCase**, siempre comenzando con `use`, p. ej. `useSelect`, `useDynamicForm`.  
  - Archivo: `useHookName.ts` dentro de `components/ComponentName/hooks/`.

- **Funciones utilitarias (utilities)**  
  - Nombre descriptivo en **camelCase**, p. ej. `getInitialValues`, `cleanHiddenFields`, `resolveVariant`.  
  - Ubicación: `components/ComponentName/utilities/`.

- **Estilos**  
  - Archivo único `styles.ts` dentro de cada componente.  
  - Exportar objetos con nombres claros, p. ej. `baseStyles`, `checkboxClasses`, `dynamicFormStyles`.

- **Tipos (types)**  
  - Archivo `types.ts` en la carpeta del componente.  
  - Interfaces y tipos en **PascalCase**, p. ej. `ButtonProps`, `SelectOption`, `FieldModel`.

- **Catalogs / ejemplos manuales**  
  - Archivos `ComponentNameCatalog.tsx` para demos o pruebas manuales, en la misma carpeta del componente.

- **Tests**  
  - Co-localizados con el componente (`ComponentName.test.tsx`).  
  - Declarar la suite con el nombre del componente o la funcionalidad, p. ej.  
    ```js
    describe('Button component', () => { … })
    ```
    o
    ```js
    describe('DynamicForm – Escenarios adicionales', () => { … })
    ```

Estas convenciones ayudan a que cualquier desarrollador encuentre rápidamente dónde buscar o añadir código, manteniendo la base ordenada y predecible.  

### Control de calidad y validación de componentes

Para que un nuevo componente o funcionalidad sea aceptada en `dev`, debe cumplir con:

1. **Test unitarios con Vitest**  
   - Cada componente debe incluir un archivo `ComponentName.test.tsx`.
   - Las pruebas deben cubrir al menos la renderización y comportamiento básico.

2. **Documentación en Storybook**  
   - Cada componente debe tener un archivo `ComponentName.stories.tsx` en formato CSF3.
   - Se deben definir al menos una historia en modo claro (`LightMode`) y otra en modo oscuro (`DarkMode`), usando `data-theme`.

3. **Tipado completo con TypeScript**  
   - Las props deben estar definidas en `types.ts` con JSDoc para autodocs.
   - No se permiten props `any` o implícitas.

4. **Estilos encapsulados**  
   - Los estilos deben estar definidos en `styles.ts` como clases de Tailwind.
5. **Separación de lógica**  
   - Cada componente debe tener su hook personalizado, para tener el renderizado aparte de la logica. 
6. **Creación de contexto (En caso de ser una pagina)**  
   - Al momento de crear una nueva pagina o subpagina debemos de crear un contexto donde se manejaran estados globales que puedan ser integrados en todos los componentes de la página. 
7. **Funciones reutilizables o muy largas dentro de la carpeta utilites del componente**  
   - Cuando la lógica es muy compleja, y creemos funciones reutilizables o muy largas deberan ser creadas en la carpeta utilities, y deben ser centralizadas por medio de un hook personalizado. 


Seguir esta guía garantiza una base de código consistente y fácil de mantener.
