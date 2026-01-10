import React, { useState, useEffect } from 'react';
import { Save, Percent, Plus, Trash2 } from 'lucide-react';
import { DollarSign as Banknote } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import SpotlightCard from '../SpotlightCard';
import ToggleSwitch from './ToggleSwitch';

// Taxes & Fees Component
const TaxesFeesSettings = ({ data, onUpdate, isSaving }) => {
    const [taxes, setTaxes] = useState(data || []);

    useEffect(() => {
        if (data) setTaxes(data);
    }, [data]);

    const [newTax, setNewTax] = useState({
        name: '',
        type: 'percentage',
        rate: 0,
        amount: 0,
        description: '',
        appliesTo: 'all',
        enabled: true
    });

    const addTax = () => {
        if (!newTax.name) return;
        const tax = {
            ...newTax,
            id: taxes.length + 1
        };
        setTaxes([...taxes, tax]);
        setNewTax({
            name: '',
            type: 'percentage',
            rate: 0,
            amount: 0,
            description: '',
            appliesTo: 'all',
            enabled: true
        });
    };

    const removeTax = (id) => {
        setTaxes(taxes.filter(tax => tax.id !== id));
    };

    const toggleTax = (id) => {
        setTaxes(taxes.map(tax =>
            tax.id === id ? { ...tax, enabled: !tax.enabled } : tax
        ));
    };

    const handleSave = () => {
        onUpdate({ taxesAndFees: taxes });
    };

    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                        Taxes & Fees
                    </h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        Configure taxes, fees, and additional charges
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    isLoading={isSaving}
                    className="px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2"
                >
                    <Save size={18} />
                    Save Changes
                </Button>
            </div>

            <div className="space-y-6">
                {/* Add New Tax */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                    <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Add New Tax or Fee
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Name *
                            </label>
                            <Input
                                type="text"
                                value={newTax.name}
                                onChange={(e) => setNewTax({ ...newTax, name: e.target.value })}
                                placeholder="e.g., Service Fee"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Type
                            </label>
                            <select
                                value={newTax.type}
                                onChange={(e) => setNewTax({ ...newTax, type: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount ($)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                {newTax.type === 'percentage' ? 'Rate (%)' : 'Amount ($)'}
                            </label>
                            <Input
                                type="number"
                                value={newTax.type === 'percentage' ? newTax.rate : newTax.amount}
                                onChange={(e) => setNewTax({
                                    ...newTax,
                                    [newTax.type === 'percentage' ? 'rate' : 'amount']: parseFloat(e.target.value)
                                })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Applies To
                            </label>
                            <select
                                value={newTax.appliesTo}
                                onChange={(e) => setNewTax({ ...newTax, appliesTo: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Bookings</option>
                                <option value="per_night">Per Night</option>
                                <option value="per_stay">Per Stay</option>
                                <option value="services">Additional Services</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                            Description
                        </label>
                        <Input
                            type="text"
                            value={newTax.description}
                            onChange={(e) => setNewTax({ ...newTax, description: e.target.value })}
                            placeholder="Describe this tax or fee"
                        />
                    </div>
                    <Button
                        onClick={addTax}
                        variant="success"
                        className="flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add Tax/Fee
                    </Button>
                </div>

                {/* Taxes List */}
                <div>
                    <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Current Taxes & Fees
                    </h4>
                    <div className="space-y-4">
                        {taxes.map((tax, idx) => (
                            <div key={idx} className="p-4 rounded-lg border border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tax.enabled ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-white/10'}`}>
                                            {tax.type === 'percentage' ? (
                                                <Percent size={20} className={tax.enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-400'} />
                                            ) : (
                                                <Banknote size={20} className={tax.enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-400'} />
                                            )}
                                        </div>
                                        <div>
                                            <h5 className="font-sans font-medium text-gray-900 dark:text-white">
                                                {tax.name}
                                            </h5>
                                            <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                                {tax.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-mono font-medium ${tax.enabled ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-400'}`}>
                                            {tax.type === 'percentage' ? `${tax.rate}%` : `₦${tax.amount.toLocaleString()}`}
                                        </span>
                                        <ToggleSwitch
                                            enabled={tax.enabled}
                                            onChange={() => toggleTax(tax.id)}
                                            label=""
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                        Applies to: {tax.appliesTo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                    <Button
                                        onClick={() => removeTax(tax.id)}
                                        variant="ghostDestructive"
                                        size="icon"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tax Preview */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10 bg-blue-50 dark:bg-blue-900/20">
                    <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Tax Preview
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="font-sans text-gray-700 dark:text-gray-300">Room Rate (3 nights)</span>
                            <span className="font-sans font-medium text-gray-900 dark:text-white">₦897,000</span>
                        </div>
                        {taxes.filter(t => t.enabled).map((tax, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">{tax.name}</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {tax.type === 'percentage'
                                        ? `₦${(897000 * (tax.rate / 100)).toLocaleString()}`
                                        : tax.appliesTo === 'per_night'
                                            ? `₦${(tax.amount * 3).toLocaleString()}`
                                            : `₦${tax.amount.toLocaleString()}`
                                    }
                                </span>
                            </div>
                        ))}
                        <div className="flex justify-between pt-3 border-t border-gray-300 dark:border-white/10">
                            <span className="font-serif font-bold text-gray-900 dark:text-white">Total with Taxes</span>
                            <span className="font-serif text-xl font-bold text-gray-900 dark:text-white">₦1,124,250</span>
                        </div>
                    </div>
                </div>
            </div>
        </SpotlightCard>
    );
};

export default TaxesFeesSettings;
