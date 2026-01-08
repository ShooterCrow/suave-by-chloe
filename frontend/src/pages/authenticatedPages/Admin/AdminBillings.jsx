import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Search,
    Filter,
    Download,
    Eye,
    MoreVertical,
    ChevronRight,
    ChevronDown,
    CreditCard,
    DollarSign,
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
    RefreshCw,
    Printer,
    Copy,
    ExternalLink,
    TrendingUp,
    TrendingDown,
    Users,
    Home,
    Calendar,
    Shield,
    Lock,
    Unlock,
    Receipt,
    Send,
    Upload,
    Plus,
    Minus,
    Percent,
    CreditCard as Card,
    Banknote,
    Wallet,
    Bitcoin,
    PieChart,
    BarChart,
    LineChart,
    Activity,
    Calculator,
    FileText,
    Mail,
    Phone,
    User,
    MapPin,
    Globe,
    Settings,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownRight,
    RotateCcw,
    X
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import SpotlightCard from '../../../components/ui/SpotlightCard';


// Status Badge Component
// Status Badge Component
const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
        const configs = {
            'completed': { variant: 'success', icon: <CheckCircle size={12} /> },
            'pending': { variant: 'warning', icon: <Clock size={12} /> }, // Pending -> Warning
            'failed': { variant: 'destructive', icon: <XCircle size={12} /> },
            'refunded': { variant: 'secondary', icon: <RefreshCw size={12} /> }, // Refunded -> Secondary (Gray/Blue-ish depending on theme, but secondary is safe)
            'processing': { variant: 'purple', icon: <Activity size={12} /> },
            'cancelled': { variant: 'secondary', icon: <XCircle size={12} /> }, // Cancelled -> Secondary
            'disputed': { variant: 'warning', icon: <AlertCircle size={12} /> }, // Disputed -> Warning (Orange)
            'approved': { variant: 'success', icon: <CheckCircle size={12} /> }, // Added 'approved' for refunds
            'rejected': { variant: 'destructive', icon: <XCircle size={12} /> }  // Added 'rejected' for refunds
        };
        return configs[status] || configs.pending;
    };

    const config = getStatusConfig(status);

    return (
        <Badge variant={config.variant} className="gap-1">
            {config.icon}
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
};

// PaymentMethodBadge Component
// PaymentMethodBadge Component
const PaymentMethodBadge = ({ method }) => {
    const getMethodConfig = (method) => {
        const configs = {
            'credit_card': { variant: 'blue', icon: <CreditCard size={12} /> },
            'debit_card': { variant: 'success', icon: <CreditCard size={12} /> }, // Green
            'paypal': { variant: 'purple', icon: <Globe size={12} /> }, // Indigo/Purple
            'bank_transfer': { variant: 'teal', icon: <Banknote size={12} /> }, // Teal
            'cash': { variant: 'warning', icon: <Wallet size={12} /> }, // Amber/Warning
            'crypto': { variant: 'warning', icon: <Bitcoin size={12} /> }, // Orange/Warning
            'check': { variant: 'secondary', icon: <FileText size={12} /> } // Added check
        };
        return configs[method] || configs.credit_card;
    };

    const config = getMethodConfig(method);

    return (
        <Badge variant={config.variant} className="gap-1">
            {config.icon}
            {method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </Badge>
    );
};

// Transaction Card Component
const TransactionCard = ({ transaction, onView, onRefund, onExport }) => {
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'NGN'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-4 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-serif font-bold text-gray-900 dark:text-white">
                            {transaction.transactionId}
                        </h4>
                        <StatusBadge status={transaction.status} />
                    </div>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        {transaction.guestName} • {formatDate(transaction.date)}
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        onClick={() => onView(transaction)}
                        variant="ghost"
                        size="icon"
                        className="text-gray-900 dark:text-white"
                    >
                        <Eye size={16} />
                    </Button>
                    <Button
                        onClick={() => onExport(transaction)}
                        variant="ghost"
                        size="icon"
                        className="text-gray-900 dark:text-white"
                    >
                        <Download size={16} />
                    </Button>
                </div>
            </div>

            {/* Transaction Details */}
            <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mb-1">Amount</p>
                    <p className={`text-xl font-serif font-bold ${transaction.type === 'refund' || transaction.type === 'payout'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-green-600 dark:text-green-400'
                        }`}>
                        {transaction.type === 'refund' || transaction.type === 'payout' ? '-' : ''}
                        {formatAmount(transaction.amount)}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mb-1">Type</p>
                    <p className="text-sm font-sans font-medium text-gray-900 dark:text-white">
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <PaymentMethodBadge method={transaction.method} />
                    <span className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        {transaction.method === 'credit_card' ? `**** ${transaction.lastFour}` : ''}
                    </span>
                </div>
                {transaction.status === 'completed' && transaction.type === 'payment' && (
                    <Button
                        onClick={() => onRefund(transaction)}
                        variant="destructive"
                        size="sm"
                        className="py-1.5"
                    >
                        Refund
                    </Button>
                )}
            </div>
        </SpotlightCard>
    );
};

// Transactions Overview Component
const TransactionsOverview = () => {
    const transactions = [
        {
            id: 1,
            transactionId: 'TX-78901234',
            guestName: 'Michael Chen',
            bookingId: 'RES-789012',
            date: '2024-06-15T14:30:00',
            amount: 1497000,
            type: 'payment',
            method: 'credit_card',
            status: 'completed',
            lastFour: '4242',
            description: 'Room deposit payment',
            processor: 'stripe',
            fee: 44910,
            netAmount: 1452090
        },
        {
            id: 2,
            transactionId: 'TX-78901235',
            guestName: 'Sarah Wilson',
            bookingId: 'RES-789013',
            date: '2024-06-18T10:15:00',
            amount: 850000,
            type: 'refund',
            method: 'credit_card',
            status: 'completed',
            lastFour: '5556',
            description: 'Partial refund for cancellation',
            processor: 'stripe',
            fee: 0,
            netAmount: -850000
        },
        {
            id: 3,
            transactionId: 'TX-78901236',
            guestName: 'Suave By Chloe',
            bookingId: 'POUT-202406',
            date: '2024-06-20T09:00:00',
            amount: 15000000,
            type: 'payout',
            method: 'bank_transfer',
            status: 'completed',
            lastFour: '1234',
            description: 'Monthly revenue payout',
            processor: 'stripe_connect',
            fee: 150000,
            netAmount: 14850000
        },
        {
            id: 4,
            transactionId: 'TX-78901237',
            guestName: 'Robert Davis',
            bookingId: 'RES-789014',
            date: '2024-06-22T16:45:00',
            amount: 398000,
            type: 'payment',
            method: 'paypal',
            status: 'pending',
            lastFour: '',
            description: 'Final payment',
            processor: 'paypal',
            fee: 11940,
            netAmount: 386060
        },
        {
            id: 5,
            transactionId: 'TX-78901238',
            guestName: 'Emily Johnson',
            bookingId: 'RES-789015',
            date: '2024-06-25T11:20:00',
            amount: 1000000,
            type: 'payment',
            method: 'credit_card',
            status: 'failed',
            lastFour: '8888',
            description: 'Deposit payment attempt',
            processor: 'stripe',
            fee: 0,
            netAmount: 0
        },
        {
            id: 6,
            transactionId: 'TX-78901239',
            guestName: 'James Miller',
            bookingId: 'RES-789016',
            date: '2024-06-28T13:10:00',
            amount: 598000,
            type: 'payment',
            method: 'bank_transfer',
            status: 'processing',
            lastFour: '5678',
            description: 'Bank transfer payment',
            processor: 'bank',
            fee: 5980,
            netAmount: 592020
        }
    ];

    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const statusTypes = ['all', 'completed', 'pending', 'failed', 'refunded', 'processing', 'disputed'];
    const transactionTypes = ['all', 'payment', 'refund', 'payout'];

    const handleViewDetails = (transaction) => {
        setSelectedTransaction(transaction);
        setDetailsModalOpen(true);
    };

    const handleProcessRefund = (transaction) => {
        if (window.confirm(`Process refund of ₦${transaction.amount.toLocaleString()} for transaction ${transaction.transactionId}?`)) {
            alert(`Refund processed for ${transaction.transactionId}`);
        }
    };

    const handleExportReceipt = (transaction) => {
        alert(`Exporting receipt for ${transaction.transactionId}...`);
    };

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch =
            transaction.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.bookingId.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
        const matchesType = selectedType === 'all' || transaction.type === selectedType;

        const matchesDate = !dateRange.start || !dateRange.end ||
            (new Date(transaction.date) >= new Date(dateRange.start) &&
                new Date(transaction.date) <= new Date(dateRange.end));

        return matchesSearch && matchesStatus && matchesType && matchesDate;
    });

    const stats = {
        totalRevenue: transactions.filter(t => t.type === 'payment' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
        totalRefunds: transactions.filter(t => t.type === 'refund').reduce((sum, t) => sum + t.amount, 0),
        totalPayouts: transactions.filter(t => t.type === 'payout').reduce((sum, t) => sum + t.amount, 0),
        processingFees: transactions.reduce((sum, t) => sum + t.fee, 0),
        netRevenue: transactions.filter(t => t.type === 'payment' && t.status === 'completed').reduce((sum, t) => sum + t.netAmount, 0) -
            transactions.filter(t => t.type === 'refund').reduce((sum, t) => sum + t.amount, 0),
        pendingTransactions: transactions.filter(t => t.status === 'pending').length
    };

    const TransactionDetailsModal = () => {
        if (!selectedTransaction) return null;

        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        const formatAmount = (amount) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'NGN'
            }).format(amount);
        };

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white dark:bg-dark-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                                    Transaction Details
                                </h2>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                    {selectedTransaction.transactionId}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => handleExportReceipt(selectedTransaction)}
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-900 dark:text-white"
                                >
                                    <Printer size={20} />
                                </Button>
                                <Button
                                    onClick={() => setDetailsModalOpen(false)}
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-900 dark:text-white"
                                >
                                    <X size={24} />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                        <div className="space-y-6">
                            {/* Transaction Header */}
                            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-white/10">
                                <div>
                                    <p className="text-sm font-sans text-gray-500 dark:text-gray-400">Amount</p>
                                    <p className={`text-3xl font-serif font-bold ${selectedTransaction.type === 'refund' || selectedTransaction.type === 'payout'
                                        ? 'text-red-600 dark:text-red-400'
                                        : 'text-green-600 dark:text-green-400'
                                        }`}>
                                        {formatAmount(selectedTransaction.amount)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <StatusBadge status={selectedTransaction.status} />
                                    <p className="text-sm font-sans text-gray-500 dark:text-gray-400 mt-2">
                                        {formatDate(selectedTransaction.date)}
                                    </p>
                                </div>
                            </div>

                            {/* Transaction Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Transaction Type</p>
                                    <p className="font-sans font-medium text-gray-900 dark:text-white">
                                        {selectedTransaction.type.charAt(0).toUpperCase() + selectedTransaction.type.slice(1)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Payment Method</p>
                                    <div className="flex items-center gap-2">
                                        <PaymentMethodBadge method={selectedTransaction.method} />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Guest</p>
                                    <p className="font-sans font-medium text-gray-900 dark:text-white">
                                        {selectedTransaction.guestName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Booking ID</p>
                                    <p className="font-sans font-medium text-gray-900 dark:text-white">
                                        {selectedTransaction.bookingId}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Processor</p>
                                    <p className="font-sans font-medium text-gray-900 dark:text-white">
                                        {selectedTransaction.processor.charAt(0).toUpperCase() + selectedTransaction.processor.slice(1)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Description</p>
                                    <p className="font-sans font-medium text-gray-900 dark:text-white">
                                        {selectedTransaction.description}
                                    </p>
                                </div>
                            </div>

                            {/* Fee Breakdown */}
                            <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                                <h4 className="font-serif font-bold text-gray-900 dark:text-white mb-3">
                                    Fee Breakdown
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="font-sans text-gray-600 dark:text-gray-400">Gross Amount</span>
                                        <span className="font-sans font-medium text-gray-900 dark:text-white">
                                            {formatAmount(selectedTransaction.amount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-sans text-gray-600 dark:text-gray-400">Processing Fee</span>
                                        <span className="font-sans font-medium text-red-600 dark:text-red-400">
                                            -{formatAmount(selectedTransaction.fee)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-white/10">
                                        <span className="font-serif font-bold text-gray-900 dark:text-white">Net Amount</span>
                                        <span className="font-serif font-bold text-gray-900 dark:text-white">
                                            {formatAmount(selectedTransaction.netAmount)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                {selectedTransaction.status === 'completed' && selectedTransaction.type === 'payment' && (
                                    <Button
                                        onClick={() => {
                                            handleProcessRefund(selectedTransaction);
                                            setDetailsModalOpen(false);
                                        }}
                                        variant="destructive"
                                        className="flex-1"
                                    >
                                        Process Refund
                                    </Button>
                                )}
                                <Button variant="secondary" className="flex-1">
                                    Send Receipt
                                </Button>
                            </div>
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
                        Transactions
                    </h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        View and manage all payment transactions
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" className="flex items-center gap-2">
                        <Download size={16} />
                        Export
                    </Button>
                    <Button className="flex items-center gap-2">
                        <Plus size={16} />
                        Manual Entry
                    </Button>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                        <Input
                            type="text"
                            placeholder="Search transactions by ID, guest, or booking..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={Search}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {statusTypes.map(status => (
                                <option key={status} value={status}>
                                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {transactionTypes.map(type => (
                                <option key={type} value={type}>
                                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="From"
                            />
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="To"
                            />
                        </div>
                        <Button variant="secondary" className="flex items-center gap-2">
                            <Filter size={16} />
                            More Filters
                        </Button>
                    </div>
                </div>
            </div>

            {/* Transactions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredTransactions.map(transaction => (
                    <TransactionCard
                        key={transaction.id}
                        transaction={transaction}
                        onView={handleViewDetails}
                        onRefund={handleProcessRefund}
                        onExport={handleExportReceipt}
                    />
                ))}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                    <p className="text-sm font-sans text-gray-500 dark:text-gray-400 mb-1">Total Revenue</p>
                    <p className="text-2xl font-serif font-bold text-green-600 dark:text-green-400">
                        ${stats.totalRevenue.toLocaleString()}
                    </p>
                </div>
                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                    <p className="text-sm font-sans text-gray-500 dark:text-gray-400 mb-1">Total Refunds</p>
                    <p className="text-2xl font-serif font-bold text-red-600 dark:text-red-400">
                        -${stats.totalRefunds.toLocaleString()}
                    </p>
                </div>
                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                    <p className="text-sm font-sans text-gray-500 dark:text-gray-400 mb-1">Processing Fees</p>
                    <p className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-400">
                        -${stats.processingFees.toLocaleString()}
                    </p>
                </div>
                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                    <p className="text-sm font-sans text-gray-500 dark:text-gray-400 mb-1">Net Revenue</p>
                    <p className="text-2xl font-serif font-bold text-blue-600 dark:text-blue-400">
                        ${stats.netRevenue.toLocaleString()}
                    </p>
                </div>
            </div>

            {detailsModalOpen && <TransactionDetailsModal />}
        </div>
    );
};

// Refunds Manager Component
const RefundsManager = () => {
    const [refunds, setRefunds] = useState([
        {
            id: 1,
            refundId: 'REF-789012',
            transactionId: 'TX-78901234',
            guestName: 'Sarah Wilson',
            bookingId: 'RES-789013',
            amount: 850000,
            reason: 'Cancellation - Within policy',
            status: 'completed',
            requestedDate: '2024-06-17',
            processedDate: '2024-06-18',
            method: 'credit_card',
            processor: 'stripe',
            notes: 'Refund processed as per cancellation policy'
        },
        {
            id: 2,
            refundId: 'REF-789013',
            transactionId: 'TX-78901111',
            guestName: 'John Davis',
            bookingId: 'RES-789010',
            amount: 299000,
            reason: 'Service Issue - Room not clean',
            status: 'pending',
            requestedDate: '2024-06-20',
            processedDate: '',
            method: 'paypal',
            processor: 'paypal',
            notes: 'Awaiting manager approval'
        },
        {
            id: 3,
            refundId: 'REF-789014',
            transactionId: 'TX-78900999',
            guestName: 'Lisa Thompson',
            bookingId: 'RES-789009',
            amount: 150000,
            reason: 'Early Check-out - Medical emergency',
            status: 'approved',
            requestedDate: '2024-06-15',
            processedDate: '2024-06-16',
            method: 'bank_transfer',
            processor: 'stripe',
            notes: 'Approved by manager, processing within 3-5 business days'
        },
        {
            id: 4,
            refundId: 'REF-789015',
            transactionId: 'TX-78900888',
            guestName: 'Robert Johnson',
            bookingId: 'RES-789008',
            amount: 500000,
            reason: 'Overcharge - Double billing',
            status: 'rejected',
            requestedDate: '2024-06-10',
            processedDate: '',
            method: 'credit_card',
            processor: 'stripe',
            notes: 'Duplicate transaction verified, refund rejected as charge was valid'
        }
    ]);

    const [newRefund, setNewRefund] = useState({
        transactionId: '',
        amount: 0,
        reason: '',
        notes: '',
        method: 'credit_card'
    });

    const handleProcessRefund = (refundId, action) => {
        setRefunds(refunds.map(refund =>
            refund.id === refundId
                ? {
                    ...refund,
                    status: action,
                    processedDate: action === 'approved' ? new Date().toISOString().split('T')[0] : refund.processedDate
                }
                : refund
        ));
    };

    const handleCreateRefund = () => {
        if (!newRefund.transactionId || !newRefund.amount) return;
        const refund = {
            ...newRefund,
            id: refunds.length + 1,
            refundId: 'REF-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            guestName: 'Guest Name',
            bookingId: 'RES-XXXXXX',
            status: 'pending',
            requestedDate: new Date().toISOString().split('T')[0],
            processor: 'stripe'
        };
        setRefunds([refund, ...refunds]);
        setNewRefund({
            transactionId: '',
            amount: 0,
            reason: '',
            notes: '',
            method: 'credit_card'
        });
    };

    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                        Refunds Management
                    </h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        Process and manage refund requests
                    </p>
                </div>
                <Button className="flex items-center gap-2">
                    <Plus size={16} />
                    New Refund
                </Button>
            </div>

            <div className="space-y-6">
                {/* Create New Refund */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                    <h4 className="font-serif font-bold text-gray-900 dark:text-white mb-4">
                        Create Manual Refund
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Transaction ID *
                            </label>
                            <Input
                                type="text"
                                value={newRefund.transactionId}
                                onChange={(e) => setNewRefund({ ...newRefund, transactionId: e.target.value })}
                                placeholder="e.g., TX-78901234"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Amount *
                            </label>
                            <Input
                                type="number"
                                value={newRefund.amount}
                                onChange={(e) => setNewRefund({ ...newRefund, amount: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Reason
                            </label>
                            <Input
                                type="text"
                                value={newRefund.reason}
                                onChange={(e) => setNewRefund({ ...newRefund, reason: e.target.value })}
                                placeholder="e.g., Cancellation, Service Issue"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Refund Method
                            </label>
                            <select
                                value={newRefund.method}
                                onChange={(e) => setNewRefund({ ...newRefund, method: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="credit_card">Credit Card (Original)</option>
                                <option value="paypal">PayPal</option>
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="cash">Cash</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                            Notes
                        </label>
                        <textarea
                            value={newRefund.notes}
                            onChange={(e) => setNewRefund({ ...newRefund, notes: e.target.value })}
                            rows="3"
                            placeholder="Additional notes about this refund..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <Button
                        onClick={handleCreateRefund}
                        variant="success"
                        className="flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Create Refund Request
                    </Button>
                </div>

                {/* Refunds List */}
                <div>
                    <h4 className="font-serif font-bold text-gray-900 dark:text-white mb-4">
                        Refund Requests
                    </h4>
                    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-white/10">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                            <thead className="bg-gray-50 dark:bg-white/5">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-sans font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Refund ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-sans font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Guest
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-sans font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-sans font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Reason
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-sans font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-sans font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-white/10">
                                {refunds.map(refund => (
                                    <tr key={refund.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                                                {refund.refundId}
                                            </span>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                                {refund.transactionId}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <p className="font-sans font-medium text-gray-900 dark:text-white">
                                                    {refund.guestName}
                                                </p>
                                                <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                                    {refund.bookingId}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-serif font-bold text-red-600 dark:text-red-400">
                                                -${refund.amount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-sans text-gray-900 dark:text-white">
                                                {refund.reason}
                                            </p>
                                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                                {refund.notes}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={refund.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {refund.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            onClick={() => handleProcessRefund(refund.id, 'approved')}
                                                            variant="success"
                                                            size="sm"
                                                            className="py-1"
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleProcessRefund(refund.id, 'rejected')}
                                                            variant="destructive"
                                                            size="sm"
                                                            className="py-1"
                                                        >
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                                {refund.status === 'approved' && (
                                                    <Button
                                                        onClick={() => alert(`Processing refund ${refund.refundId}...`)}
                                                        size="sm"
                                                        className="py-1"
                                                    >
                                                        Process Now
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="p-1.5 text-gray-900 dark:text-white"
                                                >
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Refund Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                        <p className="text-sm font-sans text-gray-500 dark:text-gray-400 mb-1">Total Refunds</p>
                        <p className="text-2xl font-serif font-bold text-red-600 dark:text-red-400">
                            -${refunds.filter(r => r.status === 'completed' || r.status === 'approved').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                        <p className="text-sm font-sans text-gray-500 dark:text-gray-400 mb-1">Pending Refunds</p>
                        <p className="text-2xl font-serif font-bold text-yellow-600 dark:text-yellow-400">
                            {refunds.filter(r => r.status === 'pending').length}
                        </p>
                    </div>
                    <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10">
                        <p className="text-sm font-sans text-gray-500 dark:text-gray-400 mb-1">Avg. Refund</p>
                        <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                            ${(refunds.filter(r => r.status === 'completed' || r.status === 'approved').reduce((sum, r) => sum + r.amount, 0) / refunds.filter(r => r.status === 'completed' || r.status === 'approved').length || 0).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
        </SpotlightCard>
    );
};

// Payouts Manager Component
const PayoutsManager = () => {
    const [payouts, setPayouts] = useState([
        {
            id: 1,
            payoutId: 'POUT-202406',
            period: 'June 2024',
            startDate: '2024-06-01',
            endDate: '2024-06-30',
            grossAmount: 150000,
            fees: 4500,
            netAmount: 145500,
            status: 'completed',
            processedDate: '2024-07-05',
            method: 'bank_transfer',
            bankAccount: '****1234',
            statement: 'statement-june-2024.pdf'
        },
        {
            id: 2,
            payoutId: 'POUT-202405',
            period: 'May 2024',
            startDate: '2024-05-01',
            endDate: '2024-05-31',
            grossAmount: 135000,
            fees: 4050,
            netAmount: 130950,
            status: 'completed',
            processedDate: '2024-06-05',
            method: 'bank_transfer',
            bankAccount: '****1234',
            statement: 'statement-may-2024.pdf'
        },
        {
            id: 3,
            payoutId: 'POUT-202404',
            period: 'April 2024',
            startDate: '2024-04-01',
            endDate: '2024-04-30',
            grossAmount: 142500,
            fees: 4275,
            netAmount: 138225,
            status: 'completed',
            processedDate: '2024-05-05',
            method: 'bank_transfer',
            bankAccount: '****1234',
            statement: 'statement-april-2024.pdf'
        },
        {
            id: 4,
            payoutId: 'POUT-202407',
            period: 'July 2024',
            startDate: '2024-07-01',
            endDate: '2024-07-31',
            grossAmount: 0,
            fees: 0,
            netAmount: 0,
            status: 'pending',
            processedDate: '',
            method: 'bank_transfer',
            bankAccount: '****1234',
            statement: ''
        }
    ]);

    const handleInitiatePayout = (payoutId) => {
        if (window.confirm('Initiate payout for this period?')) {
            setPayouts(payouts.map(payout =>
                payout.id === payoutId
                    ? {
                        ...payout,
                        status: 'processing',
                        processedDate: new Date().toISOString().split('T')[0],
                        grossAmount: 162000,
                        fees: 4860,
                        netAmount: 157140
                    }
                    : payout
            ));
        }
    };

    const handleDownloadStatement = (statement) => {
        alert(`Downloading ${statement}...`);
    };

    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                        Payouts Management
                    </h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        Manage revenue payouts and bank transfers
                    </p>
                </div>
                <Button className="flex items-center gap-2">
                    <Plus size={16} />
                    Initiate Payout
                </Button>
            </div>

            <div className="space-y-6">
                {/* Payouts List */}
                <div>
                    <h4 className="font-serif font-bold text-gray-900 dark:text-white mb-4">
                        Payout History
                    </h4>
                    <div className="space-y-4">
                        {payouts.map(payout => (
                            <div key={payout.id} className="p-4 rounded-lg border border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h5 className="font-serif font-bold text-gray-900 dark:text-white">
                                                {payout.period}
                                            </h5>
                                            <StatusBadge status={payout.status} />
                                        </div>
                                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                            {payout.startDate} - {payout.endDate} • {payout.payoutId}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-serif font-bold text-green-600 dark:text-green-400">
                                            ${payout.netAmount.toLocaleString()}
                                        </p>
                                        <p className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                            Net Amount
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mb-1">Gross Amount</p>
                                        <p className="font-sans font-medium text-gray-900 dark:text-white">
                                            ${payout.grossAmount.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mb-1">Processing Fees</p>
                                        <p className="font-sans font-medium text-red-600 dark:text-red-400">
                                            -${payout.fees.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mb-1">Payment Method</p>
                                        <div className="flex items-center gap-2">
                                            <PaymentMethodBadge method={payout.method} />
                                            <span className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                                {payout.bankAccount}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        {payout.statement && (
                                            <Button
                                                onClick={() => handleDownloadStatement(payout.statement)}
                                                variant="secondary"
                                                size="sm"
                                                className="flex items-center gap-2"
                                            >
                                                <Download size={14} />
                                                Download Statement
                                            </Button>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {payout.status === 'pending' && (
                                            <Button
                                                onClick={() => handleInitiatePayout(payout.id)}
                                                variant="success"
                                            >
                                                Initiate Payout
                                            </Button>
                                        )}
                                        {payout.status === 'completed' && (
                                            <span className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                                Processed: {payout.processedDate}
                                            </span>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-gray-900 dark:text-white"
                                        >
                                            <MoreVertical size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payout Settings */}
                <div className="p-4 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                    <h4 className="font-serif font-bold text-gray-900 dark:text-white mb-4">
                        Payout Settings
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Payout Frequency
                            </label>
                            <select className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="weekly">Weekly</option>
                                <option value="biweekly">Bi-weekly</option>
                                <option value="monthly" selected>Monthly</option>
                                <option value="quarterly">Quarterly</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Minimum Payout Amount
                            </label>
                            <Input
                                type="number"
                                defaultValue="1000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Default Payment Method
                            </label>
                            <select className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="paypal">PayPal</option>
                                <option value="check">Check</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-900 dark:text-white mb-2">
                                Payout Delay (Days)
                            </label>
                            <Input
                                type="number"
                                defaultValue="5"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <Button>
                            Save Settings
                        </Button>
                    </div>
                </div>
            </div>
        </SpotlightCard>
    );
};

// Main AdminBillings Component
const AdminBillings = () => {
    const [activeTab, setActiveTab] = useState('transactions');
    const [reconcileModalOpen, setReconcileModalOpen] = useState(false);

    const tabs = [
        { id: 'transactions', label: 'Transactions', icon: CreditCard },
        { id: 'refunds', label: 'Refunds', icon: RefreshCw },
        { id: 'payouts', label: 'Payouts', icon: Banknote },
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    const handleReconcilePayments = () => {
        setReconcileModalOpen(true);
    };

    const handleExportAll = () => {
        alert('Exporting all billing data...');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-void p-4 sm:p-6 lg:p-8">
            <Helmet>
                <title>Billings | Suave By Chloe</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-2 block">
                        ADMIN_BILLINGS
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Billing & Payments
                            </h1>
                            <p className="font-sans text-gray-600 dark:text-gray-400">
                                Manage transactions, refunds, payouts, and financial reports
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={handleReconcilePayments}
                                variant="secondary"
                                className="flex items-center gap-2"
                            >
                                <Calculator size={18} />
                                Reconcile
                            </Button>
                            <Button
                                onClick={handleExportAll}
                                className="flex items-center gap-2"
                            >
                                <Download size={18} />
                                Export All
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <TrendingUp size={24} className="text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">Revenue (MTD)</p>
                                <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                                    $45,250
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-green-500" />
                            <span className="text-sm font-sans text-green-600 dark:text-green-400">+12.5%</span>
                            <span className="text-sm font-sans text-gray-500 dark:text-gray-400 ml-auto">vs last month</span>
                        </div>
                    </SpotlightCard>
                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <RefreshCw size={24} className="text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">Refunds (MTD)</p>
                                <p className="text-2xl font-serif font-bold text-red-600 dark:text-red-400">
                                    -$2,850
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingDown size={16} className="text-red-500" />
                            <span className="text-sm font-sans text-red-600 dark:text-red-400">-8.2%</span>
                            <span className="text-sm font-sans text-gray-500 dark:text-gray-400 ml-auto">vs last month</span>
                        </div>
                    </SpotlightCard>
                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Banknote size={24} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">Processing Fees</p>
                                <p className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-400">
                                    -$1,357
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Percent size={16} className="text-amber-500" />
                            <span className="text-sm font-sans text-amber-600 dark:text-amber-400">3.0%</span>
                            <span className="text-sm font-sans text-gray-500 dark:text-gray-400 ml-auto">of revenue</span>
                        </div>
                    </SpotlightCard>
                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <Shield size={24} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">Net Revenue</p>
                                <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                                    $41,043
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-green-500" />
                            <span className="text-sm font-sans text-green-600 dark:text-green-400">+11.8%</span>
                            <span className="text-sm font-sans text-gray-500 dark:text-gray-400 ml-auto">vs last month</span>
                        </div>
                    </SpotlightCard>
                </div>

                {/* Navigation Tabs */}
                <div className="mb-8">
                    <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10">
                        <div className="p-4">
                            <div className="flex flex-wrap gap-2">
                                {tabs.map(tab => {
                                    const Icon = tab.icon;
                                    return (
                                        <Button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            variant={activeTab === tab.id ? 'primary' : 'secondary'}
                                            className={`flex items-center gap-2 py-3 ${activeTab !== tab.id ? 'bg-gray-100 dark:bg-white/5 border-transparent' : ''}`}
                                        >
                                            <Icon size={18} />
                                            {tab.label}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    </SpotlightCard>
                </div>

                {/* Main Content */}
                <div className="mb-8">
                    {activeTab === 'transactions' && <TransactionsOverview />}
                    {activeTab === 'refunds' && <RefundsManager />}
                    {activeTab === 'payouts' && <PayoutsManager />}
                    {activeTab === 'reports' && (
                        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                            <div className="text-center py-12">
                                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Financial Reports
                                </h3>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-4">
                                    Generate detailed financial reports and analytics
                                </p>
                                <Button>
                                    View Reports
                                </Button>
                            </div>
                        </SpotlightCard>
                    )}
                    {activeTab === 'settings' && (
                        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                            <div className="text-center py-12">
                                <Settings size={48} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Payment Settings
                                </h3>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-4">
                                    Configure payment gateways and billing settings
                                </p>
                                <Button>
                                    Configure Settings
                                </Button>
                            </div>
                        </SpotlightCard>
                    )}
                </div>

                {/* Recent Activity */}
                <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="font-sans font-medium text-gray-900 dark:text-white">
                                        Payment processed for Michael Chen
                                    </p>
                                    <p className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                        TX-78901234 • $1,497.00 • Credit Card
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                2 hours ago
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                    <RefreshCw size={20} className="text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <p className="font-sans font-medium text-gray-900 dark:text-white">
                                        Refund initiated for Sarah Wilson
                                    </p>
                                    <p className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                        REF-789012 • -$850.00 • Credit Card
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                1 day ago
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <Banknote size={20} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="font-sans font-medium text-gray-900 dark:text-white">
                                        Monthly payout processed
                                    </p>
                                    <p className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                        POUT-202406 • $145,500 • Bank Transfer
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                3 days ago
                            </span>
                        </div>
                    </div>
                </SpotlightCard>
            </div>
        </div>
    );
};

export default AdminBillings;