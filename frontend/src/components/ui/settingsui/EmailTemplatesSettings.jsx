
import React, { useState, useEffect } from 'react';
import { Save, Check, Copy, X, Mail as MailIcon } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import SpotlightCard from '../SpotlightCard';

// Email Templates Component
const EmailTemplatesSettings = ({ data, onUpdate, isSaving }) => {
    const [templates, setTemplates] = useState(data || []);

    useEffect(() => {
        if (data) setTemplates(data);
    }, [data]);

    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [previewMode, setPreviewMode] = useState('desktop');
    const [emailContent, setEmailContent] = useState(`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Booking Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; color: #666; font-size: 14px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{hotel_name}</h1>
            <p>Booking Confirmation</p>
        </div>
        <div class="content">
            <h2>Dear {guest_name},</h2>
            <p>Thank you for choosing {hotel_name}! Your booking has been confirmed.</p>
            
            <h3>Booking Details:</h3>
            <p><strong>Booking ID:</strong> {booking_id}</p>
            <p><strong>Check-in:</strong> {check_in}</p>
            <p><strong>Check-out:</strong> {check_out}</p>
            <p><strong>Room Type:</strong> {room_type}</p>
            <p><strong>Total Amount:</strong> ₦{total_amount}</p>
            
            <p>We look forward to welcoming you!</p>
            <a href="#" class="button">View Booking Details</a>
        </div>
        <div class="footer">
            <p>{hotel_name}<br>
            {hotel_address}<br>
            {hotel_phone} | {hotel_email}</p>
            <p>If you have any questions, please contact us.</p>
        </div>
    </div>
</body>
</html>`);

    const handleSelectTemplate = (template) => {
        setSelectedTemplate(template);
        // In a real app, you would load the template content from your database
    };

    const handleTestEmail = () => {
        alert('Test email sent to admin@suavebychloe.com');
    };

    const handleSaveTemplate = () => {
        onUpdate({ emailTemplates: templates });
    };

    const handleCopyVariable = (variable) => {
        navigator.clipboard.writeText(`{${variable}}`);
        alert(`Copied: {${variable}}`);
    };

    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                        Email Templates
                    </h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        Customize automated emails sent to guests
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleTestEmail}
                        variant="secondary"
                        className="flex items-center gap-2"
                    >
                        <MailIcon size={16} />
                        Send Test
                    </Button>
                    <Button
                        onClick={handleSaveTemplate}
                        disabled={isSaving}
                        isLoading={isSaving}
                        className="flex items-center gap-2"
                    >
                        <Save size={18} />
                        Save Template
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Templates List */}
                <div className="lg:col-span-1">
                    <div className="space-y-3">
                        {templates.map(template => (
                            <div
                                key={template.id}
                                onClick={() => handleSelectTemplate(template)}
                                className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedTemplate?.id === template.id
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-sans font-medium text-gray-900 dark:text-white">
                                        {template.name}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        {template.enabled ? (
                                            <Check size={16} className="text-green-500" />
                                        ) : (
                                            <X size={16} className="text-gray-400" />
                                        )}
                                        <span className={`w-2 h-2 rounded-full ${template.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                    </div>
                                </div>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-2">
                                    {template.subject}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                        Modified: {template.lastModified}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                                        {template.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Available Variables */}
                    <div className="mt-6 p-4 rounded-lg border border-gray-200 dark:border-white/10">
                        <h4 className="font-serif font-bold text-gray-900 dark:text-white mb-3">
                            Available Variables
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                'guest_name', 'booking_id', 'check_in', 'check_out',
                                'room_type', 'total_amount', 'hotel_name', 'hotel_address',
                                'hotel_phone', 'hotel_email'
                            ].map(variable => (
                                <button
                                    key={variable}
                                    onClick={() => handleCopyVariable(variable)}
                                    className="px-2 py-1 rounded text-xs font-sans bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 flex items-center justify-between"
                                >
                                    <span>{variable}</span>
                                    <Copy size={10} />
                                </button>
                            ))}
                        </div>
                        <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mt-2">
                            Click to copy variable
                        </p>
                    </div>
                </div>

                {/* Template Editor */}
                <div className="lg:col-span-2">
                    {selectedTemplate ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                                        {selectedTemplate.name}
                                    </h3>
                                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                        Edit email template content and settings
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex bg-gray-100 dark:bg-white/10 rounded-lg p-1">
                                        <button
                                            onClick={() => setPreviewMode('desktop')}
                                            className={`px-3 py-1 rounded text-sm font-sans ${previewMode === 'desktop' ? 'bg-white dark:bg-dark-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}
                                        >
                                            Desktop
                                        </button>
                                        <button
                                            onClick={() => setPreviewMode('mobile')}
                                            className={`px-3 py-1 rounded text-sm font-sans ${previewMode === 'mobile' ? 'bg-white dark:bg-dark-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}
                                        >
                                            Mobile
                                        </button>
                                        <button
                                            onClick={() => setPreviewMode('code')}
                                            className={`px-3 py-1 rounded text-sm font-sans ${previewMode === 'code' ? 'bg-white dark:bg-dark-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}
                                        >
                                            Code
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Email Subject */}
                            <div>
                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                    Email Subject
                                </label>
                                <Input
                                    type="text"
                                    defaultValue={selectedTemplate.subject}
                                />
                            </div>

                            {/* Template Editor/Preview */}
                            <div>
                                <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                    {previewMode === 'code' ? 'HTML Code' : 'Preview'}
                                </label>
                                {previewMode === 'code' ? (
                                    <textarea
                                        value={emailContent}
                                        onChange={(e) => setEmailContent(e.target.value)}
                                        rows="15"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-gray-900 text-gray-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ) : (
                                    <div className={`border border-gray-300 dark:border-white/10 rounded-lg overflow-hidden ${previewMode === 'mobile' ? 'max-w-sm' : ''}`}>
                                        <div className="border-b border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 p-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                <span className="text-xs font-sans text-gray-600 dark:text-gray-400 ml-2">
                                                    {selectedTemplate.name} - Preview
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-900 p-4">
                                            <div dangerouslySetInnerHTML={{
                                                __html: emailContent
                                                    .replace(/{guest_name}/g, 'John Smith')
                                                    .replace(/{booking_id}/g, 'RES-789012')
                                                    .replace(/{check_in}/g, 'Jun 15, 2024')
                                                    .replace(/{check_out}/g, 'Jun 20, 2024')
                                                    .replace(/{room_type}/g, 'Deluxe City Suite')
                                                    .replace(/{total_amount}/g, '$1,497')
                                                    .replace(/{hotel_name}/g, 'Suave By Chloe')
                                                    .replace(/{hotel_address}/g, 'Kubwa, Abuja, Nigeria')
                                                    .replace(/{hotel_phone}/g, '+234 800 123 4567')
                                                    .replace(/{hotel_email}/g, 'info@suavebychloe.com')
                                            }} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Template Settings */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Send Delay (hours before/after)
                                    </label>
                                    <Input
                                        type="number"
                                        defaultValue="24"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                        Email Format
                                    </label>
                                    <select className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="html">HTML</option>
                                        <option value="plain">Plain Text</option>
                                        <option value="both">Both</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <MailIcon size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="font-sans text-gray-600 dark:text-gray-400">
                                Select an email template to edit
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </SpotlightCard>
    );
};

export default EmailTemplatesSettings;
