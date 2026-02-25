"use client"

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  HardDrive,
  Wrench,
  ArrowLeft,
  DollarSign,
  Activity,
  User,
  Percent,
  AlertCircle,
} from 'lucide-react';
import { api } from '@/lib/api';
import { isAdmin } from '@/lib/api/storage';
import { ROUTES } from '@/lib/routes';
import { formatBytes } from '@/lib/entitlements';
import Navbar from '@/sections/Navbar';

// ============================================
// Types
// ============================================

interface AdminOverview {
  kpis: {
    totalVisitors: number;
    totalUsers: number;
    totalSubscribers: number;
    conversionRate: number;
    monthlyRecurringRevenue: number;
  };
  storage: {
    totalUsedBytes: number;
    averageProjectSizeBytes: number;
    projectCount: number;
  };
  topTools: Array<{
    slug: string;
    name: string;
    runCount: number;
  }>;
  users: Array<{
    id: string;
    name: string;
    email: string;
    plan: string;
    usagePercent: number;
    createdAt: string;
  }>;
}

// ============================================
// Components
// ============================================

const KPICard = ({ 
  title, 
  value, 
  icon: Icon, 
  color,
  subtitle 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType; 
  color: string;
  subtitle?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-[#1B2D2B] rounded-2xl p-6 border border-gray-100 dark:border-gray-800"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-green-dark dark:text-white">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
);

const UsersTable = ({ users }: { users: AdminOverview['users'] }) => (
  <div className="bg-white dark:bg-[#1B2D2B] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
      <h3 className="text-lg font-bold text-green-dark dark:text-white flex items-center gap-2">
        <Users className="w-5 h-5 text-green-primary" />
        المستخدمين
      </h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">المستخدم</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الباقة</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الاستخدام</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">تاريخ التسجيل</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-green-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-dark dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.plan === 'free' ? 'bg-gray-100 text-gray-600' :
                  user.plan === 'pro' ? 'bg-blue-100 text-blue-600' :
                  user.plan === 'business' ? 'bg-purple-100 text-purple-600' :
                  'bg-amber-100 text-amber-600'
                }`}>
                  {user.plan}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        user.usagePercent > 80 ? 'bg-red-500' :
                        user.usagePercent > 50 ? 'bg-amber-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${user.usagePercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{user.usagePercent}%</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString('ar-SA')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TopToolsChart = ({ tools }: { tools: AdminOverview['topTools'] }) => (
  <div className="bg-white dark:bg-[#1B2D2B] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
    <h3 className="text-lg font-bold text-green-dark dark:text-white flex items-center gap-2 mb-6">
      <Wrench className="w-5 h-5 text-green-primary" />
      الأدوات الأكثر استخداماً
    </h3>
    <div className="space-y-4">
      {tools.map((tool, index) => (
        <div key={tool.slug} className="flex items-center gap-4">
          <span className="w-6 h-6 rounded-full bg-green-primary/10 text-green-primary text-xs font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium text-green-dark dark:text-white">{tool.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(tool.runCount / tools[0].runCount) * 100}%` }}
                className="h-full bg-green-primary rounded-full"
              />
            </div>
            <span className="text-xs text-gray-500 w-10 text-left">{tool.runCount}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StorageCard = ({ storage }: { storage: AdminOverview['storage'] }) => (
  <div className="bg-white dark:bg-[#1B2D2B] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
    <h3 className="text-lg font-bold text-green-dark dark:text-white flex items-center gap-2 mb-6">
      <HardDrive className="w-5 h-5 text-green-primary" />
      التخزين
    </h3>
    <div className="space-y-6">
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">إجمالي التخزين المستخدم</span>
          <span className="font-bold text-green-dark dark:text-white">{formatBytes(storage.totalUsedBytes)}</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '45%' }}
            className="h-full bg-gradient-to-r from-green-primary to-green-teal rounded-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">عدد المشاريع</p>
          <p className="text-xl font-bold text-green-dark dark:text-white">{storage.projectCount}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">متوسط حجم المشروع</p>
          <p className="text-xl font-bold text-green-dark dark:text-white">
            {formatBytes(storage.averageProjectSizeBytes)}
          </p>
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// Main Component
// ============================================

export default function AdminPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    // Check admin access
    if (!isAdmin()) {
      setIsAuthorized(false);
      setLoading(false);
      return;
    }

    // Fetch admin overview
    api.getAdminOverview().then((response) => {
      if (response.success && response.overview) {
        setOverview(response.overview);
      }
      setLoading(false);
    });
  }, []);

  if (!isAuthorized) {
    return (
      <div dir="rtl" className="min-h-screen bg-gray-50 dark:bg-[#0D1B1A]">
        <Navbar />
        <div className="h-[80px]" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-dark dark:text-white mb-2">غير مصرح</h1>
            <p className="text-gray-500 mb-6">ليس لديك صلاحية الوصول لهذه الصفحة</p>
            <Link 
              to={ROUTES.HOME}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-primary text-white rounded-xl hover:bg-green-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-gray-50 dark:bg-[#0D1B1A]">
        <Navbar />
        <div className="h-[80px]" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-8 h-8 border-4 border-green-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div dir="rtl" className="min-h-screen bg-gray-50 dark:bg-[#0D1B1A]">
        <Navbar />
        <div className="h-[80px]" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-500">حدث خطأ في تحميل البيانات</p>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 dark:bg-[#0D1B1A]">
      <Navbar />
      <div className="h-[80px]" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-primary to-green-teal flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-dark dark:text-white">لوحة التحكم</h1>
              <p className="text-sm text-gray-500">نظرة عامة على المنصة والمستخدمين</p>
            </div>
          </div>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <KPICard
            title="الزوار"
            value={overview.kpis.totalVisitors.toLocaleString()}
            icon={Activity}
            color="bg-blue-500"
            subtitle="هذا الشهر"
          />
          <KPICard
            title="المستخدمين"
            value={overview.kpis.totalUsers}
            icon={Users}
            color="bg-green-500"
          />
          <KPICard
            title="المشتركين"
            value={overview.kpis.totalSubscribers}
            icon={TrendingUp}
            color="bg-purple-500"
          />
          <KPICard
            title="معدل التحويل"
            value={`${overview.kpis.conversionRate}%`}
            icon={Percent}
            color="bg-amber-500"
          />
          <KPICard
            title="الإيراد الشهري"
            value={`$${overview.kpis.monthlyRecurringRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="bg-emerald-500"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Users Table - Full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-2">
            <UsersTable users={overview.users} />
          </div>
          
          {/* Side Cards */}
          <div className="space-y-8">
            <StorageCard storage={overview.storage} />
            <TopToolsChart tools={overview.topTools} />
          </div>
        </div>
      </main>

      {/* Back Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Link 
          to={ROUTES.HOME}
          className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-[#1B2D2B] rounded-full shadow-xl border border-green-primary/10 hover:border-green-primary/30 transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-green-primary" />
          <span className="text-sm font-medium text-green-dark dark:text-white">العودة</span>
        </Link>
      </div>
    </div>
  );
}
