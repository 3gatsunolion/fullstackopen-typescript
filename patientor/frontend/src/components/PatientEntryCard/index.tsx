import { Box, Card, Typography } from "@mui/material";
import SummarizeIcon from "@mui/icons-material/Summarize";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WorkIcon from "@mui/icons-material/Work";

import {
  type Entry,
  EntryType,
  type HealthCheckEntry,
  type Diagnosis,
  type HospitalEntry,
  type OccupationalHealthcareEntry,
} from "../../types";
import HealthRatingBar from "../HealthRatingBar";
import { assertNever } from "../../utils/types";

interface EntryProps {
  entry: Entry;
  diagnosisLookup: Diagnosis[];
}

const DiagnosisList = ({ entry, diagnosisLookup }: EntryProps) => {
  if (!entry.diagnosisCodes || entry.diagnosisCodes.length === 0) return null;

  return (
    <Typography component="ul">
      {entry.diagnosisCodes.map((code) => (
        <Typography key={code} component="li">
          {code} {diagnosisLookup.find((d) => d.code === code)?.name}
        </Typography>
      ))}
    </Typography>
  );
};

const style = {
  display: "flex",
  alignItems: "center",
  gap: 1,
};

const HealthCheckEntry = ({
  entry,
  diagnosisLookup,
}: {
  entry: HealthCheckEntry;
  diagnosisLookup: Diagnosis[];
}) => {
  return (
    <Box>
      <Typography variant="body1" sx={style}>
        {entry.date} <SummarizeIcon />
      </Typography>
      <Typography variant="body1">
        <i>{entry.description}</i>
      </Typography>
      <DiagnosisList entry={entry} diagnosisLookup={diagnosisLookup} />
      <HealthRatingBar rating={entry.healthCheckRating} showText={false} />
      <Typography variant="body1">diagnose by {entry.specialist}</Typography>
    </Box>
  );
};

const HospitalEntry = ({
  entry,
  diagnosisLookup,
}: {
  entry: HospitalEntry;
  diagnosisLookup: Diagnosis[];
}) => {
  return (
    <Box>
      <Typography variant="body1" sx={style}>
        {entry.date} <LocalHospitalIcon />
      </Typography>
      <Typography variant="body1">
        <i>{entry.description}</i>
      </Typography>
      <DiagnosisList entry={entry} diagnosisLookup={diagnosisLookup} />
      <Typography variant="body1">
        Discharge ({entry.discharge.date}): {entry.discharge.criteria}
      </Typography>
      <Typography variant="body1">diagnose by {entry.specialist}</Typography>
    </Box>
  );
};

const OccupationalHealthcareEntry = ({
  entry,
  diagnosisLookup,
}: {
  entry: OccupationalHealthcareEntry;
  diagnosisLookup: Diagnosis[];
}) => {
  return (
    <Box>
      <Typography variant="body1" sx={style}>
        {entry.date} <WorkIcon /> Employer: {entry.employerName}
      </Typography>
      <Typography variant="body1">
        <i>{entry.description}</i>
      </Typography>
      <DiagnosisList entry={entry} diagnosisLookup={diagnosisLookup} />
      {entry.sickLeave && (
        <Typography variant="body1">
          Sick Leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
        </Typography>
      )}
      <Typography variant="body1">diagnose by {entry.specialist}</Typography>
    </Box>
  );
};

const EntryDetails = ({ entry, diagnosisLookup }: EntryProps) => {
  switch (entry.type) {
    case EntryType.HealthCheck:
      return (
        <HealthCheckEntry entry={entry} diagnosisLookup={diagnosisLookup} />
      );
    case EntryType.Hospital:
      return <HospitalEntry entry={entry} diagnosisLookup={diagnosisLookup} />;
    case EntryType.OccupationalHealthcare:
      return (
        <OccupationalHealthcareEntry
          entry={entry}
          diagnosisLookup={diagnosisLookup}
        />
      );
    default:
      return assertNever(entry);
  }
};

const PatientEntryCard = ({ entry, diagnosisLookup }: EntryProps) => {
  return (
    <Card sx={{ padding: 2 }}>
      <EntryDetails entry={entry} diagnosisLookup={diagnosisLookup} />
    </Card>
  );
};

export default PatientEntryCard;
