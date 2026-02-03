import { NavLink } from 'react-router-dom';
import {
    GitGraph,
    Activity,
    FileText,
    Settings,
    LayoutDashboard
} from 'lucide-react';

const SidebarNav = () => {
    const navItems = [
        { to: '/', icon: GitGraph, label: 'Builder' },
        { to: '/timeline', icon: Activity, label: 'Timeline' },
        { to: '/transactions', icon: FileText, label: 'Transactions' },
        { to: '/audit', icon: Settings, label: 'Audit Logs' },
    ];

    return (
        <nav className="flex flex-col gap-2 p-2 w-[60px] border-r border-gray-200 h-full bg-gray-50 items-center py-4">
            <div className="mb-4 text-blue-600">
                <LayoutDashboard className="w-8 h-8" />
            </div>

            {navItems.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `
             p-3 rounded-xl transition-all duration-200 group relative
             ${isActive
                            ? 'bg-blue-100 text-blue-600 shadow-sm'
                            : 'text-gray-400 hover:bg-white hover:text-gray-600 hover:shadow-sm'}
           `}
                    title={item.label}
                >
                    <item.icon className="w-6 h-6" />
                </NavLink>
            ))}
        </nav>
    );
};

export default SidebarNav;
