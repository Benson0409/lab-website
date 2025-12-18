import React, { useState, useEffect, useLayoutEffect } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { db, auth, appId } from './firebase';

// 引入拆分後的資料
import { DEFAULT_CONFIG } from './data/constants';

// 引入拆分後的元件
import Button from './components/Button';
import Card from './components/Card';

// 引入拆分後的頁面區塊
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import ProjectsSection from './sections/ProjectsSection';
import EventsSection from './sections/EventsSection';

// 引入獨立頁面
import ProjectDetailPage from './pages/ProjectDetailPage';
import AdminPage from './pages/AdminPage';

// --------------------------------------------------------
// 為了避免你還要再建立兩個新檔案，我先把比較簡單的兩個頁面
// (EventDetailPage, AllProjectsPage) 定義在這裡。
// 等你熟悉了，可以再把它們移到 pages 資料夾。
// --------------------------------------------------------

const AllProjectsPage = ({ projects, onBack, onNavigateToDetail }) => {
    const [filter, setFilter] = useState('All');
    const categories = ['All', 'VR', 'AR', 'Game'];
    const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);
    return (
        <div className="min-h-screen bg-background pt-24 pb-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                    <div><Button onClick={onBack} variant="outline" className="mb-4">← 返回首頁</Button><h2 className="font-display text-4xl font-bold text-foreground">所有作品檔案</h2></div>
                    <div className="flex gap-2 mt-4 md:mt-0 flex-wrap">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === cat ? 'bg-[#0052FF] text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>{cat}</button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((item) => (
                        <div key={item.id} onClick={() => onNavigateToDetail(item)} className="cursor-pointer group">
                            <div className="relative overflow-hidden rounded-2xl mb-4 aspect-video bg-muted">
                                {item.coverImage ? (
                                    <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                ) : (
                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.category === 'VR' ? 'from-purple-500/20' : 'from-blue-500/20'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"><span className="bg-white/90 text-foreground px-4 py-2 rounded-full text-sm font-bold shadow-lg">查看詳情</span></div>
                            </div>
                            <h3 className="font-ui text-xl font-bold text-foreground group-hover:text-[#0052FF] transition-colors">{item.title}</h3>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.abstract}</p>
                            <div className="flex gap-2 mt-3">
                                <span className="text-xs font-mono-tech text-muted-foreground bg-muted px-2 py-1 rounded">{item.category || 'General'}</span>
                                <span className="text-xs font-mono-tech text-muted-foreground bg-muted px-2 py-1 rounded">{item.date instanceof Date ? item.date.getFullYear() : ''}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const EventDetailPage = ({ event, onBack }) => {
    if (!event) return null;
    return (
        <div className="min-h-screen bg-muted flex items-center justify-center p-4">
            <Card className="max-w-3xl w-full bg-card shadow-2xl relative overflow-hidden">
                <button onClick={onBack} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground z-10 p-2 bg-card/50 rounded-full hover:bg-card">✕ 關閉</button>
                {event.images && event.images.length > 0 && <div className="w-full h-64 md:h-80 bg-muted mb-6"><img src={event.images[0]} alt={event.title} className="w-full h-full object-cover" /></div>}
                <div className="border-b border-border pb-6 mb-6 px-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#0052FF]/10 text-[#0052FF] text-xs font-bold mb-4">近期活動</span>
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">{event.title}</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-mono-tech mt-4">
                        <span className="flex items-center gap-1">📅 {event.date}</span><span className="flex items-center gap-1">⏰ {event.time}</span><span className="flex items-center gap-1">📍 {event.location}</span>
                    </div>
                </div>
                <div className="prose prose-slate mb-8 px-6"><p className="text-lg leading-relaxed text-foreground/80">{event.description}</p></div>
                {event.images && event.images.length > 0 && (
                    <div className="px-6 mb-8"><h4 className="font-bold text-lg mb-4 text-foreground">活動相簿</h4><div className="grid grid-cols-2 md:grid-cols-3 gap-3">{event.images.map((img, idx) => (<img key={idx} src={img} alt={`Album ${idx+1}`} className="rounded-lg object-cover w-full h-32 hover:scale-105 transition-transform duration-300 shadow-sm cursor-pointer" />))}</div></div>
                )}
                <div className="flex gap-4 px-6 pb-6">
                    {event.link ? <Button className="flex-1 text-center justify-center" href={event.link} target="_blank">{event.linkText || "前往報名 / 查看詳情"} ↗</Button> : !event.images && <Button className="flex-1 text-center justify-center" disabled>無需報名 / 自由參加</Button>}
                    <Button variant="outline" onClick={onBack} className="flex-1 justify-center">返回列表</Button>
                </div>
            </Card>
        </div>
    );
};

// --- Main App Component ---

const App = () => {
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [labContent, setLabContent] = useState([]);
    const [eventsContent, setEventsContent] = useState([]);
    const [siteConfig, setSiteConfig] = useState(DEFAULT_CONFIG);
    const [refreshCount, setRefreshCount] = useState(0); 
    const [activePage, setActivePage] = useState({ page: 'home', data: null });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [lastScrollPos, setLastScrollPos] = useState(0);
    const [showLoginModal, setShowLoginModal] = useState(false); 
    const [loginError, setLoginError] = useState(''); 
    const [showPassword, setShowPassword] = useState(false); 
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        setTheme('light');
        document.documentElement.setAttribute('data-theme', 'light');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const navigateTo = (page, data = null) => { 
        if (activePage.page === 'home' && page !== 'home') setLastScrollPos(window.scrollY);
        setActivePage({ page, data }); 
        if (page !== 'home') window.scrollTo({ top: 0, behavior: 'smooth' }); 
    };

    const handleExitAdmin = () => { navigateTo('home'); };

    useLayoutEffect(() => {
        if (activePage.page === 'home') setTimeout(() => { window.scrollTo({ top: lastScrollPos, behavior: 'auto' }); }, 0);
    }, [activePage.page, lastScrollPos]);

    const scrollToSection = (id) => {
        if (activePage.page !== 'home') {
            navigateTo('home');
            setTimeout(() => { const element = document.getElementById(id); if (element) { const headerHeight = 80; const offset = element.offsetTop - headerHeight; window.scrollTo({ top: offset, behavior: 'smooth' }); } }, 100);
        } else {
            setIsMenuOpen(false); 
            const element = document.getElementById(id);
            if (element) { const headerHeight = 80; const offset = element.offsetTop - headerHeight; window.scrollTo({ top: offset, behavior: 'smooth' }); }
        }
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        const pwd = e.target.password.value;
        if (pwd === siteConfig.adminPassword) {
            setShowLoginModal(false);
            setLoginError(''); 
            navigateTo('admin');
        } else {
            setLoginError("密碼錯誤，請再試一次。");
        }
    };

    useEffect(() => {
        const authenticate = async () => { try { await signInAnonymously(auth); } catch (error) { console.error("Auth Error:", error); } };
        authenticate();
        const unsubscribe = onAuthStateChanged(auth, (user) => { setUserId(user ? user.uid : null); setIsAuthReady(true); });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!isAuthReady || !userId || !db) return;
        const qProjects = query(collection(db, `artifacts/${appId}/users/${userId}/lab_data`), orderBy('date', 'desc'));
        const unsubProjects = onSnapshot(qProjects, (snap) => setLabContent(snap.docs.map(d => ({ id: d.id, ...d.data(), date: d.data().date?.toDate ? d.data().date.toDate() : new Date() }))));
        
        const qEvents = query(collection(db, `artifacts/${appId}/users/${userId}/lab_events`));
        const unsubEvents = onSnapshot(qEvents, (snap) => setEventsContent(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

        const unsubConfig = onSnapshot(doc(db, `artifacts/${appId}/users/${userId}/lab_config`, 'main'), (docSnap) => {
            if (docSnap.exists()) {
                setSiteConfig(prev => ({ ...prev, ...docSnap.data() })); 
            }
        });

        return () => { unsubProjects(); unsubEvents(); unsubConfig(); };
    }, [isAuthReady, userId, refreshCount]);

    const displayProjects = labContent.length > 0 ? labContent : [];
    const displayEvents = eventsContent.length > 0 ? eventsContent : [];

    return (
        <div className="min-h-screen bg-background text-foreground font-ui relative">
            
            {showLoginModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-card p-6 rounded-2xl shadow-2xl w-full max-w-sm border border-border">
                        <h3 className="text-xl font-bold mb-4 text-foreground">管理員登入</h3>
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div className="relative">
                                <input 
                                    name="password" 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="請輸入密碼" 
                                    className="w-full p-3 border border-border bg-input text-foreground rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-[#0052FF]" 
                                    autoFocus 
                                    onChange={() => setLoginError('')}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? "👁️" : "🙈"}
                                </button>
                            </div>
                            {loginError && <p className="text-red-500 text-sm font-medium">{loginError}</p>}
                            <div className="flex gap-2">
                                <Button className="flex-1" type="submit">登入</Button>
                                <Button className="flex-1" variant="outline" type="button" onClick={() => { setShowLoginModal(false); setLoginError(''); }}>取消</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <header className="bg-card/90 backdrop-blur-sm sticky top-0 z-40 border-b border-border transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('home')}>
                        {siteConfig.logoUrl ? (
                            <img src={siteConfig.logoUrl} alt="Lab Logo" className={`rounded-lg object-contain ${siteConfig.labName ? 'h-8 w-8 md:h-10 md:w-10' : 'h-10 md:h-12 w-auto'}`} />
                        ) : null}
                        {siteConfig.labName && (
                            <h1 className="font-display text-lg md:text-2xl text-foreground font-bold truncate">{siteConfig.labName}<span className="hidden md:inline"> (Wei Xiang Lab)</span></h1>
                        )}
                    </div>
                    <nav className="hidden lg:flex items-center space-x-4">
                        <button onClick={() => scrollToSection('hero')} className="font-ui px-3 py-1 rounded-lg transition-colors text-sm text-muted-foreground hover:text-foreground">網站首頁</button>
                        <button onClick={() => scrollToSection('about')} className="font-ui px-3 py-1 rounded-lg transition-colors text-sm text-muted-foreground hover:text-foreground">實驗室介紹</button>
                        <button onClick={() => navigateTo('all-projects')} className="font-ui px-3 py-1 rounded-lg transition-colors text-sm text-muted-foreground hover:text-foreground">最新成果</button>
                        <button onClick={() => scrollToSection('events')} className="font-ui px-3 py-1 rounded-lg transition-colors text-sm text-muted-foreground hover:text-foreground">近期活動</button>
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-muted text-foreground transition-colors">
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                    </nav>
                    <div className="flex items-center gap-2 lg:hidden">
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-muted text-foreground transition-colors">
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                        <button className="p-2 text-foreground focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            ☰
                        </button>
                    </div>
                </div>
                <div className={`lg:hidden absolute w-full bg-card border-b border-border shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col px-4 py-4 space-y-4">
                        <button onClick={() => scrollToSection('hero')} className="text-left font-ui py-2 text-muted-foreground hover:text-foreground">網站首頁</button>
                        <button onClick={() => scrollToSection('about')} className="text-left font-ui py-2 text-muted-foreground hover:text-foreground">實驗室介紹</button>
                        <button onClick={() => navigateTo('all-projects')} className="text-left font-ui py-2 text-muted-foreground hover:text-foreground">最新成果</button>
                        <button onClick={() => scrollToSection('events')} className="text-left font-ui py-2 text-muted-foreground hover:text-foreground">近期活動</button>
                    </div>
                </div>
            </header>
            <main>
                {activePage.page === 'home' && (
                    <>
                        <HeroSection scrollToSection={scrollToSection} config={siteConfig} />
                        <AboutSection config={siteConfig} />
                        <ProjectsSection labContent={displayProjects} scrollToSection={scrollToSection} onNavigate={navigateTo} />
                        <EventsSection events={displayEvents} onNavigate={navigateTo} />
                        <section className="inverted-section-bg py-20 text-background">
                            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                                <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6 text-white">加入我們的<span className="text-gradient inline-block ml-3">創新旅程</span></h2>
                                <p className="font-ui text-lg text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto">我們熱烈歡迎對數位設計、互動技術或遊戲開發有熱忱的學生加入微想實驗室，一同探索未來的可能性。</p>
                                <Button href={siteConfig.fanPageUrl} target="_blank" className="h-14 px-10 text-lg">聯絡我們</Button>
                            </div>
                        </section>
                    </>
                )}
                {activePage.page === 'admin' && (
                    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        {isAuthReady ? <AdminPage userId={userId} db={db} isAuthReady={isAuthReady} labContent={displayProjects} eventsContent={displayEvents} config={siteConfig} setRefreshCount={setRefreshCount} onExit={handleExitAdmin} appId={appId} /> : <div className="p-8 text-center text-muted-foreground">身份驗證中...</div>}
                    </section>
                )}
                {activePage.page === 'project-detail' && <ProjectDetailPage project={activePage.data} onBack={() => navigateTo('home')} />}
                {activePage.page === 'all-projects' && <AllProjectsPage projects={displayProjects} onBack={() => navigateTo('home')} onNavigateToDetail={(item) => navigateTo('project-detail', item)} />}
                {activePage.page === 'event-detail' && <EventDetailPage event={activePage.data} onBack={() => navigateTo('home')} />}
            </main>
            <footer className="py-12 border-t border-white/10 inverted-section-bg text-background/80">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-ui text-sm text-white/60">© {new Date().getFullYear()} {siteConfig.labNameFull}. {siteConfig.department.split(' ')[0]}.</p>
                    <button onClick={() => setShowLoginModal(true)} className="text-xs text-white/20 hover:text-white/50 transition-colors">Admin</button>
                </div>
            </footer>
        </div>
    );
};

export default App;