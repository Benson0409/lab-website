import React from 'react';
import SectionLabel from '../components/SectionLabel';
import Card from '../components/Card';
import Button from '../components/Button';

const AboutSection = ({ config }) => (
    <section id="about" className="py-16 bg-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionLabel>ABOUT US</SectionLabel>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-16 max-w-3xl text-foreground">
                <span className="inline-block whitespace-nowrap">{config.aboutTitlePrefix}</span>
                <span className="text-gradient inline-block ml-2 md:ml-3 whitespace-nowrap">{config.aboutTitleHighlight}</span><br className="block" /><span className="inline-block whitespace-nowrap mt-2">{config.aboutTitleSuffix}</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <Card className="lg:col-span-2 shadow-xl bg-card">
                    <h3 className="font-ui text-3xl font-bold mb-4 text-[#0052FF]">{config.aboutDeptTitle}</h3>
                    <p className="font-ui text-lg text-foreground leading-relaxed mb-6">{config.department}</p>
                    <p className="font-ui text-base text-muted-foreground mb-8">{config.aboutDeptDesc}</p>
                    <Button href={config.departmentLink} target="_blank" variant="outline" className="w-full sm:w-auto text-foreground h-10">前往 數位科技設計學系 網站<svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg></Button>
                </Card>
                <div className="space-y-6">
                    {config.professors.map((prof, index) => (
                        <Card key={index} className="flex flex-col bg-card">
                            <span className="font-mono-tech text-xs uppercase text-muted-foreground mb-1">{prof.title}</span><h4 className="font-ui text-2xl font-semibold mb-2 text-foreground">{prof.name}</h4><p className="text-sm text-muted-foreground">{prof.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

export default AboutSection;