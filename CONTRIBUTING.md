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
   npm run lint     # revisar estilo de código
   npm run build    # asegurar que el proyecto compile
   npm run test     # ejecutar pruebas con Vitest
   ```

5. **Pull Request**  
   - Haz push de tu rama y abre el PR **contra** `dev`.  
   - Una vez aprobado, se fusiona en `dev`, luego se promueve a `staging` y finalmente a `main`.

## Actualización de CHANGELOG y versión

Por cada cambio relevante:

1. **Abre el Pull Request** y obtén el número asignado (p. ej. `#123`).
2. **Actualiza `CHANGELOG.md`**:
   - Añade una sección para la nueva versión.
   - Usa el formato:
     ```markdown
     ## [X.Y.Z] - YYYY-MM-DD

     ### Feature
     - Descripción de la nueva funcionalidad. (Autor) [#123](https://github.com/tu-org/tu-repo/pull/123)
     ```
3. **Actualiza la versión** en `package.json` (campo `"version"`).
4. **Commit de CHANGELOG y versión** en la misma rama antes de fusión.
5. **Fusiona** el PR; así el historial refleja el cambio de versión y el registro en el changelog.

### Ejemplo de entrada en CHANGELOG

```markdown
## [6.2.0] - 2025-07-25

### Feature
- Registrar errores en el front-end, tanto en peticiones como en componentes, para proporcionar mejor diagnóstico y soluciones. (Bruno Mendoza) [#592](https://github.com/tu-org/tu-repo/pull/592)
```
