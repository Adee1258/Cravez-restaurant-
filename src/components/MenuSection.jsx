import { useState, useEffect, useRef } from 'react';
import FoodCard from './FoodCard';
import { categories } from '../data/menuData';

export default function MenuSection({ onAdd, onView3D, menuItems = [] }) {
  const [activecat, setActivecat] = useState('all');
  const [filtered, setFiltered] = useState(menuItems);
  const [transitioning, setTransitioning] = useState(false);
  const [key, setKey] = useState(0);
  const sectionRef = useRef(null);
  const [sectionVisible, setSectionVisible] = useState(false);

  useEffect(() => {
    setFiltered(activecat === 'all' ? menuItems : menuItems.filter(i => i.cat === activecat));
  }, [menuItems, activecat]);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setSectionVisible(true);
    }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const handleCatClick = (cat) => {
    if (cat === activecat) return;
    setTransitioning(true);
    setTimeout(() => {
      setActivecat(cat);
      // No need to setFiltered here as the useEffect above handles it
      setKey(k => k + 1);
      setTransitioning(false);
    }, 280);
  };

  return (
    <div id="menu-section" ref={sectionRef} style={{ paddingTop: 120 }}>
      {/* Header */}
      <div style={{
        textAlign: 'center', padding: '0 40px', marginBottom: 60,
        transform: sectionVisible ? 'translateY(0)' : 'translateY(40px)',
        opacity: sectionVisible ? 1 : 0,
        transition: 'all 0.8s cubic-bezier(0.23,1,0.32,1)',
      }}>
        <p style={{
          fontSize: 10, letterSpacing: 6, textTransform: 'uppercase',
          color: '#E8541A', marginBottom: 14, fontFamily: "'DM Sans',sans-serif",
        }}>
          What We Serve
        </p>
        <h2 style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900,
          color: '#F5F0E8', lineHeight: 1,
        }}>
          Our Menu
        </h2>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 10, justifyContent: 'center',
          flexWrap: 'wrap', marginTop: 40, padding: '0 20px',
        }}>
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => handleCatClick(cat.key)}
              style={{
                padding: '9px 22px',
                border: `1px solid ${activecat === cat.key ? '#E8541A' : '#2a2a2a'}`,
                background: activecat === cat.key ? '#E8541A' : 'transparent',
                color: activecat === cat.key ? '#fff' : '#666',
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.25s',
                borderRadius: 0,
              }}
              onMouseEnter={(e) => {
                if (activecat !== cat.key) {
                  e.currentTarget.style.background = 'rgba(232,84,26,0.12)';
                  e.currentTarget.style.color = '#E8541A';
                  e.currentTarget.style.borderColor = '#E8541A';
                }
              }}
              onMouseLeave={(e) => {
                if (activecat !== cat.key) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#666';
                  e.currentTarget.style.borderColor = '#2a2a2a';
                }
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div style={{
        padding: '0 40px 100px',
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? 'translateY(20px)' : 'translateY(0)',
        transition: 'opacity 0.28s ease, transform 0.28s ease',
      }}>
        <div key={key} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {filtered.map((item, i) => (
            <FoodCard key={item.id} item={item} index={i} onAdd={onAdd} onView3D={onView3D} />
          ))}
        </div>
      </div>
    </div>
  );
}
