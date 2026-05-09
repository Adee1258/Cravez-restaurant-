import { useRef, useEffect, useState } from 'react';
import SingleFood3D from './SingleFood3D';
import FoodCard from './FoodCard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FoodShowcaseSection({ id, category, imagePath, title, description, onAdd, menuItems = [], reverse = false, scale = 3.2, animation = 'zoom' }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const modelRef = useRef(null);
  const menuRef = useRef(null);
  const glowRef = useRef(null);
  const filteredMenu = menuItems.filter(item => item.cat === category);
  
  
  // --- DYNAMIC TYPING LOGIC ---
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(25);

  const descriptions = Array.isArray(description) ? description : [description];

  useEffect(() => {
    if (!Array.isArray(description)) {
      setDisplayText(description);
      return;
    }

    const handleType = () => {
      const i = loopNum % descriptions.length;
      const fullText = descriptions[i];

      setDisplayText(
        isDeleting 
        ? fullText.substring(0, displayText.length - 1) 
        : fullText.substring(0, displayText.length + 1)
      );

      setTypingSpeed(isDeleting ? 5 : 20);

      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), 2500); // Wait at end
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(300); // Pause before next word
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, description, typingSpeed, descriptions]);
  // ----------------------------

  useEffect(() => {
    const ctx = gsap.context(() => {
      // TIME-BASED CINEMATIC TIMELINE (No Scrub)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%', // Trigger when section is 70% in view
          toggleActions: 'play none none none' // Play once and don't look back
        }
      });

      // 1. TEXT ANIMATION - Ultra smooth character reveal
      const titleChars = titleRef.current.querySelectorAll('.char');
      tl.fromTo(titleChars,
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          stagger: 0.04,
          duration: 1.2,
          ease: 'power2.out'
        },
        0.1
      );

      // 2. MODEL ANIMATION - Based on category type
      if (animation === 'flip') {
        // BIRYANI - 3D Flip Reveal (Card flip from back to front)
        tl.fromTo(modelRef.current,
          {
            rotateY: reverse ? 90 : -90,
            opacity: 0,
            scale: 0.7,
          },
          {
            rotateY: 0,
            opacity: 1,
            scale: 1,
            duration: 2.2,
            ease: 'power2.out'
          },
          0.2
        );
      } else if (animation === 'bounce') {
        // PULAO - Soft Scale Pop
        tl.fromTo(modelRef.current,
          { scale: 0.6, opacity: 0, y: 50 },
          { scale: 1, opacity: 1, duration: 1.6, ease: 'elastic.out(1, 0.65)' },
          0.2
        );
      } else if (animation === 'steam') {
        // SPECIAL DESI - Steam Rise (wobble like hot steam)
        tl.fromTo(modelRef.current,
          { y: 120, opacity: 0, scale: 0.75, rotateZ: -8 },
          { y: 0, opacity: 1, scale: 1, rotateZ: 0, duration: 2.4, ease: 'power1.out' },
          0.2
        );
        // Add steam wobble
        tl.to(modelRef.current, { rotateZ: 3, duration: 0.4, ease: 'sine.inOut', yoyo: true, repeat: 3 }, 1.0);
      } else if (animation === 'spice') {
        // CHANAY - Spice Sprinkle (quick shake + settle)
        tl.fromTo(modelRef.current,
          { scale: 0.4, opacity: 0, rotateZ: -20 },
          { scale: 1, opacity: 1, rotateZ: 0, duration: 1.1, ease: 'back.out(1.5)' },
          0.2
        );
      } else if (animation === 'drop') {
        // EGG - Bounce Drop (drop from top with elastic)
        tl.fromTo(modelRef.current,
          { y: -200, opacity: 0, scale: 0.5 },
          { y: 0, opacity: 1, scale: 1, duration: 1.3, ease: 'bounce.out' },
          0.2
        );
      } else if (animation === 'pour') {
        // DRINKS - Liquid Pour (slide from side with ripple)
        tl.fromTo(modelRef.current,
          { x: reverse ? -150 : 150, opacity: 0, scale: 0.8, skewX: reverse ? 15 : -15 },
          { x: 0, opacity: 1, scale: 1, skewX: 0, duration: 1.8, ease: 'power2.out' },
          0.2
        );
      } else if (animation === 'spin') {
        // DESSERT - Sweet Spin (slow 360° rotation then settle)
        tl.fromTo(modelRef.current,
          { rotateY: 180, opacity: 0, scale: 0.6 },
          { rotateY: 360, opacity: 0.8, scale: 0.9, duration: 1.3, ease: 'power1.inOut' },
          0.2
        );
        tl.to(modelRef.current, { rotateY: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.3)' }, 1.7);
      } else if (animation === 'snap') {
        // ADDS ON - Quick Snap (fast scale with crisp stop)
        tl.fromTo(modelRef.current,
          { scale: 0.3, opacity: 0 },
          { scale: 1.05, opacity: 1, duration: 0.35, ease: 'power3.out' },
          0.2
        );
        tl.to(modelRef.current, { scale: 1, duration: 0.18, ease: 'power2.out' }, 0.6);
      } else if (animation === 'rise') {
        // BEVERAGES - Warm Rise (gentle upward steam motion)
        tl.fromTo(modelRef.current,
          { y: 100, opacity: 0, scale: 0.85 },
          { y: 0, opacity: 1, scale: 1, duration: 2.0, ease: 'power1.out' },
          0.2
        );
      } else {
        // PARATHA - BUTTER-SMOOTH CINEMATIC ZOOM (default)
        tl.fromTo(modelRef.current,
          {
            scale: 0.58,
            opacity: 0,
            y: 80,
            rotateY: reverse ? 35 : -35,
          },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            rotateY: 0,
            duration: 2.8,
            ease: 'power2.out'
          },
          0.15
        );
      }

      // 3. DESCRIPTION & BUTTON - Smooth fade in
      tl.fromTo([descRef.current, '.showcase-btn'],
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 1.0,
          stagger: 0.25,
          ease: 'power2.out'
        },
        0.8
      );

      // 4. Background glow - Ultra smooth sync
      tl.fromTo(glowRef.current,
        { scale: 0.4, opacity: 0 },
        { scale: 1.3, opacity: 0.4, duration: 2.8, ease: 'power2.out' },
        0.15
      );

    }, sectionRef);

    // --- MOUSE TRACKING 3D TILT HOVER EFFECT - ENHANCED ---
    const model = modelRef.current;
    let rafId = null;

    const handleMouseMove = (e) => {
      if (!model) return;

      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const rect = model.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // More dramatic tilt (25 degrees max)
        const rotateY = ((x - centerX) / centerX) * -25;
        const rotateX = ((y - centerY) / centerY) * -20;

        // Stronger magnetic pull (20px max)
        const moveX = ((x - centerX) / centerX) * 20;
        const moveY = ((y - centerY) / centerY) * 20;

        // Distance from center affects scale more
        const distance = Math.sqrt(
          Math.pow((x - centerX) / centerX, 2) + Math.pow((y - centerY) / centerY, 2)
        );
        const scale = 1 + (0.18 * (1 - Math.min(distance, 1))); // 1.18 max scale at center

        gsap.to(model, {
          rotateY: rotateY,
          rotateX: rotateX,
          x: moveX,
          y: moveY,
          scale: scale,
          duration: 0.35,
          ease: 'power2.out'
        });
      });
    };

    const handleMouseLeave = () => {
      if (!model) return;
      if (rafId) cancelAnimationFrame(rafId);

      gsap.to(model, {
        rotateY: 0,
        rotateX: 0,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power3.out'
      });
    };

    if (model) {
      model.addEventListener('mousemove', handleMouseMove, { passive: true });
      model.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      ctx.revert();
      if (rafId) cancelAnimationFrame(rafId);
      if (model) {
        model.removeEventListener('mousemove', handleMouseMove);
        model.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [reverse, title, animation]);

  return (
    <section 
      ref={sectionRef}
      id={id}
      className="food-showcase-section"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '80px 20px',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at center, rgba(232,84,26,0.08) 0%, transparent 50%)'
      }}
    >
      {/* Background Glow Effect */}
      <div ref={glowRef} className="food-showcase-glow" style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(232,84,26,0.12) 0%, transparent 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.6
      }} />

      {/* Main Content Grid */}
      <div className="food-showcase-grid" style={{
        display: 'grid',
        gridTemplateColumns: reverse ? '1fr 1.2fr' : '1.2fr 1fr',
        gap: '80px',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: reverse ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '100px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Text Content */}
        <div style={{ direction: 'ltr', position: 'relative', zIndex: 10, width: '550px', flexShrink: 0 }}>
          <p style={{
            fontSize: '14px',
            letterSpacing: '12px',
            textTransform: 'uppercase',
            color: '#E8541A',
            marginBottom: '40px',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 800
          }}>
            Signature Selection
          </p>
          <h2 ref={titleRef} style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(60px, 8vw, 120px)',
            fontWeight: 900,
            lineHeight: 1,
            color: '#F5F0E8',
            marginBottom: '50px',
            whiteSpace: 'nowrap'
          }}>
            {title.split(' ').map((word, wordIndex) => (
              <span key={wordIndex} style={{ 
                 display: 'block', // Force words to new lines
                 marginBottom: '10px',
                 color: wordIndex === title.split(' ').length - 1 ? '#E8541A' : 'inherit' // BACK TO ORANGE
               }}>
                {word.split('').map((char, charIndex) => (
                  <span key={charIndex} className="char" style={{ display: 'inline-block', transformOrigin: 'center top' }}>
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h2>
          <div style={{ width: '100px', height: '5px', background: '#E8541A', marginBottom: '50px' }} />
          <p ref={descRef} style={{
            fontSize: '22px',
            lineHeight: '2.1',
            color: '#888',
            marginBottom: '60px',
            maxWidth: '600px',
            minHeight: '150px', // Prevent layout shifts
            fontFamily: "'DM Sans', sans-serif",
            position: 'relative'
          }}>
            {displayText}
            <span style={{
              display: Array.isArray(description) ? 'inline-block' : 'none',
              width: '3px',
              height: '24px',
              background: '#E8541A',
              marginLeft: '5px',
              verticalAlign: 'middle',
              animation: 'blink 0.8s infinite'
            }} />
          </p>
          <style>{`
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
          `}</style>
          <button
            className="showcase-btn"
            onClick={() => document.getElementById(`${id}-menu`)?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: '#E8541A',
              color: '#fff',
              border: 'none',
              padding: '22px 55px',
              fontSize: '15px',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
              fontFamily: "'DM Sans', sans-serif",
              clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
          >
            Explore Menu
          </button>
        </div>

        {/* 3D Model Display with Steam Effect */}
        <div ref={modelRef} style={{
          height: '900px',
          width: '850px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 60px 120px rgba(0,0,0,0.9))',
          overflow: 'visible',
          position: 'relative',
          zIndex: 1,
          perspective: '1200px',
          transformStyle: 'preserve-3d',
          cursor: 'pointer'
        }}>
          <SingleFood3D imagePath={imagePath} scale={scale} />
          {/* Steam/Hot Effect Overlay */}
          <div style={{
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '300px',
            height: '200px',
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 60%)',
            filter: 'blur(30px)',
            pointerEvents: 'none',
            zIndex: 10,
            animation: 'steamFloat 4s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            top: '5%',
            left: '40%',
            width: '150px',
            height: '100px',
            background: 'radial-gradient(ellipse, rgba(255,200,150,0.1) 0%, transparent 50%)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
            zIndex: 10,
            animation: 'steamFloat 3s ease-in-out infinite 1s'
          }} />
        </div>
      </div>

      {/* Food Cards Grid */}
      {filteredMenu.length > 0 && (
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto 100px',
          padding: '0 20px'
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '32px',
            fontWeight: 700,
            color: '#F5F0E8',
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            {title} Menu
          </h3>
          <div className="food-card-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {filteredMenu.map((item, index) => (
              <FoodCard 
                key={item.id} 
                item={item} 
                index={index} 
                onAdd={onAdd} 
                onView3D={() => {}} 
              />
            ))}
          </div>
        </div>
      )}

    </section>
  );
}

