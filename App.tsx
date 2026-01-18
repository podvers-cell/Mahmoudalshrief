import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X, ArrowRight, Instagram, Linkedin, Youtube, Video, Film, MessageSquare, Check, Play, Pause, Zap, Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react';

import { NAV_LINKS, PROJECTS, SERVICES, PACKAGES } from './constants';
import { Service, Package, Project, BookingState } from './types';
import logoImage from './assets/logo.png';

// --- UTILS ---

// Theme Context
const ThemeContext = createContext<{ theme: 'dark' | 'light'; toggleTheme: () => void } | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Hook for custom cursor
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const mouseMoveHandler = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", mouseMoveHandler);
    return () => window.removeEventListener("mousemove", mouseMoveHandler);
  }, []);
  return mousePosition;
};

// --- SHARED COMPONENTS ---

const CustomCursor = () => {
  const { x, y } = useMousePosition();
  return (
    <>
      <div 
        className="cursor-dot bg-brand-pink shadow-[0_0_10px_#ffffff]"
        style={{ left: `${x}px`, top: `${y}px` }}
      />
      <div 
        className="cursor-outline"
        style={{ 
          left: `${x}px`, 
          top: `${y}px`,
          transform: `translate(-50%, -50%) translate(${x/50}px, ${y/50}px)` // Subtle lag effect
        }}
      />
    </>
  );
};

const Button: React.FC<{ 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'outline' | 'glow'; 
  className?: string;
  onClick?: () => void;
  to?: string;
  disabled?: boolean;
}> = ({ children, variant = 'primary', className = '', onClick, to, disabled = false }) => {
  const navigate = useNavigate();
  
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-[1.05] active:scale-[0.98] relative overflow-hidden group";
  const disabledStyles = "opacity-50 cursor-not-allowed hover:scale-100";
  const enabledStyles = "cursor-pointer";
  
  const variants = {
    primary: "bg-white text-black hover:bg-gray-100 shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:shadow-[0_0_25px_rgba(255,255,255,0.6)]",
    secondary: "bg-primary text-white hover:bg-violet-700 shadow-[0_0_20px_rgba(109,40,217,0.4)]",
    outline: "border border-white/20 text-white hover:border-brand-pink/50 hover:text-brand-pink hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] bg-transparent",
    glow: "bg-brand-pink text-black hover:bg-[#e2e8f0] shadow-[0_0_20px_rgba(255,255,255,0.6)] hover:shadow-[0_0_40px_rgba(255,255,255,0.8)]"
  };

  const handleClick = () => {
    if (disabled) return;
    if (to) {
      navigate(to);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <button 
      onClick={handleClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? disabledStyles : enabledStyles} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {/* Shine effect */}
      {!disabled && <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />}
    </button>
  );
};

const Section: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
  fullWidth?: boolean;
}> = ({ children, className = '', id, fullWidth = false }) => (
  <section id={id} className={`py-12 sm:py-16 md:py-24 lg:py-32 relative ${fullWidth ? 'w-full' : 'px-4 sm:px-6 md:px-8 max-w-7xl mx-auto'} ${className}`}>
    {children}
  </section>
);

const Reveal: React.FC<{ children: React.ReactNode; delay?: number; direction?: 'up' | 'left' | 'right' }> = ({ children, delay = 0, direction = 'up' }) => {
  const x = direction === 'left' ? -50 : direction === 'right' ? 50 : 0;
  const y = direction === 'up' ? 50 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
};

const Logo = () => (
  <Link to="/" className="transition-all hover:scale-105 block py-2">
    <img 
      src={logoImage} 
      alt="Mahmoud Alshrief Logo" 
      className="h-12 md:h-[60px] w-auto object-contain"
    />
  </Link>
);

// --- LAYOUT COMPONENTS ---

const Header = ({ theme, toggleTheme }: { theme: 'dark' | 'light'; toggleTheme: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? theme === 'dark' 
              ? 'bg-[#050508]/80 backdrop-blur-lg border-b border-white/5 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
              : 'bg-white/90 backdrop-blur-lg border-b border-gray-200 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
            : 'bg-transparent py-4 md:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <Logo />
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`text-sm font-medium transition-all hover:text-brand-pink relative group ${
                  location.pathname === link.path 
                    ? theme === 'dark' ? 'text-white' : 'text-slate-900'
                    : theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-[1px] bg-brand-pink transition-all duration-300 ${location.pathname === link.path ? 'w-full shadow-[0_0_8px_#ffffff]' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
            <Button variant="glow" to="/book" className="!py-2 !px-6 text-sm">
              Book Now
            </Button>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
              theme === 'dark' 
                ? 'text-white hover:bg-white/10' 
                : 'text-slate-900 hover:bg-gray-200'
            }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] ${theme === 'dark' ? 'bg-[#050508]' : 'bg-white'} border-l ${theme === 'dark' ? 'border-white/10' : 'border-gray-300'} z-[70] md:hidden overflow-y-auto shadow-2xl`}
            >
              <div className="p-6 flex flex-col h-full">
                {/* Menu Header */}
                <div className="flex items-center justify-between mb-8">
                  <Logo />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                      theme === 'dark' 
                        ? 'text-white hover:bg-white/10' 
                        : 'text-slate-900 hover:bg-gray-200'
                    }`}
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 flex flex-col gap-1 mb-6">
                  {NAV_LINKS.map((link, index) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${
                        location.pathname === link.path
                          ? theme === 'dark'
                            ? 'bg-brand-pink text-black'
                            : 'bg-brand-pink text-black'
                          : theme === 'dark'
                            ? 'text-slate-300 hover:bg-white/10 hover:text-white'
                            : 'text-slate-700 hover:bg-gray-200 hover:text-slate-900'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                {/* Book Now Button */}
                <Button 
                  variant="glow" 
                  to="/book" 
                  className="w-full !py-3 text-base"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Book Now
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const Footer = ({ theme }: { theme: 'dark' | 'light' }) => (
  <footer className={`${theme === 'dark' ? 'bg-[#0f1016] border-t border-white/5' : 'bg-gray-100 border-t border-gray-300'} pt-20 pb-10 relative overflow-hidden`}>
    {/* Glow elements */}
    <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-brand-pink/10 rounded-full blur-[100px] pointer-events-none" />

    <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
      <div className="grid md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-2">
          <div className="mb-6"><Logo /></div>
          <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} max-w-sm mb-6`}>
            Cinematic visuals that sell, connect, and elevate brands. 
            Based in Dubai, available worldwide.
          </p>
          <div className="flex gap-4">
            {[
              { Icon: Instagram, href: 'https://www.instagram.com/melgml10?igsh=MW4yc21uM2Q4N2lweQ%3D%3D&utm_source=qr' },
              { Icon: Youtube, href: 'https://www.youtube.com/channel/UCBcUcxcH8-jzCdBCVjppDpA' },
              { Icon: Linkedin, href: 'https://www.linkedin.com/in/melgml10/' },
              { Icon: MessageSquare, href: 'https://wa.me/971548886318' }
            ].map(({ Icon, href }, i) => (
              <a 
                key={i} 
                href={href} 
                target="_blank"
                rel="noopener noreferrer"
                className={`w-12 h-12 rounded-full ${theme === 'dark' ? 'glass' : 'bg-gray-200 border border-gray-300'} flex items-center justify-center ${theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'} hover:bg-brand-pink/20 hover:border-brand-pink/40 ${theme === 'dark' ? 'hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]' : ''} transition-all duration-300`}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-semibold mb-6 ${theme === 'dark' ? 'text-glow-sm' : ''}`}>Explore</h4>
          <ul className="space-y-3">
            {NAV_LINKS.slice(0, 4).map(link => (
              <li key={link.path}>
                <Link to={link.path} className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} hover:text-brand-pink transition-colors`}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-semibold mb-6 ${theme === 'dark' ? 'text-glow-sm' : ''}`}>Services</h4>
          <ul className="space-y-3">
            <li className={`${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} cursor-pointer transition-colors`}>Videography</li>
            <li className={`${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} cursor-pointer transition-colors`}>Post-Production</li>
            <li className={`${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} cursor-pointer transition-colors`}>Creative Direction</li>
            <li className={`${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} cursor-pointer transition-colors`}>Consultation</li>
          </ul>
        </div>
      </div>
      
      <div className={`border-t ${theme === 'dark' ? 'border-white/5' : 'border-gray-300'} pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>
        <p>© 2024 Mahmoud Alshrief. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className={`${theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'} transition-colors`}>Privacy Policy</a>
          <a href="#" className={`${theme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900'} transition-colors`}>Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

// --- PAGE COMPONENTS ---

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const HomePage = () => {
  const { theme } = useTheme();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] md:min-h-[95vh] flex items-center pt-16 sm:pt-20 overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div style={{ y: y1 }} className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] mix-blend-screen animate-blob" />
          <motion.div style={{ y: y2 }} className="absolute top-20 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-brand-pink/20 rounded-full blur-[140px] mix-blend-screen animate-blob animation-delay-4000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-200/80 border border-gray-300/50'} mb-6 backdrop-blur-md`}
            >
              <div className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
              <span className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'} text-xs font-medium uppercase tracking-widest`}>Based in Dubai</span>
            </motion.div>
            
            <h1 className={`text-7xl sm:text-6xl md:text-8xl lg:text-9xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} leading-[0.9] mb-6 sm:mb-8 tracking-tight px-2`}>
              Cinematic <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                Visuals
              </span>
              <span className="text-brand-pink text-glow">.</span>
            </h1>
            
            <p className={`text-base sm:text-lg md:text-2xl ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'} mb-8 sm:mb-12 max-w-2xl mx-auto font-light leading-relaxed px-4`}>
              Elevating brands through premium storytelling. <br />
              <span className="text-brand-pink/90 font-normal">Videography</span> • <span className="text-secondary/90 font-normal">Editing</span> • <span className="text-primary/90 font-normal">Direction</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
              <Button to="/work" variant="glow" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                View Work <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button to="/book" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                Book a Shoot
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Showreel Placeholder */}
      <Section className="!py-0 relative z-20 -mt-20">
        <Reveal>
          <div className={`relative aspect-video rounded-2xl overflow-hidden ${theme === 'dark' ? 'shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-surface' : 'shadow-[0_0_30px_rgba(0,0,0,0.1)] bg-white'} group`}>
             <iframe
               id="youtube-video-player"
               src="https://www.youtube.com/embed/gILiG8PZFXg?autoplay=1&mute=1&loop=1&playlist=gILiG8PZFXg&controls=0&modestbranding=1&rel=0&disablekb=1&fs=0&playsinline=1&showinfo=0&iv_load_policy=3&cc_load_policy=0&origin=https://www.youtube.com&vq=hd1080"
               className="absolute inset-0 w-full h-full pointer-events-none"
               allow="autoplay; encrypted-media"
               allowFullScreen={false}
               title="Showreel 2024"
               frameBorder="0"
               referrerPolicy="strict-origin-when-cross-origin"
             />
             
             {/* Fade overlays to blend video with background from all edges */}
             {/* Top fade */}
             <div 
               className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-30"
               style={{
                 background: `linear-gradient(to bottom, ${theme === 'dark' ? 'rgba(5, 5, 8, 1)' : 'rgba(249, 250, 251, 1)'} 0%, ${theme === 'dark' ? 'rgba(5, 5, 8, 0.8)' : 'rgba(249, 250, 251, 0.8)'} 30%, transparent 100%)`
               }}
             />
             {/* Bottom fade */}
             <div 
               className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-30"
               style={{
                 background: `linear-gradient(to top, ${theme === 'dark' ? 'rgba(5, 5, 8, 1)' : 'rgba(249, 250, 251, 1)'} 0%, ${theme === 'dark' ? 'rgba(5, 5, 8, 0.8)' : 'rgba(249, 250, 251, 0.8)'} 30%, transparent 100%)`
               }}
             />
             {/* Left fade */}
             <div 
               className="absolute top-0 bottom-0 left-0 w-32 pointer-events-none z-30"
               style={{
                 background: `linear-gradient(to right, ${theme === 'dark' ? 'rgba(5, 5, 8, 1)' : 'rgba(249, 250, 251, 1)'} 0%, ${theme === 'dark' ? 'rgba(5, 5, 8, 0.8)' : 'rgba(249, 250, 251, 0.8)'} 30%, transparent 100%)`
               }}
             />
             {/* Right fade */}
             <div 
               className="absolute top-0 bottom-0 right-0 w-32 pointer-events-none z-30"
               style={{
                 background: `linear-gradient(to left, ${theme === 'dark' ? 'rgba(5, 5, 8, 1)' : 'rgba(249, 250, 251, 1)'} 0%, ${theme === 'dark' ? 'rgba(5, 5, 8, 0.8)' : 'rgba(249, 250, 251, 0.8)'} 30%, transparent 100%)`
               }}
             />
             
             {/* Overlay to block all interactions - always active to prevent YouTube controls and branding */}
             <div 
               className="absolute inset-0 bg-transparent pointer-events-auto z-50 cursor-default" 
               onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
               onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
               onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
               onMouseUp={(e) => { e.preventDefault(); e.stopPropagation(); }}
               onDoubleClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
               style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
             />
             {/* Additional overlay on hover to hide YouTube watermark/branding */}
             <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 pointer-events-none z-40" style={{ background: 'transparent' }} />
          </div>
        </Reveal>
      </Section>

      {/* Services Preview */}
      <Section>
        <div className="text-center mb-16">
          <Reveal>
             <h2 className={`text-2xl sm:text-3xl md:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-4`}>What I Do</h2>
             <div className="w-20 h-1 bg-brand-pink mx-auto rounded-full shadow-[0_0_10px_#ffffff]" />
          </Reveal>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {SERVICES.map((service, idx) => (
            <Reveal key={service.id} delay={idx * 0.1}>
              <div className={`${theme === 'dark' ? 'glass-card' : 'bg-white border border-gray-200 shadow-lg'} p-8 rounded-2xl h-full group relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className={`w-14 h-14 rounded-xl ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border border-gray-300'} flex items-center justify-center mb-6 text-brand-pink group-hover:scale-110 group-hover:border-brand-pink/50 ${theme === 'dark' ? 'group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]' : ''} transition-all`}>
                   {service.iconName === 'Camera' && <Video size={28} />}
                   {service.iconName === 'Scissors' && <Film size={28} />}
                   {service.iconName === 'Lightbulb' && <MessageSquare size={28} />}
                </div>
                
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-3 group-hover:text-brand-pink transition-colors`}>{service.title}</h3>
                <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} mb-6 line-clamp-2 leading-relaxed`}>{service.description}</p>
                
                <div className="mt-auto relative z-10">
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-600 group-hover:text-slate-800'} mb-4`}>Starting from <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{service.startingPrice}</span></p>
                  <Link to="/services" className={`inline-flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-medium group/link`}>
                    <span className="border-b border-brand-pink pb-0.5 group-hover/link:text-brand-pink transition-colors">Learn More</span> 
                    <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform text-brand-pink" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Featured Work */}
      <Section className="relative">
         {/* Background glow for work section */}
         <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/10 blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-4`}>Featured Projects</h2>
            <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} text-lg`}>Selected works from 2023-2024</p>
          </div>
          <Button to="/work" variant="outline" className="hidden md:flex">
            View All Projects
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.slice(0, 6).map((project, idx) => (
            <Reveal key={project.id} delay={idx * 0.1}>
              <Link to="/work" className={`group block relative overflow-hidden rounded-2xl aspect-[4/3] border ${theme === 'dark' ? 'border-white/5 hover:border-brand-pink/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'border-gray-300 hover:border-brand-pink/50 hover:shadow-lg'} transition-all duration-500`}>
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                
                <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-brand-pink text-xs font-bold uppercase tracking-widest mb-2 block">{project.category}</span>
                  <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white group-hover:text-glow-sm' : 'text-slate-900'} mb-1`}>{project.title}</h3>
                  <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100`}>{project.client} • {project.year}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center md:hidden">
          <Button to="/work" variant="outline">View All Projects</Button>
        </div>
      </Section>

      {/* CTA */}
      <Section className="mb-20">
        <div className={`${theme === 'dark' ? 'glass-card' : 'bg-white border border-gray-200 shadow-lg'} rounded-[2rem] p-12 md:p-24 text-center relative overflow-hidden border-brand-pink/20`}>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-pink/20 blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className={`text-4xl sm:text-5xl md:text-7xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-6 sm:mb-8 tracking-tight px-4`}>
              Ready to create <br />
              <span className={`text-brand-pink ${theme === 'dark' ? 'text-glow' : ''}`}>something epic?</span>
            </h2>
            <p className={`text-xl ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'} mb-10 font-light`}>
              Let's create something extraordinary together. Whether it's a full production or a quick edit, I'm here to help.
            </p>
            <Button to="/book" variant="glow" className="text-xl px-12 py-5 shadow-[0_0_40px_rgba(255,255,255,0.4)]">
              Start a Project
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
};

const ServicesPage = () => {
  const { theme } = useTheme();
  return (
    <div className="pt-32 pb-20">
      <Section>
        <Reveal>
          <div className="text-center mb-20">
             <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-4 sm:mb-6 px-4`}>Services</h1>
             <p className={`text-lg sm:text-xl ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mx-auto px-4`}>
               Comprehensive video production services tailored to your needs. From concept to final delivery.
             </p>
          </div>
        </Reveal>

        <div className="space-y-32">
          {SERVICES.map((service, index) => (
             <Reveal key={service.id}>
               <div className={`flex flex-col md:flex-row gap-16 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                 <div className="flex-1 space-y-6">
                   <div className="inline-block px-3 py-1 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-sm font-bold uppercase tracking-widest">{service.category}</div>
                   <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{service.title}</h2>
                   <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'} text-lg leading-relaxed border-l-2 border-brand-pink/30 pl-6`}>{service.description}</p>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                     {service.features.map(feat => (
                       <div key={feat} className={`flex items-center gap-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                         <div className={`w-8 h-8 rounded-full ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center text-brand-pink shrink-0`}>
                           <Check size={14} />
                         </div>
                         <span>{feat}</span>
                       </div>
                     ))}
                   </div>

                   <div className="pt-6 flex flex-col sm:flex-row items-center gap-6">
                     <div className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-bold text-2xl`}>
                       <span className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'} font-normal block`}>Starting from</span>
                       {service.startingPrice}
                     </div>
                     <Button to="/book" variant="outline" className="w-full sm:w-auto hover:bg-brand-pink hover:text-black hover:border-brand-pink">Book This Service</Button>
                   </div>
                 </div>
                 
                 <div className="flex-1 w-full relative group">
                    <div className="absolute inset-0 bg-brand-pink/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className={`aspect-[4/5] md:aspect-[4/3] ${theme === 'dark' ? 'bg-surface border border-white/10' : 'bg-white border border-gray-300'} rounded-2xl overflow-hidden relative shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500`}>
                       <img 
                        src={`https://picsum.photos/seed/${service.id}/800/800`} 
                        alt={service.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                 </div>
               </div>
             </Reveal>
          ))}
        </div>
      </Section>
    </div>
  );
};

const WorkPage = () => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ['All', 'Commercial', 'Product', 'Events', 'Social', 'Lifestyle'];
  
  const filteredProjects = filter === 'All' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === filter);

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <Section>
        <Reveal>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-6 sm:mb-8 px-4`}>Portfolio</h1>
          <p className={`text-lg sm:text-xl ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mb-8 sm:mb-12 px-4`}>
             A selection of my best work across various industries.
          </p>
        </Reveal>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-12 sm:mb-16 px-2 sm:px-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 border ${
                filter === cat 
                  ? 'bg-brand-pink text-black border-brand-pink shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
                  : theme === 'dark'
                    ? 'bg-transparent border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
                    : 'bg-transparent border-gray-300 text-slate-600 hover:border-gray-400 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer relative"
              >
                <div className={`relative aspect-video rounded-2xl overflow-hidden mb-4 border ${theme === 'dark' ? 'border-white/10 group-hover:border-brand-pink/40 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]' : 'border-gray-300 group-hover:border-brand-pink/60 group-hover:shadow-lg'} transition-all duration-500`}>
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-brand-pink/90 p-4 rounded-full text-black shadow-[0_0_20px_rgba(255,255,255,0.6)] transform scale-50 group-hover:scale-100 transition-all duration-300">
                      <Play size={24} className="fill-black translate-x-0.5" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} group-hover:text-brand-pink transition-colors`}>{project.title}</h3>
                    <p className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'} text-sm`}>{project.client}</p>
                  </div>
                  <span className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-400 border border-white/10' : 'text-slate-600 border border-gray-300'} px-2 py-1 rounded uppercase`}>{project.category}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`${theme === 'dark' ? 'bg-surface border border-white/10' : 'bg-white border border-gray-300'} rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'shadow-[0_0_50px_rgba(0,0,0,0.8)]' : 'shadow-2xl'}`}
            >
              <div className="relative aspect-video w-full bg-black group">
                <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover opacity-60" />
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 right-6 bg-black/50 hover:bg-brand-pink hover:text-black p-2 rounded-full text-white transition-colors z-20"
                >
                  <X size={24} />
                </button>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play size={80} className="text-white/80 drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-110 hover:text-brand-pink transition-all duration-300" />
                </div>
              </div>
              
              <div className="p-8 md:p-12">
                <div className="flex flex-wrap items-start justify-between gap-6 mb-8 border-b border-white/10 pb-8">
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-2">{selectedProject.title}</h2>
                    <p className="text-brand-pink text-xl">{selectedProject.client}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.role.map(r => (
                      <span key={r} className="px-4 py-1.5 rounded-full bg-white/5 text-sm text-slate-300 border border-white/10 uppercase tracking-wider hover:border-brand-pink/50 transition-colors">{r}</span>
                    ))}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-12">
                  <div className="md:col-span-2 space-y-8">
                    <div>
                      <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                        <Zap size={18} className="text-brand-pink" /> The Project
                      </h4>
                      <p className="text-slate-300 leading-relaxed text-lg">{selectedProject.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-bold text-lg mb-4">Deliverables</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedProject.deliverables.map(d => (
                          <li key={d} className="flex items-center gap-2 text-slate-400">
                             <div className="w-1.5 h-1.5 bg-brand-pink rounded-full" /> {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-2xl p-8 border border-white/10 h-fit">
                    <h4 className="text-white font-bold mb-6">Details</h4>
                    <div className="space-y-6 text-sm">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-500">Year</span>
                        <span className="text-slate-200">{selectedProject.year}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-500">Category</span>
                        <span className="text-slate-200">{selectedProject.category}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-500">Camera</span>
                        <span className="text-slate-200">RED Komodo 6K</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-500">Output</span>
                        <span className="text-slate-200">Social + TVC</span>
                      </div>
                    </div>
                    <Button className="w-full mt-8" variant="outline">View Live Link</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PackagesPage = () => {
  const { theme } = useTheme();
  return (
    <div className="pt-32 pb-20">
      <Section>
        <div className="text-center mb-20">
          <Reveal>
            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-4 sm:mb-6 px-4`}>Packages</h1>
            <p className={`text-lg sm:text-xl ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mx-auto px-4`}>
              Transparent pricing for consistent content. Choose a plan or book a custom package tailored to your brand.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {PACKAGES.map((pkg, idx) => (
            <Reveal key={pkg.id} delay={idx * 0.1}>
              <div className={`relative h-full p-8 rounded-3xl flex flex-col border transition-all duration-500 group ${
                pkg.isPopular 
                  ? theme === 'dark'
                    ? 'bg-gradient-to-b from-[#1a1a24] to-[#0a0a10] border-brand-pink/50 shadow-[0_0_40px_rgba(255,255,255,0.15)]'
                    : 'bg-gradient-to-b from-gray-100 to-white border-brand-pink/50 shadow-lg'
                  : theme === 'dark'
                    ? 'bg-glass-card border-white/10 hover:border-brand-pink/30 hover:bg-[#15151a]'
                    : 'bg-white border border-gray-300 hover:border-brand-pink/50 hover:shadow-lg'
              } ${pkg.isPopular ? 'scale-105 z-10' : ''}`}>
                {pkg.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-pink text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[0_0_15px_#ffffff]">
                    Most Popular
                  </div>
                )}
                
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-2`}>{pkg.name}</h3>
                <div className={`text-3xl font-bold text-brand-pink mb-6 ${theme === 'dark' ? 'text-glow-sm' : ''}`}>{pkg.price}</div>
                <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} text-sm mb-8 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-300'} pb-8 leading-relaxed`}>{pkg.description}</p>
                
                <ul className="space-y-4 mb-8 flex-1">
                  {pkg.features.map((feat, i) => (
                    <li key={i} className={`flex items-start gap-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'} text-sm`}>
                      <div className={`mt-0.5 w-5 h-5 rounded-full ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center text-brand-pink shrink-0 group-hover:bg-brand-pink group-hover:text-black transition-colors`}>
                        <Check size={10} />
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  to="/book" 
                  variant={pkg.isPopular ? 'glow' : 'outline'} 
                  className="w-full"
                >
                  Choose {pkg.name}
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </div>
  );
};

// --- DESKTOP TIME PICKER COMPONENT ---
const DesktopTimePicker = ({ 
  allSlots,
  disabledSlots,
  selectedSlot,
  onSelectSlot,
  theme 
}: {
  allSlots: string[];
  disabledSlots: string[];
  selectedSlot: string;
  onSelectSlot: (slot: string) => void;
  theme: 'dark' | 'light';
}) => {
  // Format slot (HH:mm) to display format (h:mm AM/PM)
  const formatSlot = (slot: string): string => {
    const [hour24, minute] = slot.split(':').map(Number);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${String(minute).padStart(2, '0')} ${period}`;
  };

  const slotRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  useEffect(() => {
    const selectedIndex = allSlots.indexOf(selectedSlot);
    if (selectedIndex !== -1 && slotRefs.current[selectedIndex]) {
      slotRefs.current[selectedIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedSlot, allSlots]);

  const handleKeyDown = (e: React.KeyboardEvent, currentSlot: string, index: number) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      // Skip disabled slots when navigating
      let newIndex = index;
      do {
        newIndex = e.key === 'ArrowDown' 
          ? Math.min(newIndex + 1, allSlots.length - 1)
          : Math.max(newIndex - 1, 0);
      } while (disabledSlots.includes(allSlots[newIndex]) && newIndex !== index);
      
      if (!disabledSlots.includes(allSlots[newIndex])) {
        onSelectSlot(allSlots[newIndex]);
        setTimeout(() => slotRefs.current[newIndex]?.focus(), 0);
      }
    } else if (e.key === 'Enter' && !disabledSlots.includes(currentSlot)) {
      e.preventDefault();
      onSelectSlot(currentSlot);
    }
  };

  return (
    <div className="p-4">
      <div className={`${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'} border rounded-xl p-2 max-h-64 overflow-y-auto scrollbar-hide`}>
        <div className="grid grid-cols-2 gap-2">
          {allSlots.map((slot, index) => {
            const isSelected = selectedSlot === slot;
            const isDisabled = disabledSlots.includes(slot);
            return (
              <button
                key={slot}
                ref={(el) => { slotRefs.current[index] = el; }}
                onClick={() => !isDisabled && onSelectSlot(slot)}
                onKeyDown={(e) => handleKeyDown(e, slot, index)}
                onFocus={() => !isDisabled && setFocusedIndex(index)}
                disabled={isDisabled}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  isDisabled
                    ? theme === 'dark' 
                      ? 'text-white/30 cursor-not-allowed' 
                      : 'text-slate-400 cursor-not-allowed'
                    : isSelected
                      ? theme === 'dark' ? 'bg-brand-pink text-black' : 'bg-brand-pink text-black'
                      : `cursor-pointer ${theme === 'dark' 
                        ? 'text-white hover:bg-white/10 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]' 
                        : 'text-slate-700 hover:bg-gray-200 hover:shadow-[0_0_10px_rgba(0,0,0,0.1)]'}`
                } ${focusedIndex === index && !isSelected && !isDisabled ? theme === 'dark' ? 'ring-2 ring-white/20' : 'ring-2 ring-gray-400/20' : ''}`}
              >
                {formatSlot(slot)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- WHEEL PICKER COMPONENT ---
const WheelPicker = <T extends string | number>({ 
  items, 
  selectedValue, 
  onSelect, 
  theme,
  formatValue 
}: { 
  items: T[]; 
  selectedValue: T; 
  onSelect: (value: T) => void;
  theme: 'dark' | 'light';
  formatValue: (val: T) => string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const ITEM_HEIGHT = 44;
  const VISIBLE_ITEMS = 5;
  const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const selectedIndex = items.indexOf(selectedValue);
    if (selectedIndex !== -1) {
      const scrollPosition = selectedIndex * ITEM_HEIGHT;
      container.scrollTo({
        top: scrollPosition,
        behavior: 'auto'
      });
    }
  }, [items, selectedValue]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const selectedIndex = Math.round(scrollTop / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(selectedIndex, items.length - 1));
    
    if (items[clampedIndex] !== selectedValue) {
      onSelect(items[clampedIndex]);
    }
  };

  const handleScrollEnd = () => {
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const selectedIndex = Math.round(scrollTop / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(selectedIndex, items.length - 1));
    const snapPosition = clampedIndex * ITEM_HEIGHT;

    container.scrollTo({
      top: snapPosition,
      behavior: 'smooth'
    });
  };

  const centerOffset = ITEM_HEIGHT * 2;

  return (
    <div className="flex-1 relative" style={{ height: CONTAINER_HEIGHT }}>
      {/* Fade gradients */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `linear-gradient(to bottom, ${
            theme === 'dark' ? 'rgba(15, 16, 22, 1)' : 'rgba(255, 255, 255, 1)'
          } 0%, transparent 20%, transparent 80%, ${
            theme === 'dark' ? 'rgba(15, 16, 22, 1)' : 'rgba(255, 255, 255, 1)'
          } 100%)`
        }}
      />
      
      {/* Center highlight line */}
      <div 
        className="absolute left-0 right-0 pointer-events-none z-20"
        style={{ 
          top: `${ITEM_HEIGHT * 2}px`,
          height: `${ITEM_HEIGHT}px`,
          borderTop: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'}`,
          borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'}`
        }}
      />

      {/* Scroll container */}
      <div
        ref={containerRef}
        className="overflow-y-scroll scrollbar-hide h-full"
        style={{
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
        onScroll={handleScroll}
        onTouchEnd={handleScrollEnd}
        onMouseUp={handleScrollEnd}
        onWheel={(e) => {
          setTimeout(handleScrollEnd, 100);
        }}
      >
        {/* Top padding */}
        <div style={{ height: centerOffset }} />
        
        {/* Items */}
        {items.map((item, index) => {
          const selectedIndex = items.indexOf(selectedValue);
          const distanceFromCenter = Math.abs(index - selectedIndex);
          const isSelected = item === selectedValue;
          const opacity = isSelected ? 1 : Math.max(0.3, 1 - distanceFromCenter * 0.25);
          const scale = isSelected ? 1.15 : Math.max(0.85, 1 - distanceFromCenter * 0.05);
          const fontSize = isSelected ? 'text-2xl' : 'text-lg';
          const fontWeight = isSelected ? 'font-semibold' : 'font-medium';

          return (
            <div
              key={index}
              className={`flex items-center justify-center ${fontSize} ${fontWeight} transition-all duration-150 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
              style={{
                height: `${ITEM_HEIGHT}px`,
                scrollSnapAlign: 'center',
                scrollSnapStop: 'always',
                opacity,
                transform: `scale(${scale})`,
                willChange: 'opacity, transform',
              }}
            >
              {formatValue(item)}
            </div>
          );
        })}

        {/* Bottom padding */}
        <div style={{ height: centerOffset }} />
      </div>
    </div>
  );
};

// --- DATETIME PICKER MODAL COMPONENT ---
const DateTimePickerModal = ({ isOpen, onClose, onConfirm, theme, initialDate, initialTime, mode = 'date' }: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string, time: string, formatted: string) => void;
  theme: 'dark' | 'light';
  initialDate?: string;
  initialTime?: string;
  mode?: 'date' | 'time';
}) => {
  const [currentView, setCurrentView] = useState<'date' | 'time'>(mode);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isTouchDevice || isSmallScreen);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Helper to get today's date (local, time stripped)
  const getTodayLocal = (): Date => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  // Helper to strip time from date for comparison (local timezone)
  const stripTime = (date: Date): Date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Helper to check if a date is in the past
  const isPastDate = (date: Date): boolean => {
    const today = getTodayLocal();
    const dateOnly = stripTime(date);
    return dateOnly.getTime() < today.getTime();
  };

  // Helper to check if a date is today
  const isTodayDate = (date: Date): boolean => {
    const today = getTodayLocal();
    const dateOnly = stripTime(date);
    return dateOnly.getTime() === today.getTime();
  };

  // Get next available date (starting from today)
  const getNextAvailableDate = (): Date => {
    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);
    
    // Check up to 365 days ahead
    for (let i = 0; i < 365; i++) {
      const slots = getAvailableTimeSlots(checkDate);
      if (slots.length > 0) {
        return checkDate;
      }
      // Move to next day
      checkDate = new Date(checkDate);
      checkDate.setDate(checkDate.getDate() + 1);
    }
    
    // Fallback: return today if nothing found
    return getTodayLocal();
  };

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (initialDate) {
      const [year, month, day] = initialDate.split('-').map(Number);
      const parsed = new Date(year, month - 1, day);
      if (!isPastDate(parsed)) {
        return parsed;
      }
    }
    return getTodayLocal();
  });
  const [selectedMonth, setSelectedMonth] = useState(() => selectedDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(() => selectedDate.getFullYear());
  // Generate ALL time slots (9:00 AM - 9:00 PM, 30-minute intervals)
  // Always returns all slots regardless of date
  const getAllTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let hour = 9; hour <= 21; hour++) {
      for (const minute of [0, 30]) {
        slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
      }
    }
    return slots;
  };

  // Check if a slot is disabled (past time for today only)
  const isSlotDisabled = (date: Date, slot: string): boolean => {
    // Date comparison using toDateString() (ignores time)
    const todayStr = new Date().toDateString();
    const selectedStr = date.toDateString();
    const isToday = todayStr === selectedStr;
    
    // Only disable past slots for today
    if (!isToday) {
      return false; // Never disable slots for future dates
    }
    
    // When selectedDate is TODAY:
    // Create slotDate using selectedDate, then set hours/minutes
    const [hour, minute] = slot.split(':').map(Number);
    const slotDate = new Date(date);
    slotDate.setHours(hour, minute, 0, 0);
    
    // Create "now" using local time (full Date object)
    const now = new Date();
    
    // Compare using getTime() on full Date objects
    // Disable if slotDate.getTime() < now.getTime()
    return slotDate.getTime() < now.getTime();
  };

  // Get available (enabled) time slots for a date
  const getAvailableTimeSlots = (date: Date): string[] => {
    const allSlots = getAllTimeSlots();
    return allSlots.filter(slot => !isSlotDisabled(date, slot));
  };

  // Convert time slot (HH:mm) to hour, minute, period
  const parseTimeSlot = (timeSlot: string) => {
    const [hour24, minute] = timeSlot.split(':').map(Number);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period: 'AM' | 'PM' = hour24 >= 12 ? 'PM' : 'AM';
    return { hour24, hour12, minute, period };
  };

  // Initialize with nearest available slot (only for valid dates)
  const getInitialSlot = (date: Date, initialTime?: string): string => {
    // Only get slots if date is not in the past
    if (isPastDate(date)) {
      return '09:00'; // Fallback
    }
    
    const slots = getAvailableTimeSlots(date);
    if (slots.length === 0) return '09:00'; // Fallback
    
    if (initialTime && slots.includes(initialTime)) {
      return initialTime;
    }
    
    // Default to first available slot (nearest next available)
    return slots[0];
  };

  const [selectedSlot, setSelectedSlot] = useState(() => {
    const slot = getInitialSlot(selectedDate, initialTime);
    return slot;
  });

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get all time slots and determine which are disabled
  const allSlots = getAllTimeSlots();
  const disabledSlots = allSlots.filter(slot => isSlotDisabled(selectedDate, slot));
  const availableSlots = getAvailableTimeSlots(selectedDate);
  
  // Auto-correct if current selection is invalid
  useEffect(() => {
    if (mode === 'time' && availableSlots.length > 0) {
      if (!availableSlots.includes(selectedSlot)) {
        // Find nearest valid slot
        const [currentH, currentM] = selectedSlot.split(':').map(Number);
        const currentMinutes = currentH * 60 + currentM;
        let nearestSlot = availableSlots[0];
        let minDiff = Infinity;
        
        availableSlots.forEach(slot => {
          const [h, m] = slot.split(':').map(Number);
          const slotMinutes = h * 60 + m;
          const diff = Math.abs(slotMinutes - currentMinutes);
          if (diff < minDiff) {
            minDiff = diff;
            nearestSlot = slot;
          }
        });
        
        setSelectedSlot(nearestSlot);
      }
    } else if (mode === 'time' && availableSlots.length > 0 && !availableSlots.includes(selectedSlot)) {
      // If no slots match, set to first available
      setSelectedSlot(availableSlots[0]);
    }
  }, [selectedDate, mode, availableSlots.length, selectedSlot, mode]);

  // Update slot when date changes
  useEffect(() => {
    if (mode === 'time') {
      const slots = getAvailableTimeSlots(selectedDate);
      if (slots.length > 0 && !slots.includes(selectedSlot)) {
        setSelectedSlot(slots[0]);
      }
    }
  }, [selectedDate]);

  // Keep hour/minute/period in sync with selectedSlot for backward compatibility
  const { hour12, minute, period } = parseTimeSlot(selectedSlot);
  const selectedHour = hour12;
  const selectedMinute = minute;
  const selectedPeriod = period;

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(prev => prev - 1);
      } else {
        setSelectedMonth(prev => prev - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(prev => prev + 1);
      } else {
        setSelectedMonth(prev => prev + 1);
      }
    }
  };

  const selectDate = (day: number) => {
    const newDate = new Date(selectedYear, selectedMonth, day);
    // Prevent selecting past dates
    if (!isPastDate(newDate)) {
      setSelectedDate(newDate);
    }
  };

  const formatDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${date.getDate()} ${monthsShort[date.getMonth()]}`;
  };

  const formatOutput = () => {
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const year = selectedDate.getFullYear();
    const dateStr = `${year}-${month}-${day}`;
    
    // Use selectedSlot directly for time mode
    const timeStr = mode === 'time' ? selectedSlot : '09:00';
    const { hour12, minute, period } = parseTimeSlot(selectedSlot);
    const minuteStr = String(minute).padStart(2, '0');
    
    let formatted = '';
    if (mode === 'date') {
      formatted = `${day}/${month}/${year}`;
    } else {
      formatted = `${hour12}:${minuteStr} ${period}`;
    }
    
    return { dateStr, timeStr, formatted };
  };

  const handleConfirm = () => {
    const { dateStr, timeStr, formatted } = formatOutput();
    onConfirm(dateStr, timeStr, formatted);
    onClose();
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
  const days = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div 
          className={`fixed inset-0 ${theme === 'dark' ? 'bg-black/80' : 'bg-black/60'} backdrop-blur-sm`} 
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative backdrop-blur-xl ${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/95 border-gray-300/50'} border rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden`}
        >
          {/* Header */}
          <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-300/50'}`}>
            {mode === 'date' ? (
              <div className={`text-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-semibold text-lg`}>
                {formatDate(selectedDate)}
              </div>
            ) : (
              <div className={`text-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-semibold text-lg`}>
                {(() => {
                  const { hour12, minute, period } = parseTimeSlot(selectedSlot);
                  return `${hour12}:${String(minute).padStart(2, '0')} ${period}`;
                })()}
              </div>
            )}
          </div>

          {/* Date View */}
          {currentView === 'date' && (
            <div className="p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-200 text-slate-900'} transition-colors`}
                >
                  <ChevronLeft size={20} />
                </button>
                <div className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-semibold`}>
                  {months[selectedMonth]} {selectedYear}
                </div>
                <button
                  onClick={() => navigateMonth('next')}
                  className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-200 text-slate-900'} transition-colors`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map(day => (
                  <div key={day} className={`text-center text-xs font-medium py-2 ${theme === 'dark' ? 'text-white/60' : 'text-slate-600'}`}>
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, idx) => {
                  if (!day) return <div key={idx} />;
                  
                  const dayDate = new Date(selectedYear, selectedMonth, day);
                  const isPast = isPastDate(dayDate);
                  const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === selectedMonth && selectedDate.getFullYear() === selectedYear;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => selectDate(day)}
                      disabled={isPast}
                      className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                        isPast
                          ? theme === 'dark'
                            ? 'text-white/20 cursor-not-allowed'
                            : 'text-slate-300 cursor-not-allowed'
                          : isSelected
                            ? 'bg-brand-pink text-black'
                            : theme === 'dark'
                              ? 'text-white hover:bg-white/10'
                              : 'text-slate-900 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Time View - Only show when mode is 'time' or currentView is 'time' */}
          {(mode === 'time' || currentView === 'time') && (
            <div className="p-6">
              {isMobile ? (
                // Mobile: iOS-style scroll wheels - show time slots
                availableSlots.length === 0 ? (
                  <div className={`p-8 text-center ${theme === 'dark' ? 'text-white/60' : 'text-slate-600'}`}>
                    No available slots
                  </div>
                ) : (
                  <WheelPicker
                    items={availableSlots}
                    selectedValue={selectedSlot}
                    onSelect={setSelectedSlot}
                    theme={theme}
                    formatValue={(slot) => {
                      const { hour12, minute, period } = parseTimeSlot(slot);
                      return `${hour12}:${String(minute).padStart(2, '0')} ${period}`;
                    }}
                  />
                )
              ) : (
                // Desktop: Clickable grid/list - show all slots with disabled ones greyed out
                <DesktopTimePicker
                  allSlots={allSlots}
                  disabledSlots={disabledSlots}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                  theme={theme}
                />
              )}
            </div>
          )}

          {/* Buttons */}
          <div className={`flex border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-300/50'}`}>
            <button
              onClick={onClose}
              className={`flex-1 py-4 ${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-gray-100'} transition-colors font-medium`}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={(mode === 'time' && availableSlots.length === 0) || (mode === 'date' && isPastDate(selectedDate))}
              className={`flex-1 py-4 ${(mode === 'time' && availableSlots.length === 0) || (mode === 'date' && isPastDate(selectedDate)) ? 'opacity-50 cursor-not-allowed' : ''} ${theme === 'dark' ? 'text-white hover:bg-white/20 bg-white/10' : 'text-slate-900 hover:bg-gray-200 bg-gray-100'} transition-colors font-medium border-l ${theme === 'dark' ? 'border-white/10' : 'border-gray-300/50'}`}
            >
              OK
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const BookPage = () => {
  const { theme } = useTheme();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingState>({
    serviceType: '',
    packageId: '',
    date: '',
    time: '',
    details: {
      name: '', email: '', phone: '', company: '', brief: '', budget: ''
    }
  });
  const [submitted, setSubmitted] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dateDisplay, setDateDisplay] = useState('');
  const [timeDisplay, setTimeDisplay] = useState('');

  const handleNext = () => setStep(p => p + 1);
  const handleBack = () => setStep(p => p - 1);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const updateDetail = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, details: { ...prev.details, [field]: value } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format email content
    const emailSubject = `New Booking Request - ${formData.serviceType}`;
    const emailBody = `
New Booking Request Received

Service Type: ${formData.serviceType}
Package: ${formData.packageId === 'custom' ? 'Custom / Not sure' : formData.packageId}
Preferred Date: ${formData.date || 'Not selected'}
Preferred Time: ${formData.time || 'Not selected'}

Client Details:
- Name: ${formData.details.name}
- Email: ${formData.details.email}
- Phone: ${formData.details.phone || 'Not provided'}
- Company: ${formData.details.company || 'Not provided'}

Project Brief:
${formData.details.brief}

Budget: ${formData.details.budget || 'Not specified'}

---
This booking was submitted through your website.
    `.trim();
    
    const res = await fetch("/api/send-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service: formData.serviceType,
        date: formData.date,
        time: formData.time,
        name: formData.details.name,
        email: formData.details.email,
        phone: formData.details.phone,
        company: formData.details.company,
        brief: formData.details.brief,
        budget: formData.details.budget,
      }),
    });
    
    const data = await res.json();
    
    if (!data.success) {
      alert("حصل خطأ أثناء إرسال الطلب ❌");
      return;
    }
    
    setSubmitted(true);
    
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <Section className="text-center max-w-2xl">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.5)]"
           >
             <Check size={48} className="text-white" />
           </motion.div>
           <h2 className={`text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-6`}>Request Received!</h2>
           <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} mb-10 text-lg`}>
             Thanks for reaching out, {formData.details.name}. I'll review your project brief and get back to you within 24 hours.
           </p>
           <div className="flex flex-col gap-4 max-w-xs mx-auto">
              <Button to="/" variant="outline">Back to Home</Button>
              <a 
                href={`https://wa.me/971548886318?text=Hi Mahmoud, I just submitted a booking request for ${formData.serviceType}. My name is ${formData.details.name}.`}
                target="_blank"
                rel="noreferrer"
                className="text-green-400 hover:text-green-300 text-sm flex items-center justify-center gap-2 mt-4 hover:underline"
              >
                <MessageSquare size={16} /> Send via WhatsApp
              </a>
           </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <Section className="max-w-3xl">
        <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-8 sm:mb-12 text-center px-4`}>Book a Service</h1>
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-10 sm:mb-16 relative px-2 sm:px-4">
          <div className={`absolute left-0 right-0 top-1/2 h-0.5 ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-300'} -z-10`} />
          {[1, 2, 3, 4].map(num => (
            <div 
              key={num}
              className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                step >= num 
                  ? 'bg-brand-pink text-black shadow-[0_0_15px_#ffffff] scale-110' 
                  : theme === 'dark'
                    ? 'bg-surface border border-white/20 text-slate-500'
                    : 'bg-white border border-gray-300 text-slate-600'
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        <motion.div
           key={step}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
           transition={{ duration: 0.3 }}
           className={`${theme === 'dark' ? 'glass-card' : 'bg-white border border-gray-200 shadow-lg'} p-4 sm:p-6 md:p-8 lg:p-12 rounded-2xl sm:rounded-3xl border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-300'}`}
        >
          {step === 1 && (
            <div className="space-y-6">
              <h3 className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-6 sm:mb-8`}>What are you looking for?</h3>
              <div className="grid grid-cols-1 gap-4">
                {['videography', 'editing', 'consultation'].map((type) => (
                  <button
                    key={type}
                    onClick={() => { updateField('serviceType', type); handleNext(); }}
                    className={`p-6 text-left rounded-2xl border transition-all duration-300 group relative overflow-hidden ${
                      formData.serviceType === type 
                        ? 'bg-brand-pink/20 border-brand-pink' 
                        : theme === 'dark'
                          ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-brand-pink/50'
                          : 'bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-brand-pink/50'
                    }`}
                  >
                     <div className="relative z-10">
                       <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} capitalize block mb-2`}>{type}</span>
                       <span className={`text-sm ${theme === 'dark' ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-600 group-hover:text-slate-800'} transition-colors`}>
                         {type === 'videography' ? 'Shooting commercials, events, or content.' :
                          type === 'editing' ? 'Post-production for existing footage.' :
                          'Strategy and creative direction.'}
                       </span>
                     </div>
                     <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-brand-pink">
                       <ArrowRight />
                     </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-6 sm:mb-8`}>Choose a Package</h3>
              <div className="grid gap-4">
                <button
                  onClick={() => { updateField('packageId', 'custom'); handleNext(); }}
                  className={`p-5 rounded-2xl border text-center font-bold text-lg transition-all ${
                    formData.packageId === 'custom' 
                      ? 'bg-brand-pink text-black border-brand-pink shadow-[0_0_20px_#ffffff]' 
                      : theme === 'dark'
                        ? 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:border-white/30'
                        : 'bg-gray-50 text-slate-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                  }`}
                >
                  Custom / I'm not sure
                </button>
                {PACKAGES.map(pkg => (
                  <button
                     key={pkg.id}
                     onClick={() => { updateField('packageId', pkg.id); handleNext(); }}
                     className={`p-5 rounded-2xl border flex justify-between items-center transition-all ${
                      formData.packageId === pkg.id 
                        ? 'bg-brand-pink/20 border-brand-pink text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]' 
                        : theme === 'dark'
                          ? 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:border-white/30'
                          : 'bg-gray-50 text-slate-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                    }`}
                  >
                    <span className="font-semibold text-base sm:text-lg">{pkg.name}</span>
                    <span className="text-xs sm:text-sm opacity-70 bg-white/10 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">{pkg.price}</span>
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={handleBack} className="text-slate-400 hover:text-white transition-colors">Back</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-6 sm:mb-8`}>Preferred Date & Time</h3>
              <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} mb-6`}>Select a tentative date and time for the shoot or meeting.</p>
              
              {/* Date & Time Picker Triggers */}
              <div className={`${theme === 'dark' ? 'backdrop-blur-xl bg-white/10 border border-white/20' : 'backdrop-blur-xl bg-gray-100/80 border border-gray-300/50'} rounded-2xl p-6 shadow-2xl max-w-md mx-auto`}>
                <label className={`block ${theme === 'dark' ? 'text-white/80' : 'text-slate-700/80'} text-sm mb-4 font-medium`}>
                  Select Date & Time
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date Input */}
                  <input
                    type="text"
                    readOnly
                    onClick={() => setShowDatePicker(true)}
                    className={`w-full ${theme === 'dark' ? 'bg-white/10 text-white border-white/20 focus:ring-white/40' : 'bg-white/80 text-slate-900 border-gray-300/50 focus:ring-gray-400/40'} border rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 backdrop-blur-md transition-all cursor-pointer`}
                    placeholder="Select Date"
                    value={dateDisplay || (formData.date ? formData.date.split('-').reverse().join('/') : '')}
                  />

                  {/* Time Input */}
                  <input
                    type="text"
                    readOnly
                    onClick={() => setShowTimePicker(true)}
                    className={`w-full ${theme === 'dark' ? 'bg-white/10 text-white border-white/20 focus:ring-white/40' : 'bg-white/80 text-slate-900 border-gray-300/50 focus:ring-gray-400/40'} border rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 backdrop-blur-md transition-all cursor-pointer`}
                    placeholder="Select Time"
                    value={timeDisplay || formData.time || ''}
                  />
                </div>
              </div>

              {/* Date Picker Modal */}
              <DateTimePickerModal
                isOpen={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                onConfirm={(date, time, formatted) => {
                  updateField('date', date);
                  setDateDisplay(formatted.split(',')[0].trim());
                }}
                theme={theme}
                initialDate={formData.date}
                initialTime={formData.time}
                mode="date"
              />

              {/* Time Picker Modal */}
              <DateTimePickerModal
                isOpen={showTimePicker}
                onClose={() => setShowTimePicker(false)}
                onConfirm={(date, time, formatted) => {
                  updateField('time', time);
                  setTimeDisplay(formatted.split(',')[1]?.trim() || formatted);
                }}
                theme={theme}
                initialDate={formData.date}
                initialTime={formData.time}
                mode="time"
              />
              
              <div className="mt-10 flex justify-between">
                <button onClick={handleBack} className={`${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>Back</button>
                <Button onClick={handleNext} disabled={!formData.date} variant="glow">Next Step</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-6 sm:mb-8`}>Project Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <input required placeholder="Name" className="input-field" value={formData.details.name} onChange={e => updateDetail('name', e.target.value)} />
                <input required placeholder="Email" type="email" className="input-field" value={formData.details.email} onChange={e => updateDetail('email', e.target.value)} />
                <input placeholder="Phone" className="input-field" value={formData.details.phone} onChange={e => updateDetail('phone', e.target.value)} />
                <input placeholder="Company (Optional)" className="input-field" value={formData.details.company} onChange={e => updateDetail('company', e.target.value)} />
              </div>
              <textarea 
                required 
                placeholder="Tell me about your project (Brief, goals, location...)" 
                className="input-field h-40 resize-none" 
                value={formData.details.brief} 
                onChange={e => updateDetail('brief', e.target.value)}
              />
               <input placeholder="Budget Range (Optional)" className="input-field" value={formData.details.budget} onChange={e => updateDetail('budget', e.target.value)} />
              
              <div className="mt-10 flex justify-between items-center">
                <button type="button" onClick={handleBack} className="text-slate-400 hover:text-white transition-colors">Back</button>
                <Button variant="glow" className="shadow-[0_0_30px_rgba(255,255,255,0.4)]">Submit Request</Button>
              </div>
            </form>
          )}
        </motion.div>
      </Section>
    </div>
  );
};

const AboutPage = () => {
  const { theme } = useTheme();
  return (
    <div className="pt-32 pb-20">
      <Section>
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <Reveal>
             <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary via-brand-pink to-secondary opacity-40 blur-3xl rounded-full group-hover:opacity-60 transition-opacity duration-1000" />
                <img 
                  src="https://picsum.photos/seed/mahmoud/600/800" 
                  alt="Mahmoud Alshrief" 
                  className="relative rounded-3xl w-full object-cover shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 grayscale hover:grayscale-0"
                />
             </div>
          </Reveal>
          
          <Reveal delay={0.2}>
            <div className="relative">
              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-2 font-sans text-brand-pink text-glow`}>Mahmoudalshrief</h1>
              <h2 className={`text-xl sm:text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} mb-6 sm:mb-8 tracking-wide`}>Visual Storyteller & Creative Director</h2>
              <div className="space-y-6 text-slate-300 text-lg leading-relaxed font-light">
                <p>
                  I don't just capture footage; I craft narratives. With over <strong className="text-white">6 years</strong> of experience in the Dubai media landscape, I've helped brands transform their vision into cinematic reality.
                </p>
                <p>
                  My approach blends technical precision with creative flair. Whether it's a high-energy car commercial, a corporate documentary, or stylized social content, the goal remains the same: 
                  <span className="text-white font-medium border-b border-brand-pink/50"> create visuals that stop the scroll.</span>
                </p>
                <p>
                  When I'm not behind the camera, I'm analyzing market trends to ensure my clients stay ahead of the curve.
                </p>
              </div>
              
              <div className="mt-12 grid grid-cols-2 gap-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-brand-pink/50 transition-colors">
                  <h3 className="text-white text-3xl font-bold mb-1">50+</h3>
                  <p className="text-sm text-brand-pink uppercase tracking-wider">Projects Delivered</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-brand-pink/50 transition-colors">
                  <h3 className="text-white text-3xl font-bold mb-1">6+ Years</h3>
                  <p className="text-sm text-brand-pink uppercase tracking-wider">Industry Experience</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
        
        {/* Gear Section */}
        <div className="mt-40">
          <Reveal>
            <h2 className="text-4xl font-bold text-white mb-16 text-center">The Arsenal</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['RED Cinema Cameras', 'FPV Drones', 'Pro Audio', 'Davinci Suite'].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="glass-card p-8 rounded-2xl text-center group hover:bg-[#15151a]">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-pink group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
                    <Video size={24} />
                  </div>
                  <h3 className="text-white font-medium text-lg">{item}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
};

const ContactPage = () => {
  const { theme } = useTheme();
  return (
    <div className="pt-32 pb-20">
      <Section>
        <div className="text-center mb-20">
          <Reveal>
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-4 sm:mb-6 px-4`}>Get in Touch</h1>
            <p className={`text-lg sm:text-xl ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} px-4`}>Have a question? Ready to start? Drop me a line.</p>
          </Reveal>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <Reveal>
             <div className="space-y-8 h-full">
               <div className="glass-card p-10 rounded-3xl h-full flex flex-col justify-between relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/10 blur-[50px]" />
                 
                 <div>
                   <h3 className="text-3xl font-bold text-white mb-8">Contact Info</h3>
                   <div className="space-y-6 text-slate-300 text-lg">
                     <p className="flex items-center gap-4"><span className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-pink">E</span> hello@mahmoudalshrief.com</p>
                     <p className="flex items-center gap-4"><span className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-pink">P</span> +971 54 888 6318</p>
                     <a href="https://wa.me/971548886318" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 hover:text-brand-pink transition-colors cursor-pointer">
                       <span className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-pink"><MessageSquare size={18} /></span>
                       <span>WhatsApp: +971 54 888 6318</span>
                     </a>
                     <p className="flex items-center gap-4"><span className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-pink">L</span> Dubai, United Arab Emirates</p>
                   </div>
                 </div>

                 <div className="mt-12 pt-12 border-t border-white/10">
                   <h3 className="text-xl font-bold text-white mb-6">FAQ</h3>
                   <div className="space-y-6">
                     <div>
                       <p className="text-white font-medium mb-1">What is your typical turnaround time?</p>
                       <p className="text-slate-400 text-sm">Usually 5-7 business days for standard projects.</p>
                     </div>
                     <div>
                       <p className="text-white font-medium mb-1">Do you travel?</p>
                       <p className="text-slate-400 text-sm">Yes, available for shoots across the UAE and GCC.</p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
          </Reveal>

          <Reveal delay={0.2}>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                // Form submission logic would go here
                alert('Message sent! (This is a demo form)');
              }}
              className="space-y-6 glass-card p-10 rounded-3xl"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input required placeholder="Name" className="input-field bg-[#050508]/50" />
                <input required placeholder="Email" type="email" className="input-field bg-[#050508]/50" />
              </div>
              <input required placeholder="Subject" className="input-field bg-[#050508]/50" />
              <textarea required placeholder="Message" className="input-field h-48 bg-[#050508]/50 resize-none" />
              <Button type="submit" variant="glow" className="w-full text-lg py-4">Send Message</Button>
            </form>
          </Reveal>
        </div>
      </Section>
    </div>
  );
};


// --- MAIN APP ---

const App = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Router>
        <ScrollToTop />
        <CustomCursor />
        <div className={`${theme === 'dark' ? 'bg-background text-slate-200' : 'bg-gray-50 text-slate-900'} min-h-screen selection:bg-brand-pink selection:text-black font-sans cursor-none transition-colors duration-300`}>
        <style>{`
          .input-field {
            width: 100%;
            background: ${theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)'};
            border: ${theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'};
            padding: 1.25rem;
            border-radius: 1rem;
            color: ${theme === 'dark' ? 'white' : '#1e293b'};
            transition: all 0.3s;
          }
          .input-field:focus {
            outline: none;
            border-color: ${theme === 'dark' ? '#ff8fa3' : '#6366f1'};
            background: ${theme === 'dark' ? 'rgba(255,143,163,0.05)' : 'rgba(99,102,241,0.05)'};
            box-shadow: 0 0 15px ${theme === 'dark' ? 'rgba(255,143,163,0.1)' : 'rgba(99,102,241,0.1)'};
          }
          .theme-text-primary {
            color: ${theme === 'dark' ? '#f1f5f9' : '#0f172a'};
          }
          .theme-text-secondary {
            color: ${theme === 'dark' ? '#cbd5e1' : '#475569'};
          }
          .theme-text-muted {
            color: ${theme === 'dark' ? '#94a3b8' : '#64748b'};
          }
          .theme-bg-surface {
            background-color: ${theme === 'dark' ? '#0f1016' : '#ffffff'};
          }
          .theme-bg-glass {
            background: ${theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'};
            border: ${theme === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.08)'};
          }
          .theme-border {
            border-color: ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
          }
        `}</style>
        
        <Header theme={theme} toggleTheme={toggleTheme} />
        
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/book" element={<BookPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>

        <Footer theme={theme} />
        
        {/* Floating WhatsApp Button */}
        <a
          href="https://wa.me/971548886318"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
          aria-label="Contact via WhatsApp"
        >
          <MessageSquare size={24} className="sm:w-7 sm:h-7 text-white" />
          <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse"></span>
        </a>
      </div>
      </Router>
    </ThemeContext.Provider>
  );
};

export default App;