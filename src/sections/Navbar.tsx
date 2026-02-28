import { useState } from 'react';
import { Menu, X, Sun, Moon, Monitor, Briefcase, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES, getHomeSectionUrl, type HomeSection } from '@/lib/routes';
import { isAuthenticated } from '@/lib/auth/store';

// Navigation links using centralized routes
const navLinks = [
  { name: 'الرئيسية', href: getHomeSectionUrl('hero'), type: 'section' as const, sectionId: 'hero' },
  { name: 'أدوات ذكية', href: getHomeSectionUrl('tools'), type: 'section' as const, sectionId: 'tools' },
  { name: 'القوالب', href: getHomeSectionUrl('templates'), type: 'section' as const, sectionId: 'templates' },
  { name: 'الباقات', href: getHomeSectionUrl('pricing'), type: 'section' as const, sectionId: 'pricing' },
  { name: 'الدعم', href: ROUTES.SUPPORT, type: 'page' as const },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  
  // Check if we're on the homepage
  const isHomePage = location.pathname === '/' || location.pathname === '';

  const scrollToSection = (sectionId: HomeSection) => {
    // If not on homepage, navigate to homepage with section param
    if (!isHomePage) {
      navigate(getHomeSectionUrl(sectionId));
    } else {
      // Already on homepage, just scroll
      if (sectionId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.type === 'section' && link.sectionId) {
      scrollToSection(link.sectionId as HomeSection);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white dark:bg-[#0D1B1A] shadow-lg border-b border-gray-100 dark:border-gray-800`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[80px]">
          {/* Logo */}
          <Link 
            to={ROUTES.HOME}
            className="flex items-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-primary to-green-teal flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-green-dark dark:text-white">
              مِهني
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              link.type === 'section' ? (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-primary dark:hover:text-green-light transition-all rounded-xl hover:bg-green-primary/5 flex items-center gap-2"
                >
                  {link.name === 'أدوات ذكية' && <Sparkles className="w-4 h-4" />}
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-primary dark:hover:text-green-light transition-all rounded-xl hover:bg-green-primary/5 flex items-center gap-2"
                >
                  {link.name === 'الدعم' && <MessageCircle className="w-4 h-4" />}
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-11 h-11 border border-green-primary/20 hover:bg-green-primary/10 transition-all"
                >
                  {resolvedTheme === 'dark' ? (
                    <Moon className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Sun className="w-5 h-5 text-amber-500" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px]">
                <DropdownMenuItem onClick={() => setTheme('light')} className="gap-2">
                  <Sun className="w-4 h-4" />
                  <span>فاتح</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')} className="gap-2">
                  <Moon className="w-4 h-4" />
                  <span>داكن</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')} className="gap-2">
                  <Monitor className="w-4 h-4" />
                  <span>النظام</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Login Button - Show only when not authenticated */}
            {!authenticated && (
              <Link to={ROUTES.LOGIN}>
                <Button
                  variant="ghost"
                  className="hidden sm:flex text-green-primary dark:text-green-light hover:bg-green-primary/10 rounded-xl"
                >
                  تسجيل الدخول
                </Button>
              </Link>
            )}

            {/* Dashboard Button - Show when authenticated */}
            {authenticated && (
              <Link to={ROUTES.DASHBOARD}>
                <Button
                  variant="outline"
                  className="hidden sm:flex border-2 border-green-primary text-green-primary hover:bg-green-primary hover:text-white rounded-xl font-semibold"
                >
                  لوحة التحكم
                </Button>
              </Link>
            )}

            {/* Get Started Button - Goes to start page for Guest Mode */}
            <Link to={ROUTES.HOME}>
              <Button className="hidden sm:flex bg-gradient-to-r from-green-primary to-green-teal text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 rounded-xl font-semibold">
                ابدأ مجاناً
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-green-primary/10 animate-slide-up bg-white/95 dark:bg-[#0D1B1A]/95 backdrop-blur-lg rounded-2xl mt-2 mb-4 shadow-xl">
            <div className="flex flex-col gap-2 px-4">
              {/* Main Navigation */}
              {navLinks.map((link) => (
                link.type === 'section' ? (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link)}
                    className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-primary dark:hover:text-green-light hover:bg-green-primary/5 rounded-xl transition-all flex items-center gap-2 text-right"
                  >
                    {link.name === 'أدوات ذكية' && <Sparkles className="w-4 h-4" />}
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-primary dark:hover:text-green-light hover:bg-green-primary/5 rounded-xl transition-all flex items-center gap-2"
                  >
                    {link.name === 'الدعم' && <MessageCircle className="w-4 h-4" />}
                    {link.name}
                  </Link>
                )
              ))}
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-green-primary/10">
                {!authenticated && (
                  <Link to={ROUTES.LOGIN} className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-green-primary text-green-primary hover:bg-green-primary/10 rounded-xl"
                    >
                      تسجيل الدخول
                    </Button>
                  </Link>
                )}
                {authenticated && (
                  <Link to={ROUTES.DASHBOARD} className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-green-primary text-green-primary hover:bg-green-primary hover:text-white rounded-xl"
                    >
                      لوحة التحكم
                    </Button>
                  </Link>
                )}
                <Link to={ROUTES.HOME} className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-green-primary to-green-teal text-white rounded-xl">
                    ابدأ مجاناً
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
