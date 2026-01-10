import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Save,
    Building,
    Phone,
    CreditCard,
    Shield,
    FileText,
    Users,
    Lock,
    Database,
    Upload,
    Download,
    Copy,
    Eye,
    Check,
    X,
    AlertCircle,
    Edit,
    Trash2,
    Plus,
    Clock,
    Percent,
    Receipt,
    Mail as MailIcon,
    Code,
    Palette,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import SpotlightCard from '../../../components/ui/SpotlightCard';
import Loader from '../../../components/ui/Loader';
import {
    useGetSettingsQuery,
    useUpdateSettingsMutation,
    useDeleteGalleryImageMutation
} from '../settingsApiSlice';
import { toast } from 'react-hot-toast';
import HotelInfoSettings from '../../../components/ui/settingsui/HotelInfoSettings';
import TaxesFeesSettings from '../../../components/ui/settingsui/TaxesFeesSettings';
import PoliciesSettings from '../../../components/ui/settingsui/PoliciesSettings';
import EmailTemplatesSettings from '../../../components/ui/settingsui/EmailTemplatesSettings';

// Main AdminSettings Component
const AdminSettings = () => {
    const [activeSection, setActiveSection] = useState('hotel-info');
    const { data: settings, isLoading, isError, error, refetch } = useGetSettingsQuery();
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();
    const [deleteImage] = useDeleteGalleryImageMutation();

    // Handle setting updates from child components
    const handleUpdate = async ({ hotelInfo, logo, gallery, taxesAndFees, policies, emailTemplates }) => {
        alert()
        try {
            // Prepare update data based on what's being updated
            const updateData = {};

            if (hotelInfo !== undefined) {
                updateData.hotelInfo = hotelInfo;
            }
            if (logo !== undefined) {
                updateData.logo = logo;
            }
            if (gallery !== undefined) {
                updateData.gallery = gallery;
            }
            if (taxesAndFees !== undefined) {
                updateData.taxesAndFees = taxesAndFees;
            }
            if (policies !== undefined) {
                updateData.policies = policies;
            }
            if (emailTemplates !== undefined) {
                updateData.emailTemplates = emailTemplates;
            }

            // Call the updateSettings mutation with the prepared data
            await updateSettings(updateData).unwrap();

            // Refetch settings to get the latest data
            await refetch();

            toast.success('Settings updated successfully');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update settings');
        }
    };

    // Handle gallery image deletion
    const handleDeleteGalleryImage = async (publicId) => {
        try {
            await deleteImage(publicId).unwrap();
            // Refetch settings to get updated gallery
            await refetch();
            toast.success('Image deleted successfully');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to delete image');
        }
    };

    const sections = [
        { id: 'hotel-info', label: 'Hotel Information', icon: Building },
        { id: 'taxes-fees', label: 'Taxes & Fees', icon: Receipt },
        { id: 'policies', label: 'Policies', icon: FileText },
        { id: 'email-templates', label: 'Email Templates', icon: MailIcon },
        { id: 'users', label: 'Users & Permissions', icon: Users },
        { id: 'security', label: 'Security', icon: Lock },
        // { id: 'integrations', label: 'Integrations', icon: Code },
        // { id: 'appearance', label: 'Appearance', icon: Palette }
    ];

    const handleSaveAll = () => {
        toast.success('All settings are auto-synced on save');
    };

    const handleBackup = () => {
        toast.loading('Settings backup initiated...');
    };

    const handleRestore = () => {
        toast.loading('Settings restore dialog opened...');
    };

    if (isLoading) return <Loader />;
    if (isError) return <div className="p-8 text-center text-red-500">Error loading settings: {error?.data?.message || 'Unknown error'}</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-void p-4 sm:p-6 lg:p-8">
            <Helmet>
                <title>Settings | Suave By Chloe</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-2 block">
                        ADMIN_SETTINGS
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="min-w-0">
                            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Hotel Settings
                            </h1>
                            <p className="font-sans text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                Configure hotel information, policies, and system settings
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <Button
                                onClick={handleBackup}
                                variant="secondary"
                                className="flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4"
                            >
                                <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
                                <span className="hidden sm:inline">Backup</span>
                            </Button>
                            <Button
                                onClick={handleRestore}
                                variant="secondary"
                                className="flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4"
                            >
                                <Upload size={16} className="sm:w-[18px] sm:h-[18px]" />
                                <span className="hidden sm:inline">Restore</span>
                            </Button>
                            <Button
                                onClick={handleSaveAll}
                                isLoading={isUpdating}
                                disabled={isUpdating}
                                className="px-4 sm:px-6 py-2 flex items-center gap-2 text-sm sm:text-base"
                            >
                                {!isUpdating && (
                                    <>
                                        <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
                                        <span className="hidden sm:inline">Save All Changes</span>
                                        <span className="sm:hidden">Save All</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Settings Navigation */}
                <div className="mb-8">
                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10">
                        <div className="p-4">
                            <div className="flex flex-wrap gap-2">
                                {sections.map(section => {
                                    const Icon = section.icon;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-sans text-sm sm:text-base font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeSection === section.id
                                                ? 'bg-blue-600 dark:bg-blue-500 text-white'
                                                : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                                                }`}
                                        >
                                            <Icon size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                                            <span className="truncate">{section.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </SpotlightCard>
                </div>

                {/* Settings Content */}
                <div className="mb-8">
                    {activeSection === 'hotel-info' && (
                        <HotelInfoSettings
                            data={settings?.hotelInfo}
                            onUpdate={handleUpdate}
                            isSaving={isUpdating}
                        />
                    )}
                    {activeSection === 'taxes-fees' && (
                        <TaxesFeesSettings
                            data={settings?.taxesAndFees}
                            onUpdate={(updatedTaxesAndFees) => handleUpdate({ taxesAndFees: updatedTaxesAndFees })}
                            isSaving={isUpdating}
                        />
                    )}
                    {activeSection === 'policies' && (
                        <PoliciesSettings
                            data={settings?.policies}
                            onUpdate={(updatedPolicies) => handleUpdate({ policies: updatedPolicies })}
                            isSaving={isUpdating}
                        />
                    )}
                    {activeSection === 'email-templates' && (
                        <EmailTemplatesSettings
                            data={settings?.emailTemplates}
                            onUpdate={(updatedEmailTemplates) => handleUpdate({ emailTemplates: updatedEmailTemplates })}
                            isSaving={isUpdating}
                        />
                    )}
                    {activeSection === 'users' && (
                        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                            <div className="text-center py-12">
                                <Users size={48} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Users & Permissions
                                </h3>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-4">
                                    Manage staff users and their permissions
                                </p>
                                <Button>
                                    Manage Users
                                </Button>
                            </div>
                        </SpotlightCard>
                    )}
                    {activeSection === 'security' && (
                        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                            <div className="text-center py-12">
                                <Lock size={48} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Security Settings
                                </h3>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-4">
                                    Configure security preferences and access controls
                                </p>
                                <Button>
                                    Security Settings
                                </Button>
                            </div>
                        </SpotlightCard>
                    )}
                    {activeSection === 'integrations' && (
                        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                            <div className="text-center py-12">
                                <Code size={48} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Integrations
                                </h3>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-4">
                                    Connect third-party services and APIs
                                </p>
                                <Button>
                                    Manage Integrations
                                </Button>
                            </div>
                        </SpotlightCard>
                    )}
                    {activeSection === 'appearance' && (
                        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                            <div className="text-center py-12">
                                <Palette size={48} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Appearance
                                </h3>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-4">
                                    Customize colors, themes, and visual settings
                                </p>
                                <Button>
                                    Customize Appearance
                                </Button>
                            </div>
                        </SpotlightCard>
                    )}
                </div>

                {/* Settings Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <Trash2 size={24} className="text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h4 className="font-serif font-bold text-gray-900 dark:text-white">
                                    Reset Settings
                                </h4>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                    Reset all settings to default
                                </p>
                            </div>
                        </div>
                        <Button variant="outlineDestructive" className="w-full">
                            Reset to Defaults
                        </Button>
                    </SpotlightCard>

                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <Database size={24} className="text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h4 className="font-serif font-bold text-gray-900 dark:text-white">
                                    Export Settings
                                </h4>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                    Export all settings as JSON
                                </p>
                            </div>
                        </div>
                        <Button variant="secondary" className="w-full">
                            Export JSON
                        </Button>
                    </SpotlightCard>

                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Eye size={24} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h4 className="font-serif font-bold text-gray-900 dark:text-white">
                                    Audit Log
                                </h4>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                    View settings change history
                                </p>
                            </div>
                        </div>
                        <Button variant="secondary" className="w-full">
                            View Audit Log
                        </Button>
                    </SpotlightCard>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;