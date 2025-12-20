import React, { useState, useEffect } from 'react';
import SectionLabel from '../components/SectionLabel';
import Button from '../components/Button';
import { HERO_SPECIALTIES } from '../data/constants';

const HeroSection = ({ scrollToSection, config }) => { 
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => { 
        if (isPaused) return;
        const interval = setInterval(() => { 
            setActiveIndex((prev) => (prev + 1) % HERO_SPECIALTIES.length); 
        }, 4000); 
        return () => clearInterval(interval); 
    }, [isPaused]);

    return (
        /* 移除 overflow-hidden，讓圓圈在大螢幕可以完整顯示 */
        <section id="hero" className="relative py-12 md:py-24 lg:py-40 min-h-[80vh] flex items-center">
            {/* 內容容器：維持標準最大寬度並居中 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-4 items-center relative z-10">
                
                {/* 左側文字區：確保對齊 */}
                <div className="flex flex-col items-center lg:items-start z-20 text-center lg:text-left">
                    <SectionLabel>National Taipei University of Education</SectionLabel>
                    <h2 className="font-display text-4xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.15] mb-8 text-foreground">
                        {config.heroTitleLine1 && (
                            <span className="block mb-2 whitespace-nowrap">{config.heroTitleLine1}</span>
                        )}
                        {config.labName && (
                            <span className="block mb-2">{config.labName}的</span>
                        )}
                        {config.heroTitleHighlight && (
                            <span className="relative inline-block">
                                <span className="text-gradient drop-shadow-[0_0_30px_rgba(0,82,255,0.4)]">
                                    {config.heroTitleHighlight}
                                </span>
                            </span>
                        )}
                    </h2>
                    <p className="font-ui text-base md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl">
                        {config.heroDescription}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Button onClick={() => scrollToSection('projects')} className="w-full sm:w-auto">
                            探索最新成果 <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </Button>
                        <Button onClick={() => scrollToSection('about')} variant="outline" className="w-full sm:w-auto">
                            教授介紹
                        </Button>
                    </div>
                </div>

                {/* 右側動態互動區：在大螢幕會隨視窗縮放比例 */}
                <div className="relative h-[400px] md:h-[550px] lg:h-[650px] w-full flex items-center justify-center 
                                lg:translate-x-20 
                                scale-[0.8] sm:scale-90 lg:scale-[1.1] 2xl:scale-[1.25] 
                                transition-all duration-700 ease-out">
                    
                    {/* 背景裝飾：不再被截斷 */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="absolute w-[300px] h-[300px] bg-[#0052FF]/20 rounded-full blur-[70px] animate-pulse"></div>
                        <div className="absolute w-[500px] lg:w-[850px] h-[500px] lg:h-[850px] rounded-full border border-dashed border-[#0052FF]/20 animate-spin-slow"></div>
                        <div className="absolute w-[350px] lg:w-[600px] h-[350px] lg:h-[600px] rounded-full border border-[#0052FF]/10 animate-spin-reverse-slow"></div>
                    </div>

                    {/* 互動輪播卡片 */}
                    <div 
                        className="relative w-full h-full flex items-center justify-center perspective-1000"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {HERO_SPECIALTIES.map((item, index) => {
                            const offset = (index - activeIndex + HERO_SPECIALTIES.length) % HERO_SPECIALTIES.length;
                            let transformClass = '', opacityClass = '', zIndexClass = '';
                            
                            if (offset === 0) { 
                                transformClass = 'translate-x-0 translate-y-0 scale-100 rotate-0 shadow-[0_20px_50px_rgba(0,82,255,0.2)]'; 
                                opacityClass = 'opacity-100'; 
                                zIndexClass = 'z-30'; 
                            } else if (offset === 1) { 
                                transformClass = 'translate-x-28 lg:translate-x-44 translate-y-10 scale-90 rotate-6 blur-[1px]'; 
                                opacityClass = 'opacity-30'; 
                                zIndexClass = 'z-10'; 
                            } else { 
                                transformClass = '-translate-x-28 lg:-translate-x-44 translate-y-10 scale-90 -rotate-6 blur-[1px]'; 
                                opacityClass = 'opacity-30'; 
                                zIndexClass = 'z-10'; 
                            }

                            return (
                                <div 
                                    key={item.id} 
                                    className={`absolute w-60 lg:w-72 h-[380px] lg:h-[450px] rounded-3xl bg-card border border-white/40 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col group ${transformClass} ${opacityClass} ${zIndexClass}`}
                                >
                                    <div className="h-[55%] w-full relative overflow-hidden rounded-t-[22px]">
                                        <img src={item.src} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-20`}></div>
                                    </div>

                                    <div className="h-[45%] w-full p-6 flex flex-col justify-between bg-card relative rounded-b-[22px]">
                                        <div className="absolute -top-12 right-6 px-4 py-2 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/40 flex items-center justify-center text-white font-bold font-mono-tech text-xl shadow-lg transition-transform group-hover:-translate-y-2">
                                            <span className={`bg-gradient-to-br ${item.color} bg-clip-text text-transparent`}>{item.icon}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-display text-2xl font-bold text-foreground leading-tight group-hover:text-[#0052FF] transition-colors">{item.title}</h3>
                                            <p className="font-ui text-sm text-muted-foreground mt-2">{item.subtitle}</p>
                                        </div>
                                        <div className="w-full h-1 bg-muted rounded-full mt-4 overflow-hidden">
                                            {offset === 0 && (
                                                <div className={`h-full bg-signature-gradient ${isPaused ? '' : 'animate-[width_4s_linear_infinite]'}`} style={{ width: '100%' }}></div>
                                            )}
                                        </div>
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