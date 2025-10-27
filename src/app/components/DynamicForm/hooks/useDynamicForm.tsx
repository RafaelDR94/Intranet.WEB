import { useCallback, useMemo } from 'react';

import { FieldModel } from '../types';
import { cleanHiddenFields } from '../utilities/cleanHiddenFields';
import { getInitialValues } from '../utilities/getInitialValues';
import { getValidationSchema } from '../utilities/getValidationSchema';
import { resolveVariant } from '../utilities/resolveVariant';

/**
 * Crea utilidades derivadas de un conjunto de campos para construir un formulario dinámico.
 *
 * @param fields Definiciones de los campos que se renderizarán.
 * @param valuesVersion Incrementa únicamente cuando se requiere reinicializar los valores del formulario.
 * @param valuesVersionActive Cuando es `true` usa `valuesVersion` para recalcular; si es `false`, recalcula con cada cambio en `fields`.
 * @returns Valores iniciales, esquema de validación, función para limpiar campos ocultos y resolvedor de variantes visuales.
 */
export const useDynamicForm = (
  fields: FieldModel[],
  valuesVersion = 0,
  valuesVersionActive = false
) => {
  // Valores iniciales obtenidos del modelo. Solo se recalculan cuando
  // se actualiza explícitamente la versión del formulario.
  const initialValues = useMemo(
    () => getInitialValues(fields),
    // si valuesVersionActive está activo, dependemos de valuesVersion;
    // si no, dependemos de fields para recalcular siempre que cambien.
    valuesVersionActive ? [valuesVersion] : [fields]
  );

  // Esquema de validación basado en Yup. Cambia ante cualquier ajuste estructural.
  const validationSchema = useMemo(() => getValidationSchema(fields), [fields]);

  // Limpieza de campos ocultos
  const cleanValues = useCallback(
    (values: Record<string, unknown>) => cleanHiddenFields(fields, values),
    [fields]
  );

  return { initialValues, validationSchema, resolveVariant, cleanValues };
};
