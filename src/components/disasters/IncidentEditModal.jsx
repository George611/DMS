import { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';

const IncidentEditModal = ({ isOpen, onClose, onSave, incident }) => {
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        type: 'fire',
        severity: 'medium',
        description: ''
    });

    useEffect(() => {
        if (incident) {
            setFormData({
                title: incident.title || '',
                location: incident.location || '',
                type: incident.type || 'fire',
                severity: incident.severity || 'medium',
                description: incident.description || ''
            });
        }
    }, [incident]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass animate-scale-in">
                <div className="modal-header">
                    <h3>Edit Incident</h3>
                    <button onClick={onClose} className="close-btn"><FaTimes /></button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Type</label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="fire">Fire</option>
                                <option value="flood">Flood</option>
                                <option value="medical">Medical</option>
                                <option value="earthquake">Earthquake</option>
                            </select>
                        </div>
                        <div className="form-group half">
                            <label>Severity</label>
                            <select
                                value={formData.severity}
                                onChange={e => setFormData({ ...formData, severity: e.target.value })}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            rows="4"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">
                            <FaSave /> Save Changes
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                }
                .modal-content {
                    width: 100%;
                    max-width: 500px;
                    background: var(--bg-surface);
                    border: 1px solid var(--border);
                    border-radius: 1.5rem;
                    overflow: hidden;
                    box-shadow: var(--shadow-2xl);
                }
                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-header h3 { font-size: 1.25rem; font-weight: 700; color: var(--primary); }
                .close-btn { background: none; border: none; font-size: 1.25rem; color: var(--text-secondary); cursor: pointer; }
                
                .modal-form { padding: 1.5rem; }
                .form-group { margin-bottom: 1.25rem; }
                .form-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-muted); }
                
                .form-group input, .form-group select, .form-group textarea {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    background: var(--bg-surface-2);
                    border: 1px solid var(--border);
                    border-radius: 0.75rem;
                    color: var(--text-main);
                    font-size: 0.95rem;
                }
                
                .form-row { display: flex; gap: 1rem; }
                .form-group.half { flex: 1; }
                
                .modal-footer {
                    padding-top: 1rem;
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                }
                
                .btn-secondary {
                    padding: 0.75rem 1.5rem;
                    background: var(--bg-surface-2);
                    border: 1px solid var(--border);
                    border-radius: 0.75rem;
                    color: var(--text-main);
                    font-weight: 600;
                    cursor: pointer;
                }
                
                .btn-primary {
                    padding: 0.75rem 1.5rem;
                    background: var(--primary);
                    border: none;
                    border-radius: 0.75rem;
                    color: white;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default IncidentEditModal;
