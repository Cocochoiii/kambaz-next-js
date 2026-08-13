// Float puts elements next to each other. The last empty div clears them.
export default function Float() {
  return (
    <div id="wd-css-float">
      <h2>Float</h2>
      <div>
        <div className="wd-float-left wd-dimension-portrait wd-bg-color-yellow">Yellow</div>
        <div className="wd-float-left wd-dimension-portrait wd-bg-color-blue wd-fg-color-white">Blue</div>
        <div className="wd-float-left wd-dimension-portrait wd-bg-color-red">Red</div>
        <img className="wd-float-right" src="/images/reactjs.jpg" alt="React logo" height="100px" />
        <div className="wd-float-done"></div>
      </div>
    </div>
  );
}
