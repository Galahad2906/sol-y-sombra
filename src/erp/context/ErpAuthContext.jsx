import { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/mockErpData';

const ErpAuthContext = createContext(null);

const STORAGE_KEY = 'sol_y_sombra_erp_user';

export const ErpAuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Error loading ERP auth from storage:', e);
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email, password) => {
    const trimmedEmail = email?.trim().toLowerCase();
    const found = INITIAL_USERS.find(
      u => u.email.toLowerCase() === trimmedEmail && u.password === password
    );

    if (found) {
      const authUser = {
        id: found.id,
        email: found.email,
        name: found.name,
        role: found.role,
        title: found.title,
        avatar: found.avatar
      };
      setUser(authUser);
      return { success: true, user: authUser };
    }

    return { 
      success: false, 
      error: 'Credenciales inválidas. Comprueba tu usuario y contraseña de Sol & Sombra.' 
    };
  };

  const loginAsRole = (targetRole) => {
    const found = INITIAL_USERS.find(u => u.role === targetRole) || INITIAL_USERS[0];
    const authUser = {
      id: found.id,
      email: found.email,
      name: found.name,
      role: found.role,
      title: found.title,
      avatar: found.avatar
    };
    setUser(authUser);
    return authUser;
  };

  const logout = () => {
    setUser(null);
  };

  const hasRole = (allowedRoles) => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admin has universal access
    if (Array.isArray(allowedRoles)) {
      return allowedRoles.includes(user.role);
    }
    return user.role === allowedRoles;
  };

  return (
    <ErpAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role: user?.role || null,
        login,
        loginAsRole,
        logout,
        hasRole
      }}
    >
      {children}
    </ErpAuthContext.Provider>
  );
};

export const useErpAuth = () => {
  const context = useContext(ErpAuthContext);
  if (!context) {
    throw new Error('useErpAuth debe ser usado dentro de un ErpAuthProvider');
  }
  return context;
};
