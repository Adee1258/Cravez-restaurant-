import { useState, useEffect, useRef } from 'react';

export default function Featured({ onOrderSpecialDesi, onView3D }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div id="featured" ref={ref} style={{
      background: 'linear-gradient(135deg,#111 0%,#1a0a02 100%)',
      padding: '100px 60px',
      borderTop: '1px solid #1a1a1a',
      borderBottom: '1px solid #1a1a1a',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 80, alignItems: 'center',
      }}
        className="featured-inner"
      >
        {/* Floating Real Food Image - Clickable for 3D */}
        <div style={{
          textAlign: 'center',
          transform: visible ? 'translateX(0)' : 'translateX(-60px)',
          opacity: visible ? 1 : 0,
          transition: 'all 1s cubic-bezier(0.23,1,0.32,1)',
          position: 'relative',
        }}>
          <div
            onClick={() => onView3D && onView3D({
              name: 'Special Beef Nihari',
              price: 250,
              image: 'https://images.unsplash.com/photo-1563379091339-03a21a65f05d?w=600&h=600&fit=crop',
              desc: 'Rich overnight beef nihari — a true classic',
              badge: 'Signature'
            })}
            style={{
              width: 'clamp(200px, 30vw, 380px)',
              height: 'clamp(200px, 30vw, 380px)',
              margin: '0 auto',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid rgba(232,84,26,0.3)',
              boxShadow: '0 30px 80px rgba(232,84,26,0.35), inset 0 0 60px rgba(0,0,0,0.4)',
              animation: 'floatPlate 4s ease-in-out infinite',
              cursor: onView3D ? 'pointer' : 'default',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 40px 100px rgba(232,84,26,0.5), inset 0 0 60px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 30px 80px rgba(232,84,26,0.35), inset 0 0 60px rgba(0,0,0,0.4)';
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1563379091339-03a21a65f05d?w=600&h=600&fit=crop"
              alt="Special Nihari"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scale(1.1)',
              }}
            />
          </div>
          {onView3D && (
            <p style={{
              fontSize: 10,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: '#E8541A',
              marginTop: 16,
              opacity: 0.7,
              fontFamily: "'DM Sans',sans-serif",
            }}>
              Click image for 3D View
            </p>
          )}
        </div>

        {/* Text */}
        <div style={{
          transform: visible ? 'translateX(0)' : 'translateX(60px)',
          opacity: visible ? 1 : 0,
          transition: 'all 1s 0.2s cubic-bezier(0.23,1,0.32,1)',
          fontFamily: "'DM Sans',sans-serif",
        }}>
          <p style={{ fontSize: 10, letterSpacing: 6, textTransform: 'uppercase', color: '#E8541A', marginBottom: 20 }}>
            Chef's Recommendation
          </p>
          <h2 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900,
            color: '#F5F0E8', lineHeight: 1, marginBottom: 20,
          }}>
            Special Desi<br />Nihari
          </h2>
          <p style={{ color: '#666', lineHeight: 1.85, marginBottom: 36, fontSize: 15 }}>
            Authentic Pakistani cuisine slow-cooked overnight in traditional spices.
            Rich, velvety gravy with hand-pounded masala — a recipe passed through generations.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 44, marginBottom: 44 }}>
            {[
              { num: '12+', label: 'Hours Cooked' },
              { num: '20+', label: 'Spice Blend' },
              { num: 'Rs.450', label: 'Large Portion' },
            ].map(s => (
              <div key={s.label}>
                <div style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 34, fontWeight: 900, color: '#E8541A',
                }}>
                  {s.num}
                </div>
                <div style={{ fontSize: 10, color: '#555', letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button
              onClick={onOrderSpecialDesi}
              style={{
                background: '#E8541A', color: '#fff', border: 'none',
                padding: '16px 44px', fontFamily: "'DM Sans',sans-serif",
                fontSize: 12, letterSpacing: 3, textTransform: 'uppercase',
                cursor: 'pointer',
                clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Order Nihari
            </button>
            {onView3D && (
              <button
                onClick={() => onView3D({
                  name: 'Special Beef Nihari',
                  price: 250,
                  image: 'https://images.unsplash.com/photo-1563379091339-03a21a65f05d?w=600&h=600&fit=crop',
                  desc: 'Rich overnight beef nihari — a true classic',
                  badge: 'Signature'
                })}
                style={{
                  background: 'transparent', color: '#E8541A', border: '1px solid #E8541A',
                  padding: '16px 44px', fontFamily: "'DM Sans',sans-serif",
                  fontSize: 12, letterSpacing: 3, textTransform: 'uppercase',
                  cursor: 'pointer',
                  clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.background = 'rgba(232,84,26,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                View in 3D
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
