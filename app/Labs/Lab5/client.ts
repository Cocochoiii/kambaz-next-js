// All the axios calls of Lab 5. One function per request.
import axios from "axios";
import { HTTP_SERVER } from "@/app/env";

const ASSIGNMENT_API = `${HTTP_SERVER}/lab5/assignment`;
const TODOS_API = `${HTTP_SERVER}/lab5/todos`;

export const fetchWelcomeMessage = async () => {
  const { data } = await axios.get(`${HTTP_SERVER}/lab5/welcome`);
  return data;
};

export const fetchAssignment = async () => {
  const { data } = await axios.get(ASSIGNMENT_API);
  return data;
};

// Change the title. The new title goes in the path.
export const updateTitle = async (title: string) => {
  const { data } = await axios.get(
    `${ASSIGNMENT_API}/title/${encodeURIComponent(title)}`
  );
  return data;
};

export const fetchTodos = async () => {
  const { data } = await axios.get(TODOS_API);
  return data;
};

// Old way to delete. It is a GET.
export const removeTodo = async (todo: { id: number | string }) => {
  const { data } = await axios.get(`${TODOS_API}/${todo.id}/delete`);
  return data;
};

// Old way to create. It is also a GET.
export const createTodo = async () => {
  const { data } = await axios.get(`${TODOS_API}/create`);
  return data;
};

// The real POST. It answers with the new todo.
export const postTodo = async (todo: { title: string; completed: boolean }) => {
  const { data } = await axios.post(TODOS_API, todo);
  return data;
};

export const deleteTodo = async (todo: { id: number | string }) => {
  const { data } = await axios.delete(`${TODOS_API}/${todo.id}`);
  return data;
};

export const updateTodo = async (todo: { id: number | string }) => {
  const { data } = await axios.put(`${TODOS_API}/${todo.id}`, todo);
  return data;
};
