import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Package, 
  BarChart3, 
  Users,
  Award,
  Zap,
  DollarSign,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';


const StatsCard = ({ title, value, change, trend = 'up', color = 'emerald', icon: Icon }) => {
  const isPositive = trend === 'up' || change >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br opacity-10 ${color === 'emerald' ? 'from-emerald-500' : color === 'amber' ? 'from-amber-500' : 'from-sky-500'}`} />
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-3">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${color === 'emerald' ? 'from-emerald-500 to-teal-600' : color === 'amber' ? 'from-amber-500 to-orange-500' : 'from-sky-500 to-blue-600'} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        
        {change !== undefined && (
          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
            isPositive 
              ? 'bg-emerald-100 text-emerald-800' 
              : 'bg-rose-100 text-rose-800'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
    </motion.div>
  );
};


const VoucherStats = ({
  stats,
  loading,
  error,
  onRetry,
}) => {

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-2xl p-6">
            <div className="h-12 w-12 bg-gray-200 rounded-2xl mb-4"></div>
            <div className="h-8 bg-gray-200 rounded-lg mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load stats</h3>
        <p className="text-gray-500 mb-4">Unable to fetch voucher statistics</p>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatsCard
          title="Total Vouchers"
          value={stats?.total?.toLocaleString() || 0}
          color="emerald"
          icon={Package}
        />
        
        <StatsCard
          title="Active"
          value={stats?.active?.toLocaleString() || 0}
          color="emerald"
          icon={Zap}
        />
        
        <StatsCard
          title="Expired"
          value={stats?.expired?.toLocaleString() || 0}
          color="rose"
          icon={Clock}
        />
        
        <StatsCard
          title="Upcoming"
          value={stats?.upcoming?.toLocaleString() || 0}
          color="amber"
          icon={Calendar}
        />
        
        <StatsCard
          title="Inactive"
          value={stats?.inactive?.toLocaleString() || 0}
          color="slate"
          icon={Activity}
        />
        
        <StatsCard
          title="Total Usage"
          value={stats?.totalUsage?.toLocaleString() || 0}
          color="sky"
          icon={Users}
        />
        
        <StatsCard
          title="₹ Saved"
          value={stats?.totalDiscountGiven ? `₹${(stats.totalDiscountGiven / 1000).toLocaleString('en-IN', { maximumFractionDigits: 0 })}K` : '₹0'}
          color="violet"
          icon={DollarSign}
        />
        
        <StatsCard
          title="Avg Usage"
          value={stats?.totalUsage ? Math.round(stats.totalUsage / stats.total || 0) : 0}
          color="indigo"
          icon={Award}
        />
      </div>
    </div>
  );
};

export default VoucherStats;