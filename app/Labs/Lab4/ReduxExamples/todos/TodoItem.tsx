"use client";

// 4.8 One row of the list. Delete removes the todo.
// Edit copies it into the form, so I can change the title.
import { useDispatch } from "react-redux";
import { ListGroup, Button } from "react-bootstrap";
import { deleteTodo, setTodo } from "./todosReducer";

export default function TodoItem({ todo }: { todo: any }) {
  const dispatch = useDispatch();

  return (
    <ListGroup.Item className="d-flex align-items-center">
      <Button
        variant="danger"
        onClick={() => dispatch(deleteTodo(todo.id))}
        id="wd-delete-todo-click"
        className="me-2"
      >
        Delete
      </Button>
      <Button
        variant="warning"
        onClick={() => dispatch(setTodo(todo))}
        id="wd-set-todo-click"
        className="me-2"
      >
        Edit
      </Button>
      {todo.title}
    </ListGroup.Item>
  );
}
