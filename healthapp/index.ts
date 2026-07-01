import express from "express";
import { calculateBMI } from "./bmiCalculator.ts";
import { calculateExercises } from "./exerciseCalculator.ts";
import { isNotNumber } from "./utils.ts";

const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;

  const heightNum = Number(height);
  const weightNum = Number(weight);

  if (
    isNotNumber(height) ||
    isNotNumber(weight) ||
    heightNum <= 0 ||
    weightNum <= 0
  ) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const bmi = calculateBMI(heightNum, weightNum);
  return res.json({ weight: weightNum, height: heightNum, bmi });
});

app.post("/exercises", (req, res) => {
  console.log(req.body);
  const { daily_exercises, target } = req.body as {
    daily_exercises: number[];
    target: number;
  };

  if (!daily_exercises || !target) {
    return res.status(400).json({ error: "parameters missing" });
  }
  if (
    isNotNumber(target) ||
    !Array.isArray(daily_exercises) ||
    daily_exercises.some(isNotNumber)
  ) {
    return res.status(400).json({ error: "malformatted parameters" });
  }
  return res.json(calculateExercises(daily_exercises, target));
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
