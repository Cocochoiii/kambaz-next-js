"use client";
import { useState } from 'react';
import api from '@/app/lib/api';

export default function SeedDatabase() {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const checkStatus = async () => {
        try {
            const response = await api.get('/api/seed/status');
            setStatus(response.data);
        } catch (error) {
            console.error('Status check failed:', error);
        }
    };

    const seedDatabase = async () => {
        if (!confirm('This will seed the database with initial data. Continue?')) return;

        setLoading(true);
        setMessage('');
        try {
            const response = await api.post('/api/seed/initialize', {
                seedKey: 'kambaz-seed-2024'
            });
            setMessage('Database seeded successfully!');
            setStatus(response.data.results);
            await checkStatus();
        } catch (error: any) {
            setMessage(`Error: ${error.response?.data?.error || error.message}`);
        }
        setLoading(false);
    };

    return (
        <div className="container mt-4">
            <h2>Database Management</h2>

            <div className="card mt-3">
                <div className="card-body">
                    <h5 className="card-title">Current Data Status</h5>
                    <button
                        className="btn btn-info btn-sm mb-3"
                        onClick={checkStatus}
                    >
                        Check Status
                    </button>

                    {status && (
                        <div>
                            <p>Pazza Folders: {status.folders}</p>
                            <p>Pazza Posts: {status.posts}</p>
                            <p>Quizzes: {status.quizzes}</p>
                            <p>Questions: {status.questions}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="card mt-3">
                <div className="card-body">
                    <h5 className="card-title">Seed Database</h5>
                    <p>Use this to initialize the database with seed data.</p>
                    <button
                        className="btn btn-warning"
                        onClick={seedDatabase}
                        disabled={loading}
                    >
                        {loading ? 'Seeding...' : 'Seed Database'}
                    </button>

                    {message && (
                        <div className={`alert mt-3 ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}