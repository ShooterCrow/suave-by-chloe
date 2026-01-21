import React, { useState } from 'react';
import {
    Users,
    DollarSign,
    Home,
    Calendar,
    BarChart3,
    Search,
    Bell,
    Menu,
    X,
    Shield,
    Settings,
    LogOut,
    MoreHorizontal
} from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

// Admin Navbar Component
const AdminNavbar = ({ toggleSidebar, isSidebarOpen }) => {
    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-white/10">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-white lg:hidden"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <div className="flex items-center gap-2">
                            <Shield className="text-blue-500 dark:text-blue-400" size={20} />
                            <span className="font-serif text-lg font-bold text-gray-900 dark:text-white">
                                Hotel Admin
                            </span>
                            <span className="hidden sm:inline-block text-xs px-2 py-1 rounded-full font-mono bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                PRO
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="hidden md:flex items-center relative">
                            <Search size={18} className="absolute left-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search reservations, guests..."
                                className="pl-10 pr-4 py-2 w-64 rounded-lg border outline-none text-sm bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-400 dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-blue-500/50"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-white">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Admin Profile */}
                        <div className="flex items-center gap-3">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-sans font-semibold text-gray-900 dark:text-white">
                                    Sarah Johnson
                                </p>
                                <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                    Hotel Manager
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-blue-600 dark:bg-blue-500">
                                SJ
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

// Desktop Sidebar Component
const AdminSidebar = ({ isOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: Home, label: 'Dashboard', path: '/admin' },
        { icon: Users, label: 'Guests', count: 42, path: '/admin/users' },
        { icon: Calendar, label: 'Reservations', count: 156, path: '/admin/reservations' },
        { icon: Home, label: 'Rooms', count: 45, path: '/admin/rooms' },
        { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
        { icon: DollarSign, label: 'Billing', path: '/admin/billing' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <aside className={`${isOpen ? 'translate-x-0' : '-translate-x-full'
            } fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-white/10 lg:translate-x-0 hidden lg:flex flex-col`}>
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="p-6 border-b border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-3">
                        {/* <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-600 dark:bg-blue-500">
                            <Shield className="text-white" size={24} />
                        </div> */}
                        <div>
                            {/* <h1 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                                Suave
                            </h1>
                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                Administration
                            </p> */}
                        </div>
                    </div>
                </div>

                {/* Menu */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={index}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all font-sans ${isActive
                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={20} />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                {item.count && (
                                    <span className={`px-2 py-1 text-xs font-mono rounded-full ${isActive
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300'
                                        : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400'
                                        }`}>
                                        {item.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-white/10">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 transition-all font-sans">
                        <LogOut size={20} />
                        <span className="font-medium">Log Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

// Mobile Bottom Navigation Component
const MobileBottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showMore, setShowMore] = useState(false);

    const primaryItems = [
        { icon: Home, label: 'Dashboard', path: '/admin' },
        { icon: Users, label: 'Guests', path: '/admin/users' },
        { icon: Calendar, label: 'Bookings', path: '/admin/reservations' },
    ];

    const moreItems = [
        { icon: Home, label: 'Rooms', path: '/admin/rooms' },
        { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
        { icon: DollarSign, label: 'Billing', path: '/admin/billing' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
        { icon: LogOut, label: 'Log Out', path: '/logout' },
    ];

    return (
        <>
            {/* More Menu Modal */}
            {showMore && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                    onClick={() => setShowMore(false)}
                >
                    <div
                        className="absolute bottom-20 left-0 right-0 bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-white/10 rounded-t-3xl p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
                        <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4 px-2">
                            More Options
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            {moreItems.map((item, index) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (item.path === '/logout') {
                                                // Handle logout
                                            } else {
                                                navigate(item.path);
                                            }
                                            setShowMore(false);
                                        }}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${isActive
                                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        <item.icon size={24} />
                                        <span className="text-xs font-sans font-medium text-center">
                                            {item.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-white/10 lg:hidden">
                <div className="flex items-center justify-around px-4 py-3 safe-area-bottom">
                    {primaryItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={index}
                                onClick={() => navigate(item.path)}
                                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${isActive
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-xs font-sans font-medium">
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                    <button
                        onClick={() => setShowMore(!showMore)}
                        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${showMore
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400'
                            }`}
                    >
                        <MoreHorizontal size={22} strokeWidth={showMore ? 2.5 : 2} />
                        <span className="text-xs font-sans font-medium">
                            More
                        </span>
                    </button>
                </div>
            </nav>
        </>
    );
};

// Admin Layout Provider Component
const AdminLayoutProvider = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-void transition-colors duration-300">
            {/* <AdminNavbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} /> */}
            <div className="flex max-w-7xl mx-auto">
                {/* <AdminSidebar isOpen={sidebarOpen} /> */}
                <main className="pb-24 lg:pb-6 pt-[130px]">
                    <Outlet />
                </main>
            </div>
            {/* <MobileBottomNav /> */}
        </div>
    );
};

export default AdminLayoutProvider;