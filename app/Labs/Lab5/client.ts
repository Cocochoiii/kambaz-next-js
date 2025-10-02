// app/Labs/Lab5/client.ts
"use client";

import axios from "axios";

// Use the public env var so browser code gets the correct base URL
const baseURL =
    process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";

// Helpful to see what the client is calling
if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.log("[Lab5] HTTP baseURL =", baseURL);
}

/**
 * IMPORTANT:
 * Keep withCredentials: false for Lab 5 so preflight stays simple.
 * (You’ll flip this to true later when wiring cookie-based auth.)
 */
export const http = axios.create({
    baseURL,
    withCredentials: false,
});

// ---- Lab 5 calls ----

// Welcome
export const fetchWelcomeMessage = async () => {
    const { data } = await http.get(`/lab5/welcome`);
    return data;
};

// Objects
export const fetchAssignment = async () => {
    const { data } = await http.get(`/lab5/assignment`);
    return data;
};
export const updateTitle = async (title: string) => {
    const { data } = await http.get(
        `/lab5/assignment/title/${encodeURIComponent(title)}`
    );
    return data;
};

// Todos
export const fetchTodos = async () => {
    const { data } = await http.get(`/lab5/todos`);
    return data;
};
export const removeTodoLegacy = async (todo: any) => {
    const { data } = await http.get(`/lab5/todos/${todo.id}/delete`);
    return data;
};
export const createNewTodoLegacy = async () => {
    const { data } = await http.get(`/lab5/todos/create`);
    return data;
};

// Proper REST versions (your server already supports them)
export const deleteTodo = async (todo: any) => {
    await http.delete(`/lab5/todos/${todo.id}`);
};
export const postNewTodo = async (todo: any) => {
    const { data } = await http.post(`/lab5/todos`, todo);
    return data;
};
export const updateTodo = async (todo: any) => {
    await http.put(`/lab5/todos/${todo.id}`, todo);
};
