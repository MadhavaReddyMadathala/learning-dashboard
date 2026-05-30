import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, User as UserIcon, ShieldAlert, Eye } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Don’t render navbar if user is not logged in
  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleViewAsStudent = () => {
    navigate('/student-view'); // change route if needed
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800 backdrop-blur-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="bg-brand-500 text-white p-2 rounded-xl shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <BookOpen size={20} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">
            Aura<span className="text-brand-400">LMS</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link
            to={user.role === 'admin' ? '/admin' : '/dashboard'}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
          </Link>
        </div>

        {/* Profile / Actions */}
        <div className="flex items-center space-x-4">
          
          {/* View as Student Button (Admin only) */}
          {user.role === 'admin' && (
            <button
              onClick={handleViewAsStudent}
              className="flex items-center space-x-2 text-sm font-medium px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
            >
              <Eye size={16} className="text-brand-400" />
              <span className="hidden sm:inline">View as Student</span>
            </button>
          )}

          {/* Profile badge */}
          <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
            {user.role === 'admin' ? (
              <ShieldAlert size={14} className="text-amber-400 animate-pulse" />
            ) : (
              <UserIcon size={14} className="text-brand-400" />
            )}

            <span className="text-xs font-semibold text-slate-300">
              {user.name}
            </span>

            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
              {user.role}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-sm font-medium px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 hover:border-slate-800 border border-transparent transition-all cursor-pointer"
            title="Log Out"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;

