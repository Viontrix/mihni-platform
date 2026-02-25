import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
import { ROUTES, FOOTER_LINKS } from '@/lib/routes';

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const socialLinks = [
  { icon: Twitter, href: '#', label: 'تويتر' },
  { icon: Linkedin, href: '#', label: 'لينكد إن' },
  { icon: Instagram, href: '#', label: 'إنستغرام' },
  { icon: Youtube, href: '#', label: 'يوتيوب' },
  { icon: TikTokIcon, href: '#', label: 'تيك توك' },
];

export default function Footer() {
  return (
    <footer className="bg-green-dark dark:bg-[#0D1B1A] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-light rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-teal rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to={ROUTES.HOME} className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-primary to-green-teal flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">مِهني</span>
            </Link>
            <p className="text-gray-300 text-sm mb-8 leading-relaxed max-w-sm">
              منصة القوالب والأدوات الاحترافية الأولى في المملكة العربية السعودية. نُمكّن الأفراد والشركات والجهات الحكومية من إنجاز مهامهم بكفاءة واحترافية.
            </p>
            <div className="space-y-4">
              <a href="mailto:info@viontrix.com" className="flex items-center gap-3 text-gray-300 hover:text-green-light transition-colors text-sm">
                <Mail className="w-5 h-5" />
                info@viontrix.com
              </a>
              <a href="tel:0551665600" className="flex items-center gap-3 text-gray-300 hover:text-green-light transition-colors text-sm">
                <Phone className="w-5 h-5" />
                0551665600
              </a>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <MapPin className="w-5 h-5" />
                الرياض، المملكة العربية السعودية
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-bold mb-6 text-green-light text-lg">المنتج</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold mb-6 text-green-light text-lg">الشركة</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-bold mb-6 text-green-light text-lg">الموارد</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-bold mb-6 text-green-light text-lg">الدعم</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="py-10 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h4 className="font-bold mb-2 text-xl">اشترك في نشرتنا البريدية</h4>
              <p className="text-gray-300 text-sm">احصل على آخر الأخبار والتحديثات والقوالب الجديدة مباشرة إلى بريدك</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 md:w-72 px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-light transition-colors"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-green-primary to-green-teal text-white rounded-xl transition-all hover:shadow-lg font-semibold">
                اشترك
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-400 text-sm">
            © 2025 مِهني. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-green-primary transition-all hover:scale-110"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
