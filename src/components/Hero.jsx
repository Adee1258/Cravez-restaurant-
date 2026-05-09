import Hero3D from './Hero3D';

export default function Hero() {
  const scrollToMenu = () => document.getElementById('paratha-showcase')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div id="hero" className="hero-section" style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <Hero3D />

      {/* Content */}
      <div className="hero-content" style={{
        position: 'relative', zIndex: 2, textAlign: 'center',
        padding: '0 20px', fontFamily: "'DM Sans',sans-serif",
      }}>
        <p className="hero-subtitle" style={{
          fontSize: 11, letterSpacing: 6, textTransform: 'uppercase',
          color: '#E8541A', marginBottom: 20,
          animation: 'fadeUp 1s 0.3s both',
        }}>
          Islamabad's Finest Desi Cuisine
        </p>

        <h1 className="hero-title" style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: 'clamp(56px, 10vw, 120px)',
          fontWeight: 900, lineHeight: 0.92,
          color: '#F5F0E8',
          animation: 'fadeUp 1s 0.5s both',
        }}>
          Satisfy<br />
          <span style={{ color: '#E8541A' }}>Every</span><br />
          Craving.
        </h1>

        <p className="hero-description" style={{
          fontSize: 14, color: '#666', margin: '24px 0 40px',
          letterSpacing: 3, animation: 'fadeUp 1s 0.7s both',
        }}>
          Flavors of Nature · Since Always
        </p>

        <button
          onClick={scrollToMenu}
          className="hero-button"
          style={{
            background: '#E8541A', color: '#fff', border: 'none',
            padding: '16px 44px', fontFamily: "'DM Sans',sans-serif",
            fontSize: 12, letterSpacing: 3, textTransform: 'uppercase',
            cursor: 'pointer',
            clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))',
            animation: 'fadeUp 1s 0.9s both',
            transition: 'transform 0.2s, opacity 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Explore Menu
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator" style={{
        position: 'absolute', bottom: 30, left: '50%',
        transform: 'translateX(-50%)', display: 'flex',
        flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 2,
      }}>
        <div style={{
          width: 1, height: 60,
          background: 'linear-gradient(to bottom,#E8541A,transparent)',
          animation: 'scrollLine 2s infinite',
        }} />
        <p style={{ fontSize: 9, letterSpacing: 3, color: '#555', fontFamily: "'DM Sans',sans-serif" }}>
          SCROLL
        </p>
      </div>
    </div>
  );
}
