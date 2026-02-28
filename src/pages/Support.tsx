"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  HelpCircle, 
  Search,
  ChevronDown,
  Send,
  ArrowLeft,
  User,
  Clock,
  Headphones,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ROUTES } from '@/lib/routes';
import Navbar from '@/sections/Navbar';
import { PageBackBar } from '@/components/navigation/PageBackBar';

const faqs = [
  {
    question: 'كيف يمكنني البدء باستخدام المنصة؟',
    answer: 'يمكنك البدء فوراً بالضغط على "ابدأ مجاناً" واختيار الأداة المناسبة. لا يتطلب الأمر تسجيلاً للاستخدام الأساسي.',
  },
  {
    question: 'هل يمكنني استخدام الأدوات بدون تسجيل؟',
    answer: 'نعم! جميع الأدوات متاحة للاستخدام الفوري. التسجيل مطلوب فقط عند حفظ المشاريع أو التصدير بدون علامة مائية.',
  },
  {
    question: 'ما هي صيغ التصدير المتاحة؟',
    answer: 'نحن ندعم تصدير الملفات بصيغ PDF و PNG. الباقات المدفوعة تدعم أيضاً Word و Excel.',
  },
  {
    question: 'كيف يمكنني ترقية باقتي؟',
    answer: 'يمكنك ترقية باقتك من خلال الذهاب إلى صفحة الباقات واختيار الباقة المناسبة لك، ثم إتمام عملية الدفع.',
  },
  {
    question: 'هل يوجد دعم فني متاح؟',
    answer: 'نعم، فريق الدعم الفني متاح عبر الدردشة المباشرة للباقات المدفوعة. يمكنك أيضاً التواصل معنا عبر البريد الإلكتروني.',
  },
  {
    question: 'كيف يمكنني زيادة سعة التخزين؟',
    answer: 'يمكنك زيادة سعة التخزين من لوحة التحكم بالضغط على "زيادة السعة" واختيار الحجم المناسب.',
  },
];

const chatMessages = [
  { id: 1, sender: 'bot', message: 'مرحباً بك في مِهني! 👋 كيف يمكنني مساعدتك اليوم؟', time: 'الآن' },
];

type TabType = 'faq' | 'chat' | 'contact';

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<TabType>('faq');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState(chatMessages);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: 'user' as const,
      message: message,
      time: 'الآن'
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        sender: 'bot' as const,
        message: 'شكراً لتواصلك معنا! سيتم الرد عليك من قبل فريق الدعم في أقرب وقت.',
        time: 'الآن'
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const tabs: { id: TabType; label: string; icon: typeof HelpCircle }[] = [
    { id: 'faq', label: 'الأسئلة الشائعة', icon: HelpCircle },
    { id: 'chat', label: 'الدردشة', icon: MessageCircle },
    { id: 'contact', label: 'تواصل معنا', icon: Phone },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-[#F8FAF9] to-white dark:from-[#0D1B1A] dark:to-[#1B2D2B]">
      {/* Unified Navbar */}
      <Navbar />
      
      {/* Spacer for fixed navbar */}
      <div className="h-[80px]" />

      <PageBackBar className="pt-4" />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-green-primary/10 to-transparent rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-primary/10 to-green-teal/10 text-green-primary text-sm font-semibold mb-8 border border-green-primary/20"
            >
              <Headphones className="w-4 h-4" />
              مركز المساعدة
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-dark dark:text-white mb-6">
              كيف يمكننا <span className="text-green-primary">مساعدتك؟</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
              فريق الدعم جاهز لمساعدتك على مدار الساعة. ابحث في الأسئلة الشائعة أو تواصل معنا مباشرة
            </p>

            {/* Search */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative max-w-xl mx-auto"
            >
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="ابحث عن سؤال..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-14 py-6 text-lg rounded-2xl border-2 border-green-primary/20 focus:border-green-primary bg-white dark:bg-[#1B2D2B] shadow-lg"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Custom Tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-gray-100 dark:bg-[#152B26] p-1.5 rounded-2xl">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all ${
                      isActive
                        ? 'bg-white dark:bg-[#1B2D2B] text-green-primary shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:text-green-primary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <motion.div
                key="faq"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-[#1B2D2B] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:border-green-primary/30 transition-all shadow-sm hover:shadow-md"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-right hover:bg-green-primary/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-green-primary/10 flex items-center justify-center flex-shrink-0">
                          <HelpCircle className="w-5 h-5 text-green-primary" />
                        </div>
                        <span className="font-bold text-green-dark dark:text-white text-lg">{faq.question}</span>
                      </div>
                      <motion.div
                        animate={{ rotate: openFaq === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-6 h-6 text-green-primary" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pr-20">
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}

                {filteredFaqs.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                      <Search className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد نتائج</h3>
                    <p className="text-gray-500">جرب البحث بكلمات مختلفة</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white dark:bg-[#1B2D2B] rounded-3xl shadow-xl border border-green-primary/10 overflow-hidden max-w-2xl mx-auto">
                  {/* Chat Header */}
                  <div className="p-6 border-b border-green-primary/10 bg-gradient-to-r from-green-primary/5 to-transparent">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-primary to-green-teal flex items-center justify-center shadow-lg">
                        <MessageCircle className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-green-dark dark:text-white text-lg">الدعم الفني</h3>
                        <div className="flex items-center gap-2 text-sm text-green-primary">
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                          متصل الآن
                        </div>
                      </div>
                      <div className="mr-auto flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        الرد خلال دقائق
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="h-80 overflow-y-auto p-6 space-y-4 bg-gray-50/50 dark:bg-[#0D1B1A]/50">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl ${
                            msg.sender === 'user'
                              ? 'bg-green-primary text-white rounded-tl-md'
                              : 'bg-white dark:bg-[#152B26] text-gray-800 dark:text-gray-200 rounded-tr-md shadow-sm border border-gray-100 dark:border-gray-700'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                          <span className={`text-xs mt-2 block ${msg.sender === 'user' ? 'text-green-100' : 'text-gray-400'}`}>
                            {msg.time}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t border-green-primary/10 bg-white dark:bg-[#1B2D2B]">
                    <div className="flex gap-3">
                      <Input
                        type="text"
                        placeholder="اكتب رسالتك..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-primary"
                      />
                      <Button 
                        onClick={handleSendMessage}
                        className="bg-green-primary hover:bg-green-teal text-white px-6 rounded-xl"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  {[
                    {
                      icon: Phone,
                      title: 'الجوال',
                      value: '0551665600',
                      description: 'من الأحد إلى الخميس',
                      subDescription: '8 ص - 5 م',
                      color: 'from-green-400 to-emerald-500',
                    },
                    {
                      icon: Mail,
                      title: 'البريد الإلكتروني',
                      value: 'info@viontrix.com',
                      description: 'نرد خلال 24 ساعة',
                      subDescription: 'على مدار الأسبوع',
                      color: 'from-blue-400 to-cyan-500',
                    },
                    {
                      icon: MessageCircle,
                      title: 'الدردشة المباشرة',
                      value: 'متاح الآن',
                      description: 'دعم فوري',
                      subDescription: '24/7',
                      color: 'from-purple-400 to-violet-500',
                    },
                  ].map((contact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-[#1B2D2B] rounded-3xl p-8 text-center border border-gray-100 dark:border-gray-800 hover:border-green-primary/30 transition-all hover:-translate-y-2 hover:shadow-xl group"
                    >
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${contact.color} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                        <contact.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-green-dark dark:text-white mb-2">{contact.title}</h3>
                      <p className="text-2xl font-bold text-green-primary mb-4">{contact.value}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{contact.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{contact.subDescription}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-[#1B2D2B] rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-gray-800 shadow-lg"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-primary to-green-teal flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-green-dark dark:text-white">أرسل لنا رسالة</h3>
                      <p className="text-gray-500">سنرد عليك في أقرب وقت ممكن</p>
                    </div>
                  </div>

                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الاسم</label>
                        <Input 
                          className="py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-primary" 
                          placeholder="اسمك الكامل"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">البريد الإلكتروني</label>
                        <Input 
                          type="email"
                          className="py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-primary" 
                          placeholder="your@email.com"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الموضوع</label>
                      <Input 
                        className="py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-primary" 
                        placeholder="موضوع الرسالة"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الرسالة</label>
                      <Textarea 
                        rows={5}
                        className="rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-primary resize-none" 
                        placeholder="اكتب رسالتك هنا..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        required
                      />
                    </div>
                    <Button 
                      type="submit"
                      className="w-full py-6 bg-gradient-to-r from-green-primary to-green-teal text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all"
                    >
                      <Send className="w-5 h-5 ml-2" />
                      إرسال الرسالة
                    </Button>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Back to Home */}
      <div className="fixed bottom-6 left-6 z-50">
        <Link 
          to={ROUTES.HOME}
          className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-[#1B2D2B] rounded-full shadow-xl border border-green-primary/10 hover:border-green-primary/30 transition-all hover:shadow-2xl hover:-translate-y-1"
        >
          <ArrowLeft className="w-5 h-5 text-green-primary" />
          <span className="text-sm font-medium text-green-dark dark:text-white">العودة للرئيسية</span>
        </Link>
      </div>
    </div>
  );
}
