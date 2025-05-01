import data from "../../data/patients";
import { PatientEntry } from "../types";

export const getEntries = () : PatientEntry[] => {
    return data;
};