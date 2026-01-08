import React, { useState } from 'react';
import {
    User,
    Mail,
    Lock,
    Phone,
    Briefcase,
    Building,
    Eye,
    EyeOff,
    CheckCircle,
    XCircle,
    ArrowRight,
    Shield,
    Sparkles,
    AlertCircle
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import SpotlightCard from '../../components/ui/SpotlightCard';


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
            {password.length > 0 && (
                <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                    <div className="flex items-center gap-1">
                        {password.length >= 8 ? (
                            <CheckCircle size={12} className="text-green-500" />
                        ) : (
                            <XCircle size={12} className="text-red-500" />
                        )}
                        <span className={password.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            At least 8 characters
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        {/[A-Z]/.test(password) ? (
                            <CheckCircle size={12} className="text-green-500" />
                        ) : (
                            <XCircle size={12} className="text-red-500" />
                        )}
                        <span className={/[A-Z]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            Uppercase letter
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        {/[0-9]/.test(password) ? (
                            <CheckCircle size={12} className="text-green-500" />
                        ) : (
                            <XCircle size={12} className="text-red-500" />
                        )}
                        <span className={/[0-9]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            Number
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        {/[^A-Za-z0-9]/.test(password) ? (
                            <CheckCircle size={12} className="text-green-500" />
                        ) : (
                            <XCircle size={12} className="text-red-500" />
                        )}
                        <span className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            Special character
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

import { useSignupMutation } from './authApiSlice';

// Register Component
const Register = () => {
    const [signup, { isLoading }] = useSignupMutation();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        // Step 1: Personal Information
        firstName: '',
        lastName: '',
        email: '',
        phone: '',

        // Step 2: Professional Information
        jobTitle: '',
        department: '',
        hotelId: '',
        employeeId: '',

        // Step 3: Account Security
        password: '',
        confirmPassword: '',
        termsAccepted: false,
        privacyAccepted: false,
        marketingAccepted: false
    });

    const departments = [
        'Front Office',
        'Housekeeping',
        'Food & Beverage',
        'Management',
        'Sales & Marketing',
        'Finance',
        'Maintenance',
        'Security'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
        } else {
            try {
                await signup(formData).unwrap();
                alert('Registration request submitted! Please check your email for verification.');
                window.location.href = '/login';
            } catch (err) {
                alert(err?.data?.message || 'Failed to register');
            }
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleLogin = () => {
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-void dark:via-dark-800 dark:to-void p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <Helmet>
                <title>Register | Suave By Chloe</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center">
                            <User size={24} className="text-white" />
                        </div>
                        <span className="font-mono text-sm text-blue-500 tracking-widest uppercase">
                            HOTEL_REGISTRATION
                        </span>
                    </div>
                    <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Join Our Team
                    </h1>
                    <p className="font-sans text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Request access to the hotel management system. Your application will be reviewed by administration.
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
                                            Registration Request
                                        </h2>
                                        <p className="font-sans text-gray-600 dark:text-gray-400">
                                            Step {step} of 3 • {step === 1 ? 'Personal Info' : step === 2 ? 'Professional Info' : 'Account Setup'}
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                                    First Name *
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                        <User size={20} className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={formData.firstName}
                                                        onChange={(e) => handleChange('firstName', e.target.value)}
                                                        placeholder="John"
                                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                                    Last Name *
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                        <User size={20} className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={formData.lastName}
                                                        onChange={(e) => handleChange('lastName', e.target.value)}
                                                        placeholder="Doe"
                                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        required
                                                    />
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
                                                    placeholder="john.doe@hotel.com"
                                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mt-2">
                                                Must be your company email address
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                                Phone Number *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                    <Phone size={20} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => handleChange('phone', e.target.value)}
                                                    placeholder="+1 (555) 123-4567"
                                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                                Job Title *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                    <Briefcase size={20} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={formData.jobTitle}
                                                    onChange={(e) => handleChange('jobTitle', e.target.value)}
                                                    placeholder="Front Desk Manager"
                                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                                Department *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                    <Building size={20} className="text-gray-400" />
                                                </div>
                                                <select
                                                    value={formData.department}
                                                    onChange={(e) => handleChange('department', e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                >
                                                    <option value="">Select Department</option>
                                                    {departments.map(dept => (
                                                        <option key={dept} value={dept}>{dept}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                                    Hotel ID
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.hotelId}
                                                    onChange={(e) => handleChange('hotelId', e.target.value)}
                                                    placeholder="HOTEL-001"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                                    Employee ID
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.employeeId}
                                                    onChange={(e) => handleChange('employeeId', e.target.value)}
                                                    placeholder="EMP-00123"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-900/20">
                                            <div className="flex items-start gap-3">
                                                <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                                                <div>
                                                    <h4 className="font-sans font-medium text-gray-900 dark:text-white mb-1">
                                                        Verification Required
                                                    </h4>
                                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                                        Your registration request will be verified by administration. You'll receive an email once your account is approved.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                                Password *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                    <Lock size={20} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={formData.password}
                                                    onChange={(e) => handleChange('password', e.target.value)}
                                                    placeholder="Create a strong password"
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
                                                <PasswordStrength password={formData.password} />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                                Confirm Password *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                    <Lock size={20} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                                    placeholder="Re-enter your password"
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
                                            {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                                <p className="text-sm font-sans text-red-600 dark:text-red-400 mt-2">
                                                    Passwords do not match
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    id="terms"
                                                    checked={formData.termsAccepted}
                                                    onChange={(e) => handleChange('termsAccepted', e.target.checked)}
                                                    className="w-4 h-4 mt-1 rounded border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-blue-600 focus:ring-blue-500"
                                                    required
                                                />
                                                <label htmlFor="terms" className="text-sm font-sans text-gray-900 dark:text-white">
                                                    I agree to the{' '}
                                                    <button className="text-blue-600 dark:text-blue-400 hover:underline">
                                                        Terms of Service
                                                    </button>{' '}
                                                    and{' '}
                                                    <button className="text-blue-600 dark:text-blue-400 hover:underline">
                                                        Acceptable Use Policy
                                                    </button>
                                                </label>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    id="privacy"
                                                    checked={formData.privacyAccepted}
                                                    onChange={(e) => handleChange('privacyAccepted', e.target.checked)}
                                                    className="w-4 h-4 mt-1 rounded border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-blue-600 focus:ring-blue-500"
                                                    required
                                                />
                                                <label htmlFor="privacy" className="text-sm font-sans text-gray-900 dark:text-white">
                                                    I have read and understood the{' '}
                                                    <button className="text-blue-600 dark:text-blue-400 hover:underline">
                                                        Privacy Policy
                                                    </button>
                                                </label>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    id="marketing"
                                                    checked={formData.marketingAccepted}
                                                    onChange={(e) => handleChange('marketingAccepted', e.target.checked)}
                                                    className="w-4 h-4 mt-1 rounded border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label htmlFor="marketing" className="text-sm font-sans text-gray-900 dark:text-white">
                                                    I agree to receive important system updates and announcements via email
                                                </label>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-lg border border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-900/20">
                                            <div className="flex items-start gap-3">
                                                <Shield size={20} className="text-green-600 dark:text-green-400 mt-0.5" />
                                                <div>
                                                    <h4 className="font-sans font-medium text-gray-900 dark:text-white mb-1">
                                                        Security Notice
                                                    </h4>
                                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                                        Your account will be created with limited access. Full access will be granted after administrative approval.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between pt-4">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        disabled={step === 1}
                                        className={`px-6 py-3 rounded-lg font-sans font-medium transition-colors ${step === 1
                                            ? 'border border-gray-300 dark:border-white/10 text-gray-400 cursor-not-allowed'
                                            : 'border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || (step === 3 && formData.password !== formData.confirmPassword)}
                                        className="px-6 py-3 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Processing...
                                            </>
                                        ) : step === 3 ? (
                                            'Submit Request'
                                        ) : (
                                            'Continue'
                                        )}
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </form>

                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 text-center">
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                    Already have an account?{' '}
                                    <button
                                        onClick={handleLogin}
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
                            {/* Requirements */}
                            <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                        <Sparkles size={24} className="text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                                            Requirements
                                        </h3>
                                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                            What you'll need
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
                                                Company Email
                                            </p>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                                Must be your hotel email address
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <CheckCircle size={16} className="text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                Employment Verification
                                            </p>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                                Verified by administration
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <CheckCircle size={16} className="text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                Strong Password
                                            </p>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                                Minimum 8 characters with complexity
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SpotlightCard>

                            {/* Processing Time */}
                            <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    Processing Timeline
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                            <span className="text-sm font-sans font-bold text-green-600 dark:text-green-400">1</span>
                                        </div>
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                Submit Request
                                            </p>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                                Immediate
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                            <span className="text-sm font-sans font-bold text-amber-600 dark:text-amber-400">2</span>
                                        </div>
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                Admin Review
                                            </p>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                                24-48 hours
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <span className="text-sm font-sans font-bold text-blue-600 dark:text-blue-400">3</span>
                                        </div>
                                        <div>
                                            <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                Account Activation
                                            </p>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                                After approval
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SpotlightCard>

                            {/* Support */}
                            <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    Need Assistance?
                                </h3>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-4">
                                    Contact our HR department for help with registration
                                </p>
                                <div className="space-y-2">
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        Email:{' '}
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            hr@hotel.com
                                        </span>
                                    </p>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        Internal:{' '}
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            Ext. 1234
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
                        This system is for authorized hotel personnel only. Unauthorized access is prohibited.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;