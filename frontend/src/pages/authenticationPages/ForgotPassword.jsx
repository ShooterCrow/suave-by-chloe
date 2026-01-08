import React, { useState } from 'react';
import {
    Mail,
    Key,
    ArrowLeft,
    ArrowRight,
    Shield,
    Clock,
    Smartphone,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

import { Helmet } from 'react-helmet-async';
import SpotlightCard from '../../components/ui/SpotlightCard';


// Forgot Password Component
const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        verificationCode: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (step === 1) {
            setEmailSent(true);
            setStep(2);
        } else if (step === 2) {
            setStep(3);
        } else {
            alert('Password reset successful!');
            window.location.hash = '#login';
        }

        setLoading(false);
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            window.location.hash = '#login';
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleResendCode = () => {
        setLoading(true);
        setTimeout(() => {
            alert('Verification code resent!');
            setLoading(false);
        }, 1000);
    };

    const handleTryAnotherMethod = () => {
        alert('Alternative recovery methods would appear here');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-void dark:via-dark-800 dark:to-void p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <Helmet>
                <title>Forgot Password | Suave By Chloe</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center">
                            <Key size={24} className="text-white" />
                        </div>
                        <span className="font-mono text-sm text-blue-500 tracking-widest uppercase">
                            PASSWORD_RECOVERY
                        </span>
                    </div>
                    <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Reset Your Password
                    </h1>
                    <p className="font-sans text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Follow the steps below to securely reset your password and regain access to your account
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Form */}
                    <div className="lg:w-2/3">
                        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-8">
                            {/* Progress Steps */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                                            Step {step} of 3
                                        </h2>
                                        <p className="font-sans text-gray-600 dark:text-gray-400">
                                            {step === 1 ? 'Verify Identity' : step === 2 ? 'Enter Code' : 'New Password'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3].map((stepNum) => (
                                            <div key={stepNum} className="flex items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= stepNum
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                                                    }`}>
                                                    {stepNum}
                                                </div>
                                                {stepNum < 3 && (
                                                    <div className={`w-8 h-1 ${step > stepNum ? 'bg-blue-600' : 'bg-gray-200 dark:bg-white/10'}`}></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {step === 1 && (
                                    <div className="space-y-6">
                                        <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-900/20">
                                            <div className="flex items-start gap-3">
                                                <Shield size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                                                <div>
                                                    <h4 className="font-sans font-medium text-gray-900 dark:text-white mb-1">
                                                        Security Verification
                                                    </h4>
                                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                                        Enter your email address to receive a verification code
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                                Email Address *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                    <Mail size={20} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleChange('email', e.target.value)}
                                                    placeholder="staff@hotel.com"
                                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mt-2">
                                                Must be your registered company email
                                            </p>
                                        </div>

                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={handleTryAnotherMethod}
                                                className="text-sm font-sans text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center justify-center gap-2 mx-auto"
                                            >
                                                <Smartphone size={16} />
                                                Try another verification method
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-6">
                                        <div className="p-4 rounded-lg border border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-900/20">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle size={20} className="text-green-600 dark:text-green-400 mt-0.5" />
                                                <div>
                                                    <h4 className="font-sans font-medium text-gray-900 dark:text-white mb-1">
                                                        Verification Code Sent
                                                    </h4>
                                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                                        We've sent a 6-digit code to {formData.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                                Enter 6-digit Code *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                    <Key size={20} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={formData.verificationCode}
                                                    onChange={(e) => handleChange('verificationCode', e.target.value)}
                                                    placeholder="123456"
                                                    maxLength="6"
                                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg tracking-widest text-center"
                                                    required
                                                />
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                                    Code expires in 15 minutes
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={handleResendCode}
                                                    disabled={loading}
                                                    className="text-sm font-sans text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                                >
                                                    Resend code
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-lg border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-900/20">
                                            <div className="flex items-start gap-3">
                                                <AlertCircle size={20} className="text-amber-600 dark:text-amber-400 mt-0.5" />
                                                <div>
                                                    <h4 className="font-sans font-medium text-gray-900 dark:text-white mb-1">
                                                        Can't find the email?
                                                    </h4>
                                                    <ul className="text-sm font-sans text-gray-600 dark:text-gray-400 space-y-1">
                                                        <li>• Check your spam or junk folder</li>
                                                        <li>• Ensure you entered the correct email</li>
                                                        <li>• Wait a few minutes and try again</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-6">
                                        <div className="p-4 rounded-lg border border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-900/20">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle size={20} className="text-green-600 dark:text-green-400 mt-0.5" />
                                                <div>
                                                    <h4 className="font-sans font-medium text-gray-900 dark:text-white mb-1">
                                                        Verification Successful
                                                    </h4>
                                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                                        Now create your new password
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                                New Password *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                    <Key size={20} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    value={formData.newPassword}
                                                    onChange={(e) => handleChange('newPassword', e.target.value)}
                                                    placeholder="Create a strong password"
                                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                                Confirm New Password *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                    <Key size={20} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                                    placeholder="Re-enter your new password"
                                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                            {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                                                <p className="text-sm font-sans text-red-600 dark:text-red-400 mt-2">
                                                    Passwords do not match
                                                </p>
                                            )}
                                        </div>

                                        <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-900/20">
                                            <div className="space-y-2">
                                                <h4 className="font-sans font-medium text-gray-900 dark:text-white">
                                                    Password Requirements
                                                </h4>
                                                <ul className="text-sm font-sans text-gray-600 dark:text-gray-400 space-y-1">
                                                    <li>• Minimum 8 characters</li>
                                                    <li>• At least one uppercase letter</li>
                                                    <li>• At least one number</li>
                                                    <li>• At least one special character</li>
                                                    <li>• Cannot be your last 3 passwords</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between pt-4">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="px-6 py-3 rounded-lg font-sans font-medium transition-colors border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2"
                                    >
                                        <ArrowLeft size={18} />
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || (step === 3 && formData.newPassword !== formData.confirmPassword)}
                                        className="px-6 py-3 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                {step === 1 ? 'Sending...' : step === 2 ? 'Verifying...' : 'Resetting...'}
                                            </>
                                        ) : step === 3 ? (
                                            'Reset Password'
                                        ) : (
                                            'Continue'
                                        )}
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </form>

                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 text-center">
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                    Remember your password?{' '}
                                    <button
                                        onClick={() => window.location.hash = '#login'}
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
                            {/* Security Info */}
                            <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <Shield size={24} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                                            Security Measures
                                        </h3>
                                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                            Protecting your account
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                            <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                Email Verification
                                            </p>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                                Code sent to registered email
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <Clock size={16} className="text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                Time-limited Code
                                            </p>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                                Expires in 15 minutes
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                            <Key size={16} className="text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                Password History
                                            </p>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                                Cannot reuse old passwords
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SpotlightCard>

                            {/* Next Steps */}
                            <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    What Happens Next?
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-sans font-bold text-blue-600 dark:text-blue-400">1</span>
                                        </div>
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                Verification Email
                                            </p>
                                            <p className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                                Check your inbox for the code
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-sans font-bold text-blue-600 dark:text-blue-400">2</span>
                                        </div>
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                Enter Code
                                            </p>
                                            <p className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                                Use the 6-digit verification code
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-sans font-bold text-blue-600 dark:text-blue-400">3</span>
                                        </div>
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                Create New Password
                                            </p>
                                            <p className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                                Follow password requirements
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SpotlightCard>

                            {/* Contact Support */}
                            <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    Need Help?
                                </h3>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-4">
                                    Contact IT support for assistance
                                </p>
                                <div className="space-y-2">
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        Email:{' '}
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            it-support@hotel.com
                                        </span>
                                    </p>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        Phone:{' '}
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            +1 (555) 987-6543
                                        </span>
                                    </p>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        Available 24/7 for urgent issues
                                    </p>
                                </div>
                            </SpotlightCard>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-6 border-t border-gray-200 dark:border-white/10 text-center">
                    <p className="text-sm font-sans text-gray-500 dark:text-gray-400">
                        For security reasons, password reset requests are logged and monitored.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;