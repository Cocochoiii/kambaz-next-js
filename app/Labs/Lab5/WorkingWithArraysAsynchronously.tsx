"use client";
import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { FaTrash } from "react-icons/fa6";
import * as client from "./client";

export default function WorkingWithArraysAsynchronously() {
    const [todos, setTodos] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchTodos = async () => setTodos(await client.fetchTodos());

    const removeTodoLegacy = async (todo: any) => {
        const updated = await client.removeTodoLegacy(todo);
        setTodos(updated);
    };
    const deleteTodo = async (todo: any) => {
        try {
            await client.deleteTodo(todo);
            setTodos(todos.filter((t) => t.id !== todo.id));
        } catch (e: any) {
            setErrorMessage(e?.response?.data?.message ?? "Delete failed");
        }
    };
    const createNewTodoLegacy = async () => setTodos(await client.createNewTodoLegacy());
    const postNewTodo = async () => {
        const newTodo = await client.postNewTodo({ title: "New Posted Todo", completed: false });
        setTodos([...todos, newTodo]);
    };
    const updateTodo = async (todo: any) => {
        try {
            await client.updateTodo(todo);
            setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));
        } catch (e: any) {
            setErrorMessage(e?.response?.data?.message ?? "Update failed");
        }
    };

    const editTodo = (todo: any) => setTodos(todos.map((t) => t.id === todo.id ? { ...t, editing: true } : t));

    useEffect(() => { fetchTodos(); }, []);

    return (
        <div id="wd-asynchronous-arrays">
            <h3>Working with Arrays Asynchronously</h3>
            {errorMessage && <div id="wd-todo-error-message" className="alert alert-danger mb-2 mt-2">{errorMessage}</div>}
            <h4>
                Todos
                <FaPlusCircle onClick={createNewTodoLegacy} className="text-success float-end fs-3" id="wd-create-todo" />
                <FaPlusCircle onClick={postNewTodo} className="text-primary float-end fs-3 me-3" id="wd-post-todo" />
            </h4>
            <ul className="list-group">
                {todos.map((todo) => (
                    <li className="list-group-item" key={todo.id}>
                        <FaTrash onClick={() => removeTodoLegacy(todo)} className="text-danger float-end mt-1" id="wd-remove-todo"/>
                        <TiDelete onClick={() => deleteTodo(todo)} className="text-danger float-end me-2 fs-3" id="wd-delete-todo"/>

                        <input type="checkbox" className="form-check-input me-2 float-start"
                               defaultChecked={!!todo.completed}
                               onChange={(e) => updateTodo({ ...todo, completed: e.target.checked })}/>

                        {!todo.editing ? (
                            <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>{todo.title}</span>
                        ) : (
                            <input className="form-control w-50 d-inline-block"
                                   defaultValue={todo.title}
                                   onKeyDown={(e) => { if (e.key === "Enter") updateTodo({ ...todo, editing: false }); }}
                                   onChange={(e) => updateTodo({ ...todo, title: e.target.value })}/>
                        )}
                    </li>
                ))}
            </ul>
            <hr/>
        </div>
    );
}
