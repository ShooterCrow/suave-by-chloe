
import { useState, useEffect } from 'react';
import { Save, Edit, X, CreditCard, Clock, Users, Shield, AlertCircle } from 'lucide-react';
import Button from '../Button';
import SpotlightCard from '../SpotlightCard';
import ToggleSwitch from './ToggleSwitch';

// Policies Component
const PoliciesSettings = ({ data, onUpdate, isSaving }) => {
    const [policies, setPolicies] = useState(data || {
        cancellation: {
            freeCancellationHours: 48,
            cancellationFee: 50,
            noShowFee: 100,
            description: ''
        },
        deposit: {
            required: true,
            amountType: 'percentage',
            amount: 30,
            dueHours: 24,
            description: ''
        },
        checkIn: {
            earlyCheckIn: true,
            earlyCheckInFee: 15000,
            lateCheckIn: true,
            latestCheckInTime: '22:00',
            description: ''
        },
        children: {
            childrenAllowed: true,
            maxChildrenAge: 12,
            extraBedFee: 25000,
            cribAvailable: true,
            cribFee: 10000,
            description: ''
        },
        pets: {
            petsAllowed: false,
            petFee: 25000,
            maxPets: 1,
            description: ''
        },
        smoking: {
            smokingAllowed: false,
            smokingFee: 150000,
            description: ''
        }
    });

    useEffect(() => {
        if (data) setPolicies(data);
    }, [data]);

    const [editingPolicy, setEditingPolicy] = useState(null);

    const handleSave = () => {
        onUpdate({ policies });
    };

    const PolicyCard = ({ title, policy, fields, icon: Icon }) => (
        <SpotlightCard className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Icon size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h5 className="font-serif font-bold text-gray-900 dark:text-white">{title}</h5>
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                            {policy.description}
                        </p>
                    </div>
                </div>
                <Button
                    onClick={() => setEditingPolicy(title.toLowerCase())}
                    variant="ghost"
                    size="icon"
                    className="text-gray-900 dark:text-white"
                >
                    <Edit size={16} />
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {fields.map(field => (
                    <div key={field.key}>
                        <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mb-1">
                            {field.label}
                        </p>
                        <p className="font-sans font-medium text-gray-900 dark:text-white">
                            {typeof policy[field.key] === 'boolean'
                                ? policy[field.key] ? 'Yes' : 'No'
                                : field.key.toLowerCase().includes('fee') || field.key.toLowerCase().includes('amount')
                                    ? policy.amountType === 'percentage' && field.key === 'amount'
                                        ? `${policy[field.key]}%`
                                        : `₦${policy[field.key].toLocaleString()}`
                                    : policy[field.key]
                            }
                        </p>
                    </div>
                ))}
            </div>
        </SpotlightCard>
    );

    const EditPolicyModal = () => {
        if (!editingPolicy) return null;

        const policyKey = editingPolicy;
        const currentPolicy = policies[policyKey];

        const handleSaveChanges = () => {
            setPolicies({ ...policies, [policyKey]: currentPolicy });
            setEditingPolicy(null);
        };

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white dark:bg-dark-800 rounded-2xl w-full max-w-2xl">
                    <div className="p-6 border-b border-gray-200 dark:border-white/10">
                        <div className="flex items-center justify-between">
                            <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                                Edit {editingPolicy.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Policy
                            </h3>
                            <Button
                                onClick={() => setEditingPolicy(null)}
                                variant="ghost"
                                size="icon"
                                className="text-gray-900 dark:text-white"
                            >
                                <X size={24} />
                            </Button>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={currentPolicy?.description}
                                    onChange={(e) => {
                                        const updated = { ...currentPolicy, description: e.target.value };
                                        setPolicies({ ...policies, [policyKey]: updated });
                                    }}
                                    rows="3"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            {editingPolicy === 'cancellation' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                                Free Cancellation (hours)
                                            </label>
                                            <input
                                                type="number"
                                                value={currentPolicy.freeCancellationHours}
                                                onChange={(e) => {
                                                    const updated = { ...currentPolicy, freeCancellationHours: parseInt(e.target.value) };
                                                    setPolicies({ ...policies, [policyKey]: updated });
                                                }}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                                Cancellation Fee (%)
                                            </label>
                                            <input
                                                type="number"
                                                value={currentPolicy.cancellationFee}
                                                onChange={(e) => {
                                                    const updated = { ...currentPolicy, cancellationFee: parseInt(e.target.value) };
                                                    setPolicies({ ...policies, [policyKey]: updated });
                                                }}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                            No-Show Fee (%)
                                        </label>
                                        <input
                                            type="number"
                                            value={currentPolicy.noShowFee}
                                            onChange={(e) => {
                                                const updated = { ...currentPolicy, noShowFee: parseInt(e.target.value) };
                                                setPolicies({ ...policies, [policyKey]: updated });
                                            }}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </>
                            )}
                            {/* Add other policy fields similarly */}
                        </div>
                        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
                            <Button
                                onClick={() => setEditingPolicy(null)}
                                variant="secondary"
                            >
                                Cancel
                            </Button>
                            <Button
                                className='cursor-pointer'
                                onClick={handleSaveChanges}
                                disabled={isSaving}
                                isLoading={isSaving}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                        Hotel Policies
                    </h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        Configure cancellation, check-in, and other policies
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    isLoading={isSaving}
                    className="flex items-center gap-2"
                >
                    <Save size={18} />
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PolicyCard
                    title="Cancellation Policy"
                    policy={policies.cancellation}
                    icon={X}
                    fields={[
                        { key: 'freeCancellationHours', label: 'Free Cancellation' },
                        { key: 'cancellationFee', label: 'Cancellation Fee' },
                        { key: 'noShowFee', label: 'No-Show Fee' }
                    ]}
                />
                <PolicyCard
                    title="Deposit Policy"
                    policy={policies.deposit}
                    icon={CreditCard}
                    fields={[
                        { key: 'required', label: 'Deposit Required' },
                        { key: 'amount', label: 'Deposit Amount' },
                        { key: 'dueHours', label: 'Due Within' }
                    ]}
                />
                <PolicyCard
                    title="Check-in Policy"
                    policy={policies.checkIn}
                    icon={Clock}
                    fields={[
                        { key: 'earlyCheckIn', label: 'Early Check-in' },
                        { key: 'earlyCheckInFee', label: 'Early Check-in Fee' },
                        { key: 'lateCheckIn', label: 'Late Check-in' }
                    ]}
                />
                <PolicyCard
                    title="Children Policy"
                    policy={policies.children}
                    icon={Users}
                    fields={[
                        { key: 'childrenAllowed', label: 'Children Allowed' },
                        { key: 'maxChildrenAge', label: 'Max Age Free' },
                        { key: 'extraBedFee', label: 'Extra Bed Fee' }
                    ]}
                />
                <PolicyCard
                    title="Pet Policy"
                    policy={policies.pets}
                    icon={Shield}
                    fields={[
                        { key: 'petsAllowed', label: 'Pets Allowed' },
                        { key: 'petFee', label: 'Pet Fee' },
                        { key: 'maxPets', label: 'Max Pets' }
                    ]}
                />
                <PolicyCard
                    title="Smoking Policy"
                    policy={policies.smoking}
                    icon={AlertCircle}
                    fields={[
                        { key: 'smokingAllowed', label: 'Smoking Allowed' },
                        { key: 'smokingFee', label: 'Smoking Fee' }
                    ]}
                />
            </div>

            {/* Additional Policy Settings */}
            <div className="mt-6 p-4 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Additional Settings
                </h4>
                <div className="space-y-4">
                    <ToggleSwitch
                        enabled={policies.sendPolicyConfirmation}
                        onChange={(val) => setPolicies({ ...policies, sendPolicyConfirmation: val })}
                        label="Send policy confirmation emails"
                    />
                    <ToggleSwitch
                        enabled={policies.requirePolicyAcceptance}
                        onChange={(val) => setPolicies({ ...policies, requirePolicyAcceptance: val })}
                        label="Require policy acceptance at booking"
                    />
                    <ToggleSwitch
                        enabled={policies.displayPolicies}
                        onChange={(val) => setPolicies({ ...policies, displayPolicies: val })}
                        label="Display policies on booking page"
                    />
                </div>
            </div>

            {editingPolicy && <EditPolicyModal />}
        </div>
    );
};

export default PoliciesSettings;
