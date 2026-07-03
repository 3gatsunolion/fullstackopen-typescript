import express, { type Request, type Response } from "express";
import patientService from "../services/patientService.ts";
import {
  type NonSensitivePatient,
  type Patient,
  type NewPatient,
  type NewEntry,
  type EntryWithoutId,
} from "../types.ts";
import {
  newPatientParser,
  newEntryParser,
  errorMiddleware,
} from "../middleware.ts";

const router = express.Router();

router.get("/", (_req, res: Response<NonSensitivePatient[]>) => {
  const data = patientService.getNonSensitivePatientData();
  res.send(data);
});

router.get("/:id", (req, res: Response<Patient | { error: string }>) => {
  const data = patientService.getSinglePatientData(req.params.id);
  if (data) {
    res.send(data);
  } else {
    res.status(404).send({ error: "patient not found" });
  }
});

router.post(
  "/",
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientService.addPatient(req.body);
    res.json(addedPatient);
  },
);

router.post(
  "/:id/entries",
  newEntryParser,
  (
    req: Request<{ id: string }, unknown, EntryWithoutId>,
    res: Response<NewEntry | { error: string }>,
  ) => {
    const addedEntry = patientService.addEntry(req.params.id, req.body);
    if (addedEntry) {
      res.json(addedEntry);
    } else {
      res.status(404).json({ error: "patient not found" });
    }
  },
);

router.use(errorMiddleware);

export default router;
