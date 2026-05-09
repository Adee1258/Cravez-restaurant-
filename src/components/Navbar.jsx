import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';

export default function Navbar({ cartCount, onCartClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Entry animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.5 }
      );
      gsap.fromTo(logoRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.7)', delay: 0.8 }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleNavClick = (id) => {
    setMenuOpen(false);
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categories = [
    { id: 'paratha', label: 'Paratha' },
    { id: 'biryani', label: 'Biryani' },
    { id: 'pulao', label: 'Pulao' },
    { id: 'specialdesi', label: 'Special Desi' },
    { id: 'chanay', label: 'Chanay' },
    { id: 'egg', label: 'Egg' },
    { id: 'drinks', label: 'Drinks' },
    { id: 'dessert', label: 'Dessert' },
    { id: 'addon', label: 'Adds On' },
    { id: 'beverages', label: 'Beverages' },
  ];

  return (
    <>
      <nav ref={navRef} style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: scrolled ? '12px 50px' : '20px 50px',
      background: scrolled ? 'rgba(30,22,16,0.97)' : 'linear-gradient(to bottom,rgba(35,26,18,0.85),transparent)',
      backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(0px)',
      borderBottom: scrolled ? '1px solid rgba(232,84,26,0.3)' : '1px solid transparent',
      transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
      fontFamily: "'DM Sans',sans-serif",
    }}>
      {/* Logo */}
      <div ref={logoRef}
        onClick={() => {
          if (location.pathname !== '/') navigate('/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        style={{
          fontFamily: "'Playfair Display',serif", fontSize: scrolled ? 24 : 28,
          fontWeight: 900, color: '#fff', letterSpacing: 1,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0,
          transition: 'all 0.3s ease',
        }}
      >
        <span style={{ color: '#fff' }}>CR</span>
        <span style={{ color: '#E8541A' }}>A</span>
        <span style={{ color: '#fff' }}>VEZ</span>
      </div>

      {/* Desktop Navigation */}
      <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Categories Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            onMouseEnter={() => setMenuOpen(true)}
            style={{
              background: menuOpen ? 'rgba(232,84,26,0.15)' : 'transparent',
              border: '1px solid rgba(232,84,26,0.3)',
              color: '#fff',
              padding: '10px 20px',
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: "'DM Sans',sans-serif",
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.3s ease',
            }}
          >
            <span>Categories</span>
            <span style={{
              transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
              fontSize: 10,
            }}>▼</span>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div
              onMouseLeave={() => setMenuOpen(false)}
              style={{
                position: 'absolute', top: 'calc(100% + 10px)', left: 0,
                background: 'rgba(13,13,13,0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(232,84,26,0.2)',
                borderRadius: 8,
                padding: '12px',
                display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 4,
                minWidth: 280,
                zIndex: 1001,
                animation: 'fadeIn 0.2s ease',
              }}
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleNavClick(`${cat.id}-showcase`)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ccc',
                    padding: '10px 16px',
                    fontSize: 12,
                    letterSpacing: 1,
                    textTransform: 'capitalize',
                    cursor: 'pointer',
                    fontFamily: "'DM Sans',sans-serif",
                    textAlign: 'left',
                    borderRadius: 4,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(232,84,26,0.15)';
                    e.currentTarget.style.color = '#E8541A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#ccc';
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: '1px', height: 24, background: 'rgba(255,255,255,0.1)', margin: '0 12px' }} />

        
        {/* Our Story Button */}
        <button
          onClick={() => handleNavClick('our-story')}
          style={{
            background: 'transparent', border: 'none',
            color: '#ccc', padding: '10px 16px',
            fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
            cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
            borderRadius: 4, transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(232,84,26,0.1)';
            e.currentTarget.style.color = '#E8541A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#aaa';
          }}
        >
          Our Story
        </button>

        {/* Visit Us Button */}
        <button
          onClick={() => handleNavClick('info-section')}
          style={{
            background: 'transparent', border: 'none',
            color: '#ccc', padding: '10px 16px',
            fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
            cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
            borderRadius: 4, transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(232,84,26,0.1)';
            e.currentTarget.style.color = '#E8541A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#aaa';
          }}
        >
          Visit Us
        </button>

        {/* Admin Link */}
        <Link to="/admin" style={{
          textDecoration: 'none',
          color: location.pathname === '/admin' ? '#E8541A' : '#999',
          fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
          cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
          padding: '8px 12px', borderRadius: 4,
          transition: 'all 0.2s ease',
          border: location.pathname === '/admin' ? '1px solid rgba(232,84,26,0.3)' : '1px solid transparent',
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#E8541A';
            e.currentTarget.style.border = '1px solid rgba(232,84,26,0.3)';
          }}
          onMouseLeave={(e) => {
            if (location.pathname !== '/admin') {
              e.currentTarget.style.color = '#999';
              e.currentTarget.style.border = '1px solid transparent';
            }
          }}
        >
          Admin
        </Link>

        <div style={{ width: '1px', height: 24, background: 'rgba(255,255,255,0.1)', margin: '0 12px' }} />

        {/* Cart Button */}
        <button onClick={onCartClick} style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #E8541A 0%, #ff6b35 100%)',
          color: '#fff',
          border: 'none',
          padding: '12px 20px',
          cursor: 'pointer',
          fontSize: 11,
          letterSpacing: 2,
          textTransform: 'uppercase',
          fontFamily: "'DM Sans',sans-serif",
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          transition: 'all 0.3s ease',
          fontWeight: 500,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(232,84,26,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 2L6 7H3L5.5 20H18.5L21 7H18L15 2H9Z" />
            <path d="M9 11V17M15 11V17" />
          </svg>
          <span>Cart</span>
          {cartCount > 0 && (
            <span style={{
              background: '#fff', color: '#E8541A', borderRadius: 12,
              minWidth: 20, height: 20, display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{
          display: 'none',
          background: 'transparent',
          border: 'none',
          color: '#fff',
          fontSize: 24,
          cursor: 'pointer',
          padding: 8,
          borderRadius: 4,
          transition: 'all 0.3s ease',
        }}
      >
        {mobileMenuOpen ? '✕' : '☰'}
      </button>
    </nav>

    {/* Mobile Menu Overlay */}
    {mobileMenuOpen && (
      <div 
        className="mobile-menu-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(13, 13, 13, 0.98)',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <button
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: 32,
            cursor: 'pointer',
            padding: 8,
          }}
        >
          ✕
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleNavClick(`${cat.id}-showcase`)}
            className="mobile-menu-item"
            style={{
              color: '#fff',
              fontSize: 18,
              padding: '15px 20px',
              margin: '5px 0',
              background: 'transparent',
              border: '1px solid transparent',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              textAlign: 'center',
              borderRadius: 4,
              transition: 'all 0.3s ease',
              width: '200px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#E8541A';
              e.currentTarget.style.color = '#E8541A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.color = '#fff';
            }}
          >
            {cat.label}
          </button>
        ))}

        <button
          onClick={() => handleNavClick('our-story')}
          className="mobile-menu-item"
          style={{
            color: '#fff',
            fontSize: 18,
            padding: '15px 20px',
            margin: '5px 0',
            background: 'transparent',
            border: '1px solid transparent',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            textAlign: 'center',
            borderRadius: 4,
            transition: 'all 0.3s ease',
            width: '200px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#E8541A';
            e.currentTarget.style.color = '#E8541A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.color = '#fff';
          }}
        >
          Our Story
        </button>

        <button
          onClick={() => handleNavClick('info-section')}
          className="mobile-menu-item"
          style={{
            color: '#fff',
            fontSize: 18,
            padding: '15px 20px',
            margin: '5px 0',
            background: 'transparent',
            border: '1px solid transparent',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            textAlign: 'center',
            borderRadius: 4,
            transition: 'all 0.3s ease',
            width: '200px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#E8541A';
            e.currentTarget.style.color = '#E8541A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.color = '#fff';
          }}
        >
          Visit Us
        </button>

        <Link 
          to="/admin" 
          onClick={() => setMobileMenuOpen(false)}
          className="mobile-menu-item"
          style={{
            color: location.pathname === '/admin' ? '#E8541A' : '#fff',
            fontSize: 18,
            padding: '15px 20px',
            margin: '5px 0',
            background: 'transparent',
            border: location.pathname === '/admin' ? '1px solid #E8541A' : '1px solid transparent',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            textAlign: 'center',
            borderRadius: 4,
            transition: 'all 0.3s ease',
            width: '200px',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#E8541A';
            e.currentTarget.style.color = '#E8541A';
          }}
          onMouseLeave={(e) => {
            if (location.pathname !== '/admin') {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.color = '#fff';
            }
          }}
        >
          Admin
        </Link>
      </div>
    )}
    </>
  );
}
