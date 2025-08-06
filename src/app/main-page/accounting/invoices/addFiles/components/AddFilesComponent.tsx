'use client';
import { Input } from '@/app/components/Input/Input';
import { Select } from '@/app/components/Select/Select';
import { FileUploader } from '@/app/components/FileUploader/FileUploader';
import { Button } from '@/app/components/Button/Button';
import { useState } from 'react';

const AddFilesComponent = () => {
    const [debtorName, setDebtorName] = useState('');
    const [project, setProject] = useState('');
    const [viaticType, setViaticType] = useState('');
    const [xmlFile, setXmlFile] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    const isFormComplete =
        debtorName && project && viaticType && xmlFile && pdfFile;

    return (
        <div className="flex flex-col gap-4">
            {/* Título + botón fuera del contenedor */}
            <div className="flex justify-between items-center">
                <h2 className="text-blue-60 text-b4 font-medium">
                    Sube aquí tus archivos XML y PDF
                </h2>
                <Button disabled={!isFormComplete} hideIcon={true} >Subir Archivos</Button>
            </div>

            {/* Contenedor de tarjeta */}
            <div className="bg-white-100 p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    {/* Columna izquierda */}
                    <div className="flex flex-col gap-y-4">
                        <Input
                            label="Nombre del Deudor"
                            value={debtorName}
                            onChange={(e) => setDebtorName(e.target.value)}
                            className="max-w-[400px]"
                        />

                        <Select
                            label="Seleccionar Proyecto"
                            placeholder="Proyecto"
                            selected={project ? [project] : []}
                            onChange={(values) => setProject(values[0] ?? '')}
                            options={[
                                { label: 'Proyecto A', value: 'proyectoA' },
                                { label: 'Proyecto B', value: 'proyectoB' },
                            ]}
                            helperText="Texto informativo"
                            className="max-w-[400px]"
                        />

                        <div>
                            <p className="font-medium text-b2 text-gray-70">Seleccionar archivos</p>
                            <p className="font-medium text-b2 text-gray-70 mt-4 mb-3">Documento XML:</p>
                            <FileUploader
                                accept=".xml"
                                buttonLabel="Seleccionar documento"
                                onFile={(file) => setXmlFile(file)}
                                className="max-w-[400px]"
                            />
                        </div>
                    </div>

                    {/* Columna derecha */}
                    <div className="flex flex-col gap-y-1.5 justify-start">
                        {/* Espaciador para alinear con "Nombre del Deudor" */}
                        <div className="h-[72px]" aria-hidden />

                        <Select
                            label="Tipo de Viáticos"
                            placeholder="Proyecto"
                            selected={viaticType ? [viaticType] : []}
                            onChange={(values) => setViaticType(values[0] ?? '')}
                            options={[
                                { label: 'Proyecto', value: 'proyecto' },
                                { label: 'Comisión', value: 'comision' },
                            ]}
                            helperText="Texto informativo"
                            className="max-w-[400px]"
                        />

                        <div className="mt-10">
                            <p className="font-medium text-b2 text-gray-70 mb-3">Documento PDF:</p>
                            <FileUploader
                                accept=".pdf"
                                buttonLabel="Seleccionar documento"
                                onFile={(file) => {console.log(file);setPdfFile(file)}}
                                className="max-w-[400px]"
                                initialFile={{name:"CV",url:"https://firebasestorage.googleapis.com/v0/b/intranetdr-50f9e.appspot.com/o/HumanResources%2FTalents%2FBruno%20Mendoza%2FCV?alt=media&token=5010be61-ad34-409e-ae3a-12b82f32085e"}}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AddFilesComponent;
