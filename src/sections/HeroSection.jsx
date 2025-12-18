import React, { useState, useEffect } from 'react';
import SectionLabel from '../components/SectionLabel';
import Button from '../components/Button';
import { HERO_SPECIALTIES } from '../data/constants';

const HeroSection = ({ scrollToSection, config }) => { 
    const [activeIndex, setActiveIndex] = useState(0);
    useEffect(() => { const interval = setInterval(() => { setActiveIndex((prev) => (prev + 1) % HERO_SPECIALTIES.length); }, 3500); return () => clearInterval(interval); }, []);
    return (
        <section id="hero" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
                <div>
                    <SectionLabel>National Taipei University of Education</SectionLabel>
                    <h2 className="font-display text-5xl md:text-7xl lg:text-[5.25rem] font-bold leading-tight mb-8 relative text-foreground">
                        {config.heroTitleLine1 && <><span className="inline-block whitespace-nowrap">{config.heroTitleLine1}</span><br className="block lg:hidden" /></>}
                        {config.labName && <><span className="lg:ml-3">{config.labName}的</span><br className="block lg:hidden" /></>}
                        {config.heroTitleHighlight && <span className="relative inline-block ml-0 lg:ml-3 whitespace-nowrap"><span className="text-gradient">{config.heroTitleHighlight}</span><span className="gradient-underline absolute bottom-[-0.5rem] left-0 h-2 w-full rounded-sm hidden md:block" style={{ background: 'linear-gradient(to right, rgba(0, 82, 255, 0.15), rgba(77, 124, 255, 0.1))' }}></span></span>}
                    </h2>
                    <p className="font-ui text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl">{config.heroDescription}</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={() => scrollToSection('projects')} className="w-full sm:w-auto">探索最新成果 <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></Button>
                        <Button onClick={() => scrollToSection('about')} variant="outline" className="w-full sm:w-auto text-foreground border-border hover:bg-muted/50">教授介紹</Button>
                    </div>
                </div>
                <div className="relative h-[450px] w-full flex items-center justify-center perspective-1000 mt-12 lg:mt-0">
                    <div className="absolute w-[500px] lg:w-[650px] h-[500px] lg:h-[650px] rounded-full border border-dashed border-[#0052FF]/30 animate-spin-slow ring-glow pointer-events-none"></div>
                    <div className="absolute w-[350px] lg:w-[480px] h-[350px] lg:h-[480px] rounded-full border-2 border-[#0052FF]/10 animate-spin-reverse-slow shadow-[0_0_20px_rgba(0,82,255,0.1)] pointer-events-none"></div>
                    <div className="absolute w-[300px] h-[300px] bg-[#0052FF] rounded-full blur-[100px] opacity-10 animate-pulse pointer-events-none"></div>
                    <div className="relative w-full h-full flex items-center justify-center">
                        {HERO_SPECIALTIES.map((item, index) => {
                            const offset = (index - activeIndex + HERO_SPECIALTIES.length) % HERO_SPECIALTIES.length;
                            let transformClass = '', opacityClass = '', zIndexClass = '';
                            if (offset === 0) { transformClass = 'translate-x-0 translate-y-0 scale-100 rotate-0'; opacityClass = 'opacity-100'; zIndexClass = 'z-20'; }
                            else if (offset === 1) { transformClass = 'translate-x-12 translate-y-4 scale-90 rotate-6 blur-[1px]'; opacityClass = 'opacity-60'; zIndexClass = 'z-10'; }
                            else { transformClass = '-translate-x-12 translate-y-4 scale-90 -rotate-6 blur-[1px]'; opacityClass = 'opacity-60'; zIndexClass = 'z-10'; }
                            return (
                                <div key={item.id} className={`absolute w-64 lg:w-72 h-80 lg:h-96 rounded-2xl shadow-2xl bg-card border border-white/50 transition-all duration-700 ease-in-out flex flex-col overflow-hidden ${transformClass} ${opacityClass} ${zIndexClass}`}>
                                    <div className="h-3/5 w-full relative overflow-hidden bg-gray-100">
                                        <img src={item.src} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                                        <div className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-20 mix-blend-overlay`}></div>
                                    </div>
                                    <div className="h-2/5 w-full p-6 flex flex-col justify-between bg-card relative">
                                        <div className={`absolute -top-8 right-6 w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg flex items-center justify-center text-white font-bold font-mono-tech border-4 border-card`}>{item.icon}</div>
                                        <div><h3 className="font-display text-2xl font-bold text-foreground leading-tight">{item.title}</h3><p className="font-ui text-sm text-muted-foreground mt-1">{item.subtitle}</p></div>
                                        <div className="w-full h-1 bg-gray-100 rounded-full mt-4 overflow-hidden">{offset === 0 && <div className="h-full bg-signature-gradient animate-[width_3.5s_linear_infinite]" style={{ width: '100%' }}></div>}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;