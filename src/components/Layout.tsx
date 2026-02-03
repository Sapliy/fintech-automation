import { Outlet } from 'react-router-dom';
import SidebarNav from './SidebarNav';

const Layout = () => {
    return (
        <div className="flex h-screen w-screen bg-gray-50 overflow-hidden">
            <SidebarNav />
            <main className="flex-1 flex overflow-hidden relative">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
