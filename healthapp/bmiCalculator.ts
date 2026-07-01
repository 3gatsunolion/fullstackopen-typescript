import { isNotNumber } from "./utils.ts";

export const calculateBMI = (height: number, weight: number): string => {
  if (weight <= 0 || height <= 0) {
    throw new Error("Weight and height must be greater than 0.");
  }

  const bmi: number = (10000 * weight) / (height * height);
  switch (true) {
    case bmi < 16:
      return "Underweight (Severe thinness)";
    case bmi < 17:
      return "Underweight (Moderate thinness)";
    case bmi < 18.5:
      return "Underweight (Mild thinness)";
    case bmi < 25:
      return "Normal range";
    case bmi < 30:
      return "Overweight (Pre-obese)";
    case bmi < 35:
      return "Obese (Class I)";
    case bmi < 40:
      return "Obese (Class II)";
    default:
      return "Obese (Class III)";
  }
};

interface BMIValues {
  height: number;
  weight: number;
}

const parseArguments = (args: string[]): BMIValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNotNumber(args[2]) && !isNotNumber(args[3])) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

if (process.argv[1] === import.meta.filename) {
  // do not run this code if module is imported
  try {
    const { height, weight } = parseArguments(process.argv);
    console.log(
      `Result of calculating BMI of height ${height} cm and weight ${weight} kg:\n${calculateBMI(height, weight)}`,
    );
  } catch (error: unknown) {
    let errorMessage = "Something bad happened.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
  }
}
