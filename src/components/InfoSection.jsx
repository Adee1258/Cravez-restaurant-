import { useState, useEffect, useRef } from 'react';

const INFO = [
  { icon: '📍', title: 'Find Us', val: 'I-10/2 Street 11', val2: 'Hussain Market, Islamabad' },
  { icon: '📞', title: 'Call to Order', val: '0311-7466370', val2: 'WhatsApp orders available · Delivery in your area' },
  { icon: '📱', title: 'Follow Us', val: '@carvez.pk', val2: 'Instagram · Facebook · X · WhatsApp' },
  { icon: '⏰', title: "We're Open", val: '7AM – 11PM', val2: 'Seven days a week · Dine-in & Takeaway' },
];

export function InfoSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div id="info-section" ref={ref} style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: 2,
    }}>
      {INFO.map((block, i) => (
        <InfoBlock key={block.title} block={block} delay={i * 100} visible={visible} />
      ))}
    </div>
  );
}

function InfoBlock({ block, delay, visible }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#1a1a1a' : '#161616',
        padding: '60px 50px',
        transition: 'background 0.3s, transform 0.6s cubic-bezier(0.23,1,0.32,1), opacity 0.6s',
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        opacity: visible ? 1 : 0,
        transitionDelay: `${delay}ms`,
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 16 }}>{block.icon}</div>
      <h3 style={{
        fontFamily: "'Playfair Display',serif", fontSize: 26,
        fontWeight: 700, color: '#F5F0E8', marginBottom: 12,
      }}>
        {block.title}
      </h3>
      <p style={{ color: '#E8541A', fontSize: 17, fontWeight: 500, marginBottom: 8 }}>{block.val}</p>
      <p style={{ color: '#555', fontSize: 13, lineHeight: 1.6 }}>{block.val2}</p>
    </div>
  );
}

export function CartModal({ cart, onClose, onClear, onRemove }) {
  const total = cart.reduce((s, i) => s + i.price, 0);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
        zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeUp 0.3s both',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#161616', border: '1px solid #222',
          width: '90%', maxWidth: 480, maxHeight: '80vh',
          overflow: 'auto', padding: '40px',
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: '#F5F0E8' }}>
            Your Order
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#888',
            fontSize: 24, cursor: 'pointer',
          }}>✕</button>
        </div>

        {cart.length === 0 ? (
          <p style={{ color: '#555', textAlign: 'center', padding: '40px 0' }}>
            Your cart is empty. Add some delicious items!
          </p>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {cart.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', borderBottom: '1px solid #222',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 24 }}>{item.emoji}</span>
                    <span style={{ color: '#F5F0E8', fontSize: 14 }}>{item.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ color: '#E8541A', fontSize: 14, fontWeight: 500 }}>Rs. {item.price}</span>
                    <button
                      onClick={() => onRemove(i)}
                      style={{
                        background: 'transparent',
                        border: '1px solid #333',
                        color: '#888',
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        transition: 'all 0.2s',
                        padding: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 0, 0, 0.15)';
                        e.currentTarget.style.borderColor = '#ff4444';
                        e.currentTarget.style.color = '#ff4444';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = '#333';
                        e.currentTarget.style.color = '#888';
                      }}
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '16px 0', borderTop: '1px solid #333', marginBottom: 24,
            }}>
              <span style={{ color: '#888', fontSize: 14, letterSpacing: 1 }}>TOTAL</span>
              <span style={{ color: '#E8541A', fontSize: 22, fontWeight: 700 }}>Rs. {total}</span>
            </div>

            <a
              href={`https://wa.me/923117466370?text=${encodeURIComponent(
                `🍽️ *CRAVEZ ORDER*\n\n` +
                cart.map((item, i) => `${i + 1}. ${item.emoji} ${item.name} — Rs. ${item.price}`).join('\n') +
                `\n\n────────────────\n` +
                `💰 *Total: Rs. ${total}*\n\n` +
                `📍 Cravez Islamabad\n` +
                `I-10/2 Street 11, Hussain Market\n\n` +
                `Please confirm my order! 🙏`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              style={{
                flex: 1, background: '#E8541A', color: '#fff', border: 'none',
                padding: '14px', fontFamily: "'DM Sans',sans-serif",
                fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer',
                clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))',
                textDecoration: 'none',
                textAlign: 'center',
                display: 'inline-block',
              }}
            >
              📱 Order on WhatsApp
            </a>
            <button
              onClick={onClear}
              style={{
                padding: '14px 20px', background: 'none',
                border: '1px solid #333', color: '#888',
                fontFamily: "'DM Sans',sans-serif", fontSize: 12,
                letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              Clear
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed', bottom: 100, right: 30,
      background: '#1a1a1a', color: '#F5F0E8',
      padding: '12px 20px', borderLeft: '3px solid #E8541A',
      fontSize: 13, zIndex: 400,
      animation: 'fadeUp 0.3s both',
      fontFamily: "'DM Sans',sans-serif",
    }}>
      {message}
    </div>
  );
}
