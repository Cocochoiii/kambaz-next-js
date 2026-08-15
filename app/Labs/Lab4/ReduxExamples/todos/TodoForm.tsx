"use client";

// The form row. It has no props any more.
// It reads the todo from the store and sends the actions back.
import { useSelector, useDispatch } from "react-redux";
import { ListGroup, Button, Form } from "react-bootstrap";
import { addTodo, updateTodo, setTodo } from "./todosReducer";

export default function TodoForm() {
  const { todo } = useSelector((state: any) => state.todosReducer);
  const dispatch = useDispatch();

  return (
    <ListGroup.Item className="d-flex align-items-center">
      <Button
        onClick={() => dispatch(addTodo(todo))}
        id="wd-add-todo-click"
        className="me-2"
      >
        Add
      </Button>
      <Button
        onClick={() => dispatch(updateTodo(todo))}
        id="wd-update-todo-click"
        className="me-2"
      >
        Update
      </Button>
      <Form.Control
        value={todo.title}
        onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))}
      />
    </ListGroup.Item>
  );
}
