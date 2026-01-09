import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Lock,
    Key,
    Shield,
    CheckCircle,
    AlertCircle,
    Edit,
    Save,
    X,
    Camera,
    Download,
    Calendar,
    Eye,
    EyeOff,
    Users,
    Briefcase,
    Phone,
    Globe
} from 'lucide-react';
import SpotlightCard from '../../../components/ui/SpotlightCard';
import { useGetMeQuery, useUpdateUserMutation } from '../userApiSlice';
import Loader from '../../../components/ui/Loader';

// Editable Field Component
const EditableField = ({
    label,
    value,
    isEditing,
    type = "text",
    onChange,
    placeholder,
    icon: Icon,
    options = [],
    rows = 3,
    required = false,
    disabled = false
}) => {
    const [isFocused, setIsFocused] = useState(false);

    if (!isEditing) {
        return (
            <div className="space-y-2">
                <p className="text-xs font-sans text-gray-500 dark:text-gray-400">{label}</p>
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                            <Icon size={16} className="text-gray-600 dark:text-gray-400" />
                        </div>
                    )}
                    <p className="font-sans text-gray-900 dark:text-white">
                        {value || <span className="text-gray-400 dark:text-gray-500 italic">Not set</span>}
                    </p>
                </div>
            </div>
        );
    }

    const inputClasses = `w-full px-4 py-3 rounded-lg border ${isFocused ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-300 dark:border-white/10'} bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none transition-all duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

    return (
        <div className="space-y-2">
            <label className="text-xs font-sans font-medium text-gray-900 dark:text-white">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex items-center gap-3">
                {Icon && (
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${disabled ? 'bg-gray-100 dark:bg-white/10' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                        <Icon size={16} className={disabled ? 'text-gray-400' : 'text-blue-600 dark:text-blue-400'} />
                    </div>
                )}
                {type === 'textarea' ? (
                    <textarea
                        value={value || ''}
                        onChange={onChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        rows={rows}
                        placeholder={placeholder}
                        className={inputClasses}
                        disabled={disabled}
                        required={required}
                    />
                ) : type === 'select' ? (
                    <select
                        value={value || ''}
                        onChange={onChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className={inputClasses}
                        disabled={disabled}
                        required={required}
                    >
                        <option value="">Select {label.toLowerCase()}</option>
                        {options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={type}
                        value={value || ''}
                        onChange={onChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        className={inputClasses}
                        disabled={disabled}
                        required={required}
                    />
                )}
            </div>
        </div>
    );
};

// Role Badge Component
const RoleBadge = ({ roles, isEditing, onChange }) => {
    const availableRoles = [
        { value: 'user', label: 'User', color: 'bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-400' },
        { value: 'manager', label: 'Manager', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
        { value: 'admin', label: 'Admin', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' }
    ];

    if (!isEditing) {
        return (
            <div className="flex flex-wrap gap-2">
                {roles?.map(role => {
                    const roleConfig = availableRoles.find(r => r.value === role) || availableRoles[0];
                    return (
                        <span key={role} className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-mono font-medium ${roleConfig.color}`}>
                            <Shield size={12} />
                            {roleConfig.label}
                        </span>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                {availableRoles.map(role => {
                    const isSelected = roles?.includes(role.value);
                    return (
                        <button
                            key={role.value}
                            type="button"
                            onClick={() => {
                                const newRoles = isSelected
                                    ? roles.filter(r => r !== role.value)
                                    : [...(roles || []), role.value];
                                onChange({ target: { value: newRoles } });
                            }}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-mono font-medium transition-all ${isSelected ? role.color : 'bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20'}`}
                        >
                            <Shield size={12} />
                            {role.label}
                            {isSelected && <CheckCircle size={12} className="ml-1" />}
                        </button>
                    );
                })}
            </div>
            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                Click roles to toggle selection
            </p>
        </div>
    );
};

// Email Verification Badge
const EmailVerificationBadge = ({ verified }) => {
    return (
        <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-mono font-medium ${verified ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
            {verified ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
            {verified ? 'Email Verified' : 'Email Not Verified'}
        </span>
    );
};

// Password Strength Indicator
const PasswordStrength = ({ password }) => {
    const calculateStrength = (pass) => {
        let score = 0;
        if (pass.length >= 6) score++;
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
                <span className={`text-sm font-sans font-medium ${strength >= 4 ? 'text-green-600 dark:text-green-400' : strength >= 2 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
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
                        {password.length >= 6 ? (
                            <CheckCircle size={12} className="text-green-500" />
                        ) : (
                            <AlertCircle size={12} className="text-red-500" />
                        )}
                        <span className={password.length >= 6 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            At least 6 characters
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        {/[A-Z]/.test(password) ? (
                            <CheckCircle size={12} className="text-green-500" />
                        ) : (
                            <AlertCircle size={12} className="text-red-500" />
                        )}
                        <span className={/[A-Z]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            Uppercase letter
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

// Admin Profile Component
const AdminProfile = () => {
    const { data: user, isLoading, isError } = useGetMeQuery();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [profileData, setProfileData] = useState({
        _id: '',
        email: '',
        firstName: '',
        lastName: '',
        userName: '',
        password: '',
        roles: [],
        emailVerified: false,
        lastLogin: '',
        createdAt: '',
        phone: '',
        department: '',
        jobTitle: '',
        timezone: '',
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName || '',
                password: '',
                roles: user.roles,
                emailVerified: user.emailVerified,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
                phone: user.phone || '',
                department: user.department || '',
                jobTitle: user.jobTitle || '',
                timezone: user.timezone || '',
            });
        }
    }, [user]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleInputChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        // Validate required fields
        if (!profileData.email || !profileData.firstName || !profileData.lastName) {
            alert('Please fill in all required fields');
            return;
        }

        // Validate email format
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(profileData.email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Validate password if changed
        if (profileData.password && profileData.password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        try {
            await updateUser({
                id: profileData._id,
                ...profileData,
                // Only send password if it's been set
                ...(profileData.password ? { password: profileData.password } : {})
            }).unwrap();

            alert('Profile updated successfully!');
            setIsEditing(false);
            setProfileData(prev => ({ ...prev, password: '' })); // Clear password field
        } catch (err) {
            alert(err?.data?.message || 'Failed to update profile');
        }
    };

    const handleCancel = () => {
        if (user) {
            setProfileData({
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName || '',
                password: '',
                roles: user.roles,
                emailVerified: user.emailVerified,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
                phone: user.phone || '',
                department: user.department || '',
                jobTitle: user.jobTitle || '',
                timezone: user.timezone || '',
            });
        }
        setIsEditing(false);
    };

    const handlePasswordChange = () => {
        const newPassword = prompt('Enter new password (min 6 characters):');
        if (newPassword && newPassword.length >= 6) {
            handleInputChange('password', newPassword);
            setIsEditing(true); // Switch to edit mode to see the saving options
        } else if (newPassword) {
            alert('Password must be at least 6 characters long');
        }
    };

    const handleExportData = () => {
        const dataStr = JSON.stringify(profileData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'user-profile-data.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    if (isLoading) return <div className='h-screen relative'><Loader /></div>;
    if (isError) return <div className="p-8 text-center text-red-500">Error loading profile. Please try again later.</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-void dark:via-dark-800 dark:to-void p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-2 block">
                        USER_PROFILE
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Account Settings
                            </h1>
                            <p className="font-sans text-gray-600 dark:text-gray-400">
                                Manage your account information and security
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleExportData}
                                className="px-4 py-2 rounded-lg font-sans font-medium transition-colors border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2"
                            >
                                <Download size={18} />
                                Export Data
                            </button>
                            {isEditing ? (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 rounded-lg font-sans font-medium transition-colors border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2"
                                    >
                                        <X size={18} />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isUpdating}
                                        className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isUpdating ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2"
                                >
                                    <Edit size={18} />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Main Content Area */}
                    <SpotlightCard isEditing={isEditing} className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-8">
                        <div className="space-y-8">
                            {/* Profile Overview */}
                            <div className="flex flex-col md:flex-row gap-6 mb-8">
                                {/* Avatar & Basic Info */}
                                <div className="flex flex-col items-center">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full border-4 border-white dark:border-dark-800 shadow-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                                            {profileData.avatar ? (
                                                <img
                                                    src={profileData.avatar}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-3xl font-serif font-bold text-white">
                                                        {profileData.firstName?.[0]}{profileData.lastName?.[0]}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {isEditing && (
                                            <button
                                                onClick={() => alert('Avatar upload would open here')}
                                                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg"
                                            >
                                                <Camera size={16} className="text-white" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="mt-4 text-center">
                                        <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                                            {profileData.firstName} {profileData.lastName}
                                        </h2>
                                        <p className="font-sans text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            {profileData.email}
                                        </p>
                                        <div className="flex flex-wrap gap-2 justify-center mb-3">
                                            <RoleBadge
                                                roles={profileData.roles}
                                                isEditing={isEditing}
                                                onChange={(e) => handleInputChange('roles', e.target.value)}
                                            />
                                        </div>
                                        <EmailVerificationBadge
                                            verified={profileData.emailVerified}
                                        />
                                    </div>
                                </div>

                                {/* Account Stats */}
                                <div className="flex-1 grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl border border-gray-200 dark:border-white/10">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                <Calendar size={16} className="text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Member Since</p>
                                                <p className="font-sans text-sm font-medium text-gray-900 dark:text-white">
                                                    {formatDate(profileData.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl border border-gray-200 dark:border-white/10">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                <Shield size={16} className="text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Last Login</p>
                                                <p className="font-sans text-sm font-medium text-gray-900 dark:text-white">
                                                    {formatDate(profileData.lastLogin)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl border border-gray-200 dark:border-white/10">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                                <Users size={16} className="text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-sans text-gray-500 dark:text-gray-400">User ID</p>
                                                <p className="font-sans text-sm font-medium text-gray-900 dark:text-white font-mono">
                                                    {profileData._id?.slice(-6)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl border border-gray-200 dark:border-white/10">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                                <Key size={16} className="text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Account Status</p>
                                                <p className="font-sans text-sm font-medium text-gray-900 dark:text-white">
                                                    Active
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Password Management - Integrated into profile */}
                            <div className="mb-8">
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    Password Management
                                </h3>

                                {isEditing ? (
                                    <div className="space-y-6">
                                        <EditableField
                                            label="New Password"
                                            value={profileData.password}
                                            isEditing={isEditing}
                                            type={showPassword ? "text" : "password"}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            placeholder="Enter new password (min 6 characters)"
                                            icon={Lock}
                                        />

                                        {profileData.password && (
                                            <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                                <PasswordStrength password={profileData.password} />
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="flex items-center gap-2 text-sm font-sans text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                {showPassword ? 'Hide Password' : 'Show Password'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleInputChange('password', '')}
                                                className="text-sm font-sans text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                            >
                                                Clear Password
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-sans font-medium text-gray-900 dark:text-white mb-1">
                                                    Password Security
                                                </h4>
                                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                                    Last changed on {formatDate(profileData.createdAt)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={handlePasswordChange}
                                                className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                                            >
                                                Change Password
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Required Information */}
                            <div>
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    Required Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <EditableField
                                        label="Email Address"
                                        value={profileData.email}
                                        isEditing={isEditing}
                                        type="email"
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="admin@hotel.com"
                                        icon={Mail}
                                        required={true}
                                    />
                                    <EditableField
                                        label="Username"
                                        value={profileData.userName}
                                        isEditing={isEditing}
                                        onChange={(e) => handleInputChange('userName', e.target.value)}
                                        placeholder="username"
                                        icon={User}
                                    />
                                    <EditableField
                                        label="First Name"
                                        value={profileData.firstName}
                                        isEditing={isEditing}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        placeholder="Michael"
                                        icon={User}
                                        required={true}
                                    />
                                    <EditableField
                                        label="Last Name"
                                        value={profileData.lastName}
                                        isEditing={isEditing}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        placeholder="Chen"
                                        icon={User}
                                        required={true}
                                    />
                                </div>
                            </div>

                            {/* Roles Section */}
                            <div>
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    User Roles
                                </h3>
                                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                    <div className="mb-3">
                                        <label className="text-sm font-sans font-medium text-gray-900 dark:text-white">
                                            Roles *
                                        </label>
                                        <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mb-3">
                                            Select user roles (at least one required)
                                        </p>
                                    </div>
                                    <RoleBadge
                                        roles={profileData.roles}
                                        isEditing={isEditing}
                                        onChange={(e) => handleInputChange('roles', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div>
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    Additional Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <EditableField
                                        label="Phone Number"
                                        value={profileData.phone}
                                        isEditing={isEditing}
                                        type="tel"
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        placeholder="+1 (555) 123-4567"
                                        icon={Phone}
                                    />
                                    <EditableField
                                        label="Department"
                                        value={profileData.department}
                                        isEditing={isEditing}
                                        onChange={(e) => handleInputChange('department', e.target.value)}
                                        placeholder="Management"
                                        icon={Users}
                                    />
                                    <EditableField
                                        label="Job Title"
                                        value={profileData.jobTitle}
                                        isEditing={isEditing}
                                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                                        placeholder="System Administrator"
                                        icon={Briefcase}
                                    />
                                    <EditableField
                                        label="Timezone"
                                        value={profileData.timezone}
                                        isEditing={isEditing}
                                        onChange={(e) => handleInputChange('timezone', e.target.value)}
                                        placeholder="America/New_York"
                                        icon={Globe}
                                    />
                                </div>
                            </div>
                        </div>
                    </SpotlightCard>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
