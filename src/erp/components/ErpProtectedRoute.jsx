import { Navigate, useLocation } from 'react-router-dom';
import { useErpAuth } from '../context/ErpAuthContext';

const ErpProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, hasRole } = useErpAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/erp/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Acceso Restringido</h2>
        <p className="text-gray-500 max-w-md">Tu rol actual no tiene autorización para ingresar a este módulo del ERP. Contacta a la Dirección si requieres permisos adicionales.</p>
      </div>
    );
  }

  return children;
};

export default ErpProtectedRoute;
