interface ExerciseResults {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: 1 | 2 | 3;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  dailyHours: number[],
  target: number,
): ExerciseResults => {
  if (dailyHours.length === 0) {
    throw new Error("No days given.");
  }

  const average =
    dailyHours.reduce((accum, h) => h + accum, 0) / dailyHours.length;

  let rating: 1 | 2 | 3;
  let ratingDescription;

  if (average >= target) {
    rating = 3;
    ratingDescription = "good work! keep it up!";
  } else if (average >= target * 0.5) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else {
    rating = 1;
    ratingDescription = "...maybe try just a little bit more";
  }

  return {
    periodLength: dailyHours.length,
    trainingDays: dailyHours.filter((h) => h > 0).length,
    success: average >= target,
    rating,
    ratingDescription,
    target,
    average,
  };
};

interface ExerciseValues {
  target: number;
  dailyHours: number[];
}

const parseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error("Not enough arguments");

  const target = Number(args[2]);
  const dailyHours = args.slice(3).map(Number);
  if (isNaN(target) || dailyHours.some(isNaN)) {
    throw new Error("Provided values were not numbers!");
  }

  return {
    target,
    dailyHours,
  };
};

if (process.argv[1] === import.meta.filename) {
  try {
    const { target, dailyHours } = parseArguments(process.argv);
    console.log(calculateExercises(dailyHours, target));
  } catch (error: unknown) {
    let errorMessage = "Something bad happened.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
  }
}
