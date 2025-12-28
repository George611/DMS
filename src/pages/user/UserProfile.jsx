import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/common/StatsCard';
import { FaUser, FaHistory, FaKey, FaCamera, FaEdit, FaShieldAlt, FaSave } from 'react-icons/fa';

const UserProfile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('activity'); // 'activity', 'edit', 'password'

    // Mock Activity History
    const activities = [
        { id: 1, action: 'Logged in', time: '2 mins ago', ip: '192.168.1.1' },
        { id: 2, action: 'Updated status to "Active"', time: '1 hour ago', ip: '192.168.1.1' },
        { id: 3, action: 'Viewed Disaster Map', time: '3 hours ago', ip: '192.168.1.1' },
        { id: 4, action: 'Changed Password', time: '2 days ago', ip: '192.168.1.42' },
        { id: 5, action: 'Registered Account', time: '1 week ago', ip: '192.168.1.42' },
    ];

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-6">User Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card glass p-6 flex flex-col items-center text-center animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-primary/10"></div>

                        <div className="relative mt-8 mb-4 group cursor-pointer">
                            <div className="w-24 h-24 rounded-full bg-surface-2 border-4 border-surface shadow-lg flex items-center justify-center text-3xl font-bold text-primary overflow-hidden">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                <FaCamera size={14} />
                            </div>
                        </div>

                        <h2 className="text-xl font-bold">{user?.name || 'User Name'}</h2>
                        <p className="text-secondary mb-3">{user?.email || 'user@example.com'}</p>

                        <div className="role-badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary font-semibold text-sm">
                            <FaShieldAlt /> {user?.role || 'Authority'}
                        </div>

                        <div className="w-full mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold">42</p>
                                <p className="text-xs text-secondary uppercase tracking-wider">Actions</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">28</p>
                                <p className="text-xs text-secondary uppercase tracking-wider">Logins</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Content Area (Tabs) */}
                <div className="lg:col-span-2">
                    <div className="card glass min-h-[500px] flex flex-col animate-fade-in delay-100">

                        {/* Tabs Header */}
                        <div className="flex border-b border-border">
                            <button
                                onClick={() => setActiveTab('activity')}
                                className={`flex-1 py-4 text-center font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'activity' ? 'border-b-2 border-primary text-primary bg-primary/5' : 'text-secondary hover:text-text-main'}`}
                            >
                                <FaHistory /> Activity History
                            </button>
                            <button
                                onClick={() => setActiveTab('edit')}
                                className={`flex-1 py-4 text-center font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'edit' ? 'border-b-2 border-primary text-primary bg-primary/5' : 'text-secondary hover:text-text-main'}`}
                            >
                                <FaEdit /> Edit Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('password')}
                                className={`flex-1 py-4 text-center font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'password' ? 'border-b-2 border-primary text-primary bg-primary/5' : 'text-secondary hover:text-text-main'}`}
                            >
                                <FaKey /> Security
                            </button>
                        </div>

                        {/* Content Body */}
                        <div className="p-6 flex-1">

                            {/* ACTIVITY HISTORY */}
                            {activeTab === 'activity' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold mb-4">Recent Account Activity</h3>
                                    <div className="space-y-0 relative border-l border-border ml-2">
                                        {activities.map((activity) => (
                                            <div key={activity.id} className="mb-6 ml-6 relative">
                                                <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-surface border-2 border-primary"></div>
                                                <div className="p-4 bg-surface-2 rounded-lg border border-border hover:border-primary/30 transition-colors">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-semibold text-text-main">{activity.action}</p>
                                                            <p className="text-xs text-secondary mt-1">IP: {activity.ip}</p>
                                                        </div>
                                                        <span className="text-xs font-mono bg-surface px-2 py-1 rounded text-secondary border border-border">
                                                            {activity.time}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* EDIT PROFILE */}
                            {activeTab === 'edit' && (
                                <form className="space-y-6 max-w-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="form-group">
                                            <label className="block text-sm font-medium mb-1">First Name</label>
                                            <input type="text" defaultValue="John" className="w-full p-3 rounded-lg bg-surface-2 border border-border focus:border-primary outline-none" />
                                        </div>
                                        <div className="form-group">
                                            <label className="block text-sm font-medium mb-1">Last Name</label>
                                            <input type="text" defaultValue="Doe" className="w-full p-3 rounded-lg bg-surface-2 border border-border focus:border-primary outline-none" />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="block text-sm font-medium mb-1">Email Address</label>
                                        <input type="email" defaultValue="john.doe@example.com" disabled className="w-full p-3 rounded-lg bg-surface-2 border border-border opacity-60 cursor-not-allowed" />
                                        <p className="text-xs text-secondary mt-1">Contact admin to change email.</p>
                                    </div>

                                    <div className="form-group">
                                        <label className="block text-sm font-medium mb-1">Bio</label>
                                        <textarea rows="4" defaultValue="Dedicated disaster response volunteer." className="w-full p-3 rounded-lg bg-surface-2 border border-border focus:border-primary outline-none"></textarea>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button className="btn btn-primary flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors">
                                            <FaSave /> Save Changes
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* CHANGE PASSWORD */}
                            {activeTab === 'password' && (
                                <form className="space-y-6 max-w-lg">
                                    <div className="form-group">
                                        <label className="block text-sm font-medium mb-1">Current Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full p-3 rounded-lg bg-surface-2 border border-border focus:border-primary outline-none" />
                                    </div>

                                    <div className="form-group">
                                        <label className="block text-sm font-medium mb-1">New Password</label>
                                        <input type="password" placeholder="Enter new password" className="w-full p-3 rounded-lg bg-surface-2 border border-border focus:border-primary outline-none" />
                                    </div>

                                    <div className="form-group">
                                        <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                                        <input type="password" placeholder="Confirm new password" className="w-full p-3 rounded-lg bg-surface-2 border border-border focus:border-primary outline-none" />
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button className="btn btn-primary flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors">
                                            <FaKey /> Update Password
                                        </button>
                                    </div>
                                </form>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
