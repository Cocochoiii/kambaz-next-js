"use client";

// 4.8 The last step of the chapter: the todos are everywhere now.
// This list is in Lab 3, but it reads the same store as Lab 4.
import { useSelector } from "react-redux";
import { ListGroup } from "react-bootstrap";

export default function TodosFromStore() {
  const { todos } = useSelector((state: any) => state.todosReducer);

  return (
    <div id="wd-todos-from-store">
      <h4>Todo List from the Redux store</h4>
      <ListGroup>
        {todos.map((todo: any) => (
          <ListGroup.Item key={todo.id}>{todo.title}</ListGroup.Item>
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}
