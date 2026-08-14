// I pass a and b as attributes and this component adds them.
export default function Add({ a, b }: { a: number; b: number }) {
  return (
    <div id="wd-add">
      <h4>Add</h4>a = {a} &nbsp; b = {b} <br />
      a + b = {a + b} <hr />
    </div>
  );
}
