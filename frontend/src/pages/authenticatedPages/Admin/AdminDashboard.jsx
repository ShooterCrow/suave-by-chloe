import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
    TrendingUp,
    TrendingDown,
    Users,
    DollarSign,
    Home,
    Calendar,
    Clock,
    MoreVertical,
    Filter,
    Download,
    CheckCircle,
    XCircle,
    ChevronRight,
    Star
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import SpotlightCard from '../../../components/ui/SpotlightCard';


// Stats Card Component
const StatsCard = ({ title, value, change, trend, icon: Icon, color }) => {
    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm font-sans font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {title}
                    </p>
                    <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                        {value}
                    </p>
                </div>
                <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-')}/15 dark:${color.replace('text-', 'bg-')}/20`}>
                    <Icon className={color} size={24} />
                </div>
            </div>
            <div className="flex items-center gap-2">
                {trend === 'up' ? (
                    <TrendingUp size={16} className="text-green-500" />
                ) : (
                    <TrendingDown size={16} className="text-red-500" />
                )}
                <span className={`text-sm font-sans font-medium ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                    {change}
                </span>
                <span className="text-sm font-sans text-gray-500 dark:text-gray-400 ml-auto">
                    vs last month
                </span>
            </div>
        </SpotlightCard>
    );
};

// Revenue Overview Component with Recharts
const RevenueOverview = () => {
    const revenueData = [
        { month: 'Jan', revenue: 85000000, bookings: 156 },
        { month: 'Feb', revenue: 92000000, bookings: 178 },
        { month: 'Mar', revenue: 88000000, bookings: 165 },
        { month: 'Apr', revenue: 95000000, bookings: 189 },
        { month: 'May', revenue: 120000000, bookings: 245 },
        { month: 'Jun', revenue: 145000000, bookings: 298 },
        { month: 'Jul', revenue: 165000000, bookings: 342 },
    ];

    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                        Revenue Overview
                    </h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        Last 7 months performance
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-white">
                        <Filter size={18} />
                    </button>
                    <button className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-white">
                        <Download size={18} />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                    <div>
                        <p className="text-3xl font-serif font-bold text-gray-900 dark:text-white">₦165,000,000</p>
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400">Current month revenue</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp size={20} className="text-green-500" />
                        <span className="text-green-600 dark:text-green-400 font-sans font-medium">+24.5%</span>
                    </div>
                </div>

                <div className="h-64 mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="month"
                                stroke="#9ca3af"
                                style={{ fontSize: '12px', fontFamily: 'system-ui' }}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                style={{ fontSize: '12px', fontFamily: 'system-ui' }}
                                tickFormatter={(value) => `₦${value / 1000000}M`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                                formatter={(value) => [`₦${value.toLocaleString()}`, 'Revenue']}
                            />
                            <Bar dataKey="revenue" fill="#2563eb" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </SpotlightCard>
    );
};

// Occupancy Rate Component with Recharts
const OccupancyRate = () => {
    const occupancyData = [
        { roomType: 'Deluxe Suite', occupied: 12, total: 15, percentage: 80 },
        { roomType: 'Executive', occupied: 8, total: 10, percentage: 80 },
        { roomType: 'Standard', occupied: 18, total: 20, percentage: 90 },
    ];

    const pieData = [
        { name: 'Occupied', value: 38, color: '#2563eb' },
        { name: 'Available', value: 7, color: '#e5e7eb' }
    ];

    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                        Occupancy Rate
                    </h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        Current room occupancy
                    </p>
                </div>
            </div>

            <div className="h-48 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="text-center -mt-32">
                    <p className="text-3xl font-serif font-bold text-blue-600 dark:text-blue-400">84%</p>
                    <p className="text-xs font-sans text-gray-600 dark:text-gray-400">Occupancy</p>
                </div>
            </div>

            <div className="space-y-4">
                {occupancyData.map((data, index) => {
                    const percentage = (data.occupied / data.total) * 100;
                    return (
                        <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-sans font-medium text-gray-900 dark:text-white">
                                    {data.roomType}
                                </span>
                                <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                                    {data.occupied}/{data.total} rooms
                                </span>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-blue-600 dark:bg-blue-500"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </SpotlightCard>
    );
};

// Upcoming Check-ins Component
const UpcomingCheckIns = () => {
    const checkIns = [
        {
            id: 1,
            guest: 'Michael Chen',
            room: 'Deluxe City Suite',
            checkIn: 'Today, 2:00 PM',
            status: 'confirmed',
            nights: 3,
            bookingNo: 'RES-789012'
        },
        {
            id: 2,
            guest: 'Sarah Wilson',
            room: 'Executive Penthouse',
            checkIn: 'Today, 4:30 PM',
            status: 'pending',
            nights: 5,
            bookingNo: 'RES-789013'
        },
        {
            id: 3,
            guest: 'Robert Davis',
            room: 'Standard King',
            checkIn: 'Tomorrow, 11:00 AM',
            status: 'confirmed',
            nights: 2,
            bookingNo: 'RES-789014'
        },
        {
            id: 4,
            guest: 'Emily Johnson',
            room: 'Garden Villa',
            checkIn: 'Tomorrow, 3:00 PM',
            status: 'confirmed',
            nights: 4,
            bookingNo: 'RES-789015'
        },
    ];

    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                        Upcoming Check-ins
                    </h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        Next 24 hours
                    </p>
                </div>
                <button className="text-blue-600 dark:text-blue-400 text-sm font-sans font-medium hover:text-blue-700 dark:hover:text-blue-300">
                    View All
                </button>
            </div>

            <div className="space-y-4">
                {checkIns.map((checkIn) => (
                    <div key={checkIn.id} className="p-4 rounded-lg border border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-blue-600 dark:bg-blue-500">
                                        {checkIn.guest.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h4 className="font-sans font-medium text-gray-900 dark:text-white">
                                            {checkIn.guest}
                                        </h4>
                                        <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                            {checkIn.room}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Check-in</p>
                                        <p className="text-sm font-sans font-medium text-gray-900 dark:text-white">
                                            {checkIn.checkIn}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Stay</p>
                                        <p className="text-sm font-sans font-medium text-gray-900 dark:text-white">
                                            {checkIn.nights} nights
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-medium mb-2 ${checkIn.status === 'confirmed'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    }`}>
                                    {checkIn.status === 'confirmed' ? (
                                        <CheckCircle size={12} />
                                    ) : (
                                        <Clock size={12} />
                                    )}
                                    {checkIn.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                </div>
                                <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                    {checkIn.bookingNo}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </SpotlightCard>
    );
};

// Upcoming Check-outs Component
const UpcomingCheckOuts = () => {
    const checkOuts = [
        {
            id: 1,
            guest: 'James Miller',
            room: 'Deluxe City Suite',
            checkOut: 'Today, 11:00 AM',
            status: 'checked-out',
            total: '₦1,497,000'
        },
        {
            id: 2,
            guest: 'Lisa Thompson',
            room: 'Executive Penthouse',
            checkOut: 'Today, 12:00 PM',
            status: 'pending',
            total: '₦4,250,000'
        },
        {
            id: 3,
            guest: 'David Wilson',
            room: 'Standard Queen',
            checkOut: 'Tomorrow, 10:00 AM',
            status: 'active',
            total: '₦598,000'
        },
    ];

    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                        Upcoming Check-outs
                    </h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        Today & tomorrow
                    </p>
                </div>
                <button className="text-blue-600 dark:text-blue-400 text-sm font-sans font-medium hover:text-blue-700 dark:hover:text-blue-300">
                    View All
                </button>
            </div>

            <div className="space-y-4">
                {checkOuts.map((checkOut) => (
                    <div key={checkOut.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white bg-blue-600 dark:bg-blue-500">
                                <Home size={20} />
                            </div>
                            <div>
                                <h4 className="font-sans font-medium text-gray-900 dark:text-white">
                                    {checkOut.guest}
                                </h4>
                                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                                    {checkOut.room}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-medium mb-1 ${checkOut.status === 'checked-out'
                                ? 'bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-400'
                                : checkOut.status === 'active'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}>
                                {checkOut.status === 'checked-out' ? (
                                    <XCircle size={12} />
                                ) : checkOut.status === 'active' ? (
                                    <CheckCircle size={12} />
                                ) : (
                                    <Clock size={12} />
                                )}
                                {checkOut.status === 'checked-out' ? 'Checked Out' :
                                    checkOut.status === 'active' ? 'Active' : 'Pending'}
                            </div>
                            <div>
                                <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Check-out</p>
                                <p className="text-sm font-sans font-medium text-gray-900 dark:text-white">
                                    {checkOut.checkOut}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-sans text-gray-500 dark:text-gray-400">Total</p>
                            <p className="text-lg font-serif font-bold text-gray-900 dark:text-white">
                                {checkOut.total}
                            </p>
                        </div>
                        <button className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-white">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </SpotlightCard>
    );
};

// Recent Activity Component
const RecentActivity = () => {
    const activities = [
        { user: 'Sarah Johnson', action: 'checked in', room: 'Deluxe City Suite', time: '10 min ago' },
        { user: 'Michael Chen', action: 'made a reservation', room: 'Executive Penthouse', time: '25 min ago' },
        { user: 'Robert Davis', action: 'checked out', room: 'Standard King', time: '1 hour ago' },
        { user: 'Emily Wilson', action: 'requested late checkout', room: 'Garden Villa', time: '2 hours ago' },
    ];

    return (
        <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                        Recent Activity
                    </h3>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                        Latest hotel activities
                    </p>
                </div>
                <button className="text-blue-600 dark:text-blue-400 text-sm font-sans font-medium hover:text-blue-700 dark:hover:text-blue-300">
                    View All
                </button>
            </div>

            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-blue-600 dark:bg-blue-500">
                            {activity.user.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-sans text-gray-900 dark:text-white">
                                <span className="font-medium">{activity.user}</span>{' '}
                                {activity.action}{' '}
                                <span className="font-medium">{activity.room}</span>
                            </p>
                            <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                {activity.time}
                            </p>
                        </div>
                        <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-white">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </SpotlightCard>
    );
};

// Main Admin Dashboard Component
const AdminDashboard = () => {
    return (
        <>
            <Helmet>
                <title>Dashboard | Suave By Chloe</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            {/* Page Header */}
            <div className="mb-8">
                <span className="font-mono text-sm text-blue-500 tracking-widest uppercase mb-2 block">
                    ADMIN_DASHBOARD
                </span>
                <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Dashboard Overview
                </h1>
                <p className="font-sans text-gray-600 dark:text-gray-400">
                    Welcome back, Sarah! Here's what's happening with your hotel today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Revenue"
                    value="₦145,000,000"
                    change="+24.5%"
                    trend="up"
                    icon={DollarSign}
                    color="text-green-500"
                />
                <StatsCard
                    title="Occupancy Rate"
                    value="84%"
                    change="+8.2%"
                    trend="up"
                    icon={Home}
                    color="text-blue-500"
                />
                <StatsCard
                    title="Check-ins Today"
                    value="42"
                    change="+12.3%"
                    trend="up"
                    icon={Users}
                    color="text-purple-500"
                />
                <StatsCard
                    title="Check-outs Today"
                    value="38"
                    change="-3.4%"
                    trend="down"
                    icon={Calendar}
                    color="text-orange-500"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                    <RevenueOverview />
                </div>
                <div>
                    <OccupancyRate />
                </div>
            </div>

            {/* Check-ins & Check-outs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <UpcomingCheckIns />
                <UpcomingCheckOuts />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecentActivity />
                </div>

                {/* Quick Stats */}
                <SpotlightCard className="rounded-2xl border bg-white border-gray-200 dark:bg-dark-800 dark:border-white/10 p-6">
                    <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Quick Stats
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-1">
                                Average Daily Rate
                            </p>
                            <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                                ₦289,000
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-1">
                                Revenue Per Available Room
                            </p>
                            <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                                ₦243,000
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-1">
                                Guest Satisfaction
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={16}
                                            fill={star <= 4 ? "#fbbf24" : "#d1d5db"}
                                            className="text-yellow-400"
                                        />
                                    ))}
                                </div>
                                <span className="text-lg font-serif font-bold text-gray-900 dark:text-white">
                                    4.7/5
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mb-1">
                                Available Rooms
                            </p>
                            <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                                7/45
                            </p>
                        </div>
                    </div>
                </SpotlightCard>
            </div>
        </>
    );
};

export default AdminDashboard;