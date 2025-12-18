import React from 'react';
import SectionLabel from '../components/SectionLabel';
import Card from '../components/Card';

const EventsSection = ({ events, onNavigate }) => (
    <section id="events" className="py-16 bg-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionLabel>RECENT ACTIVITIES</SectionLabel>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-16 text-foreground">微想實驗室的<span className="text-gradient inline-block ml-3">近期活動</span>與新聞</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {events.length > 0 ? events.map((event, index) => (
                    <Card key={index} className="bg-card hover:bg-card/95 transition-colors p-6 flex flex-col justify-between cursor-pointer hover:shadow-xl" onClick={() => onNavigate('event-detail', event)}>
                        {event.images && event.images.length > 0 && (
                            <div className="w-full h-40 bg-muted rounded-lg mb-4 overflow-hidden">
                                <img src={event.images[0]} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                            </div>
                        )}
                        <div><span className="font-mono-tech text-sm text-muted-foreground mb-1 block">{event.date}</span><h4 className="font-ui text-xl font-semibold text-foreground mb-3">{event.title}</h4></div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground"><span>{event.location}</span><span className="text-[#0052FF] font-semibold">查看詳情 →</span></div>
                    </Card>
                )) : <p className="text-muted-foreground col-span-full text-center">暫無近期活動</p>}
            </div>
        </div>
    </section>
);

export default EventsSection;