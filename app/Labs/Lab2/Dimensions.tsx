
export default function DimensionsEx(){
  return (
    <div id="wd-css-dimensions">
      <h2>Dimension</h2>
      <div>
        {/* yellow is wider than tall, blue is taller than wide, red is square */}
        <div className="wd-dimension-landscape wd-bg-color-yellow">Wider than tall</div>
        <div className="wd-dimension-portrait wd-bg-color-blue wd-fg-color-white">Taller than wide</div>
        <div className="wd-dimension-square wd-bg-color-red">Square</div>
      </div>
    </div>
  );
}
