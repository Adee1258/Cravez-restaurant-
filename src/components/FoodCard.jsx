import { useRef, useState, useEffect } from 'react';

export default function FoodCard({ item, index, onAdd, onView3D }) {
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 60 + 50);
    return () => clearTimeout(timer);
  }, [index]);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 14, y: -y * 14 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  const cardStyle = {
    background: '#161616',
    border: '1px solid #E8541A', // Always orange border
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    transform: visible
      ? `perspective(800px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) translateY(0)`
      : 'translateY(60px)',
    opacity: visible ? 1 : 0,
    transition: visible
      ? 'border-color 0.3s, box-shadow 0.3s, transform 0.1s ease-out'
      : 'transform 0.6s cubic-bezier(0.23,1,0.32,1), opacity 0.6s',
    boxShadow: hovered ? '0 20px 60px rgba(232,84,26,0.4), 0 0 0 1px rgba(232,84,26,0.3)' : 'none',
    borderRadius: 0,
    height: '420px', // Fixed height for all cards
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div
      ref={cardRef}
      className="food-card"
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onView3D && onView3D(item)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={handleMouseLeave}
    >
      {/* Glow overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle at 50% 50%, rgba(232,84,26,0.25), transparent 70%)',
        opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
        zIndex: 1,
      }} />

      {/* Badge */}
      {item.badge && (
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: '#E8541A', color: '#fff',
          fontSize: 9, letterSpacing: 2, padding: '4px 10px',
          textTransform: 'uppercase', fontFamily: "'DM Sans',sans-serif",
          zIndex: 2,
        }}>
          {item.badge}
        </div>
      )}

      {/* Real Food Image */}
      <div
        onClick={() => onView3D && onView3D(item)}
        style={{
          height: 200,
          position: 'relative',
          overflow: 'hidden',
          cursor: onView3D ? 'pointer' : 'default',
        }}
      >
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: hovered ? 'scale(1.12) rotate(2deg)' : 'scale(1) rotate(0deg)',
            transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
            filter: hovered ? 'brightness(1.1)' : 'brightness(1)',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        {onView3D && (
          <div style={{
            position: 'absolute',
            bottom: 12,
            left: '50%',
            transform: hovered ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(10px)',
            opacity: hovered ? 1 : 0,
            transition: 'all 0.3s ease',
            background: 'rgba(232,84,26,0.95)',
            color: '#fff',
            fontSize: 10,
            letterSpacing: 2,
            padding: '6px 16px',
            textTransform: 'uppercase',
            fontFamily: "'DM Sans',sans-serif",
            fontWeight: 500,
            borderRadius: 0,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}>
            Click for 3D View
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ 
        padding: '20px 24px 24px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between'
      }}>
        <h3 style={{
          fontFamily: "'Playfair Display',serif", fontSize: 20,
          fontWeight: 700, color: '#F5F0E8', marginBottom: 6,
        }}>
          {item.name}
        </h3>
        <p style={{
          fontSize: 12, color: '#888', lineHeight: 1.6, marginBottom: 16,
          fontFamily: "'DM Sans',sans-serif",
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          textOverflow: 'ellipsis',
          minHeight: '57px', // 3 lines * 19px
        }}>
          {item.desc}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: "'DM Sans',sans-serif" }}>
            <span style={{ fontSize: 12, color: '#888', marginRight: 2 }}>Rs.</span>
            <span style={{ fontSize: 22, fontWeight: 500, color: '#E8541A' }}>{item.price}</span>
          </div>
          <button
            className="add-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAdd(item);
            }}
            style={{
              background: 'linear-gradient(135deg, #E8541A 0%, #ff6b35 100%)',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              borderRadius: '4px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              fontFamily: "'DM Sans', sans-serif",
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
              transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: hovered ? '0 8px 25px rgba(232,84,26,0.4)' : 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(232,84,26,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(232,84,26,0.4)';
            }}
          ></button>
        </div>
      </div>
    </div>
  );
}
