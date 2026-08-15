// I can style an element by where it sits in the page.
// The span inside the red div gets its own style.
export default function DocumentStructure() {
  return (
    <div id="wd-css-document-structure">
      <h3>Document structure</h3>
      <div id="wd-doc-structure">
        White text on a red div, but <small>this small span is blue on yellow</small>.
      </div>
    </div>
  );
}
