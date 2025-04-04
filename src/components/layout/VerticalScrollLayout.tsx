'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';

interface ScrollSectionProps {
  id: string;
  children: ReactNode;
  active: boolean;
  onScrollEnter: () => void;
}

const ScrollSection = ({ id, children, active, onScrollEnter }: ScrollSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onScrollEnter();
          }
        });
      },
      { threshold: 0.6 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [onScrollEnter]);

  return (
    <section ref={sectionRef} id={id} className="eco-section">
      {children}
    </section>
  );
};

interface VerticalScrollLayoutProps {
  sections: {
    id: string;
    component: ReactNode;
  }[];
}

export function VerticalScrollLayout({ sections }: VerticalScrollLayoutProps) {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (index: number) => {
    const sectionId = sections[index].id;
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(index);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="app-container">
      <div className="leaf leaf1">🍃</div>
      <div className="leaf leaf2">🍃</div>
      <div className="leaf leaf3">🍃</div>

      <div 
        className="eco-container" 
        ref={containerRef} 
        style={{ 
          scrollSnapType: 'y mandatory', 
          overflowY: 'scroll',
          height: '100vh',
          WebkitOverflowScrolling: 'touch',
          paddingTop: '20px'
        }}
      >
        <div className="eco-content">
          {sections.map((section, index) => (
            <ScrollSection
              key={section.id}
              id={section.id}
              active={activeSection === index}
              onScrollEnter={() => setActiveSection(index)}
            >
              {section.component}
            </ScrollSection>
          ))}
        </div>

        <div className="nav-dots">
          {sections.map((_, index) => (
            <div 
              key={index}
              className={`dot ${activeSection === index ? 'active' : ''}`}
              onClick={() => scrollToSection(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 