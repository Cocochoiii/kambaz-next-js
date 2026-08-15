"use client";

// The todo list, all on one page.
// Green plus and trash can use the old GET routes.
// Blue plus, round delete and the check box use POST, DELETE and PUT.
// A 404 from the server shows up in a red box.
import { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
// FaPlusCircle is a Font Awesome 5 name. The other two are version 6.
import { FaPlusCircle } from "react-icons/fa";
import { FaTrash, FaPencil } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti";
import * as client from "./client";

export default function WorkingWithArraysAsynchronously() {
  const [todos, setTodos] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTodos = async () => {
    const fetched = await client.fetchTodos();
    setTodos(fetched);
  };

  // Old delete. It answers with the todos that are left.
  const removeTodo = async (todo: any) => {
    const updated = await client.removeTodo(todo);
    setTodos(updated);
  };

  // Old create. It answers with the whole list.
  const createTodo = async () => {
    const updated = await client.createTodo();
    setTodos(updated);
  };

  // Only the new todo comes back, so I add it myself.
  const postTodo = async () => {
    const newTodo = await client.postTodo({
      title: "New Posted Todo",
      completed: false,
    });
    setTodos([...todos, newTodo]);
  };

  // The real DELETE. A 404 goes to the red box.
  const deleteTodo = async (todo: any) => {
    try {
      await client.deleteTodo(todo);
      setTodos(todos.filter((t) => t.id !== todo.id));
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
    }
  };

  // The real PUT. Same red box.
  const updateTodo = async (todo: any) => {
    try {
      await client.updateTodo(todo);
      setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
    }
  };

  // editing is only a flag. It turns the title into a field.
  const editTodo = (todo: any) => {
    setTodos(todos.map((t) => (t.id === todo.id ? { ...t, editing: true } : t)));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div id="wd-asynchronous-arrays">
      <h3>Working with Arrays Asynchronously</h3>

      {errorMessage && (
        <div id="wd-todo-error-message" className="alert alert-danger mb-2 mt-2">
          {errorMessage}
        </div>
      )}

      <h4>
        Todos
        <FaPlusCircle
          id="wd-create-todo"
          role="button"
          aria-label="Create todo"
          onClick={createTodo}
          className="text-success float-end fs-3"
        />
        <FaPlusCircle
          id="wd-post-todo"
          role="button"
          aria-label="Post todo"
          onClick={postTodo}
          className="text-primary float-end fs-3 me-3"
        />
      </h4>

      <ListGroup>
        {todos.map((todo) => (
          <ListGroup.Item key={todo.id}>
            <FaTrash
              id="wd-remove-todo"
              role="button"
              aria-label="Remove todo"
              onClick={() => removeTodo(todo)}
              className="text-danger float-end mt-1"
            />
            <TiDelete
              id="wd-delete-todo"
              role="button"
              aria-label="Delete todo"
              onClick={() => deleteTodo(todo)}
              className="text-danger float-end me-2 fs-3"
            />
            <FaPencil
              role="button"
              aria-label="Edit todo"
              onClick={() => editTodo(todo)}
              className="text-primary float-end me-2 mt-1"
            />

            <input
              type="checkbox"
              className="form-check-input me-2 float-start"
              defaultChecked={todo.completed}
              onChange={(e) =>
                updateTodo({ ...todo, completed: e.target.checked })
              }
            />

            {!todo.editing ? (
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.title}
              </span>
            ) : (
              <input
                className="form-control w-50 d-inline-block"
                defaultValue={todo.title}
                onChange={(e) => updateTodo({ ...todo, title: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateTodo({ ...todo, editing: false });
                  }
                }}
              />
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}
