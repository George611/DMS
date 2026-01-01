import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage if exists
        const savedUser = localStorage.getItem('dms_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user: userData } = response.data;

            localStorage.setItem('dms_token', token);
            localStorage.setItem('dms_user', JSON.stringify(userData));
            setUser(userData);
            return userData;
        } catch (error) {
            throw error.response?.data?.message || 'Login failed';
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { token, user: newUser } = response.data;

            localStorage.setItem('dms_token', token);
            localStorage.setItem('dms_user', JSON.stringify(newUser));
            setUser(newUser);
            return newUser;
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    const switchRole = (role) => {
        // This would typically involve an API call to update the role in the DB
        const updatedUser = { ...user, role };
        setUser(updatedUser);
        localStorage.setItem('dms_user', JSON.stringify(updatedUser));
    };

    const logout = () => {
        localStorage.removeItem('dms_token');
        localStorage.removeItem('dms_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, switchRole, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

