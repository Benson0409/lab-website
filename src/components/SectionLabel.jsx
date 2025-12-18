import React from 'react';

const SectionLabel = ({ children }) => (
    <div className="inline-flex items-center gap-3 rounded-full border border-[#0052FF]/30 bg-[#0052FF]/[0.05] px-5 py-2 mb-6">
        <span className="h-2 w-2 rounded-full bg-[#0052FF] animate-pulse-dot" />
        <span className="font-mono-tech text-xs uppercase tracking-[0.15em] text-[#0052FF] font-medium">{children}</span>
    </div>
);

export default SectionLabel;