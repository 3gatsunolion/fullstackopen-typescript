import { v1 as uuid } from "uuid";
import patients from "../../data/patients.ts";
import type {
  NonSensitivePatient,
  NewPatient,
  Patient,
  EntryWithoutId,
  Entry,
} from "../types.ts";

const getNonSensitivePatientData = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getSinglePatientData = (id: string): Patient | undefined => {
  return patients.find((p) => p.id === id);
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    entries: [],
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (id: string, entry: EntryWithoutId): Entry | undefined => {
  const newEntry = {
    id: uuid(),
    ...entry,
  };

  const patient = getSinglePatientData(id);
  if (patient) {
    patient.entries.push(newEntry);
    return newEntry;
  }
  return;
};

export default {
  getNonSensitivePatientData,
  getSinglePatientData,
  addPatient,
  addEntry,
};
