'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { shallow } from 'zustand/shallow'
import type { FieldModel } from '@/app/components/DynamicForm/types'
import type { Activities as ActivityModel } from '@/app/mappings/reports/reports.types'
import { useActivitiesStore } from '@/app/stores/useActivitiesStore/useActivitiesStore'
import useReportBuilderStore from '@/app/stores/useReportBuilderStore/useReportBuilderStore'
import { currentDate } from '@/app/utilities/DatesHelper/Dateshelper'

export type ActivityFormValues = Pick<ActivityModel, 'title' | 'date' | 'description'>
export type ActivityActionRow = { index: number; activity: ActivityModel }



const EMPTY_FORM_VALUES: ActivityFormValues = {
    title: '',
    date: currentDate(),
    description: '',
}

const buildFields = (defaults: ActivityFormValues): FieldModel[] => [
    { type: 'input', name: 'title', label: 'Titulo*', placeholder: 'Titulo', value: defaults.title, validations: [{ type: 'required' }, { type: 'maxLength', value: 40 }] },
    { type: 'date', name: 'date', label: 'Fecha*', value: defaults.date, validations: [{ type: 'required' }] },
    { type: 'textarea', name: 'description', label: 'Descripcion*', placeholder: 'Describe la actividad realizada', rows: 3, value: defaults.description, validations: [{ type: 'required' }, { type: 'maxLength', value: 120 }] },
]

const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result ?? ''))
        reader.onerror = () => reject(reader.error ?? new Error('No se pudo leer el archivo.'))
        reader.readAsDataURL(file)
    })

export const useAddActivities = () => {
    const submitRef = useRef<(() => void | Promise<void>) | null>(null)
    const readTokenRef = useRef(0)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [fieldsVersion, setFieldsVersion] = useState(0)
    const [uploaderVersion, setUploaderVersion] = useState(0)
    const [isFormValid, setIsFormValid] = useState(false)
    const [formDefaults, setFormDefaults] = useState<ActivityFormValues>(EMPTY_FORM_VALUES)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [pendingDelete, setPendingDelete] = useState<ActivityActionRow | null>(null)


    const { activities, addActivity, removeActivity, updateActivity } = useActivitiesStore(
        (s) => ({
            activities: s.activities,
            addActivity: s.addActivity,
            removeActivity: s.removeActivity,
            updateActivity: s.updateActivity,
        }),
        shallow
    )
    const autoDefaultTitle = useMemo(() => {
        const nextIndex = activities.length + 1
        return `Actividad ${nextIndex}`
    }, [activities.length]);

    useEffect(() => {
        if (editingIndex === null) {
            setFormDefaults({
                title: autoDefaultTitle,
                date: currentDate(),
                description: '',
            })
            setFieldsVersion((v) => v + 1)
        }
    }, [autoDefaultTitle, editingIndex]);

    const updateActivities = useReportBuilderStore((s) => s.updateActivities)
    const report = useReportBuilderStore((s) => s.report)

    useEffect(() => {
        updateActivities(activities)
    }, [activities, updateActivities])

    const formFields = useMemo(() => buildFields(formDefaults), [formDefaults, fieldsVersion])

    const resetForm = useCallback(() => {
        setEditingIndex(null)
        setFormDefaults({ ...EMPTY_FORM_VALUES })
        setImagePreview(null)
        setIsFormValid(false)
        setFieldsVersion((p) => p + 1)
        setUploaderVersion((p) => p + 1)
    }, [])

    const handleImage = useCallback(
        (file: File | null) => {
            if (!file) return resetForm()
            const id = ++readTokenRef.current
            void fileToDataUrl(file)
                .then((url) => id === readTokenRef.current && setImagePreview(url))
                .catch(() => id === readTokenRef.current && setImagePreview(null))
        },
        [resetForm]
    )

    const handleFormSubmit = useCallback(
        (values: Record<string, any>) => {
            if (!imagePreview) return
            const activity: ActivityModel = {
                title: String(values.title ?? ''),
                date: String(values.date ?? ''),
                description: String(values.description ?? ''),
                urlimage: imagePreview,
            }
            if (editingIndex !== null) {
                updateActivity(editingIndex, activity);
            } else {
                addActivity(activity);
            }
            resetForm()
        },
        [addActivity, editingIndex, imagePreview, resetForm, updateActivity]
    )

    const handleSaveClick = useCallback(() => {
        submitRef.current?.()
    }, [])

    const handleActivityEdit = useCallback((row: ActivityActionRow) => {
        setEditingIndex(row.index)
        setFormDefaults({
            title: row.activity.title,
            date: row.activity.date,
            description: row.activity.description,
        })
        setImagePreview(row.activity.urlimage ?? null)
        setIsFormValid(true)
        setFieldsVersion((p) => p + 1)
        setUploaderVersion((p) => p + 1)
    }, [])

    const handleActivityDelete = useCallback((row: ActivityActionRow) => {
        setPendingDelete(row)
    }, [])

    const confirmActivityDelete = useCallback(() => {
        if (!pendingDelete) return

        removeActivity(pendingDelete.index)

        if (editingIndex === pendingDelete.index) {
            resetForm()
        } else if (editingIndex !== null && pendingDelete.index < editingIndex) {
            setEditingIndex(editingIndex - 1)
        }

        setPendingDelete(null)
    }, [editingIndex, pendingDelete, removeActivity, resetForm])

    const cancelActivityDelete = useCallback(() => {
        setPendingDelete(null)
    }, [])

    const viewerItems = useMemo(
        () =>
            activities.map((activity, index) => {
                const base = {
                    title: activity.title,
                    description: activity.description,
                    image: activity.urlimage,
                }


                if (!report.clientsign?.url) {
                    return {
                        ...base,
                        actionMenuProps: {
                            row: { index, activity },
                            onEdit: handleActivityEdit,
                            onDelete: handleActivityDelete,
                        },
                    }
                }

                return base
            }),
        [activities, handleActivityEdit, handleActivityDelete, report.clientsign?.url]
    )
    return {
        // estado
        imagePreview,
        fieldsVersion,
        uploaderVersion,
        isFormValid,
        formFields,
        viewerItems,
        editingIndex,
        submitRef,
        pendingDelete,

        // helpers
        hasSelection: Boolean(imagePreview),
        resetForm,
        handleImage,
        handleFormSubmit,
        handleSaveClick,
        handleActivityEdit,
        handleActivityDelete,
        confirmActivityDelete,
        cancelActivityDelete,
        setIsFormValid
    }
}
export default useAddActivities
