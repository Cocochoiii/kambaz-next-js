import MathLib, { add, subtract, multiply, divide } from "./Math";
import * as Matematica from "./Math";
export default function DestructingImports() {
  return (
    <div id="wd-destructuring-imports">
      <h2>Destructing Imports</h2>
      <table className="table table-sm">
        <thead>
          <tr><th>Math</th><th>Matematica</th><th>Functions</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Math.add(2, 3) = {MathLib.add(2, 3)}</td>
            <td>Matematica.add(2, 3) = {Matematica.add(2, 3)}</td>
            <td>add(2, 3) = {add(2, 3)}</td>
          </tr>
          <tr>
            <td>Math.subtract(5, 1) = {MathLib.subtract(5, 1)}</td>
            <td>Matematica.subtract(5, 1) = {Matematica.subtract(5, 1)}</td>
            <td>subtract(5, 1) = {subtract(5, 1)}</td>
          </tr>
          <tr>
            <td>Math.multiply(4, 6) = {MathLib.multiply(4, 6)}</td>
            <td>Matematica.multiply(4, 6) = {Matematica.multiply(4, 6)}</td>
            <td>multiply(4, 6) = {multiply(4, 6)}</td>
          </tr>
          <tr>
            <td>Math.divide(10, 2) = {MathLib.divide(10, 2)}</td>
            <td>Matematica.divide(10, 2) = {Matematica.divide(10, 2)}</td>
            <td>divide(10, 2) = {divide(10, 2)}</td>
          </tr>
        </tbody>
      </table>
      <hr />
    </div>
  );
}
