import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaBoxOpen } from 'react-icons/fa';
import api from '../../api';
import Loader from '../../components/Loader';
import { useLanguage } from '../../context/LanguageContext';

const InventoryManagement = () => {
    const { t } = useLanguage();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'medical_supply',
        total_quantity: 0,
        unit: 'units',
        location: '',
        status: 'available'
    });

    const fetchResources = async () => {
        setLoading(true);
        try {
            const response = await api.get('/resources');
            setResources(response.data);
        } catch (error) {
            console.error("Failed to fetch resources", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleOpenModal = (resource = null) => {
        if (resource) {
            setEditingResource(resource);
            setFormData({
                name: resource.name,
                type: resource.type,
                total_quantity: resource.total_quantity,
                unit: resource.unit,
                location: resource.location,
                status: resource.status
            });
        } else {
            setEditingResource(null);
            setFormData({
                name: '',
                type: 'medical_supply',
                total_quantity: 0,
                unit: 'units',
                location: '',
                status: 'available'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingResource(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingResource) {
                await api.put(`/resources/${editingResource.id}`, formData);
            } else {
                await api.post('/resources', formData);
            }
            fetchResources();
            handleCloseModal();
        } catch (error) {
            alert("Action failed: " + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this resource?")) return;
        try {
            await api.delete(`/resources/${id}`);
            fetchResources();
        } catch (error) {
            alert("Delete failed");
        }
    };

    if (loading && resources.length === 0) return <Loader />;

    return (
        <div className="p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-black text-main">Inventory Command</h2>
                    <p className="text-secondary">Manage and track mission-critical assets</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
                    <FaPlus /> Add Resource
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map(res => (
                    <div key={res.id} className="premium-card p-5 relative group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary text-xl">
                                    <FaBoxOpen />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">{res.name}</h3>
                                    <span className="text-xs uppercase tracking-widest text-secondary opacity-60 font-black">{res.type.replace('_', ' ')}</span>
                                </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenModal(res)} className="p-2 hover:bg-primary/20 text-primary rounded-lg">
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDelete(res.id)} className="p-2 hover:bg-danger/20 text-danger rounded-lg">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-secondary">Stock Level</span>
                                <span className="font-bold">{res.available_quantity} / {res.total_quantity} {res.unit}</span>
                            </div>
                            <div className="w-full bg-surface-2 rounded-full h-1.5">
                                <div
                                    className="bg-primary h-full rounded-full transition-all duration-500"
                                    style={{ width: `${(res.available_quantity / res.total_quantity) * 100}%` }}
                                ></div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-secondary">
                                <span className="opacity-50">Location:</span> {res.location}
                            </div>
                        </div>

                        <div className={`status-pill w-full text-center py-2 rounded-lg text-xs font-black uppercase tracking-widest ${res.status}`}>
                            {res.status}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={handleCloseModal}></div>
                    <div className="bg-surface border border-border rounded-3xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl animate-scale-in">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h3 className="text-xl font-bold">{editingResource ? 'Edit Resource' : 'New Resource'}</h3>
                            <button onClick={handleCloseModal} className="text-secondary hover:text-main"><FaTimes /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Resource Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Type</label>
                                    <select
                                        className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 focus:border-primary outline-none"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="medical_supply">Medical Supply</option>
                                        <option value="vehicle">Vehicle</option>
                                        <option value="personnel">Personnel</option>
                                        <option value="asset">General Asset</option>
                                        <option value="bed">Hospital Bed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Status</label>
                                    <select
                                        className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 focus:border-primary outline-none"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="available">Available</option>
                                        <option value="low-stock">Low Stock</option>
                                        <option value="out-of-stock">Out of Stock</option>
                                        <option value="maintenance">Maintenance</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 focus:border-primary outline-none"
                                        value={formData.total_quantity}
                                        onChange={e => setFormData({ ...formData, total_quantity: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Unit</label>
                                    <input
                                        type="text"
                                        className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 focus:border-primary outline-none"
                                        value={formData.unit}
                                        onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Location</label>
                                <input
                                    type="text"
                                    className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 focus:border-primary outline-none"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={handleCloseModal} className="flex-1 bg-surface-2 hover:bg-border text-main font-bold py-4 rounded-2xl transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                                    <FaSave /> {editingResource ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .premium-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 2rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .premium-card:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: var(--primary);
                    transform: translateY(-5px);
                }
                .status-pill.available { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
                .status-pill.low-stock { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
                .status-pill.out-of-stock { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
                .status-pill.maintenance { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
            `}</style>
        </div>
    );
};

export default InventoryManagement;
