// Document structure: styling based on position in the document tree.
// The small span inside the red div is styled separately (blue on yellow).
export default function DocumentStructure() {
    return (
        <div>
            <h3>Document Structure</h3>
            <div id="wd-doc-structure">
                White text on a red div, but <small>this small span is blue on yellow</small>.
            </div>
        </div>
    );
}
