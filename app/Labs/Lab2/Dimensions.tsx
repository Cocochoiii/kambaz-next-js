// I set the width and the height of a div.
export default function Dimensions() {
  return (
    <div id="wd-css-dimensions">
      <h2>Dimensions</h2>
      <div className="wd-dimension-landscape wd-bg-color-yellow">Wider than tall</div>
      <div className="wd-dimension-portrait wd-bg-color-blue wd-fg-color-white">Taller than wide</div>
      <div className="wd-dimension-square wd-bg-color-red">Square</div>
    </div>
  );
}
