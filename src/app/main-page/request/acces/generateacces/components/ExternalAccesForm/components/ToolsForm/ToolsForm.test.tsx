import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import ToolsForm from "./ToolsForm";

vi.mock("@/assets/icons/acciones/plus.svg", () => ({ default: "plus.svg" }));
vi.mock("@/assets/icons/acciones/trash.svg", () => ({ default: "trash.svg" }));

const lifecycle = { mounts: 0, unmounts: 0 };

vi.mock("@/app/components/DynamicForm/DynamicForm", () => {
    const React = require("react");

    const DynamicForm = ({ fields, onValuesChange, dataTestId }: any) => {
        const [localValues, setLocalValues] = React.useState(() =>
            Object.fromEntries(fields.map((field: any) => [field.name, field.value ?? ""]))
        );

        React.useEffect(() => {
            lifecycle.mounts += 1;
            return () => {
                lifecycle.unmounts += 1;
            };
        }, []);

        React.useEffect(() => {
            setLocalValues(Object.fromEntries(fields.map((field: any) => [field.name, field.value ?? ""])));
        }, [fields]);

        return (
            <div data-testid={dataTestId}>
                {fields.map((field: any) => (
                    <input
                        key={field.name}
                        aria-label={field.label}
                        value={localValues[field.name] ?? ""}
                        onChange={(event) => {
                            const nextValues = { ...localValues, [field.name]: event.target.value };
                            setLocalValues(nextValues);
                            onValuesChange(nextValues);
                        }}
                    />
                ))}
            </div>
        );
    };

    return { __esModule: true, default: DynamicForm };
});

vi.mock("./hooks/useToolsForm", () => {
    const React = require("react");
    const initialTool = {
        quantity: "1",
        brand: "ACME",
        description: "Inicial",
        model: "X-1",
        serialnumber: "SN-1",
        materialtype: "Ferretero",
        meditiontype: "Pieza",
    };

    return {
        __esModule: true,
        default: () => {
            const [tools, setTools] = React.useState([initialTool]);

            const getToolFields = React.useCallback(
                (tool: typeof initialTool) => [
                    {
                        type: "input",
                        name: "description",
                        label: "Descripción",
                        placeholder: "Descripción",
                        value: tool.description,
                    },
                ],
                []
            );

            const handleUpdateToolValues = React.useCallback((index: number, values: Record<string, unknown>) => {
                setTools((prevTools: typeof initialTool[]) =>
                    prevTools.map((tool, toolIndex) =>
                        toolIndex === index ? { ...tool, ...values } : tool
                    )
                );
            }, []);

            return {
                tools,
                newToolFields: [],
                responsiveLayout: [],
                isAddingTool: false,
                formVersion: 0,
                canSubmitNewTool: false,
                handleSubmitNewTool: vi.fn(),
                handleDraftValuesChange: vi.fn(),
                handleUpdateToolValues,
                handleRemoveTool: vi.fn(),
                handleOpenAddTool: vi.fn(),
                getToolFields,
                handleDownloadTemplate: vi.fn(),
                handleImportToolsFile: vi.fn(),
                isDownloadingTemplate: false,
                isProcessingImport: false,
            };
        },
    };
});

describe("ToolsForm", () => {
    beforeEach(() => {
        lifecycle.mounts = 0;
        lifecycle.unmounts = 0;
    });

    it("permite editar una herramienta sin reiniciar el formulario en cada tecla", async () => {
        const user = userEvent.setup();
        render(<ToolsForm canUpdateForm />);

        const descriptionInput = screen.getByLabelText("Descripción");

        await user.clear(descriptionInput);
        await user.type(descriptionInput, "Martillo grande");

        expect(descriptionInput).toHaveValue("Martillo grande");
        expect(lifecycle.mounts).toBe(1);
        expect(lifecycle.unmounts).toBe(0);
    });
});
