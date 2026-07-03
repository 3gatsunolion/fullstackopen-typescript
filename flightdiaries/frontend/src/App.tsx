import { useEffect, useRef, useState } from "react";
import axios from "axios";
import type { DiaryEntry, NewDiaryEntry } from "./types";
import diaryService from "./services/diaryService";
import DiaryEntryForm from "./components/DiaryEntryForm";
import DiaryEntryList from "./components/DiaryEntryList";

function App() {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    diaryService
      .getAll()
      .then((initialDiaryEntries) => setDiaryEntries(initialDiaryEntries));
  }, []);

  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  const showError = (message: string, seconds: number = 5) => {
    clearTimeout(timer.current);
    setError(message);
    timer.current = setTimeout(() => {
      setError(null);
    }, seconds * 1000);
  };

  const clearError = () => {
    clearTimeout(timer.current);
    setError(null);
  };

  const diaryCreation = async (diaryEntry: NewDiaryEntry) => {
    try {
      const returnedDiaryEntry = await diaryService.create(diaryEntry);
      setDiaryEntries(diaryEntries.concat(returnedDiaryEntry));

      clearError();
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errors = error.response?.data?.error;

        if (Array.isArray(errors)) {
          const message = errors
            .map(({ path, message }) => `${path.join(".")}: ${message}`)
            .join("; ");

          showError(message);
          return false;
        }
      }
      showError("Something happened while creating diary entry. :(");
      return false;
    }
  };

  return (
    <div>
      <h2>Add new entry</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <DiaryEntryForm onSubmit={diaryCreation} />
      <DiaryEntryList entries={diaryEntries} />
    </div>
  );
}

export default App;
