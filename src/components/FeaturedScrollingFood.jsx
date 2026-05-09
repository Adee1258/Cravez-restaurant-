import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function FeaturedScrollingFood({ menuItems = [], onAdd }) {
  const scrollerRef = useRef(null);
  const featuredItems = menuItems.filter(item => item.featured);

  // If no items are featured, we can show a placeholder or nothing
  if (featuredItems.length === 0) return null;

  // Seamless loop logic: only duplicate if we have items
  // If only 1 item, we duplicate more to fill the screen width for the loop
  let displayItems = [];
  if (featuredItems.length === 1) {
    displayItems = Array(10).fill(featuredItems[0]);
  } else if (featuredItems.length < 5) {
    displayItems = [...featuredItems, ...featuredItems, ...featuredItems, ...featuredItems];
  } else {
    displayItems = [...featuredItems, ...featuredItems];
  }

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || featuredItems.length === 0) return;

    // We animate based on the width of one set of items
    const setWidth = scroller.scrollWidth / (displayItems.length / featuredItems.length);
    
    const animation = gsap.to(scroller, {
      x: -setWidth,
      duration: featuredItems.length * 15, // MUCH SLOWER (Changed from 5 to 15)
      ease: 'none',
      repeat: -1,
      onRepeat: () => {
        gsap.set(scroller, { x: 0 });
      }
    });

    // PAUSE ON HOVER logic to allow user to look at cards
    const handleMouseEnter = () => animation.pause();
    const handleMouseLeave = () => animation.play();

    scroller.addEventListener('mouseenter', handleMouseEnter);
    scroller.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      animation.kill();
      scroller.removeEventListener('mouseenter', handleMouseEnter);
      scroller.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [featuredItems.length, displayItems.length]);

  return (
    <section className="featured-scrolling-food" style={{
      background: '#080808',
      padding: '100px 0', // Slightly reduced padding
      overflow: 'hidden',
      borderBottom: '1px solid #1a1a1a',
      position: 'relative',
      perspective: '1000px'
    }}>
      {/* Background Decorative Text */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '15vw', // Smaller decorative text
        fontWeight: 900,
        color: 'rgba(232, 84, 26, 0.02)',
        whiteSpace: 'nowrap',
        zIndex: 0,
        pointerEvents: 'none',
        fontFamily: "'Playfair Display', serif"
      }}>
        FEATURED SELECTION
      </div>

      <div style={{
        textAlign: 'center',
        marginBottom: '60px',
        position: 'relative',
        zIndex: 1
      }}>
        <p style={{
          fontSize: '12px',
          letterSpacing: '8px',
          textTransform: 'uppercase',
          color: '#E8541A',
          marginBottom: '15px',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 800
        }}>
          Chef's Masterpieces
        </p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(32px, 5vw, 60px)',
          fontWeight: 900,
          color: '#F5F0E8',
          textShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          Premium <span style={{ color: '#E8541A' }}>Featured</span> Food
        </h2>
      </div>

      {/* Standard Horizontal Scroll Support added via CSS class */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        overflowX: 'auto', // Allow manual scroll if needed
        overflowY: 'hidden',
        zIndex: 1,
        scrollbarWidth: 'none', // Hide scrollbar for cleaner look
        msOverflowStyle: 'none'
      }} className="featured-scroll-container">
        <div 
          ref={scrollerRef}
          style={{
            display: 'flex',
            gap: '40px', 
            padding: '30px 40px',
            width: 'max-content'
          }}
        >
          {displayItems.map((item, index) => (
            <div 
              key={`${item.id}-${index}`}
              style={{
                width: '380px', // REDUCED SIZE (from 450px to 380px)
                background: 'linear-gradient(180deg, #141414 0%, #0a0a0a 100%)',
                borderRadius: '28px',
                overflow: 'hidden',
                border: '1px solid #E8541A', // Always orange border
                transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                cursor: 'pointer',
                flexShrink: 0,
                position: 'relative',
                boxShadow: 'none', // No glow by default
              }}
              className="featured-item-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                e.currentTarget.style.borderColor = '#E8541A'; // Keep orange
                e.currentTarget.style.boxShadow = '0 25px 60px rgba(232, 84, 26, 0.4), 0 0 0 1px rgba(232,84,26,0.3)'; // Enhanced glow on hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.borderColor = '#E8541A'; // Keep orange
                e.currentTarget.style.boxShadow = 'none'; // Remove glow
              }}
            >
              {/* Image Container */}
              <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
                <img 
                  src={item.image} 
                  alt={item.name} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.8s ease' 
                  }} 
                />
                
                {/* Category Badge */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  background: 'rgba(232, 84, 26, 0.9)', // BRAND ORANGE
                  backdropFilter: 'blur(10px)',
                  color: '#fff',
                  padding: '6px 16px',
                  borderRadius: '30px',
                  fontSize: '10px',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  boxShadow: '0 4px 15px rgba(232, 84, 26, 0.3)'
                }}>
                  {item.cat}
                </div>
              </div>

              <div style={{ padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '15px', gap: '15px' }}>
                  <h3 style={{ 
                    fontFamily: "'Playfair Display', serif", 
                    fontSize: '24px', 
                    color: '#fff', 
                    margin: 0,
                    lineHeight: '1.2',
                    flex: 1
                  }}>
                    {item.name}
                  </h3>
                  <div style={{
                    color: '#E8541A', // BRAND ORANGE
                    fontSize: '22px',
                    fontWeight: '900',
                    fontFamily: "'DM Sans', sans-serif",
                    whiteSpace: 'nowrap'
                  }}>
                    <span style={{ fontSize: '12px', opacity: 0.8, marginRight: '2px' }}>RS</span>
                    {item.price}
                  </div>
                </div>
                
                <p style={{
                  color: '#666',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  marginBottom: '25px',
                  minHeight: '44px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {item.desc || "Our chef's special selection prepared with premium ingredients."}
                </p>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAdd(item);
                    }}
                    style={{
                      background: '#E8541A',
                      color: '#fff',
                      border: 'none',
                      width: '45px',
                      height: '45px',
                      borderRadius: '12px',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 20px rgba(232, 84, 26, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
                      e.currentTarget.style.background = '#ff6b3d';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                      e.currentTarget.style.background = '#E8541A';
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}
