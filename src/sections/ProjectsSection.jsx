import React from 'react';
import SectionLabel from '../components/SectionLabel';
import Button from '../components/Button';
import { ContentCard } from '../components/Card'; // 引入我們剛才拆分出來的卡片

const ProjectsSection = ({ labContent, onNavigate }) => (
    <section id="projects" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionLabel>OUR RESEARCH & OUTPUT</SectionLabel>
        <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-16 text-foreground">實驗室的<span className="text-gradient inline-block ml-3">最新成果</span>與技術累積</h2>
        <h3 className="font-ui text-3xl font-semibold mb-8 text-foreground border-l-4 border-[#0052FF] pl-4">最新發佈 (New Releases)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {labContent.filter(i => i.isFeatured).length > 0 ? labContent.filter(i => i.isFeatured).slice(0, 3).map(item => <ContentCard key={item.id} item={{...item, isFeatured: true}} scrollToSection={() => onNavigate('project-detail', item)} />) : <p className="text-muted-foreground col-span-full">暫無精選專案</p>}
        </div>
        <h3 className="font-ui text-3xl font-semibold mb-8 text-foreground border-l-4 border-border pl-4">往年作品 (Archived Works)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {labContent.filter(i => !i.isFeatured).length > 0 ? labContent.filter(i => !i.isFeatured).slice(0, 4).map(item => <ContentCard key={item.id} item={item} scrollToSection={() => onNavigate('project-detail', item)} />) : <p className="text-muted-foreground col-span-full">暫無其他作品</p>}
        </div>
        <div className="text-center mt-16"><Button onClick={() => onNavigate('all-projects')} variant="outline" className="text-foreground h-12 px-8">查看所有作品檔案</Button></div>
    </section>
);

export default ProjectsSection;