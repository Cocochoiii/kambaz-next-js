export default function AddPathParameters({ a, b }: { a: string; b: string }) {
  return (
    <div id="wd-add">
      <h4>Add Path Parameters</h4>
      {a} + {b} = {parseInt(a as string) + parseInt(b as string)}
    </div>
  );
}
