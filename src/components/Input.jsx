import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder, className = '' }) => (
    <div className="flex flex-col space-y-2 w-full max-w-full">
        {label && <label className="font-ui text-sm text-muted-foreground">{label}</label>}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full h-12 px-4 rounded-xl border border-border bg-input font-ui text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:border-transparent transition-colors ${className}`} />
    </div>
);

export default Input;