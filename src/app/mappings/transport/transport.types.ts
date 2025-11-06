export type Transport = {
    "transport_id": string,
    "brand": string,
    "model": string,
    "UnitType": string,
    "plates": string
}


export type PostExternalTransport = {
    "plates": string,
    "brand": string,
    "model": string,
    "year": string,
    "insurance_policy": string,
    "insurance_policy_vigency": string,
    "circulation_card": string,
    "circulation_card_vigency": string,
    "serial_number": string,
    "engine_number": string,
    "plates_image": string,
    "circulation_card_image": string,
    "frontal_image": string,
    "right_lateral_image": string,
    "left_lateral_image": string,
    "rear_image": string
    "insurance_policy_doc": string,
}



export type PutExternalTransport = {
    "transport_id": string,
    "plates": string,
    "brand": string,
    "model": string,
    "year": string,
    "insurance_policy": string,
    "insurance_policy_vigency": string,
    "circulation_card": string,
    "circulation_card_vigency": string,
    "serial_number": string,
    "engine_number": string,
    "plates_image": string,
    "circulation_card_image": string,
    "frontal_image": string,
    "right_lateral_image": string,
    "left_lateral_image": string,
    "rear_image": string
    "insurance_policy_doc": string,
}



export type CompleteTransport = {
    "transport_id": string,
    "brand": string,
    "model": string,
    "unit_yype": string,
    "plates": string,
    "engine_number": string,
    "serial_number": string,
    "insurance_policy": string,
    "fuel_card": string,
    "key_copy": number,
    "circulation_card": string,
    "tag_pass": string,
    "year": string,
    "economic_number": string,
    
    "insurance_policy_vigency"?: string,
    "circulation_card_vigency"?: string,
    "plates_image"?: string,
    "circulation_card_image"?: string,
    "frontal_image"?: string,
    "right_lateral_image"?: string,
    "left_lateral_image"?: string,
    "rear_image"?: string,
    "insurance_policy_doc"?: string,
}

export type TransportStatus = {
    "status_id": string,
    "status": string,
    "description": string
}

export type TransportPost = {
    "brand": string,
    "model": string,
    "UnitType": string,
    "plates": string,
    // Campos complementarios desde CompleteTransport (opcionales)
    "unit_yype"?: string,
    "engine_number"?: string,
    "serial_number"?: string,
    "insurance_policy"?: string,
    "fuel_card"?: string,
    "key_copy"?: number,
    "circulation_card"?: string,
    "tag_pass"?: string,
    "year"?: string,
    "economic_number"?: string,
    "insurance_policy_vigency"?: string,
    "circulation_card_vigency"?: string,
    "plates_image"?: string,
    "circulation_card_image"?: string,
    "frontal_image"?: string,
    "right_lateral_image"?: string,
    "left_lateral_image"?: string,
    "rear_image"?: string,
    "insurance_policy_doc"?: string,
}

export type TransportPut = {
    "transport_id": string,
    "brand": string,
    "model": string,
    "UnitType": string,
    "plates": string,
    // Campos complementarios desde CompleteTransport (opcionales)
    "unit_yype"?: string,
    "engine_number"?: string,
    "serial_number"?: string,
    "insurance_policy"?: string,
    "fuel_card"?: string,
    "key_copy"?: number,
    "circulation_card"?: string,
    "tag_pass"?: string,
    "year"?: string,
    "economic_number"?: string,
    "insurance_policy_vigency"?: string,
    "circulation_card_vigency"?: string,
    "plates_image"?: string,
    "circulation_card_image"?: string,
    "frontal_image"?: string,
    "right_lateral_image"?: string,
    "left_lateral_image"?: string,
    "rear_image"?: string,
    "insurance_policy_doc"?: string,
}

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
    "date": string
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
    "signature_employee": string | null
    vehicletrackinglist?: VehicleTraking[]
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
