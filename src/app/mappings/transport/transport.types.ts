export type Transport = {
    "transport_id": string,
    "brand": string,
    "model": string,
    "UnitType": string,
    "plates": string
}


export type TransportPost= {
    // ------------------------
    // Campos equivalentes (usando nombre del segundo JSON)
    // ------------------------
    brand: string,
    model: string,
    plates: string,
    year: string,
    engine_number: string,
    serial_number: string,
    insurance_policy: string,
    insurance_company: string,
    policy_issue_date: string,
    policy_expiration: string,
    payment_type: string,
    coverage: string,
    circulation_card: string,
    circulation_card_expiration: string, // antes "circulation_card_vigency"

    // ------------------------
    // Imágenes (usando nombres del segundo JSON)
    // ------------------------
    image_plates: string,               // antes "plates_image"
    image_circulation_card: string,     // antes "circulation_card_image"
    front_image: string,                // antes "frontal_image"
    back_image: string,                 // antes "rear_image"
    right_side_image: string,           // antes "right_lateral_image"
    left_side_image: string,            // antes "left_lateral_image"
    
    // ------------------------
    // Campo exclusivo del primer JSON
    // ------------------------
    insurance_policy_doc: string,

    // ------------------------
    // Campos exclusivos del segundo JSON (agregados al final)
    // ------------------------
    vehicle_color: string,
    UnitType: string,
    fuel_card: string,
    key_copy: number,
    tag_pass: string,
    economic_number: string,
    id_external_enterprise: string
}



export type TransportPut = {
    transport_id: string;
    is_external: boolean;
    // Datos base
    plates: string;
    brand: string;
    model: string;
    year: string;
    engine_number: string;
    serial_number: string;

    // Seguro
    insurance_policy: string;
    insurance_company: string;
    policy_issue_date: string;
    policy_expiration: string;              // antes: insurance_policy_vigency
    payment_type: string;
    coverage: string;

    // Tarjeta circulación
    circulation_card: string;
    circulation_card_expiration: string;    // antes: circulation_card_vigency

    // Imágenes (homologadas)
    image_plates: string;                   // antes: plates_image
    image_circulation_card: string;         // antes: circulation_card_image
    front_image: string;                    // antes: frontal_image
    right_side_image: string;               // antes: right_lateral_image
    left_side_image: string;                // antes: left_lateral_image
    back_image: string;                     // antes: rear_image

    // Documento de póliza
    insurance_policy_doc: string;

      // ------------------------
    // Campos exclusivos del segundo JSON (agregados al final)
    // ------------------------
    vehicle_color: string,
    UnitType: string,
    fuel_card: string,
    key_copy: number,
    tag_pass: string,
    economic_number: string,
    id_external_enterprise: string

};




export type CompleteTransport = {
    transport_id: string;
    is_external: boolean;
    // Datos base
    brand: string;
    model: string;
    Unit_type: string;                // corregido: antes "unit_yype"
    plates: string;
    engine_number: string;
    serial_number: string;
    year: string;
    vehicle_color: string;
    economic_number: string;

    // Seguro
    insurance_policy: string;
    insurance_company: string;
    policy_issue_date?: string;       // fecha de expedición de la póliza
    policy_expiration?: string;       // antes: insurance_policy_vigency
    payment_type: string;
    coverage: string;

    // Otros datos administrativos
    fuel_card: string;
    key_copy: number;
    tag_pass: string;

    // Circulación
    circulation_card: string;
    circulation_card_expiration?: string; // antes: circulation_card_vigency

    // Imágenes (todas opcionales)
    image_plates?: string;
    image_circulation_card?: string;
    front_image?: string;
    right_side_image?: string;
    left_side_image?: string;
    back_image?: string;

    // Documento póliza
    insurance_policy_doc?: string;
};

export type TransportStatus = {
    "status_id": string,
    "status": string,
    "description": string
}

// export type TransportPost = {
//     "brand": string,
//     "model": string,
//     "UnitType": string,
//     "plates": string,
//     // Campos complementarios desde CompleteTransport (opcionales)
//     "Unit_type"?: string,
//     "engine_number"?: string,
//     "serial_number"?: string,
//     "insurance_policy"?: string,
//     "fuel_card"?: string,
//     "key_copy"?: number,
//     "circulation_card"?: string,
//     "tag_pass"?: string,
//     "year"?: string,
//     "economic_number"?: string,
//     "insurance_policy_vigency"?: string,
//     "circulation_card_vigency"?: string,
//     "plates_image"?: string,
//     "circulation_card_image"?: string,
//     "frontal_image"?: string,
//     "right_lateral_image"?: string,
//     "left_lateral_image"?: string,
//     "rear_image"?: string,
//     "insurance_policy_doc"?: string,
// }

// export type TransportPut = {
//     "transport_id": string,
//     "brand": string,
//     "model": string,
//     "UnitType": string,
//     "plates": string,
//     // Campos complementarios desde CompleteTransport (opcionales)
//     "unit_yype"?: string,
//     "engine_number"?: string,
//     "serial_number"?: string,
//     "insurance_policy"?: string,
//     "fuel_card"?: string,
//     "key_copy"?: number,
//     "circulation_card"?: string,
//     "tag_pass"?: string,
//     "year"?: string,
//     "economic_number"?: string,
//     "insurance_policy_vigency"?: string,
//     "circulation_card_vigency"?: string,
//     "plates_image"?: string,
//     "circulation_card_image"?: string,
//     "frontal_image"?: string,
//     "right_lateral_image"?: string,
//     "left_lateral_image"?: string,
//     "rear_image"?: string,
//     "insurance_policy_doc"?: string,
// }

export type VehicleTraking = {
    "id": string,
    "idVehicleAssigment": string,
    "vehicleEntryExit": boolean,
    "fuelLevel": string,
    "mileage": string,
    "circulationcard": boolean,
    "fuelCard": boolean,
    "tagOrpas": boolean,
    "insurancePolicy": boolean,
    "platesDelYtra": boolean,
    "mechanicalOrhydraulicjack": boolean,
    "keytoRemoveStuds": boolean,
    "sparetire": boolean,
    "remarks": string,
    "date": string,
    frontImage?: string | null,
    backImage?: string | null,
    rightSideImage?: string | null,
    leftSideImage?: string | null,
    circulationCardImage?: string | null,
    signature?: string | null,
}

export type VehicleTrakingPut = {
    "id": string,
    "idVehicleAssigment": string,
    "vehicleEntryExit": boolean,
    "fuelLevel": string,
    "mileage": string,
    "circulationcard": boolean,
    "fuelCard": boolean,
    "tagOrpas": boolean,
    "insurancePolicy": boolean,
    "platesDelYtra": boolean,
    "mechanicalOrhydraulicjack": boolean,
    "keytoRemoveStuds": boolean,
    "sparetire": boolean,
    "remarks": string,
    "date": string
}

export type VehicleTrakingPost = {
    vehicle_assignment_id: string,
    vehicle_entry_exit: boolean,
    full_level: string,
    mileage: string,
    circulation_card: boolean,
    fuel_card: boolean,
    tag_orpas: boolean,
    insurance_policy: boolean,
    plates_del_ytra: boolean,
    mechanical_orhydraulic_jack: boolean,
    keyto_remove_studs: boolean,
    spare_tire: boolean,
    remarks: string,
    date: string,
    front_image: string,
    back_image: string,
    right_side_image: string,
    left_side_image: string,
    circulation_card_image: string,
    signature: string,
}

export type VehicleReassignmentView = {
    id: string,
    id_vehicle_assignment: string,
    id_previous_employee: string | null,
    previous_employee_name: string | null,
    id_new_employee: string,
    new_employee_name: string | null,
    id_status: string,
    status: string | null,
    comment: string | null,
    date_created: string
    front_image?: string | null,
    back_image?: string | null,
    right_side_image?: string | null,
    left_side_image?: string | null,
    circulation_card_image?: string | null,
    signature?: string | null,
}

export type TransportAssignament = {
    "vehicleassignments_id": string,
    "employee_id": string,
    "name": string,
    "transport": Transport,
    "status": TransportStatus,
    "departure_date": string,
    "arrival_date": string,
    "destination": string,
    "signature_leader": string | null,
    "signature_employee": string | null,
    vehicletrackinglist?: VehicleTraking[],
    vehicle_reassignment?: VehicleReassignmentView[]
}

export type TransportAssignamentPost = {
    "transport_id": string,
    "employee_id": string,
    "destination": string,
    "signature_leader": string,
    "signature_employee": string
}

export type TransportAssignamentPut = {
    "transport_id": string,
    "employee_id": string,
    "destination": string,
    "status_id": string,
    "VehicleAssignments_id": string
}
