import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, LayoutDashboard, LogOut, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-600">MedSchedule</h2>
        </div>
        <nav className="mt-6">
          <Link
            to="/dashboard"
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              location.pathname === '/dashboard' ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link
            to="/calendar"
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              location.pathname === '/calendar' ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <Calendar className="w-5 h-5 mr-3" />
            Calendar
          </Link>
          <Link
            to="/patients"
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              location.pathname.startsWith('/patients') ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Patients
          </Link>
        </nav>

        <div className="absolute bottom-0 w-64 p-6">
          <button onClick={handleLogout} className="flex items-center text-gray-700 hover:text-red-600">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
