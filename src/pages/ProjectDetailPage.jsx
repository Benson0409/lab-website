import React from 'react';
import Button from '../components/Button';

const ProjectDetailPage = ({ project, onBack }) => {
    if (!project) return null;
    return (
        <div className="min-h-screen bg-background animate-float" style={{animation: 'fadeIn 0.5s ease-out'}}>
            <div className="relative h-[40vh] md:h-[50vh] w-full bg-slate-900 overflow-hidden">
                {project.coverImage ? (
                    <img src={project.coverImage} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                ) : (
                    <div className={`absolute inset-0 bg-gradient-to-r ${project.category === 'VR' ? 'from-purple-900' : 'from-blue-900'} to-slate-900 opacity-80`}></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 max-w-7xl mx-auto">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-mono-tech w-fit mb-4">{project.type === 'project' ? 'RESEARCH PROJECT' : 'PUBLICATION'} • {project.category || 'General'}</span>
                    <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-4">{project.title}</h1>
                    <p className="font-mono-tech text-white/60 text-sm">{project.dateStr || project.date instanceof Date ? project.date.toLocaleDateString('zh-TW') : 'N/A'}</p>
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-6 py-16">
                <Button onClick={onBack} variant="outline" className="mb-8">← 返回列表</Button>
                <div className="prose prose-lg prose-slate max-w-none text-foreground">
                    <h3 className="text-2xl font-bold text-foreground mb-4">摘要</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-8 border-l-4 border-[#0052FF] pl-4">{project.abstract}</p>
                    {project.videoUrl && (
                        <div className="mb-8"><h3 className="text-xl font-bold text-foreground mb-2">相關影片</h3><a href={project.videoUrl} target="_blank" rel="noreferrer" className="text-[#0052FF] underline">{project.videoUrl}</a></div>
                    )}
                    <h3 className="text-2xl font-bold text-foreground mb-4">詳細介紹</h3>
                    <p className="text-foreground leading-loose whitespace-pre-wrap">{project.fullDescription || "目前尚無詳細描述內容。"}</p>
                    {project.relatedLinks && project.relatedLinks.length > 0 && (
                        <div className="mt-8"><h3 className="text-xl font-bold text-foreground mb-4">相關資源</h3><div className="flex flex-col gap-2">{project.relatedLinks.map((link, idx) => (<a key={idx} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-card rounded-lg hover:bg-muted/80 transition-colors border border-border"><span className="text-[#0052FF] font-bold">🔗</span><span className="text-foreground font-medium underline">{link.text}</span></a>))}</div></div>
                    )}
                    {project.images && project.images.length > 0 && (
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">{project.images.map((img, idx) => (<div key={idx} className="h-64 bg-muted rounded-xl flex items-center justify-center text-muted-foreground overflow-hidden"><img src={img} alt={`Project ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform" /></div>))}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailPage;