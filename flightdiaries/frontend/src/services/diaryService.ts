import axios from "axios";
import type { DiaryEntry, NewDiaryEntry } from "../types";

const baseUrl = "/api/diaries";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newDiaryEntry: NewDiaryEntry) => {
  return axios
    .post<DiaryEntry>(baseUrl, newDiaryEntry)
    .then((response) => response.data);
};

export default { getAll, create };
