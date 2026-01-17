import { Facebook, Twitter, Instagram, Mail, MapPin, Phone, ArrowRight, Sun, Menu, Moon, X, Bell, Shield, Search, Home, Users, Calendar, DollarSign, Settings, LogOut, Book, User } from 'lucide-react';
import { useTheme } from '../utilities/ThemeProvider';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../pages/authenticationPages/authApiSlice';
import { useGetMeQuery } from '../../pages/authenticatedPages/userApiSlice';
import useAuth from '../../hooks/useAuth';
import { useGetSettingsQuery } from '../../pages/authenticatedPages/settingsApiSlice';

const Header = () => {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const [logout, { isSuccess, isLoading, reset }] = useLogoutMutation()
    const { isLoggedIn, isAdmin: isAdminState } = useAuth()
    const navigate = useNavigate()
    const { data: currentUser } = useGetMeQuery(undefined, { skip: !isLoggedIn })
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const { data: settings, isLoading: isSettingsLoading, isError: isSettingsError, error: settingsError, refetch: refetchSettings } = useGetSettingsQuery();

    const handleLogout = async () => {
        try {
            await logout().unwrap();
        } catch (error) {
            import.meta.env.VITE_ENV === "dev_env" && console.error('Logout failed:', error);
        }
    };

    useEffect(() => {
        if (isSuccess && !isLoggedIn) {
            navigate("/")
            reset()
        }
    }, [isSuccess, isLoggedIn, reset, navigate])

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open (only for non-admin)
    useEffect(() => {
        if (!isAdminState && isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen, isAdminState]);

    const guestNavLinks = [
        { name: 'Home', path: '/' },
        { name: 'Rooms', path: '/rooms' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Location', path: '/location' },
        { name: 'Contact', path: '/contact' },
    ];

    const adminNavLinks = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
        { name: 'Guests', path: '/admin/guests', icon: Users },
        { name: 'Bookings/Reservations', path: '/admin/reservations', icon: Calendar },
        { name: 'Rooms', path: '/admin/rooms', icon: Home },
        { name: 'Content Management', path: '/admin/content', icon: Book },
        { name: 'Billing', path: '/admin/billing', icon: DollarSign },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    // Admin menu toggle for mobile (simplified)
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

    return (
        <>
            {/* Main Header Container */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'py-2 md:py-4'
                    : 'py-4 md:py-6'
                    }`}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-300">
                    {/* Island Container */}
                    <div className={`
                        relative flex items-center justify-between
                        rounded-full border backdrop-blur-xl shadow-sm
                        transition-all duration-300 z-50
                        ${isAdminState
                            ? 'bg-white dark:bg-dark-800 border-gray-200 dark:border-white/10'
                            : 'bg-white/60 border-black/5 dark:bg-black/40 dark:border-white/5'
                        }
                        ${isScrolled ? 'px-4 py-2' : 'px-6 py-3'}
                    `}>
                        {/* Logo/Admin Branding */}
                        <Link to={"/"} className="flex relative items-center gap-2 group z-50">
                            <div className="relative w-25 h-7 md:w-27 md:h-8 lg:w-28 lg:h-9 overflow-hidden">
                                <img
                                    src="https://res.cloudinary.com/ddjxdvgd5/image/upload/branding/logo.png"
                                    alt={"Suave By Chloe Logo"}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            {/* {isAdminState && <p className='absolute -top-3 right-0 bg-green-300 px-1 py-0.3 rounded font-mono text-xs text-gray-600'>Admin</p>} */}
                        </Link>

                        {/* Desktop Navigation */}
                        {!isAdminState || !location.pathname.includes("admin") ? (
                            // Guest Navigation
                            <nav className="hidden md:flex items-center gap-8">
                                {guestNavLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`text-sm font-medium transition-colors hover:text-blue-500 ${location.pathname === link.path
                                            ? 'text-blue-600 dark:text-blue-400 font-semibold'
                                            : 'text-gray-600 dark:text-gray-300'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                        ) : (
                            // Admin Navigation with Search
                            <div className="hidden md:flex items-center gap-6 flex-1 max-w-2xl mx-8">
                                {/* Search Bar for Admin */}
                                <div className="relative flex-1">
                                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search reservations, guests, rooms..."
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border outline-none text-sm bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-400 dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-blue-500/50"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 md:gap-4 z-50">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-full transition-all duration-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 active:scale-95 text-slate-700 hover:text-slate-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                aria-label="Toggle theme"
                            >
                                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            {/* Admin Features */}
                            {isAdminState && (
                                <>
                                    {/* Notifications for Admin */}
                                    <button className="relative p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white">
                                        <Bell size={20} />
                                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                                    </button>

                                    {/* Admin Profile Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                                            className="flex items-center gap-3 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                        >
                                            <div className="hidden md:block text-right">
                                                <p className="text-sm font-sans font-semibold text-gray-900 dark:text-white">
                                                    {currentUser?.firstName || 'Admin User'}
                                                </p>
                                                <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                                    {currentUser?.roles.map(capitalize).join(", ")}
                                                </p>
                                            </div>
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-blue-600 dark:bg-blue-500">
                                                {currentUser?.firstName ? currentUser.firstName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AD'}
                                            </div>
                                        </button>

                                        {/* Admin Dropdown Menu */}
                                        {isAdminMenuOpen && (
                                            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-white/10 shadow-lg py-2">
                                                {/* Profile Detail */}
                                                <Link
                                                    to="/admin/profile"
                                                    className="block px-4 py-3 border-b border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                                    onClick={() => setIsAdminMenuOpen(false)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <User size={14} className="text-gray-400" />
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{currentUser?.firstName || 'Admin User'}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 ml-5">{currentUser?.email || 'admin@hotel.com'}</p>
                                                </Link>

                                                <div className="py-2">
                                                    {adminNavLinks.map((link) => (
                                                        <Link
                                                            key={link.name}
                                                            to={link.path}
                                                            className={`flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5 ${location.pathname === link.path ||
                                                                (link.path === '/admin' && location.pathname.startsWith('/admin/')) && location.pathname !== '/admin'
                                                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 font-medium'
                                                                : 'text-gray-700 dark:text-gray-300'
                                                                }`}
                                                            onClick={() => setIsAdminMenuOpen(false)}
                                                        >
                                                            <link.icon size={16} />
                                                            <span>{link.name}</span>
                                                        </Link>
                                                    ))}
                                                </div>

                                                <div className="border-t border-gray-200 dark:border-white/10 pt-2">
                                                    <button
                                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-white/5"
                                                        onClick={() => {
                                                            // Handle logout
                                                            setIsAdminMenuOpen(false);
                                                            handleLogout()
                                                        }}
                                                    >
                                                        <LogOut size={16} />
                                                        <span>Log Out</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Mobile Menu Toggle (only for non-admin) */}
                            {!isAdminState && (
                                <button
                                    className={`
                                        md:hidden p-2 rounded-full transition-all duration-300 z-50
                                        text-black dark:text-white
                                        ${isMobileMenuOpen ? 'bg-white/10 rotate-90' : ''}
                                    `}
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                >
                                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu (only for non-admin) */}
            {!isAdminState && (
                <div className={`
                    fixed inset-0 z-40 md:hidden overflow-hidden
                    backdrop-blur-3xl
                    transition-all duration-500 ease-in-out
                    ${isMobileMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-full invisible'}
                    bg-gradient-to-b from-white/95 via-gray-50/95 to-white/95 dark:from-void/95 dark:via-gray-900/95 dark:to-void/95
                `}>
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] blur-[120px] rounded-full mix-blend-screen animate-pulse bg-blue-400/20 dark:bg-blue-600/10" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] blur-[120px] rounded-full mix-blend-screen animate-pulse bg-purple-400/20 dark:bg-purple-600/10" />
                    </div>

                    <div className="relative h-full flex flex-col justify-center px-8 pt-20 pb-8">
                        {/* Navigation Links */}
                        <div>
                            <nav className="flex flex-col gap-6 items-center">
                                {guestNavLinks.map((link, index) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`group relative flex items-center gap-4 text-3xl font-light tracking-wide font-sans
                                            transition-all duration-500
                                            ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                                            ${location.pathname === link.path
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-accent'
                                            }
                                        `}
                                        style={{ transitionDelay: `${index * 100}ms` }}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <span className="opacity-0 -ml-8 transition-all duration-300 group-hover:opacity-100 group-hover:ml-0 text-blue-500">
                                            <ArrowRight size={24} />
                                        </span>
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>

                            {/* CTA Button */}
                            <div
                                className={`
                                my-12 flex justify-center w-full
                                transition-all duration-700 delay-300
                                ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                            `}
                            >
                                <button className="px-8 py-3 rounded-full bg-blue-600 text-white font-medium shadow-sm cursor-pointer hover:bg-blue-700 transition-all duration-300 w-full max-w-xs">
                                    Book Your Stay
                                </button>
                            </div>

                            {/* Social Icons Footer */}
                            <div
                                className={`
                                mt-auto flex justify-center gap-8
                                transition-all duration-700 delay-500
                                ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                            `}
                            >
                                {[
                                    { Icon: Facebook, href: '#' },
                                    { Icon: Twitter, href: '#' },
                                    { Icon: Instagram, href: '#' }
                                ].map(({ Icon, href }, i) => (
                                    <a
                                        key={i}
                                        href={href}
                                        className="p-3 rounded-full border transition-all duration-300 bg-gray-100 border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-md dark:bg-white/5 dark:border-white/10 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 dark:hover:border-white/30"
                                    >
                                        <Icon size={24} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;