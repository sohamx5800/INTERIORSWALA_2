import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Menu, 
  X, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  Send, 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Facebook, 
  Linkedin,
  MessageCircle 
} from 'lucide-react';
import { BRAND_IMAGES, SERVICES, PORTFOLIO_ITEMS } from './constants';
import { generateInteriorConcept } from './services/geminiService';
import { ProjectConcept, QuotationRequest } from './types';

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-brand-bg/90 backdrop-blur-md py-4 border-b border-brand-ink/5' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-3 items-center">
          {/* Logo Column */}
          <div className="flex justify-start">
            <a href="#" className="flex items-center group">
              <div className="h-16 flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="Interiorswala" 
                  className="h-16 w-auto object-contain transition-all duration-300" 
                />
              </div>
            </a>
          </div>
          
          {/* Nav Links Column (Centered on Desktop) */}
          <div className="hidden md:flex justify-center space-x-12 items-center">
            {['Portfolio', 'Services', 'Consultation', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors ${isScrolled ? 'text-brand-ink hover:text-brand-accent' : 'text-white hover:text-brand-accent drop-shadow-sm'}`}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Action Column (Right Aligned) */}
          <div className="flex justify-end items-center space-x-6">
            <div className="hidden md:block">
              <a 
                href="#quotation" 
                className="px-8 py-3 bg-brand-accent text-white text-xs uppercase tracking-[0.2em] hover:bg-brand-accent/90 transition-all duration-300 shadow-sm"
              >
                Request Quote
              </a>
            </div>
            <button className={`md:hidden ${isScrolled ? 'text-brand-ink' : 'text-white drop-shadow-sm'}`} onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center w-screen h-screen"
          >
            {/* Immersive Mobile Menu Background */}
            <div className="absolute inset-0 z-0">
              <img 
                src={BRAND_IMAGES.MODERN_LIVING_ALT} 
                alt="Menu Background" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-ink/95 backdrop-blur-2xl" />
            </div>

            <button className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors z-10 p-2" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={32} />
            </button>

            <div className="relative z-10 flex flex-col items-center space-y-12 w-full px-6">
              {['Portfolio', 'Services', 'Consultation', 'Contact'].map((item, idx) => (
                <motion.a 
                  key={item} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  href={`#${item.toLowerCase()}`} 
                  className="text-5xl font-serif text-white hover:text-brand-accent transition-colors tracking-wide text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </motion.a>
              ))}
              <motion.a 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                href="#quotation" 
                className="mt-12 px-16 py-5 bg-brand-accent text-white text-sm uppercase tracking-[0.3em] font-semibold rounded-full shadow-2xl hover:bg-white hover:text-brand-ink transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Request Quote
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const FadeInSection = ({ children, className = "" }: { children: React.ReactNode, className?: string, key?: React.Key }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const ExpertiseSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SERVICES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % SERVICES.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + SERVICES.length) % SERVICES.length);
  };

  return (
    <div className="relative h-[65vh] md:h-[85vh] w-full max-w-7xl mx-auto px-6 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-6 inset-y-0 rounded-[2rem] overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 z-0">
            <img 
              src={SERVICES[currentIndex].image} 
              alt={SERVICES[currentIndex].title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/95 via-brand-ink/40 to-transparent" />
          </div>
          
          <div className="relative z-10 h-full px-8 md:px-24 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="text-brand-accent font-serif text-2xl md:text-5xl italic mb-4 block">
                {SERVICES[currentIndex].id}
              </span>
            </motion.div>
            
            <motion.h3 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-white text-3xl md:text-7xl font-serif mb-6 max-w-2xl leading-[1.1]"
            >
              {SERVICES[currentIndex].title}
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-white/80 text-sm md:text-xl font-light max-w-lg leading-relaxed mb-10"
            >
              {SERVICES[currentIndex].description}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex items-center gap-4"
            >
              <button 
                onClick={prevSlide}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-brand-ink transition-all duration-500 backdrop-blur-sm"
              >
                <ArrowRight className="rotate-180" size={18} />
              </button>
              <button 
                onClick={nextSlide}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-brand-ink transition-all duration-500 backdrop-blur-sm"
              >
                <ArrowRight size={18} />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4">
        {SERVICES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentIndex(idx);
            }}
            className={`h-1.5 rounded-full transition-all duration-700 ${idx === currentIndex ? 'w-16 bg-brand-accent' : 'w-4 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [conceptPrompt, setConceptPrompt] = useState('');
  const [concept, setConcept] = useState<ProjectConcept | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [quoteForm, setQuoteForm] = useState<QuotationRequest>({
    name: '', email: '', phone: '', projectType: 'Residential', budget: '', message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleGenerateConcept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conceptPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generateInteriorConcept(conceptPrompt);
      setConcept(result);
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setQuoteForm({ name: '', email: '', phone: '', projectType: 'Residential', budget: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen selection:bg-brand-accent selection:text-white">
      <Navbar />

      {/* 1. FULLSCREEN HERO */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={BRAND_IMAGES.HERO} 
            alt="Luxury Interior" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-ink/30" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <p className="text-white/90 text-[10px] md:text-lg uppercase tracking-[0.4em] mb-12 font-light drop-shadow-md leading-relaxed">
              Design. Technical Excellence. <br className="md:hidden" /> Complete Project Delivery.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href="#quotation" 
                className="w-full sm:w-auto inline-block px-10 py-5 bg-brand-accent text-white text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-brand-ink transition-all duration-500 shadow-xl rounded-sm"
              >
                Book Consultation
              </a>
              <a 
                href="#portfolio" 
                className="w-full sm:w-auto inline-block px-10 py-5 bg-white/10 backdrop-blur-md border border-white/30 text-white text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-brand-ink transition-all duration-500 rounded-sm"
              >
                View Portfolio
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center"
        >
          <span className="text-[10px] uppercase tracking-widest mb-2">Scroll</span>
          <div className="w-px h-12 bg-white/20 relative overflow-hidden">
            <motion.div 
              animate={{ y: [0, 48] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-4 bg-white/60"
            />
          </div>
        </motion.div>
      </section>

      {/* 2. BRAND STATEMENT SECTION */}
      <section className="relative py-32 md:py-72 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
            src="https://images.unsplash.com/photo-1678762200388-51e11225d4de?q=80&w=1163&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Luxury Interior Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-ink/65" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-3xl md:text-7xl font-serif text-white mb-12 md:mb-16 leading-[1.2] tracking-tight drop-shadow-2xl">
                Spaces That Reflect <br className="hidden md:block" />
                <span className="italic text-brand-accent">Precision</span> & Lifestyle
              </h2>
            </motion.div>

            <div className="space-y-12 max-w-4xl">
              <motion.div 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-24 md:w-32 h-px bg-brand-accent/60 mx-auto"
              />

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-brand-accent text-lg md:text-3xl font-serif italic leading-relaxed tracking-wide"
              >
                Serving discerning clients across Siliguri, Sikkim, Kalimpong, and Darjeeling with thoughtful design and complete project delivery.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EDITORIAL SECTIONS */}
      <section className="bg-brand-bg overflow-hidden py-12 md:py-32 space-y-24 md:space-y-48">
        {/* Living Section */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full md:w-1/2 aspect-[16/11] relative rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
            >
              <div className="w-full h-full rounded-[3rem] overflow-hidden border border-brand-ink/5">
                <img 
                  src={BRAND_IMAGES.LIVING} 
                  alt="Living Room" 
                  className="w-full h-full object-cover scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-ink/5" />
              </div>
            </motion.div>
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <FadeInSection>
                <span className="text-brand-accent text-xs uppercase tracking-[0.3em] mb-4 block">Refined Living</span>
                <h3 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">The Art of the Living Space</h3>
                <p className="text-brand-muted text-lg leading-relaxed mb-8 font-light">
                  We create living environments that balance social energy with private tranquility. Our designs utilize natural light, premium materials, and custom-tailored layouts to enhance your daily rhythm.
                </p>
                <a href="#portfolio" className="flex items-center text-xs uppercase tracking-widest group">
                  View Collection <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={16} />
                </a>
              </FadeInSection>
            </div>
          </div>
        </div>

        {/* Kitchen Section - Reversed */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full md:w-1/2 aspect-[16/11] relative rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
            >
              <div className="w-full h-full rounded-[3rem] overflow-hidden border border-brand-ink/5">
                <img 
                  src={BRAND_IMAGES.KITCHEN} 
                  alt="Modular Kitchen" 
                  className="w-full h-full object-cover scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-ink/5" />
              </div>
            </motion.div>
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <FadeInSection>
                <span className="text-brand-accent text-xs uppercase tracking-[0.3em] mb-4 block">Technical Precision</span>
                <h3 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">Culinary Engineering</h3>
                <p className="text-brand-muted text-lg leading-relaxed mb-8 font-light">
                  Our modular kitchens are masterpieces of functional planning. We integrate the latest hardware with timeless aesthetics, creating a workspace that is as efficient as it is beautiful.
                </p>
                <a href="#portfolio" className="flex items-center text-xs uppercase tracking-widest group">
                  Explore Details <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={16} />
                </a>
              </FadeInSection>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES SECTION (EXPERTISE SLIDER) */}
      <section id="services" className="relative py-32 md:py-48 bg-brand-bg overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <FadeInSection className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="md:w-1/2">
              <h2 className="text-5xl md:text-8xl font-serif mb-4 leading-none">Our Expertise</h2>
              <div className="w-32 h-1 bg-brand-accent" />
            </div>
            <div className="md:w-1/3">
              <p className="text-brand-muted font-light text-lg">
                Specialized interior solutions delivered with architectural precision and premium materiality.
              </p>
            </div>
          </FadeInSection>
        </div>

        <div className="relative group">
          <ExpertiseSlider />
        </div>
      </section>

      {/* 5. PORTFOLIO SECTION */}
      <section id="portfolio" className="py-32 md:py-48 px-6 bg-brand-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-serif mb-6">Selected Works</h2>
            <div className="w-24 h-px bg-brand-accent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {PORTFOLIO_ITEMS.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group cursor-pointer"
              >
                <div className="overflow-hidden aspect-[4/5] mb-6 relative rounded-2xl shadow-lg">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-ink/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <span className="text-brand-accent text-[10px] uppercase tracking-[0.2em] mb-2 block">{item.category}</span>
                <h4 className="text-2xl font-serif group-hover:text-brand-accent transition-colors duration-300">{item.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. AI DESIGNER SECTION (Private Design Consultation) */}
      <section id="consultation" className="relative py-24 md:py-56 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1664711942326-2c3351e215e6?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGludGVyaW9yfGVufDB8fDB8fHww" 
            alt="AI Studio Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-ink/80 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-brand-accent text-[10px] md:text-xs uppercase tracking-[0.4em] mb-4 block"
            >
              Digital Studio
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-8xl font-serif mb-6 md:mb-8 text-white leading-tight"
            >
              Private Design Consultation
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/60 font-light max-w-2xl mx-auto text-base md:text-lg"
            >
              Describe your vision, and our intelligent design engine will architect a bespoke concept with technical precision and editorial flair.
            </motion.p>
          </div>

          <div className="bg-white/10 border border-white/20 p-6 md:p-16 backdrop-blur-2xl rounded-[2.5rem] md:rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-30 pointer-events-none" />
            
            {/* Generation Highlight Overlay */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-brand-ink/40 backdrop-blur-md flex items-center justify-center"
                >
                  <div className="relative flex flex-col items-center">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="w-16 h-16 md:w-24 md:h-24 border-2 border-brand-accent rounded-full border-t-transparent mb-6"
                    />
                    <motion.p 
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-brand-accent text-[10px] md:text-xs uppercase tracking-[0.5em] font-medium"
                    >
                      Architecting Concept...
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <form onSubmit={handleGenerateConcept} className="relative z-10 flex flex-col md:flex-row gap-4 md:gap-6 mb-12 md:mb-16">
              <div className="flex-1 relative group/input">
                <input 
                  type="text" 
                  value={conceptPrompt}
                  onChange={(e) => setConceptPrompt(e.target.value)}
                  placeholder="Describe your dream space..."
                  className="w-full bg-white/5 border border-white/10 py-5 md:py-6 px-6 md:px-8 focus:border-brand-accent/50 outline-none text-lg md:text-xl font-light transition-all rounded-xl md:rounded-2xl focus:bg-white/10 text-white placeholder:text-white/20 shadow-inner"
                />
                <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-brand-accent/5 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
              </div>
              <button 
                type="submit"
                disabled={isGenerating}
                className="px-10 py-5 md:px-12 md:py-6 bg-brand-accent text-white uppercase tracking-[0.2em] text-[10px] md:text-xs font-semibold flex items-center justify-center disabled:opacity-50 hover:bg-white hover:text-brand-ink transition-all duration-500 shadow-2xl rounded-xl md:rounded-2xl group/btn overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 flex items-center">
                  {isGenerating ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Sparkles size={18} />
                    </motion.div>
                  ) : (
                    <><Sparkles size={16} className="mr-3 group-hover/btn:scale-125 transition-transform" /> Generate Concept</>
                  )}
                </span>
              </button>
            </form>

            <AnimatePresence mode="wait">
              {concept && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16">
                    <div className="lg:col-span-2 space-y-10 md:space-y-12">
                      <div>
                        <h4 className="text-brand-accent text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4 md:mb-6">The Concept</h4>
                        <h3 className="text-3xl md:text-6xl font-serif mb-6 md:mb-8 text-white leading-tight">{concept.theme}</h3>
                        <p className="text-white/80 text-lg md:text-xl leading-relaxed font-light italic border-l-2 border-brand-accent pl-6 md:pl-8 py-2">
                          {concept.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 pt-8 border-t border-white/10">
                        <div>
                          <h5 className="text-[10px] md:text-xs uppercase tracking-[0.3em] mb-6 text-white/40">Design Plan</h5>
                          <ul className="space-y-4">
                            {concept.designPlan.map((step, i) => (
                              <motion.li 
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start text-sm font-light text-white/70 leading-relaxed"
                              >
                                <span className="text-brand-accent mr-3 font-serif italic">{i + 1}.</span> {step}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-[10px] md:text-xs uppercase tracking-[0.3em] mb-6 text-white/40">Key Features</h5>
                          <ul className="space-y-4">
                            {concept.keyFeatures.map((feature, i) => (
                              <motion.li 
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="flex items-center text-sm font-light text-white/80"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mr-4" /> {feature}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-10 md:space-y-12">
                      <div className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-md">
                        <h5 className="text-[10px] md:text-xs uppercase tracking-[0.3em] mb-6 md:mb-8 text-white/40">Color Palette</h5>
                        <div className="grid grid-cols-3 gap-4">
                          {concept.colorPalette.map((color, i) => (
                            <div key={i} className="group relative">
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="aspect-square rounded-xl border border-white/20 shadow-2xl cursor-pointer hover:scale-110 transition-transform" 
                                style={{ backgroundColor: color.startsWith('#') ? color : `#${color}` }}
                              />
                              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-mono text-white/50">
                                {color}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-md">
                        <h5 className="text-[10px] md:text-xs uppercase tracking-[0.3em] mb-6 text-white/40">Materiality</h5>
                        <div className="flex flex-wrap gap-2 md:gap-3">
                          {concept.materials.map((material, i) => (
                            <motion.span 
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.8 + i * 0.05 }}
                              className="px-3 py-1.5 md:px-4 md:py-2 bg-white/10 text-[9px] md:text-[10px] uppercase tracking-widest text-white/70 border border-white/5 rounded-full hover:bg-brand-accent hover:text-white transition-colors cursor-default"
                            >
                              {material}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 7. QUOTATION FORM */}
      <section id="quotation" className="relative py-24 md:py-56 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1920&auto=format&fit=crop" 
            alt="Contact Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-ink/70 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-20 shadow-2xl relative overflow-hidden group">
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-12 md:gap-20 items-start">
              <div className="lg:w-2/5 w-full">
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="text-brand-accent text-[10px] md:text-xs uppercase tracking-[0.4em] mb-4 md:mb-6 block"
                >
                  Contact
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-7xl font-serif mb-6 md:mb-8 text-white leading-tight"
                >
                  Begin Your <br className="hidden md:block" />Transformation
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-white/60 text-base md:text-lg font-light mb-10 md:mb-12 leading-relaxed"
                >
                  Every great project starts with a conversation. Share your vision with us, and our team will provide a comprehensive consultation and preliminary quotation.
                </motion.p>
                
                <div className="space-y-8 md:space-y-10">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center space-x-5 md:space-x-6 group/item"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-accent group-hover/item:bg-brand-accent group-hover/item:text-white transition-all duration-500">
                      <Phone size={20} />
                    </div>
                    <div>
                      <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-1">Call Us</span>
                      <p className="text-lg md:text-xl font-medium text-white tracking-wide">+91 79808 72754</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center space-x-5 md:space-x-6 group/item"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-accent group-hover/item:bg-brand-accent group-hover/item:text-white transition-all duration-500">
                      <Mail size={20} />
                    </div>
                    <div>
                      <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-1">Email</span>
                      <p className="text-lg md:text-xl font-medium text-white tracking-wide break-all">contact.interiorswala@gmail.com</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start space-x-5 md:space-x-6 group/item"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-accent group-hover/item:bg-brand-accent group-hover/item:text-white transition-all duration-500 shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-1">Office</span>
                      <p className="text-base md:text-lg font-light text-white/80 leading-relaxed max-w-xs">
                        Mangal Pandey Sarni, Ward 38, East Vivekananda Pally, Rabindra Sarani, Siliguri, West Bengal 734001
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="lg:w-3/5 w-full">
                <form onSubmit={handleQuoteSubmit} className="space-y-8 md:space-y-10 bg-white/5 p-6 md:p-12 rounded-[1.5rem] md:rounded-[2rem] border border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/40 ml-1">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={quoteForm.name}
                        onChange={(e) => setQuoteForm({...quoteForm, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 md:px-6 text-white focus:border-brand-accent outline-none transition-all focus:bg-white/10 text-sm md:text-base"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/40 ml-1">Email Address</label>
                      <input 
                        required
                        type="email" 
                        value={quoteForm.email}
                        onChange={(e) => setQuoteForm({...quoteForm, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 md:px-6 text-white focus:border-brand-accent outline-none transition-all focus:bg-white/10 text-sm md:text-base"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/40 ml-1">Project Type</label>
                      <div className="relative">
                        <select 
                          value={quoteForm.projectType}
                          onChange={(e) => setQuoteForm({...quoteForm, projectType: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 md:px-6 text-white focus:border-brand-accent outline-none transition-all focus:bg-white/10 appearance-none text-sm md:text-base"
                        >
                          <option className="bg-brand-ink">Residential</option>
                          <option className="bg-brand-ink">Modular Kitchen</option>
                          <option className="bg-brand-ink">Luxury Bedroom</option>
                          <option className="bg-brand-ink">Commercial</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                          <ChevronRight size={16} className="rotate-90" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/40 ml-1">Estimated Budget</label>
                      <input 
                        type="text" 
                        placeholder="e.g. ₹20L - ₹50L"
                        value={quoteForm.budget}
                        onChange={(e) => setQuoteForm({...quoteForm, budget: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 md:px-6 text-white focus:border-brand-accent outline-none transition-all focus:bg-white/10 text-sm md:text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/40 ml-1">Message</label>
                    <textarea 
                      rows={4}
                      value={quoteForm.message}
                      onChange={(e) => setQuoteForm({...quoteForm, message: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 md:px-6 text-white focus:border-brand-accent outline-none transition-all focus:bg-white/10 resize-none text-sm md:text-base"
                      placeholder="Tell us about your project vision..."
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 md:py-6 bg-brand-accent text-white text-[10px] md:text-xs font-semibold uppercase tracking-[0.4em] hover:bg-white hover:text-brand-ink transition-all duration-500 rounded-xl flex items-center justify-center shadow-2xl overflow-hidden relative group/btn"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                    <span className="relative z-10 flex items-center">
                      {isSubmitting ? 'Sending Request...' : submitSuccess ? 'Request Sent Successfully' : <><Send size={16} className="mr-3" /> Submit Request</>}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="relative bg-brand-ink text-white py-32 px-6 overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-accent/30 to-transparent" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="md:col-span-2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <img 
                  src="/logo.png" 
                  alt="Interiorswala" 
                  className="h-16 w-auto object-contain" 
                />
              </motion.div>
              <p className="text-white/50 font-light max-w-sm leading-relaxed text-lg italic">
                A premium interior design studio dedicated to technical excellence and luxury aesthetics.
              </p>
            </div>
            <div>
              <h5 className="text-[10px] uppercase tracking-[0.3em] text-brand-accent mb-8 font-semibold">Navigation</h5>
              <ul className="space-y-4 text-sm font-light text-white/60">
                <li><a href="#portfolio" className="hover:text-brand-accent transition-colors flex items-center group"><ChevronRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> Portfolio</a></li>
                <li><a href="#services" className="hover:text-brand-accent transition-colors flex items-center group"><ChevronRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> Services</a></li>
                <li><a href="#consultation" className="hover:text-brand-accent transition-colors flex items-center group"><ChevronRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> AI Consultation</a></li>
                <li><a href="#quotation" className="hover:text-brand-accent transition-colors flex items-center group"><ChevronRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> Request Quote</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[10px] uppercase tracking-[0.3em] text-brand-accent mb-8 font-semibold">Social</h5>
              <div className="flex space-x-6">
                <a href="https://www.instagram.com/interiorswala.in?igsh=N3ludzc2bDlnZXht" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-all duration-500"><Instagram size={20} /></a>
                <a href="https://www.facebook.com/profile.php?id=61552204746268" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-all duration-500"><Facebook size={20} /></a>
                <a href="https://wa.me/917980872754" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-all duration-500"><MessageCircle size={20} /></a>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-white/30">
            <p>© 2026 Interiorswala. All Rights Reserved.</p>
            <div className="flex space-x-12 mt-6 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
