import { useParams, Link } from 'react-router-dom';
import { menuData } from '../data/menuData';
import SingleFood3D from '../components/SingleFood3D';
import FoodCard from '../components/FoodCard';

export default function FoodDetailPage({ category, imagePath, title, description, onAdd }) {
  const filteredMenu = menuData.filter(item => item.cat === category);

  return (
    <div style={{ background: '#0D0D0D', minHeight: '100vh', color: '#F5F0E8', paddingTop: '100px' }}>
      {/* Hero Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 40px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '60px',
        alignItems: 'center',
        marginBottom: '100px'
      }}>
        {/* Left: 3D Model */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(232,84,26,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <SingleFood3D imagePath={imagePath} />
        </div>

        {/* Right: Text Content */}
        <div>
          <Link to="/" style={{
            color: '#E8541A',
            textDecoration: 'none',
            fontSize: '12px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '20px'
          }}>
            ← Back to Home
          </Link>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(40px, 6vw, 80px)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '24px'
          }}>
            {title} <br />
            <span style={{ color: '#E8541A' }}>Experience.</span>
          </h1>
          <p style={{
            fontSize: '16px',
            lineHeight: 1.8,
            color: '#888',
            marginBottom: '40px',
            fontFamily: "'DM Sans', sans-serif"
          }}>
            {description}
          </p>
          <button
            onClick={() => document.getElementById('category-menu')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'transparent',
              color: '#E8541A',
              border: '1px solid #E8541A',
              padding: '14px 32px',
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E8541A';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#E8541A';
            }}
          >
            Explore {title} Menu
          </button>
        </div>
      </div>

      {/* Menu Section */}
      <div id="category-menu" style={{
        padding: '100px 40px',
        background: 'linear-gradient(180deg, #121212 0%, #0D0D0D 100%)',
        borderTop: '1px solid #1a1a1a'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '36px',
              fontWeight: 900,
              marginBottom: '16px'
            }}>
              Our {title} Selection
            </h2>
            <div style={{ width: '60px', height: '2px', background: '#E8541A', margin: '0 auto' }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {filteredMenu.map(item => (
              <FoodCard
                key={item.id}
                item={item}
                onAdd={onAdd}
                onView3D={() => {}} // We're already on a detail page
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
