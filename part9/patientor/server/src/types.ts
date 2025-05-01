export interface diagnosesEntry {
    "code": string,
    "name": string,
    "latin"?: string
}

type gender = 'male' | 'female' | 'other';

export interface PatientEntry {
    "id": string,
    "name": string,
    "dateOfBirth": string,
    "ssn": string,
    "gender": gender,
    "occupation": string
}