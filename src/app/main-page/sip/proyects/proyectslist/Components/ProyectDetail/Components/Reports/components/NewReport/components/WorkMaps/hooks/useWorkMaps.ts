import { fileToDataUrl } from "@/app/utilities/FilesHelper/FilesHelper"
import { useRef, useEffect, useCallback, useState } from "react";
import useReportBuilderStore from "@/app/stores/useReportBuilderStore/useReportBuilderStore";
import type { Activities as ActivityModel } from '@/app/mappings/reports/reports.types';
import { shallow } from 'zustand/shallow';
import { currentDate } from '@/app/utilities/DatesHelper/Dateshelper';
import type { SelectedImage } from '@/app/components/ImageUploaderExpanded/types';

const MAP_TITLE = 'Mapa de trabajo';

const useWorkMaps = () => {
    const submitTokenRef = useRef(0);
    const savedMapRef = useRef<ActivityModel | null>(null);

    const [direction, setDirection] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(true);

    const { report, isReportHydrated, updateMaps } = useReportBuilderStore(
        (state) => ({
            report: state.report,
            isReportHydrated: state.isReportHydrated,
            updateMaps: state.updateMaps,
        }),
        shallow
    );

    useEffect(() => {
        if (!isReportHydrated) return;

        const map = (report.maps ?? [])[0] ?? null;
        savedMapRef.current = map;

        if (map) {
            setDirection(map.description ?? '');
            setImagePreview(map.urlimage ?? null);
            setIsEditing(false);
        } else {
            setDirection('');
            setImagePreview(null);
            setIsEditing(true);
        }
    }, [isReportHydrated, report.maps]);

    const currentMap = savedMapRef.current;

    const handleImageSelection = useCallback(
        (file: File | SelectedImage[] | null) => {
            if (!file || (Array.isArray(file) && file.length === 0)) {
                setImagePreview(null);
                return;
            }

            if (Array.isArray(file)) {
                const first = file[0];
                if (!first) {
                    setImagePreview(null);
                    return;
                }
                if (first.file) {
                    const requestId = ++submitTokenRef.current;
                    void fileToDataUrl(first.file)
                        .then((url) => {
                            if (submitTokenRef.current !== requestId) return;
                            setImagePreview(url);
                            setIsEditing(true);
                        })
                        .catch(() => {
                            if (submitTokenRef.current !== requestId) return;
                            setImagePreview(null);
                        });
                    return;
                }
                if (first.url) {
                    setImagePreview(first.url);
                    setIsEditing(true);
                    return;
                }
                setImagePreview(null);
                return;
            }

            const requestId = ++submitTokenRef.current;
            void fileToDataUrl(file)
                .then((url) => {
                    if (submitTokenRef.current !== requestId) return;
                    setImagePreview(url);
                    setIsEditing(true);
                })
                .catch(() => {
                    if (submitTokenRef.current !== requestId) return;
                    setImagePreview(null);
                });
        },
        []
    );

    const handleCancel = useCallback(() => {
        const stored = savedMapRef.current;

        if (stored) {
            setDirection(stored.description ?? '');
            setImagePreview(stored.urlimage ?? null);
            setIsEditing(false);
            return;
        }

        setImagePreview(null);
    }, []);

    const handleSave = useCallback(() => {
        if (!imagePreview) return;

        const trimmedDirection = direction.trim();
        const map: ActivityModel = {
            title: MAP_TITLE,
            date: currentDate(),
            description: trimmedDirection,
            urlimage: imagePreview,
        };

        savedMapRef.current = map;
        updateMaps([map]);
        setDirection(trimmedDirection);
        setIsEditing(false);
    }, [direction, imagePreview, updateMaps]);

    const handleEdit = useCallback(() => {
        setIsEditing(true);
        setImagePreview(savedMapRef.current?.urlimage ?? null);
    }, []);
    return {
        submitTokenRef, handleImageSelection, handleSave, handleCancel, setDirection, handleEdit, isEditing, imagePreview, currentMap, direction, report
    }
}
export default useWorkMaps
