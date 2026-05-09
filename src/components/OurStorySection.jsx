import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function OurStorySection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const storyRef = useRef(null);
  const statsRef = useRef(null);
  const valuesRef = useRef(null);
  const imageRef = useRef(null);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [count4, setCount4] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1.4, ease: 'power3.out',
          scrollTrigger: { trigger: titleRef.current, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );

      // Story text reveal
      gsap.fromTo(storyRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1.2, ease: 'power2.out', delay: 0.3,
          scrollTrigger: { trigger: storyRef.current, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );

      // Image reveal
      gsap.fromTo(imageRef.current,
        { opacity: 0, scale: 0.9, rotateY: -15 },
        {
          opacity: 1, scale: 1, rotateY: 0, duration: 1.6, ease: 'power2.out',
          scrollTrigger: { trigger: imageRef.current, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );

      // Stats counter animation
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 80%',
        onEnter: () => {
          animateCounter(0, 8, 2000, setCount1);
          animateCounter(0, 15000, 2500, setCount2);
          animateCounter(0, 50, 2000, setCount3);
          animateCounter(0, 4.9, 2000, setCount4, true);
        },
        once: true
      });

      // Values cards stagger
      const cards = valuesRef.current?.querySelectorAll('.value-card');
      if (cards) {
        gsap.fromTo(cards,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.8, stagger: 0.15, ease: 'power2.out',
            scrollTrigger: { trigger: valuesRef.current, start: 'top 85%', toggleActions: 'play none none none' }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const animateCounter = (start, end, duration, setter, isDecimal = false) => {
    const startTime = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = start + (end - start) * eased;
      setter(isDecimal ? current.toFixed(1) : Math.floor(current));
      if (progress < 1) requestAnimationFrame(step);
    };
    step();
  };

  const values = [
    {
      icon: '🌾',
      title: 'Farm Fresh',
      desc: 'Ingredients sourced daily from local markets for peak freshness and authentic taste.'
    },
    {
      icon: '⏰',
      title: 'Slow Cooked',
      desc: 'Traditional recipes cooked for 8+ hours to extract deep, rich flavors in every bite.'
    },
    {
      icon: '👨‍🍳',
      title: 'Master Chefs',
      desc: 'Generations of culinary expertise passed down through family traditions since 1985.'
    },
    {
      icon: '🕌',
      title: '100% Halal',
      desc: 'Certified halal sourcing with strict quality standards you can trust completely.'
    }
  ];

  return (
    <section
      ref={sectionRef}
      id="our-story"
      style={{
        background: '#0D0D0D',
        padding: '120px 80px',
        borderTop: '1px solid #1a1a1a',
        borderBottom: '1px solid #1a1a1a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(232,84,26,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(60px)',
      }} />

      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div ref={titleRef} style={{ textAlign: 'center', marginBottom: 80 }}>
          <p style={{
            fontSize: 11,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#E8541A',
            marginBottom: 20,
            fontFamily: "'DM Sans',sans-serif",
          }}>
            Since 1985 · Islamabad
          </p>
          <h2 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 900,
            color: '#F5F0E8',
            lineHeight: 1.1,
            marginBottom: 24,
          }}>
            Our Story &<br />
            <span style={{ color: '#E8541A' }}>Heritage</span>
          </h2>
          <p style={{
            color: '#666',
            fontSize: 16,
            lineHeight: 1.8,
            maxWidth: 600,
            margin: '0 auto',
            fontFamily: "'DM Sans',sans-serif",
          }}>
            From a small family kitchen to Islamabad's most loved desi food destination,
            our journey is built on passion, tradition, and unforgettable flavors.
          </p>
        </div>

        {/* Story + Image Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'center',
          marginBottom: 100,
        }}>
          {/* Story Text */}
          <div ref={storyRef}>
            <div style={{
              background: 'rgba(232,84,26,0.05)',
              border: '1px solid rgba(232,84,26,0.15)',
              borderRadius: 16,
              padding: '40px',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                top: -10,
                left: 40,
                background: '#E8541A',
                color: '#fff',
                padding: '6px 16px',
                fontSize: 10,
                letterSpacing: 3,
                textTransform: 'uppercase',
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 600,
                borderRadius: 4,
              }}>
                Our Journey
              </div>
              <p style={{
                color: '#888',
                fontSize: 15,
                lineHeight: 1.9,
                fontFamily: "'DM Sans',sans-serif",
                marginTop: 20,
              }}>
                Founded in the heart of Islamabad, <strong style={{ color: '#F5F0E8' }}>Cravez</strong> began as a humble 
                family tradition of serving authentic desi cuisine to neighbors and friends. What started 
                with a single tawa and secret family recipes has evolved into a beloved culinary destination.
              </p>
              <p style={{
                color: '#888',
                fontSize: 15,
                lineHeight: 1.9,
                fontFamily: "'DM Sans',sans-serif",
                marginTop: 16,
              }}>
                Every dish carries the warmth of home-cooked meals — the kind that brings families together 
                around the table. We don't just serve food; we serve memories, nostalgia, and the rich 
                culinary heritage of Pakistan.
              </p>
              <div style={{
                display: 'flex',
                gap: 16,
                marginTop: 28,
              }}>
                <span style={{
                  background: 'rgba(232,84,26,0.1)',
                  color: '#E8541A',
                  padding: '8px 16px',
                  borderRadius: 20,
                  fontSize: 11,
                  letterSpacing: 1,
                  fontFamily: "'DM Sans',sans-serif",
                }}>
                  🇵🇰 Pakistani Owned
                </span>
                <span style={{
                  background: 'rgba(232,84,26,0.1)',
                  color: '#E8541A',
                  padding: '8px 16px',
                  borderRadius: 20,
                  fontSize: 11,
                  letterSpacing: 1,
                  fontFamily: "'DM Sans',sans-serif",
                }}>
                  🏆 Award Winning
                </span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div ref={imageRef} style={{ perspective: '1000px' }}>
            <div style={{
              position: 'relative',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(232,84,26,0.15)',
            }}>
              <img
                src="/assets/3d-models/food-images/Nehari.png"
                alt="Traditional Cooking"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '30px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
              }}>
                <p style={{
                  color: '#E8541A',
                  fontSize: 12,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 600,
                  marginBottom: 8,
                }}>
                  Generations of Flavor
                </p>
                <p style={{
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: "'Playfair Display',serif",
                }}>
                  "The secret is in the masala, and the love is in the making."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Counter */}
        <div
          ref={statsRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 30,
            marginBottom: 100,
            padding: '50px 40px',
            background: 'rgba(232,84,26,0.03)',
            borderRadius: 20,
            border: '1px solid rgba(232,84,26,0.1)',
          }}
        >
          {[
            { num: count1, suffix: '+', label: 'Years of Service', icon: '📅' },
            { num: count2.toLocaleString(), suffix: '+', label: 'Happy Customers', icon: '❤️' },
            { num: count3, suffix: '+', label: 'Menu Items', icon: '🍽️' },
            { num: count4, suffix: '/5', label: 'Customer Rating', icon: '⭐' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{stat.icon}</div>
              <div style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 'clamp(32px, 4vw, 48px)',
                fontWeight: 900,
                color: '#E8541A',
                lineHeight: 1,
              }}>
                {stat.num}{stat.suffix}
              </div>
              <div style={{
                fontSize: 11,
                color: '#666',
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginTop: 8,
                fontFamily: "'DM Sans',sans-serif",
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Core Values */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{
            fontSize: 11,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#E8541A',
            marginBottom: 20,
            fontFamily: "'DM Sans',sans-serif",
          }}>
            What Drives Us
          </p>
          <h3 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 900,
            color: '#F5F0E8',
          }}>
            Our Core Values
          </h3>
        </div>

        <div
          ref={valuesRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
          }}
        >
          {values.map((val, i) => (
            <div
              key={i}
              className="value-card"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16,
                padding: '36px 28px',
                textAlign: 'center',
                transition: 'all 0.4s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(232,84,26,0.06)';
                e.currentTarget.style.borderColor = 'rgba(232,84,26,0.3)';
                e.currentTarget.style.transform = 'translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'rgba(232,84,26,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: 26,
              }}>
                {val.icon}
              </div>
              <h4 style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 20,
                fontWeight: 700,
                color: '#F5F0E8',
                marginBottom: 12,
              }}>
                {val.title}
              </h4>
              <p style={{
                color: '#666',
                fontSize: 13,
                lineHeight: 1.7,
                fontFamily: "'DM Sans',sans-serif",
              }}>
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
