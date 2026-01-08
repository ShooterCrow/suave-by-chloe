import React, { useEffect, useState } from 'react';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Key,
    User,
    Sparkles,
    Shield,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    Chrome,
    Smartphone
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import SpotlightCard from '../../components/ui/SpotlightCard';
import { useLoginMutation } from './authApiSlice';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import usePersist from '../../hooks/usePersist';

// Login Component
const Login = () => {
    const navigate = useNavigate()
    const from = location.state?.from?.pathname || "/admin/dashboard";
    const { isLoggedIn } = useAuth();
    const [login, { isSuccess, isLoading, isError, error }] = useLoginMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [persist, setPersist] = usePersist();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showTwoFactor, setShowTwoFactor] = useState(false);

    useEffect(() => {
        if (!isSuccess && !isLoggedIn) return;

        const destination = isSuccess ? from : "/admin/dashboard";
        const options = isSuccess ? { replace: true } : {};

        navigate(destination, options);
    }, [isSuccess, isLoggedIn, navigate, from]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData);

    };

    const handleSocialLogin = (provider) => {
        alert(`Logging in with ${provider}...`);
    };

    const handleForgotPassword = () => {
        window.location.hash = '#forgot-password';
    };

    const handleRegister = () => {
        window.location.hash = '#register';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-void dark:via-dark-800 dark:to-void pt-28 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <Helmet>
                <title>Login | Suave By Chloe</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center">
                            <Key size={24} className="text-white" />
                        </div>
                        <span className="font-mono text-sm text-blue-500 tracking-widest uppercase">
                            HOTEL_AUTH
                        </span>
                    </div>
                    <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Welcome Back
                    </h1>
                    <p className="font-sans text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        Sign in to your account to access the hotel management system
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center lg:flex-row gap-8">
                    {/* Left Column - Login Form */}
                    <div className="lg:w-1/2">
                        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-8">
                            <div className="mb-8">
                                <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Secure Login
                                </h2>
                                <p className="font-sans text-gray-600 dark:text-gray-400">
                                    Enter your credentials to access the system
                                </p>
                            </div>

                            {showTwoFactor ? (
                                // 2FA Form
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="p-4 rounded-lg border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-900/20">
                                        <div className="flex items-center gap-3">
                                            <Shield size={20} className="text-amber-600 dark:text-amber-400" />
                                            <div>
                                                <h4 className="font-sans font-medium text-gray-900 dark:text-white">
                                                    Two-Factor Authentication Required
                                                </h4>
                                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                                    Enter the verification code sent to your device
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                            Verification Code
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                <Shield size={20} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.twoFactorCode}
                                                onChange={(e) => setFormData({ ...formData, twoFactorCode: e.target.value })}
                                                placeholder="Enter 6-digit code"
                                                maxLength="6"
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg tracking-widest"
                                            />
                                        </div>
                                    </div>

                                    {isError && (
                                        <div className="p-4 rounded-lg border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-900/20 flex items-center gap-3">
                                            <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
                                            <p className="text-sm font-sans text-red-600 dark:text-red-400">
                                                {error?.data?.message || 'Verification failed. Please try again.'}
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Verifying...
                                            </>
                                        ) : (
                                            'Verify & Continue'
                                        )}
                                    </button>

                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowTwoFactor(false)}
                                            className="text-sm font-sans text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                        >
                                            ← Back to password login
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                // Main Login Form
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                <Mail size={20} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="joe@example.com"
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white">
                                                Password
                                            </label>
                                            <button
                                                type="button"
                                                onClick={handleForgotPassword}
                                                className="text-sm font-sans text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                <Lock size={20} className="text-gray-400" />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                placeholder="Enter your password"
                                                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="remember"
                                                checked={persist}
                                                onChange={() => setPersist(prev => !prev)}
                                                className="w-4 h-4 rounded border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor="remember" className="text-sm font-sans text-gray-900 dark:text-white">
                                                Remember this device
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                                Secure connection
                                            </span>
                                            <Shield size={16} className="text-green-500" />
                                        </div>
                                    </div>

                                    {isError && (
                                        <div className="p-4 rounded-lg border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-900/20 flex items-center gap-3">
                                            <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
                                            <p className="text-sm font-sans text-red-600 dark:text-red-400">
                                                {error?.data?.message || 'Failed to sign in. Please try again.'}
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Signing in...
                                            </>
                                        ) : (
                                            'Sign In'
                                        )}
                                        <ArrowRight size={18} />
                                    </button>

                                    {/* Alternative Login Methods */}
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-300 dark:border-white/10"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white dark:bg-dark-800 text-gray-500 dark:text-gray-400">
                                                Or continue with
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleSocialLogin('google')}
                                            className="px-4 py-3 rounded-lg font-sans font-medium transition-colors border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-center gap-2"
                                        >
                                            <Chrome size={20} />
                                            Google
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 text-center">
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                    Don't have an account?{' '}
                                    <button
                                        onClick={handleRegister}
                                        className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                    >
                                        Request access
                                    </button>
                                </p>
                            </div>
                        </SpotlightCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;