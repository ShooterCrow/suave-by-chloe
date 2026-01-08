import React, { useState, useEffect } from 'react';
import {
    Key,
    Lock,
    Eye,
    EyeOff,
    Shield,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    RefreshCw,
    Clock
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// SpotlightCard Component
const SpotlightCard = ({ children, className = "" }) => {
    const cardRef = React.useRef(null);
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = React.useState(false);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`relative overflow-hidden ${className}`}
            style={{
                background: isHovering
                    ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, var(--spotlight-color), transparent 40%)`
                    : 'transparent',
                '--spotlight-color': 'rgba(59, 130, 246, 0.1)'
            }}
        >
            {children}
        </div>
    );
};

// Password Strength Indicator
const PasswordStrength = ({ password }) => {
    const calculateStrength = (pass) => {
        let score = 0;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[a-z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        return Math.min(score, 5);
    };

    const strength = calculateStrength(password);
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const strengthColors = [
        'bg-red-500',
        'bg-red-400',
        'bg-amber-500',
        'bg-amber-400',
        'bg-green-500',
        'bg-green-400'
    ];

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-sans font-medium text-gray-900 dark:text-white">
                    Password Strength
                </span>
                <span className={`text-sm font-sans font-medium ${strength >= 4 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {strengthLabels[strength]}
                </span>
            </div>
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${i < strength ? strengthColors[strength] : 'bg-gray-200 dark:bg-white/10'}`}
                    />
                ))}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                <div className="flex items-center gap-1">
                    {password.length >= 8 ? (
                        <CheckCircle size={12} className="text-green-500" />
                    ) : (
                        <AlertCircle size={12} className="text-red-500" />
                    )}
                    <span className={password.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        8+ characters
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    {/[A-Z]/.test(password) ? (
                        <CheckCircle size={12} className="text-green-500" />
                    ) : (
                        <AlertCircle size={12} className="text-red-500" />
                    )}
                    <span className={/[A-Z]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        Uppercase
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    {/[0-9]/.test(password) ? (
                        <CheckCircle size={12} className="text-green-500" />
                    ) : (
                        <AlertCircle size={12} className="text-red-500" />
                    )}
                    <span className={/[0-9]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        Number
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    {/[^A-Za-z0-9]/.test(password) ? (
                        <CheckCircle size={12} className="text-green-500" />
                    ) : (
                        <AlertCircle size={12} className="text-red-500" />
                    )}
                    <span className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        Special
                    </span>
                </div>
            </div>
        </div>
    );
};

// Reset Password Component
const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    // Countdown timer for reset link validity
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setResetSuccess(true);
        setLoading(false);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleReturnToLogin = () => {
        window.location.hash = '#login';
    };

    if (timeLeft === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-void dark:via-dark-800 dark:to-void p-4 sm:p-6 lg:p-8 transition-colors duration-300 flex items-center justify-center">
                <div className="max-w-md w-full">
                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-8">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
                                <Clock size={32} className="text-red-600 dark:text-red-400" />
                            </div>
                            <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Link Expired
                            </h2>
                            <p className="font-sans text-gray-600 dark:text-gray-400 mb-6">
                                This password reset link has expired. Please request a new reset link.
                            </p>
                            <button
                                onClick={() => window.location.hash = '#forgot-password'}
                                className="w-full py-3 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                            >
                                Request New Reset Link
                            </button>
                        </div>
                    </SpotlightCard>
                </div>
            </div>
        );
    }

    if (resetSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-void dark:via-dark-800 dark:to-void p-4 sm:p-6 lg:p-8 transition-colors duration-300 flex items-center justify-center">
                <div className="max-w-md w-full">
                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-8">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Password Reset Successful!
                            </h2>
                            <p className="font-sans text-gray-600 dark:text-gray-400 mb-6">
                                Your password has been successfully reset. You can now sign in with your new password.
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={handleReturnToLogin}
                                    className="w-full py-3 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center justify-center gap-2"
                                >
                                    Sign In Now
                                    <ArrowRight size={18} />
                                </button>
                                <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                    You will be automatically logged out of all other devices.
                                </p>
                            </div>
                        </div>
                    </SpotlightCard>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-void dark:via-dark-800 dark:to-void p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <Helmet>
                <title>Reset Password | Suave By Chloe</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center">
                            <RefreshCw size={24} className="text-white" />
                        </div>
                        <span className="font-mono text-sm text-blue-500 tracking-widest uppercase">
                            RESET_PASSWORD
                        </span>
                    </div>
                    <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Create New Password
                    </h1>
                    <p className="font-sans text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Enter and confirm your new password. Make sure it meets all security requirements.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Form */}
                    <div className="lg:w-2/3">
                        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-8">
                            {/* Time Warning */}
                            <div className="mb-6 p-4 rounded-lg border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-900/20">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Clock size={20} className="text-amber-600 dark:text-amber-400" />
                                        <div>
                                            <h4 className="font-sans font-medium text-gray-900 dark:text-white">
                                                Time Remaining
                                            </h4>
                                            <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                                Complete reset before link expires
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono text-xl font-bold text-amber-600 dark:text-amber-400">
                                            {formatTime(timeLeft)}
                                        </p>
                                        <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                            minutes remaining
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        New Password *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                            <Lock size={20} className="text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={formData.newPassword}
                                            onChange={(e) => handleChange('newPassword', e.target.value)}
                                            placeholder="Enter new password"
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
                                    <div className="mt-3">
                                        <PasswordStrength password={formData.newPassword} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Confirm New Password *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                            <Lock size={20} className="text-gray-400" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                            placeholder="Re-enter new password"
                                            className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                                        <p className="text-sm font-sans text-red-600 dark:text-red-400 mt-2">
                                            Passwords do not match
                                        </p>
                                    )}
                                </div>

                                <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-900/20">
                                    <div className="flex items-start gap-3">
                                        <Shield size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                                        <div>
                                            <h4 className="font-sans font-medium text-gray-900 dark:text-white mb-1">
                                                Security Notice
                                            </h4>
                                            <ul className="text-sm font-sans text-gray-600 dark:text-gray-400 space-y-1">
                                                <li>• Your new password must be different from your last 3 passwords</li>
                                                <li>• All active sessions on other devices will be terminated</li>
                                                <li>• You'll need to re-login on all devices</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                    <input
                                        type="checkbox"
                                        id="logout-all"
                                        className="w-4 h-4 mt-1 rounded border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-blue-600 focus:ring-blue-500"
                                        defaultChecked
                                    />
                                    <label htmlFor="logout-all" className="text-sm font-sans text-gray-900 dark:text-white">
                                        Log out of all other devices (recommended for security)
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || formData.newPassword !== formData.confirmPassword}
                                    className="w-full py-3 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Resetting Password...
                                        </>
                                    ) : (
                                        'Reset Password'
                                    )}
                                    <ArrowRight size={18} />
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 text-center">
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                    Remember your password?{' '}
                                    <button
                                        onClick={handleReturnToLogin}
                                        className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                    >
                                        Sign in here
                                    </button>
                                </p>
                            </div>
                        </SpotlightCard>
                    </div>

                    {/* Right Column - Info */}
                    <div className="lg:w-1/3">
                        <div className="space-y-6">
                            {/* Password Tips */}
                            <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                        <Key size={24} className="text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                                            Password Tips
                                        </h3>
                                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                            Create a strong password
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <CheckCircle size={16} className="text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                Use a passphrase
                                            </p>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                                Combine multiple random words
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <AlertCircle size={16} className="text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                Avoid personal info
                                            </p>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                                No names, birthdays, or common words
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <RefreshCw size={16} className="text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                Update regularly
                                            </p>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                                Change password every 90 days
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SpotlightCard>

                            {/* What Happens Next */}
                            <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    After Reset
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-sans font-bold text-green-600 dark:text-green-400">1</span>
                                        </div>
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                Automatic Logout
                                            </p>
                                            <p className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                                All active sessions will end
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-sans font-bold text-blue-600 dark:text-blue-400">2</span>
                                        </div>
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                Re-login Required
                                            </p>
                                            <p className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                                Sign in again on all devices
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-sans font-bold text-purple-600 dark:text-purple-400">3</span>
                                        </div>
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                Security Alert
                                            </p>
                                            <p className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                                Confirmation email will be sent
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SpotlightCard>

                            {/* Support */}
                            <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    Questions?
                                </h3>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-4">
                                    Contact IT support if you encounter any issues
                                </p>
                                <div className="space-y-2">
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        Internal Extension:{' '}
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            5678
                                        </span>
                                    </p>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        Available:{' '}
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            24/7 for password issues
                                        </span>
                                    </p>
                                </div>
                            </SpotlightCard>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-6 border-t border-gray-200 dark:border-white/10 text-center">
                    <p className="text-sm font-sans text-gray-500 dark:text-gray-400">
                        This is a secure password reset process. Never share your reset link with anyone.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;