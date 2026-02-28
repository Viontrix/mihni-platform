import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Settings, 
  Bell, 
  Search,
  Download,
  Clock,
  Briefcase,
  Plus,
  Calendar,
  Award,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Crown,
  FolderOpen,
  Trash2,
  Edit3,
  Cloud,
  Sparkles,
  Filter,
  AlertTriangle,
  LogOut,
  Globe,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSavedProjects, deleteProject } from '@/lib/storage/projects';
import type { SavedProject } from '@/lib/tools/types';
import { getStorageInfo, formatBytes, getStorageWarningLevel } from '@/lib/storage/storage-tracker';
import { getPlanById, formatStorage } from '@/lib/entitlements/plans';
import { ROUTES, getPaymentUrl, getHomeSectionUrl } from '@/lib/routes';
import { logout } from '@/lib/auth/store';
import { useTheme } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Stats data - calculated from real projects
interface DashboardStats {
  filesCount: number;
  totalDownloads: number;
  timeSaved: number;
  toolsUsed: number;
}

// Quick tools data
const quickTools = [
  { name: 'منشئ الشهادات', icon: Award, color: 'from-amber-400 to-orange-500', desc: 'صمم شهادات احترافية', link: '/tools/certificate-maker' },
  { name: 'منشئ الاختبارات', icon: FileText, color: 'from-green-400 to-emerald-500', desc: 'أنشئ اختبارات ذكية', link: '/tools/quiz-generator' },
  { name: 'محلل الأداء', icon: BarChart3, color: 'from-rose-400 to-pink-500', desc: 'حلل النتائج والأداء', link: '/tools/performance-analyzer' },
  { name: 'منشئ الجداول', icon: Calendar, color: 'from-purple-400 to-violet-500', desc: 'نظم جداولك', link: '/tools/schedule-builder' },
];

// Sidebar items using centralized routes
const sidebarItems = [
  { id: 'dashboard', name: 'لوحة التحكم', icon: LayoutDashboard, active: true, link: ROUTES.DASHBOARD },
  { id: 'templates', name: 'قوالبي', icon: FolderOpen, active: false, link: ROUTES.TEMPLATES },
  { id: 'tools', name: 'الأدوات الذكية', icon: Zap, active: false, link: ROUTES.START },
  { id: 'settings', name: 'الإعدادات', icon: Settings, active: false, link: ROUTES.ACCOUNT },
];

// Tool name mapping
const toolNameMap: Record<string, string> = {
  'certificate-maker': 'شهادة',
  'quiz-generator': 'اختبار',
  'schedule-builder': 'جدول',
  'performance-analyzer': 'تحليل',
  'report-builder': 'تقرير',
  'survey-builder': 'استبيان',
};

// Format date relative
function formatRelativeDate(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;
  if (days < 7) return `منذ ${days} يوم`;
  return new Date(timestamp).toLocaleDateString('ar-SA');
}

// Estimate file size from project data
function estimateProjectSize(project: SavedProject): string {
  const dataSize = JSON.stringify(project.data).length * 2; // UTF-16
  const sizeKB = dataSize / 1024;
  
  if (sizeKB < 100) return `${Math.round(sizeKB)} KB`;
  if (sizeKB < 1024) return `${Math.round(sizeKB)} KB`;
  return `${(sizeKB / 1024).toFixed(1)} MB`;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToolFilter, setSelectedToolFilter] = useState<string>('all');
  const [storageInfo, setStorageInfo] = useState({ used: 0, limit: 0, percentage: 0 });
  const [greeting, setGreeting] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [notifications] = useState(3);
  
  // Mock user data - would come from auth system
  const [userData] = useState({
    name: 'أحمد محمد',
    plan: 'pro' as 'free' | 'pro' | 'business' | 'enterprise',
    avatar: 'أ',
  });

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  const userPlan = getPlanById(userData.plan);
  
  // Load data on mount
  useEffect(() => {
    // Load projects
    const savedProjects = getSavedProjects();
    setProjects(savedProjects);
    
    // Load storage info
    const info = getStorageInfo();
    setStorageInfo(info);
    
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('صباح الخير');
    else if (hour < 18) setGreeting('مساء الخير');
    else setGreeting('مساء الخير');
  }, []);

  // Calculate stats from real projects
  const stats: DashboardStats = useMemo(() => {
    const uniqueTools = new Set(projects.map(p => p.toolId));
    // Estimate time saved: 5 minutes per project
    const timeSaved = projects.length * 5;
    // Estimate downloads: 70% of projects have been downloaded
    const downloads = Math.floor(projects.length * 0.7);
    
    return {
      filesCount: projects.length,
      totalDownloads: downloads,
      timeSaved,
      toolsUsed: uniqueTools.size,
    };
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.toolName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTool = selectedToolFilter === 'all' || project.toolId === selectedToolFilter;
      return matchesSearch && matchesTool;
    });
  }, [projects, searchQuery, selectedToolFilter]);

  // Get unique tools for filter
  const uniqueTools = useMemo(() => {
    const tools = new Map<string, string>();
    projects.forEach(p => {
      if (!tools.has(p.toolId)) {
        tools.set(p.toolId, p.toolName);
      }
    });
    return Array.from(tools.entries());
  }, [projects]);

  // Handle delete project
  const handleDeleteProject = (projectId: string) => {
    if (deleteProject(projectId)) {
      setProjects(getSavedProjects());
      setShowDeleteConfirm(null);
    }
  };

  // Storage warning
  const storageWarning = getStorageWarningLevel(storageInfo.percentage);

  // Stats cards data
  const statsCards = [
    { 
      title: 'الملفات', 
      value: stats.filesCount.toString(), 
      change: '+1', 
      trend: 'up' as const,
      icon: FolderOpen, 
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'إجمالي التحميلات', 
      value: stats.totalDownloads.toString(), 
      change: '+2', 
      trend: 'up' as const,
      icon: Download, 
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'الوقت الموفّر', 
      value: `${stats.timeSaved} دقيقة`, 
      change: '+5', 
      trend: 'up' as const,
      icon: Clock, 
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50'
    },
    { 
      title: 'الأدوات المستخدمة', 
      value: stats.toolsUsed.toString(), 
      change: '+1', 
      trend: 'up' as const,
      icon: Zap, 
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF9] dark:bg-[#0D1B1A]" dir="rtl">
      {/* Header */}
      <header className="bg-white dark:bg-[#1B2D2B] border-b border-green-primary/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-primary to-green-teal flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-green-dark dark:text-white">مِهني</span>
            </Link>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في ملفاتي..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 rounded-xl border border-green-primary/20 focus:border-green-primary bg-gray-50 dark:bg-[#0D1B1A] text-sm"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#152B26] transition-colors">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                {notifications > 0 && (
                  <span className="absolute top-1 left-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              
              {/* Settings Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#152B26] transition-colors">
                    <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[200px]">
                  <div className="px-3 py-2 text-sm font-medium text-gray-500">المظهر</div>
                  <DropdownMenuItem onClick={() => setTheme('light')} className="gap-2">
                    <Sun className="w-4 h-4" />
                    <span>فاتح</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')} className="gap-2">
                    <Moon className="w-4 h-4" />
                    <span>داكن</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="px-3 py-2 text-sm font-medium text-gray-500">اللغة</div>
                  <DropdownMenuItem className="gap-2" disabled>
                    <Globe className="w-4 h-4" />
                    <span>العربية (الافتراضي)</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="flex items-center gap-3 pr-4 border-r border-gray-200 dark:border-gray-700">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-green-dark dark:text-white">{userData.name}</p>
                  <p className="text-xs text-gray-500">{userPlan?.nameAr || 'المجانية'}</p>
                </div>
                
                {/* User Dropdown with Logout */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-10 h-10 rounded-full bg-gradient-to-br from-green-primary to-green-teal flex items-center justify-center text-white font-bold hover:opacity-90 transition-opacity">
                      {userData.avatar}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[180px]">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="font-medium text-sm">{userData.name}</p>
                      <p className="text-xs text-gray-500">{userPlan?.nameAr}</p>
                    </div>
                    <Link to={ROUTES.ACCOUNT}>
                      <DropdownMenuItem className="gap-2">
                        <Settings className="w-4 h-4" />
                        <span>الإعدادات</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="gap-2 text-red-600 focus:text-red-600">
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.id} whileHover={{ x: 5 }}>
                    <Link
                      to={item.link}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        item.active
                          ? 'bg-gradient-to-r from-green-primary to-green-teal text-white shadow-lg'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-green-primary/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Storage Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-5 bg-white dark:bg-[#1B2D2B] rounded-2xl border border-green-primary/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-green-primary" />
                  <span className="font-bold text-green-dark dark:text-white text-sm">سعة التخزين</span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatBytes(storageInfo.used)} / {userPlan?.storageGB === -1 ? '∞' : formatStorage(userPlan?.storageGB || 0)}
                </span>
              </div>
              
              <div className="relative h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                <motion.div 
                  className={`absolute inset-y-0 right-0 rounded-full transition-colors ${
                    storageWarning === 'critical' ? 'bg-red-500' : 
                    storageWarning === 'warning' ? 'bg-amber-500' : 'bg-green-primary'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              
              {storageWarning !== 'normal' && (
                <div className={`flex items-center gap-2 mb-3 p-2 rounded-lg ${
                  storageWarning === 'critical' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs">
                    {storageWarning === 'critical' 
                      ? 'مساحة التخزين شبه ممتلئة!' 
                      : 'مساحة التخزين تقترب من الامتلاء'}
                  </span>
                </div>
              )}
              
              <Link to={getPaymentUrl({ addon: 'storage' })}>
                <Button variant="outline" size="sm" className="w-full text-xs border-green-primary text-green-primary hover:bg-green-primary hover:text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  زيادة السعة
                </Button>
              </Link>
            </motion.div>

            {/* Quick Upgrade */}
            {userData.plan !== 'enterprise' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 p-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl text-white"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold">الترقية للبرو</span>
                </div>
                <p className="text-sm text-white/80 mb-4">احصل على مميزات إضافية وتخزين أكبر</p>
                <Link to={getPaymentUrl({ from: 'dashboard' })}>
                  <Button className="w-full bg-white text-orange-500 hover:bg-white/90 font-bold">
                    ترقية الآن
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4 space-y-8">
            {/* Welcome Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-primary to-green-teal rounded-3xl p-6 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
              
              <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-white/80 text-sm mb-1">{greeting} 👋</p>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    مرحباً بك، {userData.name}!
                  </h1>
                  <p className="text-white/80 text-sm">
                    لديك <span className="font-bold text-white">{projects.length} ملف</span> محفوظ
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link to={getHomeSectionUrl('templates')}>
                    <Button className="bg-white text-green-primary hover:bg-white/90 rounded-xl font-bold">
                      <Plus className="w-4 h-4 mr-2" />
                      مشروع جديد
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statsCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-[#1B2D2B] rounded-2xl p-5 border border-green-primary/10 hover:border-green-primary/30 transition-all shadow-sm hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} text-white rounded-lg p-1`} />
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {stat.change}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-green-dark dark:text-white">{stat.value}</h3>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick Tools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-lg font-bold text-green-dark dark:text-white mb-4">أدوات سريعة</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickTools.map((tool, index) => {
                  const Icon = tool.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to={tool.link}
                        className="block bg-white dark:bg-[#1B2D2B] rounded-2xl p-5 border border-green-primary/10 hover:border-green-primary/40 transition-all text-center group"
                      >
                        <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="font-bold text-green-dark dark:text-white text-sm">{tool.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{tool.desc}</p>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Projects Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-[#1B2D2B] rounded-2xl border border-green-primary/10 overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-green-primary/10 flex-wrap gap-4">
                <h2 className="text-lg font-bold text-green-dark dark:text-white flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-green-primary" />
                  ملفاتي
                </h2>
                <div className="flex items-center gap-3">
                  {/* Tool Filter */}
                  <div className="relative">
                    <select
                      value={selectedToolFilter}
                      onChange={(e) => setSelectedToolFilter(e.target.value)}
                      className="appearance-none bg-gray-50 dark:bg-[#152B26] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 pr-10 text-sm focus:border-green-primary focus:outline-none"
                    >
                      <option value="all">جميع الأدوات</option>
                      {uniqueTools.map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                      ))}
                    </select>
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <Link to={getHomeSectionUrl('templates')}>
                    <Button size="sm" className="bg-green-primary text-white">
                      <Plus className="w-4 h-4 mr-1" />
                      جديد
                    </Button>
                  </Link>
                </div>
              </div>
              
              {filteredProjects.length === 0 ? (
                <div className="p-10 text-center">
                  <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد ملفات بعد'}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {searchQuery ? 'جرب البحث بكلمات مختلفة' : 'ابدأ بإنشاء مشروعك الأول'}
                  </p>
                  <Link to={getHomeSectionUrl('templates')}>
                    <Button className="bg-green-primary text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      إنشاء مشروع جديد
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-[#152B26]">
                      <tr>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">الملف</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">النوع</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">التاريخ</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">الحجم</th>
                        <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {filteredProjects.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-[#152B26] transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-green-primary/10 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-green-primary" />
                              </div>
                              <span className="font-medium text-green-dark dark:text-white text-sm">{project.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant="outline" className="text-xs">
                              {toolNameMap[project.toolId] || project.toolName}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-500">{formatRelativeDate(project.updatedAt)}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-500">{estimateProjectSize(project)}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Link to={`/tools/${project.toolId}?project=${project.id}`}>
                                <button className="p-2 rounded-lg hover:bg-blue-500/10 text-gray-500 hover:text-blue-500 transition-colors" title="تعديل">
                                  <Edit3 className="w-4 h-4" />
                                </button>
                              </Link>
                              <button 
                                onClick={() => setShowDeleteConfirm(project.id)}
                                className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-colors"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>

            {/* Activity Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-[#1B2D2B] rounded-2xl p-6 border border-green-primary/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-green-dark dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-primary" />
                  نشاطك
                </h2>
              </div>
              <div className="h-48 bg-gradient-to-br from-green-primary/5 to-green-teal/5 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-green-primary/30 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">سيتم عرض إحصائيات الاستخدام قريباً</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-[#1B2D2B] rounded-2xl p-6 max-w-sm w-full"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-green-dark dark:text-white mb-2">
                حذف المشروع؟
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => handleDeleteProject(showDeleteConfirm)}
                  className="flex-1 bg-red-500 text-white hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  حذف
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
