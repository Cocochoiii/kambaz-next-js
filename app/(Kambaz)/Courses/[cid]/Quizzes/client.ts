// Read, update and delete one quiz. Only the quiz id is needed.
// The attempts of a quiz live here too.
import axios from "axios";
import { HTTP_SERVER } from "@/app/env";

const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;

export const findQuizById = async (quizId: string) => {
  const { data } = await axios.get(`${QUIZZES_API}/${quizId}`);
  return data;
};

export const updateQuiz = async (quiz: any) => {
  const { data } = await axios.put(`${QUIZZES_API}/${quiz._id}`, quiz);
  return data;
};

export const deleteQuiz = async (quizId: string) => {
  const { data } = await axios.delete(`${QUIZZES_API}/${quizId}`);
  return data;
};

// The attempts of the signed in student on one quiz.
// The server answers with the count, the last one and the best score.
export const findAttempts = async (quizId: string, userId: string) => {
  const { data } = await axios.get(`${QUIZZES_API}/${quizId}/attempts`, {
    params: { userId },
  });
  return data;
};

// The server grades the answers. I never send a score.
export const createAttempt = async (quizId: string, attempt: any) => {
  const { data } = await axios.post(`${QUIZZES_API}/${quizId}/attempts`, attempt);
  return data;
};
