import useField from "../hooks/useField";
import RadioButtonGroup from "./RadioButtonGroup";
import type { NewDiaryEntry } from "../types";

const visibilityOptions = ["great", "good", "ok", "poor"];
const weatherOptions = ["sunny", "rainy", "cloudy", "stormy", "windy"];

const DiaryEntryForm = ({
  onSubmit,
}: {
  onSubmit: (diaryEntry: NewDiaryEntry) => Promise<boolean>;
}) => {
  const { reset: resetDate, ...date } = useField("date");
  const { reset: resetVisibility, ...visibility } = useField("radio");
  const { reset: resetWeather, ...weather } = useField("radio");
  const { reset: resetComment, ...comment } = useField("text");

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const newDiaryEntry = {
      date: date.value,
      visibility: visibility.value,
      weather: weather.value,
      comment: comment.value,
    };

    const success = await onSubmit(newDiaryEntry);
    if (success) {
      resetDate();
      resetVisibility();
      resetWeather();
      resetComment();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          date
          <input {...date} />
        </label>
      </div>
      <div>
        <RadioButtonGroup
          name="visibility"
          options={visibilityOptions}
          input={visibility}
        />
      </div>
      <div>
        <RadioButtonGroup
          name="weather"
          options={weatherOptions}
          input={weather}
        />
      </div>
      <div>
        <label>
          comment
          <input {...comment} />
        </label>
      </div>
      <button type="submit">add</button>
    </form>
  );
};

export default DiaryEntryForm;
