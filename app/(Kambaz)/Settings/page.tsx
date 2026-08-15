// The Settings screen. The book does not ask for it. Canvas has it.
// The fields only show default values. Nothing is saved.
export default function Settings() {
  return (
    <div id="wd-settings">
      <h2>Settings</h2>
      <hr />

      <h4>Profile</h4>
      <label htmlFor="wd-settings-display-name" className="form-label">Display name</label>
      <input id="wd-settings-display-name" className="form-control mb-3"
             defaultValue="Coco Choi" style={{ maxWidth: "400px" }} />

      <label htmlFor="wd-settings-email" className="form-label">Email</label>
      <input id="wd-settings-email" type="email" className="form-control mb-3"
             defaultValue="coco@example.com" style={{ maxWidth: "400px" }} />

      <h4>Notifications</h4>
      <div className="form-check">
        <input className="form-check-input" type="checkbox"
               id="wd-settings-email-alerts" defaultChecked />
        <label className="form-check-label" htmlFor="wd-settings-email-alerts">
          Email alerts
        </label>
      </div>
      <div className="form-check mb-3">
        <input className="form-check-input" type="checkbox" id="wd-settings-push-alerts" />
        <label className="form-check-label" htmlFor="wd-settings-push-alerts">
          Push alerts
        </label>
      </div>

      <button id="wd-settings-save" className="btn btn-danger">Save</button>
    </div>
  );
}
