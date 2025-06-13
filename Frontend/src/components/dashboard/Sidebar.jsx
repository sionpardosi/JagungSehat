import { Database, LogOut, ShieldCheck, Users, Clock } from "lucide-react"; 
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/dashboard' && location.pathname === '/dashboard/disease-management') {
            return true;
        }
        if (path !== '/dashboard' && location.pathname.includes(path)) {
            return true;
        }
        return false;
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken'); 
        navigate('/auth/login');
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="px-6 py-8 text-2xl font-bold border-b border-gray-200">
                JAGAT
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1">
                <button
                    type="button"
                    onClick={() => handleNavigation('/dashboard/disease-management')}  // Direct to disease management
                    className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        isActive('/dashboard/disease-management')
                            ? 'text-indigo-700 bg-indigo-100'
                            : 'text-gray-600 hover:text-indigo-700 hover:bg-indigo-100'
                    }`}
                >
                    <ShieldCheck className="w-5 h-5 mr-3" />
                    Disease Management
                </button>

                <button
                    type="button"
                    onClick={() => handleNavigation('/dashboard/user-management')}
                    className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        isActive('user-management')
                            ? 'text-indigo-700 bg-indigo-100'
                            : 'text-gray-600 hover:text-indigo-700 hover:bg-indigo-100'
                    }`}
                >
                    <Users className="w-5 h-5 mr-3" />
                    User Management
                </button>
                
                <button
                    type="button"
                    onClick={() => handleNavigation('/dashboard/predict-history')}
                    className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        isActive('history')
                            ? 'text-indigo-700 bg-indigo-100'
                            : 'text-gray-600 hover:text-indigo-700 hover:bg-indigo-100'
                    }`}
                >
                    <Clock className="w-5 h-5 mr-3" />
                    Access History
                </button>
            </nav>
            <div className="p-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={handleLogout} 
                    className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-100 transition-colors duration-200"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;