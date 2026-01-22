import { useState } from 'react';
import { FaCamera, FaMapMarkerAlt, FaPaperPlane, FaExclamationTriangle } from 'react-icons/fa';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';

const ReportIncident = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState({
        title: '',
        type: 'fire',
        severity: 'high',
        location: '',
        description: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/incidents', {
                ...report,
                title: report.title || `${report.type.toUpperCase()} reported at ${report.location}`
            });
            navigate('/app/dashboard');
        } catch (error) {
            console.error("Failed to submit report", error);
            alert("Failed to submit report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="card glass p-6 animate-fade-in">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FaExclamationTriangle /> Report Incident
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-group">
                        <label>Incident Subject</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Brief title (e.g. Apartment Fire)"
                            value={report.title}
                            onChange={e => setReport({ ...report, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label>Incident Type</label>
                            <select
                                className="input"
                                value={report.type}
                                onChange={e => setReport({ ...report, type: e.target.value })}
                            >
                                <option value="flood">Flood</option>
                                <option value="fire">Fire</option>
                                <option value="earthquake">Earthquake</option>
                                <option value="accident">Road Accident</option>
                                <option value="medical">Medical Emergency</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Severity Level</label>
                            <select
                                className="input"
                                value={report.severity}
                                onChange={e => setReport({ ...report, severity: e.target.value })}
                            >
                                <option value="critical">Critical (Immediate Help)</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <div className="input-group">
                            <FaMapMarkerAlt className="input-icon" />
                            <input
                                type="text"
                                className="input pl-10"
                                placeholder="Enter address or coordinates"
                                value={report.location}
                                onChange={e => setReport({ ...report, location: e.target.value })}
                                required
                            />
                            <button type="button" className="btn btn-sm btn-outline ml-2">Use GPS</button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            className="input h-32"
                            placeholder="Describe the situation..."
                            value={report.description}
                            onChange={e => setReport({ ...report, description: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Evidence</label>
                        <div className="upload-box">
                            <FaCamera className="text-2xl mb-2 text-secondary" />
                            <p>Click to upload photos/videos</p>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full flex justify-center items-center gap-2">
                        <FaPaperPlane /> Submit Report
                    </button>
                </form>
            </div>

            <style>{`
        .input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--bg-body);
          color: var(--text-main);
        }
        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-secondary);
        }
        .pl-10 { padding-left: 2.5rem; }
        .upload-box {
          border: 2px dashed var(--border);
          border-radius: var(--radius-md);
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .upload-box:hover {
          border-color: var(--primary);
        }
        .space-y-4 > * + * { margin-top: 1rem; }
        .grid-cols-2 { display: grid; grid-template-columns: 1fr 1fr; }
        .btn-sm { padding: 0.5rem; font-size: 0.8rem; }
        .ml-2 { margin-left: 0.5rem; }
      `}</style>
        </div>
    );
};

export default ReportIncident;
