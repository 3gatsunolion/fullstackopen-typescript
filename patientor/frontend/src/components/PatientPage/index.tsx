import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";

import {
  type Patient,
  type Diagnosis,
  Gender,
  EntryFormValues,
} from "../../types";
import PatientEntryCard from "../PatientEntryCard";
import AddEntryModal from "../AddEntryModal";

import patientService from "../../services/patients";
import diagnosisService from "../../services/diagnoses";
import axios from "axios";

const PatientPage = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnosisLookup, setDiagnosisLookup] = useState<Diagnosis[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      patientService.getById(id).then((p) => setPatient(p));
    }
  }, [id]);

  useEffect(() => {
    diagnosisService
      .getAll()
      .then((d) => setDiagnosisLookup(d))
      .catch(() => {});
  }, []);

  if (!patient) return null;

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitEntry = async (values: EntryFormValues) => {
    try {
      if (!id) return;
      const entry = await patientService.createEntry(id, values);
      const newPatient = { ...patient };
      newPatient.entries = newPatient.entries?.concat(entry);
      setPatient(newPatient);
      setModalOpen(false);
      setError("");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace(
            "Something went wrong. Error: ",
            "",
          );
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          mb: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {patient.name}
        {patient.gender === Gender.Female ? (
          <FemaleIcon />
        ) : patient.gender === Gender.Male ? (
          <MaleIcon />
        ) : null}
      </Typography>
      {patient.ssn && <Typography>ssn: {patient.ssn}</Typography>}
      <Typography>occupation: {patient.occupation}</Typography>
      {patient.dateOfBirth && (
        <Typography>date of birth: {patient.dateOfBirth}</Typography>
      )}
      <br />
      <Typography variant="h6">
        <b>entries</b>
      </Typography>
      <Stack spacing={2}>
        {patient.entries?.map((e) => (
          <PatientEntryCard
            key={e.id}
            entry={e}
            diagnosisLookup={diagnosisLookup}
          />
        ))}
        <AddEntryModal
          modalOpen={modalOpen}
          onSubmit={submitEntry}
          error={error}
          onClose={closeModal}
          diagnosisLookup={diagnosisLookup}
        />
        <div>
          <Button variant="contained" onClick={() => openModal()}>
            Add New Entry
          </Button>
        </div>
      </Stack>
    </Box>
  );
};

export default PatientPage;
