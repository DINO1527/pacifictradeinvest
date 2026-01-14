import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft, Building2, TrendingUp, Menu, X, Globe, Mail, Phone, MapPin, CheckCircle, Send, Play } from 'lucide-react';

// --- Types ---
type View = 'LANDING' | 'INVESTOR_FORM' | 'INVESTEE_FORM';

// --- Constants & Brand Colors ---
const BrandColors = {
  primary: 'bg-[#0094B3]',       
  primaryText: 'text-[#0094B3]',
  dark: 'bg-[#2D3E45]',          
  darkText: 'text-[#2D3E45]',
  accent: 'bg-[#54B7CD]',        
  accentText: 'text-[#54B7CD]',
  teal: 'text-[#009B76]',
  tealBg: 'bg-[#009B76]',
  bgLight: 'bg-[#F0F8FA]',       
};

// --- Custom CSS for Animations ---
const CustomStyles = () => (
  <style>{`
    @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes wave { 
      0% { transform: translateX(0) translateZ(0) scaleY(1); } 
      50% { transform: translateX(-25%) translateZ(0) scaleY(0.55); } 
      100% { transform: translateX(-50%) translateZ(0) scaleY(1); } 
    }
    
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
    .animate-scale-in { animation: scaleIn 0.4s ease-out forwards; }
    
    .wave-bg {
      background: url('data:image/svg+xml;utf8,%3Csvg viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z" opacity=".25" fill="%23FFFFFF"/%3E%3Cpath d="M0 0v64.66c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 43.37 1113 4.08 1200 70.85V0z" opacity=".25" fill="%23FFFFFF"/%3E%3Cpath d="M0 0v50.66c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 29.37 1113-9.92 1200 56.85V0z" opacity=".5" fill="%23FFFFFF"/%3E%3C/svg%3E');
      background-size: cover;
      background-repeat: no-repeat;
    }

    .hero-gradient { background: linear-gradient(135deg, #2D3E45 0%, #0094B3 100%); }
    
    /* Animated Input Styles */
    .input-group { position: relative; margin-bottom: 1.5rem; }
    .input-field {
      width: 100%;
      padding: 16px 12px 6px 12px;
      background: #F8FAFC;
      border: 2px solid #E2E8F0;
      border-radius: 8px;
      outline: none;
      transition: all 0.3s ease;
      font-size: 1rem;
      color: #2D3E45;
    }
    .input-field:focus {
      border-color: #0094B3;
      background: #FFFFFF;
      box-shadow: 0 4px 12px rgba(0, 148, 179, 0.1);
    }
    .input-label {
      position: absolute;
      left: 14px;
      top: 14px;
      color: #64748B;
      font-size: 1rem;
      pointer-events: none;
      transition: all 0.3s ease;
    }
    .input-field:focus ~ .input-label,
    .input-field:not(:placeholder-shown) ~ .input-label {
      top: 2px;
      font-size: 0.75rem;
      color: #0094B3;
      font-weight: 600;
    }
  `}</style>
);

// --- REUSABLE UI COMPONENTS ---

const AnimatedInput = ({ label, type = "text", placeholder = " " }: { label: string, type?: string, placeholder?: string }) => (
  <div className="input-group">
    <input type={type} className="input-field" placeholder={placeholder} />
    <label className="input-label">{label}</label>
  </div>
);

const AnimatedSelect = ({ label, options }: { label: string, options: string[] }) => (
  <div className="input-group">
    {/* Fixed: Moved default selection to select tag's defaultValue */}
    <select className="input-field appearance-none cursor-pointer text-slate-700 pt-5 pb-2" defaultValue="">
      <option value="" disabled></option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
    <label className="input-label">{label}</label>
    <div className="absolute right-4 top-4 pointer-events-none text-gray-400">
      <ChevronRight className="rotate-90 w-5 h-5" />
    </div>
  </div>
);

// 3. Navigation Bar (Transparent to Fixed White)
const Navbar = ({ goHome }: { goHome: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const textColor = isScrolled ? 'text-[#2D3E45]' : 'text-white';
  const hoverColor = isScrolled ? 'hover:text-[#0094B3]' : 'hover:text-[#54B7CD]';
  const logoUrl = isScrolled 
    ? "https://pacifictradeinvest.com/dist/image/ptia-colour-logo.png" 
    : "https://pacifictradeinvest.com/dist/image/ptia-white-logo.gif";

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div onClick={goHome} className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
            <img src={logoUrl} alt="Pacific Trade Invest" className="h-14 w-auto object-contain transition-all duration-300" />
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            {['Home', 'About Us', 'Services', 'Contact'].map((item) => (
              <button key={item} onClick={goHome} className={`${textColor} ${hoverColor} font-medium transition duration-300 text-sm tracking-wide`}>
                {item}
              </button>
            ))}
            <button className={`${isScrolled ? BrandColors.primary : 'bg-white text-[#0094B3]'} ${isScrolled ? 'text-white' : ''} px-6 py-2.5 rounded-full font-bold hover:shadow-lg transition-all transform hover:-translate-y-0.5`}>
              Get Started
            </button>
          </div>
          
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`${textColor} focus:outline-none`}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in absolute w-full">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {['Home', 'About Us', 'Services', 'Contact'].map((item) => (
              <button key={item} onClick={() => { goHome(); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// 4. Footer
const Footer = () => (
  <footer className={`${BrandColors.dark} text-white pt-20 pb-10`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center mb-6 bg-white p-3 rounded-lg w-fit shadow-lg">
           <img src="https://pacifictradeinvest.com/dist/image/ptia-colour-logo.png" alt="Pacific Trade Invest" className="h-10 w-auto" />
        </div>
        <p className="text-gray-300 max-w-sm mb-8 leading-relaxed">Creating jobs and improving livelihoods in the Pacific by facilitating sustainable trade and investment.</p>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-6 text-[#54B7CD] tracking-wide uppercase text-sm">Quick Links</h3>
        <ul className="space-y-3 text-gray-300">
          {['Home', 'Our Network', 'Export Services', 'Investment Services'].map(item => (
            <li key={item}><a href="#" className="hover:text-[#54B7CD] transition duration-300 flex items-center"><ChevronRight size={14} className="mr-2"/> {item}</a></li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-6 text-[#54B7CD] tracking-wide uppercase text-sm">Contact Us</h3>
        <ul className="space-y-4 text-gray-300">
          <li className="flex items-center"><MapPin size={18} className="mr-3 text-[#0094B3]" /> Sydney, Australia</li>
          <li className="flex items-center"><Mail size={18} className="mr-3 text-[#0094B3]" /> info@pacifictradeinvest.com</li>
          <li className="flex items-center"><Phone size={18} className="mr-3 text-[#0094B3]" /> +61 2 9290 2133</li>
        </ul>
      </div>
    </div>
  </footer>
);

// --- Form Components ---
const InvestorFormContent = () => {
  const [submitted, setSubmitted] = useState(false);
  if (submitted) return (
    <div className="text-center py-20 animate-scale-in">
      <div className="w-20 h-20 bg-[#009B76]/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-[#009B76]" />
      </div>
      <h3 className="text-3xl font-bold text-[#2D3E45] mb-4">Thank You!</h3>
      <p className="text-gray-600 max-w-md mx-auto mb-8">Your Investor Profile has been submitted securely.</p>
      <button onClick={() => window.location.reload()} className="text-[#0094B3] font-semibold hover:underline">Return Home</button>
    </div>
  );
  return (
    <div className="animate-slide-up p-8 md:p-12">
      <div className="mb-10 pb-6 border-b border-gray-100">
        <h3 className="text-2xl font-bold text-[#2D3E45] mb-2 flex items-center"><TrendingUp className="w-6 h-6 mr-3 text-[#0094B3]" /> Investor Profile</h3>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><AnimatedInput label="First Name" /><AnimatedInput label="Last Name" /></div>
        <AnimatedInput label="Organization / Fund Name" /><AnimatedInput label="Email Address" type="email" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedSelect label="Investor Type" options={['Venture Capital', 'Private Equity', 'Angel Investor', 'Corporate']} />
          <AnimatedSelect label="Investment Range (USD)" options={['$50k - $250k', '$250k - $1M', '$1M - $5M', '$5M+']} />
        </div>
        <AnimatedSelect label="Target Sectors" options={['Agriculture', 'Fisheries', 'Tourism', 'Renewable Energy', 'Technology']} />
        <div className="input-group"><textarea className="input-field h-32 pt-4" placeholder=" "></textarea><label className="input-label">Specific Interests</label></div>
        <button type="submit" className={`${BrandColors.primary} text-white w-full py-4 rounded-full font-bold text-lg hover:bg-[#007A94] transition-all shadow-lg flex items-center justify-center`}>Submit Profile <Send className="ml-2 w-5 h-5" /></button>
      </form>
    </div>
  );
};

const InvesteeFormContent = () => {
  const [submitted, setSubmitted] = useState(false);
  if (submitted) return (
    <div className="text-center py-20 animate-scale-in">
      <div className="w-20 h-20 bg-[#0094B3]/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-[#0094B3]" />
      </div>
      <h3 className="text-3xl font-bold text-[#2D3E45] mb-4">EOI Received!</h3>
      <p className="text-gray-600 max-w-md mx-auto mb-8">Your EOI is in our system.</p>
      <button onClick={() => window.location.reload()} className="text-[#0094B3] font-semibold hover:underline">Return Home</button>
    </div>
  );
  return (
    <div className="animate-slide-up p-8 md:p-12">
      <div className="mb-10 pb-6 border-b border-gray-100">
        <h3 className="text-2xl font-bold text-[#2D3E45] mb-2 flex items-center"><Building2 className="w-6 h-6 mr-3 text-[#009B76]" /> Business Details (EOI)</h3>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
        <AnimatedInput label="Registered Business Name" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><AnimatedSelect label="Country" options={['Fiji', 'Samoa', 'Vanuatu', 'Tonga']} /><AnimatedInput label="Years in Operation" type="number" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><AnimatedSelect label="Industry" options={['Agriculture', 'Tourism', 'Manufacturing']} /><AnimatedInput label="Capital Required (USD)" type="number" /></div>
        <div className="input-group"><textarea className="input-field h-32 pt-4" placeholder=" "></textarea><label className="input-label">Brief Description</label></div>
        <button type="submit" className={`${BrandColors.tealBg} text-white w-full py-4 rounded-full font-bold text-lg hover:bg-[#007A94] transition-all shadow-lg flex items-center justify-center`}>Submit EOI <Send className="ml-2 w-5 h-5" /></button>
      </form>
    </div>
  );
};

const CustomFormPage = ({ title, subtitle, formType, onBack }: { title: string; subtitle: string; formType: 'investor' | 'investee'; onBack: () => void; }) => {
  return (
    <div className={`min-h-screen ${BrandColors.bgLight} animate-slide-up pt-20`}>
      <div className={`hero-gradient text-white py-16 px-4 relative overflow-hidden`}>
        <div className="max-w-4xl mx-auto relative z-10">
          <button onClick={onBack} className="flex items-center text-[#54B7CD] hover:text-white transition mb-8 font-medium group">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3 group-hover:bg-white/20 transition"><ArrowLeft size={16} /></div> Back to Selection
          </button>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">{title}</h1>
          <p className="text-[#54B7CD] text-lg max-w-2xl leading-relaxed">{subtitle}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 -mt-10 pb-20 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">{formType === 'investor' ? <InvestorFormContent /> : <InvesteeFormContent />}</div>
      </div>
    </div>
  );
};

// 5. Landing Page
const LandingPage = ({ onSelectPath }: { onSelectPath: (path: 'investor' | 'investee') => void }) => {
  return (
    <div className="animate-fade-in overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[900px] flex items-center justify-center overflow-hidden hero-gradient">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-[#54B7CD] rounded-full filter blur-[80px] opacity-30 animate-float"></div>
        <div className="absolute bottom-10 left-[10%] w-96 h-96 bg-[#009B76] rounded-full filter blur-[100px] opacity-20 animate-float-delayed"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center pb-20">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[#54B7CD] font-semibold text-sm mb-8 animate-slide-up" style={{animationDelay: '0.1s'}}>✨ Facilitating Growth in the Pacific</div>
          
          <h1 className="text-5xl md:text-8xl font-extrabold text-white tracking-tight mb-8 leading-tight animate-slide-up" style={{animationDelay: '0.2s'}}>
            Connecting Pacific Businesses <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#54B7CD] to-white">with Global Markets</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-3xl mx-auto leading-relaxed font-light animate-slide-up" style={{animationDelay: '0.3s'}}>
            We facilitate sustainable trade and investment across <span className="text-white font-medium">16 Pacific Island nations</span>, driving economic growth.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <button 
              onClick={() => onSelectPath('investor')}
              className="bg-white text-[#0094B3] px-10 py-5 rounded-full font-bold text-xl hover:bg-slate-100 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center"
            >
              Start Investing <ChevronRight className="ml-2 w-6 h-6" />
            </button>
            <button className="bg-transparent border border-white/40 backdrop-blur-sm text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-white/10 transition flex items-center justify-center group">
              <Play className="w-5 h-5 mr-2 fill-current opacity-70 group-hover:opacity-100" /> Watch Video
            </button>
          </div>
        </div>

        {/* Wave Animation at Bottom */}
        <div className="absolute bottom-0 w-full overflow-hidden leading-[0]">
            <svg className="relative block w-[calc(100%+1.3px)] h-[150px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z" className="fill-[#F0F8FA] opacity-30 animate-float"></path>
                <path d="M0,0V15.81C13,36.92,54.55,50.1,81.5,53.82,169.1,65.8,247.3,16,335.5,16c52,0,98.6,18.52,143.4,43.79,53.25,30.07,108,38.54,163.7,28.85,55.57-9.67,110-38.69,165.7-41.27,65.1-3,119.5,14.63,165,39.46,36.1,19.7,73.4,26.85,108.6,26.85,38.8,0,77.7-8.62,118.1-27.28V120H0Z" className="fill-[#F0F8FA]"></path>
            </svg>
        </div>
      </section>

      {/* Selection Section */}
      <section className={`py-24 ${BrandColors.bgLight} relative z-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold ${BrandColors.darkText} mb-4`}>Choose Your Path</h2>
            <div className="h-1.5 w-24 bg-[#0094B3] mx-auto mb-6 rounded-full"></div>
            <p className="text-[#38606C] text-lg max-w-2xl mx-auto">Whether you are looking to invest in the Pacific region or seeking investment for your business, we have a tailored process for you.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <div onClick={() => onSelectPath('investor')} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer group relative border-t-4 border-[#0094B3]">
              <div className="absolute top-0 right-0 bg-[#0094B3]/10 w-32 h-32 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
              <div className="p-12 flex flex-col items-center text-center h-full relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2] rounded-2xl rotate-3 flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform duration-300 shadow-sm">
                  <TrendingUp className="w-10 h-10 text-[#0094B3]" />
                </div>
                <h3 className="text-3xl font-bold text-[#2D3E45] mb-4 group-hover:text-[#0094B3] transition-colors">I am an Investor</h3>
                <p className="text-[#38606C] mb-8 flex-grow leading-relaxed">Access curated investment opportunities. Connect with verified businesses ready for growth.</p>
                <span className="flex items-center text-[#0094B3] font-bold bg-[#0094B3]/5 px-6 py-3 rounded-full group-hover:bg-[#0094B3] group-hover:text-white transition-all">Start Investor KYC <ChevronRight className="ml-2 w-5 h-5" /></span>
              </div>
            </div>
            <div onClick={() => onSelectPath('investee')} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer group relative border-t-4 border-[#009B76]">
              <div className="absolute top-0 right-0 bg-[#009B76]/10 w-32 h-32 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
              <div className="p-12 flex flex-col items-center text-center h-full relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-[#e0f2f1] to-[#b2dfdb] rounded-2xl -rotate-3 flex items-center justify-center mb-8 group-hover:-rotate-6 transition-transform duration-300 shadow-sm">
                  <Building2 className="w-10 h-10 text-[#009B76]" />
                </div>
                <h3 className="text-3xl font-bold text-[#2D3E45] mb-4 group-hover:text-[#009B76] transition-colors">I am an Investee</h3>
                <p className="text-[#38606C] mb-8 flex-grow leading-relaxed">Looking for capital? Submit your Expression of Interest (EOI) to get matched.</p>
                <span className="flex items-center text-[#009B76] font-bold bg-[#009B76]/5 px-6 py-3 rounded-full group-hover:bg-[#009B76] group-hover:text-white transition-all">Submit Investee EOI <ChevronRight className="ml-2 w-5 h-5" /></span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [currentView, setCurrentView] = useState<View>('LANDING');

  const handleSelection = (path: 'investor' | 'investee') => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (path === 'investor') setCurrentView('INVESTOR_FORM');
    if (path === 'investee') setCurrentView('INVESTEE_FORM');
  };

  const goHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView('LANDING');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800">
      <CustomStyles />
      <Navbar goHome={goHome} />
      <main className="flex-grow">
        {currentView === 'LANDING' && <LandingPage onSelectPath={handleSelection} />}
        {currentView === 'INVESTOR_FORM' && (
          <CustomFormPage 
            title="Investor KYC Portal" 
            subtitle="Complete your profile with our secure, advanced onboarding system." 
            formType="investor" 
            onBack={goHome} 
          />
        )}
        {currentView === 'INVESTEE_FORM' && (
          <CustomFormPage 
            title="Investee Expression of Interest" 
            subtitle="Submit your business details for assessment by our trade advisors." 
            formType="investee" 
            onBack={goHome} 
          />
        )}
      </main>
      <Footer />
    </div>
  );
}