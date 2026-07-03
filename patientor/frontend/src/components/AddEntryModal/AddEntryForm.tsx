/* eslint-disable @typescript-eslint/no-unused-vars */
import { SyntheticEvent } from "react";
import {
  TextField,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Button,
  Stack,
  FormControl,
  FormLabel,
  SelectChangeEvent,
} from "@mui/material";
import {
  type BaseEntry,
  type Diagnosis,
  type EntryFormValues,
  EntryType,
  type HealthCheckRating,
  HealthCheckRating as HealthCheckRatingEnum,
} from "../../types";
import useField from "../../hooks/useField";
import { assertNever } from "../../utils/types";

type Field<T = string> = {
  type: string;
  value: T;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<T>,
  ) => void;
};

type HealthCheckFields = {
  rating: Field<HealthCheckRating>;
};

type HospitalFields = {
  dischargeDate: Field<string>;
  dischargeCriteria: Field<string>;
};

type OccupationalFields = {
  employer: Field<string>;
  startDate: Field<string>;
  endDate: Field<string>;
};

type SpecificFieldsProps =
  | {
      entryType: EntryType.HealthCheck;
      fields: HealthCheckFields;
    }
  | {
      entryType: EntryType.Hospital;
      fields: HospitalFields;
    }
  | {
      entryType: EntryType.OccupationalHealthcare;
      fields: OccupationalFields;
    };

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryFormValues) => void;
  diagnosisLookup: Diagnosis[];
}

const entryTypeLabels: Record<string, EntryType> = {
  "Health Check": EntryType.HealthCheck,
  "Occupational Healthcare": EntryType.OccupationalHealthcare,
  Hospital: EntryType.Hospital,
};

const healthCheckRatingMap = Object.entries(HealthCheckRatingEnum).reduce(
  (accum, [key, value]) => {
    // convert "LowRisk" -> "Low Risk"
    const label = key.replace(/([a-z])([A-Z])/g, "$1 $2");

    accum[`${value} — ${label}`] = value;
    return accum;
  },
  {} as Record<string, number>,
);

const HealthCheckFields = ({ fields }: { fields: HealthCheckFields }) => {
  const { rating } = fields;

  return (
    <FormControl size="small">
      <InputLabel>Health Check Rating *</InputLabel>
      <Select required label="Health Check Rating" fullWidth {...rating}>
        {Object.keys(healthCheckRatingMap).map((label) => (
          <MenuItem key={label} value={healthCheckRatingMap[label]}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const HospitalFields = ({ fields }: { fields: HospitalFields }) => {
  const { dischargeCriteria, dischargeDate } = fields;

  return (
    <FormControl size="small">
      <FormLabel sx={{ mb: 0.5 }}>Discharge:</FormLabel>
      <Stack spacing={1}>
        <TextField
          required
          size="small"
          label="Date"
          fullWidth
          {...dischargeDate}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
        <TextField
          required
          size="small"
          label="Criteria"
          fullWidth
          {...dischargeCriteria}
        />
      </Stack>
    </FormControl>
  );
};

const OccupationalHealthcareFields = ({
  fields,
}: {
  fields: OccupationalFields;
}) => {
  const { employer, startDate, endDate } = fields;

  return (
    <>
      <TextField
        required
        size="small"
        label="Employer Name"
        fullWidth
        {...employer}
      />
      <FormControl size="small">
        <FormLabel sx={{ mb: 0.5 }}>Sick Leave:</FormLabel>
        <Stack spacing={1.5}>
          <TextField
            size="small"
            label="Start Date"
            fullWidth
            {...startDate}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
          <TextField
            size="small"
            label="End Date"
            fullWidth
            {...endDate}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        </Stack>
      </FormControl>
    </>
  );
};

const SpecificEntryFields = ({ entryType, fields }: SpecificFieldsProps) => {
  switch (entryType) {
    case EntryType.HealthCheck:
      return <HealthCheckFields fields={fields} />;
    case EntryType.Hospital:
      return <HospitalFields fields={fields} />;
    case EntryType.OccupationalHealthcare:
      return <OccupationalHealthcareFields fields={fields} />;
    default:
      return assertNever(entryType);
  }
};

const AddEntryForm = ({ onCancel, onSubmit, diagnosisLookup }: Props) => {
  const { reset: resetEntryType, ...entryType } = useField<EntryType>(
    "select",
    EntryType.HealthCheck,
  );
  // base
  const { reset: resetDate, ...date } = useField("date", "");
  const { reset: resetDescription, ...description } = useField("text", "");
  const { reset: resetSpecialist, ...specialist } = useField("text", "");
  const { reset: resetCodes, ...codes } = useField<string[]>("select", []);

  // health
  const { reset: resetRating, ...rating } = useField<HealthCheckRating>(
    "select",
    HealthCheckRatingEnum.Healthy,
  );

  // hospital
  const { reset: resetDischargeDate, ...dischargeDate } = useField("date", "");
  const { reset: resetDischargeCriteria, ...dischargeCriteria } = useField(
    "text",
    "",
  );

  // occupational
  const { reset: resetEmployer, ...employer } = useField("text", "");
  const { reset: resetStartDate, ...startDate } = useField("date", "");
  const { reset: resetEndDate, ...endDate } = useField("date", "");

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    const base: Omit<BaseEntry, "id"> = {
      date: date.value,
      description: description.value,
      specialist: specialist.value,
    };

    if (codes.value.length > 0) {
      base.diagnosisCodes = codes.value;
    }

    switch (entryType.value) {
      case EntryType.HealthCheck:
        return onSubmit({
          ...base,
          type: entryType.value,
          healthCheckRating: rating.value,
        });

      case EntryType.Hospital:
        return onSubmit({
          ...base,
          type: entryType.value,
          discharge: {
            date: dischargeDate.value,
            criteria: dischargeCriteria.value,
          },
        });

      case EntryType.OccupationalHealthcare:
        const hasSickLeave =
          startDate.value?.trim().length > 0 &&
          endDate.value?.trim().length > 0;
        return onSubmit({
          ...base,
          type: entryType.value,
          employerName: employer.value,
          ...(hasSickLeave && {
            sickLeave: {
              startDate: startDate.value,
              endDate: endDate.value,
            },
          }),
        });

      default:
        return assertNever(entryType.value);
    }
  };

  const getFieldsByEntryType = (entryType: EntryType) => {
    switch (entryType) {
      case EntryType.HealthCheck:
        return {
          entryType,
          fields: {
            rating,
          },
        };

      case EntryType.Hospital:
        return {
          entryType,
          fields: {
            dischargeDate,
            dischargeCriteria,
          },
        };

      case EntryType.OccupationalHealthcare:
        return {
          entryType,
          fields: {
            employer,
            startDate,
            endDate,
          },
        };

      default:
        return assertNever(entryType);
    }
  };

  return (
    <div>
      <form onSubmit={addEntry}>
        <Stack spacing={2}>
          <FormControl size="small">
            <InputLabel>Entry type</InputLabel>
            <Select required label="Entry type" fullWidth {...entryType}>
              {Object.keys(entryTypeLabels).map((label) => (
                <MenuItem key={label} value={entryTypeLabels[label]}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            required
            size="small"
            label="Date"
            fullWidth
            {...date}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            required
            size="small"
            label="Description"
            fullWidth
            {...description}
          />
          <TextField
            required
            size="small"
            label="Specialist"
            fullWidth
            {...specialist}
          />

          <FormControl size="small">
            <InputLabel>Diagnosis codes</InputLabel>
            <Select
              multiple
              label="Diagnosis codes"
              fullWidth
              {...codes}
              value={codes.value}
              renderValue={(selected) => selected.join(", ")}
            >
              {diagnosisLookup.map((option) => (
                <MenuItem key={option.code} value={option.code}>
                  {option.code} — {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <SpecificEntryFields {...getFieldsByEntryType(entryType.value)} />

          <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
            <Grid size="auto">
              <Button
                color="secondary"
                variant="contained"
                type="button"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid size="auto">
              <Button type="submit" variant="contained">
                Add
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </form>
    </div>
  );
};

export default AddEntryForm;
