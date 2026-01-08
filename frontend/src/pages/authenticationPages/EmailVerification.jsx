import React, { useState, useEffect } from 'react';
import {
    Mail,
    CheckCircle,
    AlertCircle,
    RefreshCw,
    Shield,
    Clock,
    ArrowRight,
    Smartphone,
    ExternalLink
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import SpotlightCard from '../../components/ui/SpotlightCard';


// Status Badge Component
const StatusBadge = ({ type, children }) => {
    const getTypeConfig = (type) => {
        const configs = {
            'success': {
                color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                icon: <CheckCircle size={14} />
            },
            'warning': {
                color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
                icon: <Clock size={14} />
            },
            'error': {
                color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                icon: <AlertCircle size={14} />
            },
            'pending': {
                color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                icon: <Mail size={14} />
            }
        };
        return configs[type] || configs.pending;
    };

    const config = getTypeConfig(type);

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${config.color} text-sm font-sans font-medium`}>
            {config.icon}
            {children}
        </span>
    );
};

// Email Verification Component
const EmailVerification = () => {
    const [loading, setLoading] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, verifying, success, expired, invalid
    const [countdown, setCountdown] = useState(30);
    const [email, setEmail] = useState('john.doe@hotel.com');

    // Countdown for auto-redirect
    useEffect(() => {
        if (verificationStatus === 'success' && countdown > 0) {
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleRedirect();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [verificationStatus, countdown]);

    // Simulate verification process on mount
    useEffect(() => {
        const simulateVerification = async () => {
            setLoading(true);

            // Check URL parameters (simulated)
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');

            await new Promise(resolve => setTimeout(resolve, 2000));

            if (token === 'valid') {
                setVerificationStatus('success');
            } else if (token === 'expired') {
                setVerificationStatus('expired');
            } else {
                setVerificationStatus('invalid');
            }

            setLoading(false);
        };

        simulateVerification();
    }, []);

    const handleResendEmail = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert('Verification email resent!');
        setLoading(false);
    };

    const handleRedirect = () => {
        window.location.hash = '#login';
    };

    const handleTryAnotherEmail = () => {
        setEmail('');
        // In a real app, this would allow entering a different email
        alert('Enter different email functionality would appear here');
    };

    const renderContent = () => {
        switch (verificationStatus) {
            case 'success':
                return (
                    <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Email Verified Successfully!
                        </h2>
                        <p className="font-sans text-gray-600 dark:text-gray-400 mb-6">
                            Your email address has been verified. Your account is now fully activated.
                        </p>
                        <div className="space-y-4">
                            <button
                                onClick={handleRedirect}
                                className="w-full py-3 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center justify-center gap-2"
                            >
                                Continue to Dashboard
                                <ArrowRight size={18} />
                            </button>
                            <p className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                Redirecting in {countdown} seconds...
                            </p>
                        </div>
                    </div>
                );

            case 'expired':
                return (
                    <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-6">
                            <Clock size={40} className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Verification Link Expired
                        </h2>
                        <p className="font-sans text-gray-600 dark:text-gray-400 mb-6">
                            This verification link has expired. Please request a new verification email.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={handleResendEmail}
                                disabled={loading}
                                className="w-full py-3 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Sending...
                                    </>
                                ) : (
                                    'Send New Verification Email'
                                )}
                            </button>
                            <button
                                onClick={handleTryAnotherEmail}
                                className="w-full py-3 rounded-lg font-sans font-medium transition-colors border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                            >
                                Try Another Email Address
                            </button>
                        </div>
                    </div>
                );

            case 'invalid':
                return (
                    <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={40} className="text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Invalid Verification Link
                        </h2>
                        <p className="font-sans text-gray-600 dark:text-gray-400 mb-6">
                            This verification link is invalid or has already been used.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={handleResendEmail}
                                disabled={loading}
                                className="w-full py-3 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Sending...
                                    </>
                                ) : (
                                    'Request New Verification Email'
                                )}
                            </button>
                            <button
                                onClick={() => window.location.hash = '#support'}
                                className="text-sm font-sans text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                            >
                                Contact Support
                            </button>
                        </div>
                    </div>
                );

            default: // pending/verifying
                return (
                    <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-6">
                            {loading ? (
                                <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Mail size={40} className="text-blue-600 dark:text-blue-400" />
                            )}
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Verifying Your Email
                        </h2>
                        <p className="font-sans text-gray-600 dark:text-gray-400 mb-6">
                            We're verifying your email address. This usually takes just a moment...
                        </p>
                        <div className="space-y-4">
                            <StatusBadge type="pending">
                                Verifying {email}
                            </StatusBadge>
                            <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2">
                                <div className={`bg-blue-600 h-2 rounded-full transition-all duration-500 ${loading ? 'w-3/4' : 'w-full'}`}></div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-void dark:via-dark-800 dark:to-void p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <Helmet>
                <title>Verify Email | Suave By Chloe</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center">
                            <Shield size={24} className="text-white" />
                        </div>
                        <span className="font-mono text-sm text-blue-500 tracking-widest uppercase">
                            EMAIL_VERIFICATION
                        </span>
                    </div>
                    <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Verify Your Email
                    </h1>
                    <p className="font-sans text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Email verification is required to secure your account and ensure you receive important notifications
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Verification Status */}
                    <div className="lg:w-1/2">
                        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-8">
                            {renderContent()}

                            {/* Additional Options */}
                            {(verificationStatus === 'pending' || verificationStatus === 'verifying') && (
                                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
                                    <div className="space-y-4">
                                        <button
                                            onClick={handleResendEmail}
                                            disabled={loading}
                                            className="w-full py-3 rounded-lg font-sans font-medium transition-colors border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center gap-2"
                                        >
                                            <RefreshCw size={18} />
                                            Resend Verification Email
                                        </button>
                                        <p className="text-xs font-sans text-gray-500 dark:text-gray-400 text-center">
                                            Didn't receive the email? Check spam folder or resend.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </SpotlightCard>
                    </div>

                    {/* Right Column - Info & Support */}
                    <div className="lg:w-1/2">
                        <div className="space-y-6">
                            {/* Why Verify? */}
                            <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                        <Shield size={24} className="text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                                            Why Verify?
                                        </h3>
                                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                            Security and account benefits
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
                                                Enhanced Security
                                            </p>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                                Prevent unauthorized account access
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                            <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                Password Recovery
                                            </p>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                                Reset password if you forget it
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                            <CheckCircle size={16} className="text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                Important Notifications
                                            </p>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                                Receive system alerts and updates
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SpotlightCard>

                            {/* Troubleshooting */}
                            <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    Common Issues
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                                            <AlertCircle size={16} className="text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                Can't find the email?
                                            </p>
                                            <p className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                                Check spam/junk folder or request a new email
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                            <Clock size={16} className="text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                Link expired?
                                            </p>
                                            <p className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                                Verification links expire after 24 hours
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                                            <ExternalLink size={16} className="text-red-600 dark:text-red-400" />
                                        </div>
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                Wrong email address?
                                            </p>
                                            <p className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                                Contact support to update your email
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SpotlightCard>

                            {/* Alternative Methods */}
                            <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Smartphone size={24} className="text-blue-600 dark:text-blue-400" />
                                    <div>
                                        <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                                            Alternative Verification
                                        </h3>
                                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                            Other ways to verify your identity
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <button className="w-full px-4 py-3 rounded-lg font-sans font-medium transition-colors border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center gap-2">
                                        <Smartphone size={18} />
                                        Verify via SMS
                                    </button>
                                    <button className="w-full px-4 py-3 rounded-lg font-sans font-medium transition-colors border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center gap-2">
                                        <Shield size={18} />
                                        Contact Admin for Manual Verification
                                    </button>
                                </div>
                            </SpotlightCard>

                            {/* Support */}
                            <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    Need Help Verifying?
                                </h3>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-4">
                                    Our support team can help with verification issues
                                </p>
                                <div className="space-y-2">
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        Email:{' '}
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            verification-support@hotel.com
                                        </span>
                                    </p>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        Response Time:{' '}
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            Usually within 1 hour
                                        </span>
                                    </p>
                                </div>
                            </SpotlightCard>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-6 border-t border-gray-200 dark:border-white/10">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm font-sans text-gray-500 dark:text-gray-400">
                            © 2024 Hotel Management System. Email verification required for all accounts.
                        </p>
                        <div className="flex items-center gap-4">
                            <button className="text-sm font-sans text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                Privacy Policy
                            </button>
                            <button className="text-sm font-sans text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                Security Information
                            </button>
                            <button className="text-sm font-sans text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;