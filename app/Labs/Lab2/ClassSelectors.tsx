// One class can style many elements. Here it styles a paragraph and a heading.
export default function ClassSelectors() {
  return (
    <div id="wd-css-class-selectors">
      <h3>Class selectors</h3>
      <p className="wd-class-selector">Blue text on a yellow background styled by class.</p>
      <h4 className="wd-class-selector">Blue heading on a yellow background styled by class.</h4>
    </div>
  );
}
