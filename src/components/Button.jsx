import React from 'react';

const Button = ({ children, onClick, className = '', variant = 'primary', disabled = false, href = null, target = '_self', type = 'button' }) => {
    const baseClasses = "rounded-xl font-ui font-semibold transition-all duration-200 ease-out h-12 px-6 shadow-md active:scale-[0.98] flex items-center justify-center";
    let styleClasses;
    switch (variant) {
        case 'primary': styleClasses = 'bg-signature-gradient text-white shadow-accent hover:shadow-accent-lg hover:-translate-y-0.5'; break;
        case 'secondary': styleClasses = 'bg-muted text-foreground border border-border hover:opacity-80 shadow-sm'; break;
        case 'outline': styleClasses = 'bg-transparent text-foreground border border-border hover:bg-muted shadow-sm'; break;
        case 'danger': styleClasses = 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20 shadow-sm'; break;
        default: styleClasses = 'bg-signature-gradient text-white shadow-accent hover:shadow-accent-lg hover:-translate-y-0.5';
    }
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';
    if (href) return <a href={href} target={target} className={`${baseClasses} ${styleClasses} ${className} ${disabledClasses} no-underline`}>{children}</a>;
    return <button type={type} onClick={onClick} className={`${baseClasses} ${styleClasses} ${className} ${disabledClasses}`} disabled={disabled}>{children}</button>;
};

export default Button;