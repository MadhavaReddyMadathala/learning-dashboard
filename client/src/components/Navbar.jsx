import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, User as UserIcon, ShieldAlert, Eye } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleViewAsStudent = () => {
    navigate('/student-view'); // change route if needed
  };

  return (
    <nav className="flex items-center justify-between px-4 py-3 shadow-md bg-white">
      
      {/* LEFT SIDE - Brand */}
      <div className="flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        <span className="font-semibold">Admin Panel</span>
      </div>

      {/* RIGHT SIDE - Actions */}
      <div className="flex items-center gap-4">

        {/* 👁 View as Student BUTTON (kept as separate section) */}
        <button
          onClick={handleViewAsStudent}
          className="flex items-center gap-1 px-3 py-1 border rounded-md hover:bg-gray-100"
        >
          <Eye className="w-4 h-4" />
          View as Student
        </button>

        {/* User Info */}
        <div className="flex items-center gap-2">
          <UserIcon className="w-4 h-4" />
          <span>{user?.name || 'Admin'}</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-red-600 hover:text-red-800"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>

      </div>
    </nav>
  );
};

export default Navbar;
