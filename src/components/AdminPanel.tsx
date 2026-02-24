import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Image as ImageIcon, 
  MessageSquare, 
  Save, 
  Plus, 
  Trash2, 
  LogOut,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Lock,
  User,
  Sparkles
} from 'lucide-react';
import { SiteProfile, PortfolioItem, QuotationRequest, SocialLink } from '../types';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'profile' | 'portfolio' | 'quotations'>('profile');
  const [profile, setProfile] = useState<SiteProfile | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [quotations, setQuotations] = useState<QuotationRequest[]>([]);
  const [newQueriesCount, setNewQueriesCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Portfolio Form State
  const [newProject, setNewProject] = useState({ title: '', category: 'Residential', image: '' });

  useEffect(() => {
    fetchData();
    
    // Check for existing session
    const savedSession = localStorage.getItem('admin_session');
    if (savedSession) {
      try {
        const { expiry } = JSON.parse(savedSession);
        if (new Date().getTime() < expiry) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('admin_session');
        }
      } catch (e) {
        localStorage.removeItem('admin_session');
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_QUOTATION') {
        setQuotations(prev => [data.quotation, ...prev]);
        if (activeTab !== 'quotations') {
          setNewQueriesCount(prev => prev + 1);
        }
      }
    };

    return () => socket.close();
  }, [isLoggedIn, activeTab]);

  useEffect(() => {
    if (activeTab === 'quotations') {
      setNewQueriesCount(0);
    }
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const [profRes, portRes, quotRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/portfolio'),
        fetch('/api/quotations')
      ]);
      
      setProfile(await profRes.json());
      setPortfolio(await portRes.json());
      setQuotations(await quotRes.json());
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const handleProfileSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.image) return;
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });
      const data = await res.json();
      setPortfolio([...portfolio, { ...newProject, id: data.id }]);
      setNewProject({ title: '', category: 'Residential', image: '' });
    } catch (error) {
      alert('Failed to add project');
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      setPortfolio(portfolio.filter(item => item.id !== id));
    } catch (error) {
      alert('Failed to delete project');
    }
  };

  const handleDeleteQuotation = async (id: number) => {
    if (!confirm('Are you sure you want to delete this query?')) return;
    try {
      await fetch(`/api/quotations/${id}`, { method: 'DELETE' });
      setQuotations(quotations.filter(q => q.id !== id));
    } catch (error) {
      alert('Failed to delete query');
    }
  };

  const addSocialLink = () => {
    if (!profile) return;
    setProfile({
      ...profile,
      socialLinks: [...profile.socialLinks, { platform: 'New Platform', url: '' }]
    });
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    if (!profile) return;
    const newLinks = [...profile.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setProfile({ ...profile, socialLinks: newLinks });
  };

  const removeSocialLink = (index: number) => {
    if (!profile) return;
    setProfile({
      ...profile,
      socialLinks: profile.socialLinks.filter((_, i) => i !== index)
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'admin_456' && loginForm.password === 'Admin@5632') {
      setIsLoggedIn(true);
      setLoginError('');
      
      // Save session for 7 days
      const expiry = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem('admin_session', JSON.stringify({ expiry }));
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[110] bg-brand-bg flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-brand-ink/5 p-10 md:p-12 relative overflow-hidden"
        >
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex flex-col items-center mb-10">
              <img src="/logo.png" alt="Interiorswala" className="h-16 w-auto mb-6" />
              <h2 className="text-2xl font-serif text-brand-ink">Admin Authentication</h2>
              <p className="text-brand-ink/40 text-sm mt-2">Please enter your credentials to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-brand-ink/40 ml-1 font-bold">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/20" size={18} />
                  <input 
                    type="text"
                    required
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                    className="w-full bg-brand-bg/50 border border-brand-ink/10 rounded-2xl py-4 pl-12 pr-4 focus:border-brand-accent outline-none transition-all"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-brand-ink/40 ml-1 font-bold">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/20" size={18} />
                  <input 
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="w-full bg-brand-bg/50 border border-brand-ink/10 rounded-2xl py-4 pl-12 pr-4 focus:border-brand-accent outline-none transition-all"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              {loginError && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs font-medium text-center"
                >
                  {loginError}
                </motion.p>
              )}

              <button 
                type="submit"
                className="w-full py-5 bg-brand-accent text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-xs hover:bg-brand-accent/90 transition-all shadow-xl shadow-brand-accent/20"
              >
                Access Dashboard
              </button>
              
              <button 
                type="button"
                onClick={onClose}
                className="w-full text-brand-ink/40 text-xs font-medium hover:text-brand-ink transition-colors mt-4"
              >
                Return to Website
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-brand-bg flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-full md:w-72 bg-brand-ink p-8 flex flex-col border-r border-white/5">
        <div className="flex flex-col items-center mb-12">
          <img src="/logo.png" alt="Interiorswala" className="h-12 w-auto mb-6" />
          <div className="h-px w-full bg-white/10 mb-6" />
          <div className="flex items-center space-x-3 w-full px-2">
            <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center shrink-0">
              <Settings className="text-white" size={16} />
            </div>
            <h1 className="text-white font-serif text-lg truncate">Admin Dashboard</h1>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-brand-accent text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
          >
            <Globe size={18} />
            <span className="text-sm font-medium">Profile Management</span>
          </button>
          <button 
            onClick={() => setActiveTab('portfolio')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'portfolio' ? 'bg-brand-accent text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
          >
            <ImageIcon size={18} />
            <span className="text-sm font-medium">Portfolio Management</span>
          </button>
          <button 
            onClick={() => setActiveTab('quotations')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'quotations' ? 'bg-brand-accent text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
          >
            <div className="flex items-center space-x-3">
              <MessageSquare size={18} />
              <span className="text-sm font-medium">Client Queries</span>
            </div>
            {newQueriesCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-white text-brand-accent text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg"
              >
                {newQueriesCount}
              </motion.span>
            )}
          </button>
        </nav>

        <button 
          onClick={() => {
            localStorage.removeItem('admin_session');
            setIsLoggedIn(false);
            onClose();
          }}
          className="mt-auto flex items-center space-x-3 px-4 py-3 text-white/50 hover:text-white transition-all group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Logout & Exit</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-brand-bg p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'profile' && profile && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-serif text-brand-ink">Profile Management</h2>
                <button 
                  onClick={handleProfileSave}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-6 py-3 bg-brand-accent text-white rounded-xl hover:bg-brand-accent/90 transition-all disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-xs uppercase tracking-widest text-brand-ink/40 font-semibold">Contact Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/30" size={18} />
                    <input 
                      type="text" 
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="w-full bg-white border border-brand-ink/10 rounded-xl py-4 pl-12 pr-4 focus:border-brand-accent outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-xs uppercase tracking-widest text-brand-ink/40 font-semibold">Contact Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/30" size={18} />
                    <input 
                      type="email" 
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="w-full bg-white border border-brand-ink/10 rounded-xl py-4 pl-12 pr-4 focus:border-brand-accent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs uppercase tracking-widest text-brand-ink/40 font-semibold">Office Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-brand-ink/30" size={18} />
                  <textarea 
                    rows={3}
                    value={profile.address}
                    onChange={(e) => setProfile({...profile, address: e.target.value})}
                    className="w-full bg-white border border-brand-ink/10 rounded-xl py-4 pl-12 pr-4 focus:border-brand-accent outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="block text-xs uppercase tracking-widest text-brand-ink/40 font-semibold">Social Media Links</label>
                  <button onClick={addSocialLink} className="text-brand-accent flex items-center space-x-1 text-sm font-semibold hover:underline">
                    <Plus size={16} />
                    <span>Add Link</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {profile.socialLinks.map((link, index) => (
                    <div key={index} className="flex items-center space-x-4 bg-white p-4 rounded-xl border border-brand-ink/5">
                      <input 
                        type="text" 
                        placeholder="Platform (e.g. Instagram)"
                        value={link.platform}
                        onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                        className="flex-1 bg-brand-bg/50 border border-brand-ink/5 rounded-lg py-2 px-3 outline-none focus:border-brand-accent"
                      />
                      <input 
                        type="text" 
                        placeholder="URL"
                        value={link.url}
                        onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                        className="flex-[2] bg-brand-bg/50 border border-brand-ink/5 rounded-lg py-2 px-3 outline-none focus:border-brand-accent"
                      />
                      <button onClick={() => removeSocialLink(index)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'portfolio' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-serif text-brand-ink">Portfolio Management</h2>
              </div>

              {/* Add New Project */}
              <div className="bg-white p-8 rounded-2xl border border-brand-ink/5 shadow-sm space-y-6">
                <h3 className="text-lg font-serif text-brand-ink">Add New Project</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-brand-ink/40 font-semibold">Project Title</label>
                    <input 
                      type="text" 
                      value={newProject.title}
                      onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                      placeholder="e.g. Urban Sanctuary"
                      className="w-full bg-brand-bg/50 border border-brand-ink/5 rounded-xl py-3 px-4 outline-none focus:border-brand-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-brand-ink/40 font-semibold">Category</label>
                    <select 
                      value={newProject.category}
                      onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                      className="w-full bg-brand-bg/50 border border-brand-ink/5 rounded-xl py-3 px-4 outline-none focus:border-brand-accent appearance-none"
                    >
                      <option>Residential</option>
                      <option>Kitchen</option>
                      <option>Bedroom</option>
                      <option>Living</option>
                      <option>Commercial</option>
                      <option>Storage</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-brand-ink/40 font-semibold">Image URL</label>
                  <input 
                    type="text" 
                    value={newProject.image}
                    onChange={(e) => setNewProject({...newProject, image: e.target.value})}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-brand-bg/50 border border-brand-ink/5 rounded-xl py-3 px-4 outline-none focus:border-brand-accent"
                  />
                </div>
                <button 
                  onClick={handleAddProject}
                  className="w-full py-4 bg-brand-accent text-white rounded-xl font-semibold uppercase tracking-widest text-xs hover:bg-brand-accent/90 transition-all flex items-center justify-center space-x-2"
                >
                  <Plus size={18} />
                  <span>Add Project to Portfolio</span>
                </button>
              </div>

              {/* Project List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolio.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-brand-ink/5 shadow-sm group">
                    <div className="h-48 overflow-hidden relative">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4">
                        <button 
                          onClick={() => handleDeleteProject(item.id)}
                          className="bg-white/90 backdrop-blur-sm text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold mb-1 block">{item.category}</span>
                      <h4 className="text-xl font-serif text-brand-ink">{item.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'quotations' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-serif text-brand-ink">Client Queries</h2>
                <span className="bg-brand-accent/10 text-brand-accent px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {quotations.length} Total Requests
                </span>
              </div>

              <div className="space-y-6">
                {quotations.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-3xl border border-brand-ink/5">
                    <MessageSquare size={48} className="mx-auto text-brand-ink/10 mb-4" />
                    <p className="text-brand-ink/40 font-medium">No client queries yet.</p>
                  </div>
                ) : (
                  quotations.map((q) => (
                    <div key={q.id} className="bg-white p-8 rounded-3xl border border-brand-ink/5 shadow-sm space-y-6 relative group">
                      <button 
                        onClick={() => q.id && handleDeleteQuotation(q.id)}
                        className="absolute top-8 right-8 text-brand-ink/20 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={20} />
                      </button>

                      <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold mb-2 block">Client Info</span>
                          <h4 className="text-2xl font-serif text-brand-ink mb-1">{q.name}</h4>
                          <div className="flex flex-col space-y-1">
                            <a href={`mailto:${q.email}`} className="text-sm text-brand-ink/60 hover:text-brand-accent flex items-center space-x-2">
                              <Mail size={14} />
                              <span>{q.email}</span>
                            </a>
                            <a href={`tel:${q.phone}`} className="text-sm text-brand-ink/60 hover:text-brand-accent flex items-center space-x-2">
                              <Phone size={14} />
                              <span>{q.phone}</span>
                            </a>
                          </div>
                        </div>
                        <div className="md:border-l border-brand-ink/5 md:pl-12">
                          <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold mb-2 block">Project Details</span>
                          <div className="space-y-1">
                            <p className="text-sm text-brand-ink font-semibold">{q.projectType}</p>
                            <p className="text-sm text-brand-ink/60">Budget: {q.budget}</p>
                            <p className="text-[10px] text-brand-ink/30 uppercase tracking-widest mt-2">
                              {new Date(q.createdAt || '').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-brand-bg/50 p-6 rounded-2xl border border-brand-ink/5">
                        <span className="text-[10px] uppercase tracking-widest text-brand-ink/40 font-bold mb-3 block">Message</span>
                        <p className="text-brand-ink/70 leading-relaxed text-sm">{q.message}</p>
                      </div>

                      {q.aiConcept && (
                        <div className="bg-brand-accent/5 border border-brand-accent/10 p-6 rounded-2xl space-y-4">
                          <div className="flex items-center space-x-2 text-brand-accent">
                            <Sparkles size={16} />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Attached AI Design Plan</span>
                          </div>
                          {(() => {
                            try {
                              const concept = JSON.parse(q.aiConcept);
                              return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <p className="text-xs font-bold text-brand-ink/40 uppercase tracking-widest">Theme & Vision</p>
                                    <p className="text-sm text-brand-ink font-serif italic">{concept.theme}</p>
                                    <p className="text-xs text-brand-ink/60 leading-relaxed">{concept.description}</p>
                                  </div>
                                  <div className="space-y-4">
                                    <div>
                                      <p className="text-xs font-bold text-brand-ink/40 uppercase tracking-widest mb-2">Color Palette</p>
                                      <div className="grid grid-cols-5 gap-2">
                                        {concept.colorPalette.map((color: string, i: number) => (
                                          <div key={i} className="flex flex-col items-center gap-1">
                                            <div 
                                              className="w-full aspect-square rounded border border-brand-ink/10 shadow-sm"
                                              style={{ backgroundColor: color.startsWith('#') ? color : `#${color}` }}
                                            />
                                            <span className="text-[8px] font-mono text-brand-ink/40 uppercase">{color}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold text-brand-ink/40 uppercase tracking-widest mb-2">Key Features</p>
                                      <div className="flex flex-wrap gap-2">
                                        {concept.keyFeatures.map((f: string, i: number) => (
                                          <span key={i} className="text-[10px] bg-white px-2 py-1 rounded border border-brand-ink/5 text-brand-ink/60">{f}</span>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold text-brand-ink/40 uppercase tracking-widest mb-2">Materials</p>
                                      <div className="flex flex-wrap gap-2">
                                        {concept.materials.map((m: string, i: number) => (
                                          <span key={i} className="text-[10px] bg-brand-accent/10 px-2 py-1 rounded text-brand-accent">{m}</span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            } catch (e) {
                              return <p className="text-xs text-red-500">Error parsing AI concept</p>;
                            }
                          })()}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
