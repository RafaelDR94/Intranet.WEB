"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import Avatar from "@/app/components/Avatar/Avatar";
import { Button } from "@/app/components/Button/Button";
import { Input } from "@/app/components/Input/Input";

import SearchIcon from "@/assets/icons/organization/search.svg";

type CollaboratorOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type CollaboratorRow = {
  id: string;
  fullname: string;
  workPosition: string;
  phone: string;
  email: string;
  avatarSrc: string;
  avatarInitials: string;
};

type CollaboratorsSectionProps = {
  pendingCollaboratorId: string;
  collaboratorOptions: CollaboratorOption[];
  collaboratorRows: CollaboratorRow[];
  setPendingCollaboratorId: (id: string) => void;
  addCollaborator: () => void;
  removeCollaborator: (id: string) => void;
};

const tableHeaders = [
  { key: "fullname", label: "Nombre" },
  { key: "workPosition", label: "Puesto" },
  { key: "phone", label: "Telefono" },
  { key: "email", label: "Correo" },
] as const;

const CollaboratorsSection = ({
  pendingCollaboratorId,
  collaboratorOptions,
  collaboratorRows,
  setPendingCollaboratorId,
  addCollaborator,
  removeCollaborator,
}: CollaboratorsSectionProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openResults, setOpenResults] = useState(false);

  const selectedOption = useMemo(
    () => collaboratorOptions.find((option) => option.value === pendingCollaboratorId),
    [collaboratorOptions, pendingCollaboratorId]
  );

  const filteredOptions = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) return collaboratorOptions;

    return collaboratorOptions.filter((option) =>
      option.label.toLowerCase().includes(normalizedTerm)
    );
  }, [collaboratorOptions, searchTerm]);

  useEffect(() => {
    if (!pendingCollaboratorId) {
      setSearchTerm("");
      return;
    }

    if (selectedOption) {
      setSearchTerm(selectedOption.label);
    }
  }, [pendingCollaboratorId, selectedOption]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpenResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectCollaborator = (option: CollaboratorOption) => {
    setPendingCollaboratorId(option.value);
    setSearchTerm(option.label);
    setOpenResults(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setOpenResults(true);

    if (selectedOption && value !== selectedOption.label) {
      setPendingCollaboratorId("");
    }
  };

  return (
    <div className="w-full">
      <div className="text-b4 text-blue-60">Colaboradores</div>
      <div className="mt-2 text-b3 text-gray-70">Agregar colaboradores</div>

      <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-start">
        <div ref={containerRef} className="relative w-full md:max-w-[350px]">
          <Input
            label=""
            placeholder="Buscar colaborador"
            value={searchTerm}
            onFocus={() => setOpenResults(true)}
            onChange={(event) => handleSearchChange(event.target.value)}
            icon={SearchIcon}
            dataTestId="collaborator-search-input"
            className="min-h-12 rounded-2xl border-gray-60 pr-10 text-b3 placeholder:text-gray-60"
            containerClassName="gap-0"
          />

          {openResults && (
            <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-gray-30 bg-white-100 py-2 shadow-lg">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleSelectCollaborator(option);
                    }}
                    className="flex w-full items-center px-4 py-3 text-left text-b3 text-gray-80 transition-colors hover:bg-gray-10"
                  >
                    {option.label}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-b3 text-gray-60">Sin resultados</div>
              )}
            </div>
          )}
        </div>

        <Button
          hideIcon
          onClick={addCollaborator}
          disabled={!pendingCollaboratorId}
          className="min-h-10 rounded-xl px-6 text-b3 md:mt-[6px] md:min-w-[200px]"
        >
          Agregar colaborador
        </Button>
      </div>

      {collaboratorRows.length > 0 && (
        <div className="mt-10">
          <div className="hidden grid-cols-[minmax(180px,1.5fr)_minmax(160px,1.2fr)_minmax(120px,0.9fr)_minmax(220px,1.6fr)_minmax(170px,auto)] gap-4 px-4 pb-4 text-c1 uppercase tracking-[0.08em] text-blue-80 md:grid">
            {tableHeaders.map((header) => (
              <div key={header.key}>{header.label}</div>
            ))}
            <div />
          </div>

          <div className="border-t border-blue-30">
            {collaboratorRows.map((collaborator) => (
              <div
                key={collaborator.id}
                className="border-b border-gray-20 py-4 last:border-b-0"
              >
                <div className="hidden grid-cols-[minmax(180px,1.5fr)_minmax(160px,1.2fr)_minmax(120px,0.9fr)_minmax(220px,1.6fr)_minmax(170px,auto)] items-center gap-4 px-4 md:grid">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={collaborator.avatarSrc || undefined}
                      initials={collaborator.avatarInitials}
                      alt={collaborator.fullname}
                      size="xs"
                    />
                    <span className="text-b3 text-gray-80">{collaborator.fullname}</span>
                  </div>
                  <div className="text-b3 text-gray-70">{collaborator.workPosition}</div>
                  <div className="text-b3 text-gray-70">{collaborator.phone}</div>
                  <div className="truncate text-b3 text-gray-70">{collaborator.email}</div>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      hideIcon
                      onClick={() => removeCollaborator(collaborator.id)}
                      className="min-h-8 rounded-xl px-3 text-c2 text-green-80 hover:bg-green-10"
                    >
                      Quitar colaborador
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl bg-gray-10 p-4 md:hidden">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={collaborator.avatarSrc || undefined}
                      initials={collaborator.avatarInitials}
                      alt={collaborator.fullname}
                      size="xs"
                    />
                    <div>
                      <div className="text-b3 text-gray-80">{collaborator.fullname}</div>
                      <div className="text-c2 text-gray-60">{collaborator.workPosition}</div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <div className="text-c1 uppercase tracking-[0.08em] text-blue-80">
                        Telefono
                      </div>
                      <div className="mt-1 text-b3 text-gray-70">{collaborator.phone}</div>
                    </div>
                    <div>
                      <div className="text-c1 uppercase tracking-[0.08em] text-blue-80">Correo</div>
                      <div className="mt-1 break-words text-b3 text-gray-70">
                        {collaborator.email}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    hideIcon
                    onClick={() => removeCollaborator(collaborator.id)}
                    className="mt-4 min-h-8 rounded-xl px-0 text-c2 text-green-80 hover:bg-transparent"
                  >
                    Quitar colaborador
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaboratorsSection;
