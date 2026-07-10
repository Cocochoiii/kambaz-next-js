// Class selectors: the same class styles both a paragraph and a heading.
export default function ClassSelectors() {
    return (
        <div>
            <h3>Class Selectors</h3>
            <p className="wd-class-selector">Blue text on a yellow background (styled by class).</p>
            <h4 className="wd-class-selector">Blue heading on a yellow background (styled by class).</h4>
        </div>
    );
}
