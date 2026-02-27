'use client';

import React, { useEffect, useMemo, useRef } from 'react';

import { useTutorials } from '@/tutorials/engine/TutorialProvider';

export type TutorialCenterModalProps = {
  open: boolean;
  onClose: () => void;
  moduleId?: string;
};

const statusBadgeStyles: Record<string, string> = {
  Nuevo: 'bg-blue-20 text-blue-80',
  Visto: 'bg-gray-20 text-gray-80',
  Actualizado: 'bg-alert-yellow-10 text-alert-yellow-100',
};

export const TutorialCenterModal: React.FC<TutorialCenterModalProps> = ({
  open,
  onClose,
  moduleId,
}) => {
  const { listTutorials, getTutorialStatus, startTutorial } = useTutorials();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstActionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      firstActionRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  const tutorials = useMemo(() => {
    const base = listTutorials(moduleId);
    if (!moduleId || moduleId === 'main-page') return base;
    const main = listTutorials('main-page');
    const map = new Map(base.map((item) => [item.id, item]));
    main.forEach((item) => map.set(item.id, item));
    return Array.from(map.values());
  }, [listTutorials, moduleId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-center-title"
        aria-describedby="tutorial-center-description"
        className="relative z-[91] w-full max-w-xl rounded-lg bg-white-100 text-gray-90 shadow-300"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-20 px-6 py-4">
          <div>
            <h2 id="tutorial-center-title" className="text-s1 font-semibold">
              Centro de tutoriales
            </h2>
            <p id="tutorial-center-description" className="text-b3 text-gray-60">
              Reproduce los tutoriales disponibles cuando lo necesites.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-full hover:bg-gray-10 focus:outline-none focus:ring-2 focus:ring-blue-40"
            aria-label="Cerrar"
          >
            <span aria-hidden className="text-lg">
              ×
            </span>
          </button>
        </div>

        <div className="px-6 py-4">
          {tutorials.length === 0 ? (
            <p className="text-b3 text-gray-60">No hay tutoriales disponibles.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {tutorials.map((tutorial, index) => {
                const status = getTutorialStatus(tutorial.id);
                const badgeLabel = status?.isUpdated
                  ? 'Actualizado'
                  : status?.status === 'notSeen'
                    ? 'Nuevo'
                    : 'Visto';
                const badgeClass = statusBadgeStyles[badgeLabel] ?? statusBadgeStyles.Visto;

                return (
                  <div
                    key={tutorial.id}
                    className="flex flex-col gap-3 rounded-lg border border-gray-20 bg-white-100 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-b2 font-semibold text-gray-90">{tutorial.title}</h3>
                        {tutorial.description ? (
                          <p className="text-b4 text-gray-60">{tutorial.description}</p>
                        ) : null}
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-c2 font-semibold ${badgeClass}`}
                      >
                        {badgeLabel}
                      </span>
                    </div>
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        ref={index === 0 ? firstActionRef : undefined}
                        onClick={() => {
                          onClose();
                          void startTutorial(tutorial.id);
                        }}
                        className="h-9 rounded-md bg-blue-80 px-4 text-b3 font-semibold text-white-100 hover:bg-blue-70 focus:outline-none focus:ring-2 focus:ring-blue-40"
                      >
                        Reproducir
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialCenterModal;
