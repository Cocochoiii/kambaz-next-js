"use client";

// The last step of the chapter.
// Lab 3 and Lab 4 share one store.
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
