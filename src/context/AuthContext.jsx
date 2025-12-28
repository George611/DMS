import { createContext, useContext, useState } from 'react';
import { MOCK_USER } from '../utils/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(MOCK_USER);

    const login = (email, password, role = 'citizen') => {
        // Simulate API call
        console.log("Logging in with", email, password, role);
        // For demo, we just set a default user but valid auth flow would go here
        setUser({ ...MOCK_USER, email, role });
    };

    const register = (data) => {
        console.log("Registering", data);
        setUser({ ...MOCK_USER, ...data });
    };

    const switchRole = (role) => {
        setUser(prev => ({ ...prev, role }));
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, switchRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
