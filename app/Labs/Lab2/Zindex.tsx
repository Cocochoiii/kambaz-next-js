// Z index says which element is in front.
// The blue box has the biggest z index, so it is on top.
export default function Zindex() {
  return (
    <div id="wd-css-z-index">
      <h2>Z index</h2>
      <div className="wd-pos-relative">
        <div className="wd-pos-absolute-10-10 wd-bg-color-yellow wd-dimension-portrait">Portrait</div>
        <div className="wd-zindex-bring-to-front wd-pos-absolute-50-50 wd-dimension-landscape wd-bg-color-blue wd-fg-color-white">
          Landscape
        </div>
        <div className="wd-pos-absolute-120-20 wd-bg-color-red wd-dimension-square">Square</div>
      </div>
      <br /><br /><br /><br /><br /><br /><br />
    </div>
  );
}
