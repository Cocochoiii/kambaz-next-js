import { ListGroup } from "react-bootstrap";
import TodoItem from "./TodoItem";
import todos from "./todos.json";
export default function TodoList() {
  return (
    <div id="wd-todo-list">
      <h3>Todo List</h3>
      <ListGroup>
        {todos.map((todo, i) => (<TodoItem key={i} todo={todo as any} />))}
      </ListGroup>
      <hr />
    </div>
  );
}
