import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useErpAuth } from '../context/ErpAuthContext';
import { Lock, Mail, ShieldAlert, ArrowRight, CheckCircle2, Shield, Hammer, ShoppingBag } from 'lucide-react';

const ErpLogin = () => {
  const { login, loginAsRole } = useErpAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/erp/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  const handleQuickLogin = (role) => {
    loginAsRole(role);
    navigate('/erp/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Subtle background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-neutral-950 font-serif font-bold text-3xl shadow-xl shadow-amber-500/20 mb-4 ring-1 ring-amber-400/50">
            S
          </div>
          <h1 className="text-2xl font-bold font-serif tracking-wider text-white uppercase">
            Sol & Sombra <span className="text-amber-400">SRL</span>
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-amber-500/90 mt-1">
            Sistema Integral ERP & Taller Privado
          </p>
          <div className="inline-block mt-3 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400">
            Acceso restringido para personal autorizado
          </div>
        </div>

        {/* Login Box */}
        <div className="bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-xs">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide mb-1.5">
                Correo Institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@solysombra.com.py"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide mb-1.5">
                Contraseña de Seguridad
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
            >
              <span>{loading ? 'Validando credenciales...' : 'Ingresar al Sistema'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-8 pt-6 border-t border-neutral-800">
            <p className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider text-center mb-3">
              Acceso Rápido por Perfil / Roles
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-center transition-all group"
              >
                <div className="w-7 h-7 mx-auto rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Shield size={14} />
                </div>
                <div className="text-[11px] font-bold text-neutral-200">Admin</div>
                <div className="text-[9px] text-neutral-400">Dirección</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('taller')}
                className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-center transition-all group"
              >
                <div className="w-7 h-7 mx-auto rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Hammer size={14} />
                </div>
                <div className="text-[11px] font-bold text-neutral-200">Taller</div>
                <div className="text-[9px] text-neutral-400">Producción</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('ventas')}
                className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-center transition-all group"
              >
                <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <ShoppingBag size={14} />
                </div>
                <div className="text-[11px] font-bold text-neutral-200">Ventas</div>
                <div className="text-[9px] text-neutral-400">Presupuestos</div>
              </button>
            </div>
          </div>
        </div>

        {/* Security watermark */}
        <div className="text-center mt-6 text-[11px] text-neutral-400 flex items-center justify-center gap-1.5">
          <CheckCircle2 size={13} className="text-amber-500/80" />
          <span>Sol & Sombra SRL — Terminal de Gestión Corporativa Segura</span>
        </div>
      </div>
    </div>
  );
};

export default ErpLogin;
