'use client';

import { useState } from "react";

export default function SettingsPage() {
    // Local demo state (purely client-side placeholders)
    const [displayName, setDisplayName] = useState("Your Name");
    const [email, setEmail] = useState("you@example.com");
    const [darkMode, setDarkMode] = useState(false);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [pushAlerts, setPushAlerts] = useState(false);

    const onSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder – wire up to real API later
        alert("Settings saved (demo)");
    };

    return (
        <div id="wd-settings" className="container-fluid">
            <h1 className="mb-4">Settings</h1>

            <form onSubmit={onSave} className="row g-4">
                {/* Profile */}
                <div className="col-12 col-xl-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Profile</h5>

                            <div className="mb-3">
                                <label htmlFor="displayName" className="form-label">Display name</label>
                                <input
                                    id="displayName"
                                    className="form-control"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary">Save</button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => {
                                        setDisplayName("Your Name");
                                        setEmail("you@example.com");
                                    }}
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="col-12 col-xl-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Appearance</h5>
                            <div className="form-check form-switch mb-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="darkMode"
                                    checked={darkMode}
                                    onChange={(e) => setDarkMode(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="darkMode">
                                    Use dark mode
                                </label>
                            </div>

                            <small className="text-muted">
                                This is a local demo toggle. Hook it to your theme provider if you want it persistent.
                            </small>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Notifications</h5>

                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <div className="form-check form-switch mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="emailAlerts"
                                            checked={emailAlerts}
                                            onChange={(e) => setEmailAlerts(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="emailAlerts">
                                            Email notifications
                                        </label>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="form-check form-switch mb-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="pushAlerts"
                                            checked={pushAlerts}
                                            onChange={(e) => setPushAlerts(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="pushAlerts">
                                            Push notifications
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}
