import React from 'react';
import Button from './Button';

const Card = ({ children, className = '', isFeatured = false, style = {}, onClick }) => {
    const baseClasses = "bg-card border border-border rounded-2xl p-8 transition-all duration-300 ease-out shadow-md w-full overflow-hidden"; 
    const clickableClasses = onClick ? "cursor-pointer" : "";
    if (isFeatured) {
        return (
            <div onClick={onClick} className={`rounded-2xl bg-signature-gradient p-[2px] shadow-accent-lg group hover:shadow-xl hover:scale-[1.01] transition-all duration-300 ${className} ${clickableClasses}`} style={style}>
                <div className="h-full w-full rounded-[calc(16px-2px)] bg-card p-8 overflow-hidden">{children}</div>
            </div>
        );
    }
    return <div onClick={onClick} className={`${baseClasses} ${className} hover:shadow-lg hover:-translate-y-0.5 ${clickableClasses}`} style={style}>{children}</div>;
};

export const ContentCard = ({ item, scrollToSection }) => (
    <Card isFeatured={item.isFeatured} className="h-full flex flex-col justify-between">
        <div className="flex flex-col h-full">
            {item.coverImage && (
                <div className="w-full h-48 bg-muted rounded-lg mb-4 overflow-hidden shrink-0">
                    <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                </div>
            )}
            <div>
                <h4 className="font-ui text-xl md:text-2xl font-semibold mb-3 text-foreground break-words">{item.title}</h4>
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                    <span className="font-mono-tech uppercase text-[#0052FF]">{item.type === 'project' ? '專案' : '出版'}</span>
                    <span className="font-ui">{item.date instanceof Date ? item.date.toLocaleDateString('zh-TW') : 'N/A'}</span>
                </div>
                <p className="font-ui text-base text-muted-foreground leading-relaxed line-clamp-3">{item.abstract}</p>
            </div>
        </div>
        <Button onClick={() => scrollToSection()} variant="outline" className="mt-4 h-10 text-sm">查看細節</Button>
    </Card>
);

export default Card;