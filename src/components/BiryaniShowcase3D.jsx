import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, Sparkles, OrbitControls, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

function BiryaniPlate({ imageUrl }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  const texture = useMemo(() => {
    if (!imageUrl) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(imageUrl);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [imageUrl]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  if (!texture) return null;

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.08 : 1}
    >
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.6}>
        {/* Main plate */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.8, 1.6, 0.15, 128]} />
          <meshStandardMaterial color="#f5f0e8" roughness={0.2} metalness={0.15} />
        </mesh>

        {/* Inner plate */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
          <cylinderGeometry args={[1.55, 1.45, 0.08, 128]} />
          <meshStandardMaterial color="#e8e0d4" roughness={0.25} metalness={0.1} />
        </mesh>

        {/* Gold decorative rim */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0, 0]}>
          <torusGeometry args={[1.75, 0.05, 24, 128]} />
          <meshStandardMaterial color="#c9a96e" roughness={0.1} metalness={0.95} />
        </mesh>

        {/* Food image */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <circleGeometry args={[1.45, 128]} />
          <meshStandardMaterial map={texture} roughness={0.4} metalness={0.05} side={THREE.DoubleSide} />
        </mesh>

        {/* Decorative pattern ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <torusGeometry args={[1.48, 0.012, 16, 128]} />
          <meshStandardMaterial color="#b8956a" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Steam particles */}
        <Sparkles
          count={30}
          scale={4}
          size={4}
          speed={0.5}
          opacity={0.2}
          color="#ff9944"
          position={[0, 2, 0]}
        />
      </Float>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight
        position={[5, 10, 5]}
        angle={0.35}
        penumbra={0.7}
        intensity={4}
        color="#ffeedd"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <spotLight
        position={[-5, 8, 3]}
        angle={0.4}
        penumbra={0.8}
        intensity={2.5}
        color="#E8541A"
      />
      <pointLight position={[0, 5, 0]} intensity={1} color="#ffffff" />
      <pointLight position={[-3, 3, -2]} intensity={0.5} color="#ff8844" />

      <BiryaniPlate imageUrl="https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&h=800&fit=crop" />

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.6}
        scale={10}
        blur={2.5}
        far={5}
        color="#1a0a02"
      />

      <Environment preset="studio" />

      <fog attach="fog" args={['#0a0a0a', 8, 20]} />
    </>
  );
}

export default function BiryaniShowcase3D({ onView3D }) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.15 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        padding: '80px 40px',
        background: 'linear-gradient(180deg, #0D0D0D 0%, #1a0a02 50%, #0D0D0D 100%)',
        borderTop: '1px solid #1a1a1a',
        borderBottom: '1px solid #1a1a1a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 600,
        background: 'radial-gradient(circle, rgba(232,84,26,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: 60,
        alignItems: 'center',
      }}>
        {/* 3D Canvas */}
        <div style={{
          height: 500,
          position: 'relative',
          transform: visible ? 'translateX(0)' : 'translateX(-40px)',
          opacity: visible ? 1 : 0,
          transition: 'all 1.2s cubic-bezier(0.23,1,0.32,1)',
        }}>
          <Canvas
            camera={{ position: [0, 3, 6], fov: 42 }}
            gl={{ antialias: true, alpha: false }}
            shadows
            style={{
              background: 'linear-gradient(to bottom, #1a1208, #0a0a0a)',
              borderRadius: '8px',
              border: '1px solid rgba(232,84,26,0.15)',
            }}
          >
            <Scene />
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={4}
              maxDistance={12}
              minPolarAngle={0.3}
              maxPolarAngle={Math.PI / 2.2}
              autoRotate
              autoRotateSpeed={0.8}
              enableDamping
              dampingFactor={0.05}
            />
          </Canvas>

          <div style={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'rgba(255,255,255,0.3)',
            fontSize: 11,
            letterSpacing: 2,
            textTransform: 'uppercase',
            fontFamily: "'DM Sans',sans-serif",
          }}>
            <span style={{ fontSize: 14 }}>🖱️</span> Drag to rotate · Scroll to zoom
          </div>
        </div>

        {/* Info */}
        <div style={{
          transform: visible ? 'translateX(0)' : 'translateX(40px)',
          opacity: visible ? 1 : 0,
          transition: 'all 1.2s 0.2s cubic-bezier(0.23,1,0.32,1)',
        }}>
          <p style={{
            fontSize: 10,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#E8541A',
            marginBottom: 16,
            fontFamily: "'DM Sans',sans-serif",
          }}>
            3D Experience
          </p>

          <h2 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 900,
            color: '#F5F0E8',
            lineHeight: 1.1,
            marginBottom: 20,
          }}>
            Our Signature<br />
            <span style={{ color: '#E8541A' }}>Chicken Biryani</span>
          </h2>

          <p style={{
            fontSize: 15,
            color: '#888',
            lineHeight: 1.85,
            marginBottom: 30,
            fontFamily: "'DM Sans',sans-serif",
            maxWidth: 440,
          }}>
            Experience our most loved dish in immersive 3D. Slow-cooked chicken layered 
            with fragrant basmati rice, saffron, and traditional spices. Every grain 
            tells a story of authentic desi flavors.
          </p>

          <div style={{
            display: 'flex',
            gap: 24,
            marginBottom: 36,
          }}>
            {[
              { num: '300', label: 'Rs. Starting' },
              { num: '2hrs', label: 'Slow Cooked' },
              { num: '15+', label: 'Spices' },
            ].map(s => (
              <div key={s.label}>
                <div style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 28,
                  fontWeight: 900,
                  color: '#E8541A',
                }}>
                  {s.num}
                </div>
                <div style={{
                  fontSize: 10,
                  color: '#555',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  marginTop: 4,
                  fontFamily: "'DM Sans',sans-serif",
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button
              onClick={() => onView3D && onView3D({
                id: 19,
                name: 'Chicken Biryani',
                price: 300,
                image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&h=800&fit=crop',
                desc: 'Slow-cooked chicken layered with basmati rice',
                badge: 'Most Loved'
              })}
              style={{
                background: '#E8541A',
                color: '#fff',
                border: 'none',
                padding: '16px 44px',
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 12,
                letterSpacing: 3,
                textTransform: 'uppercase',
                cursor: 'pointer',
                clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 8px 30px rgba(232,84,26,0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(232,84,26,0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(232,84,26,0.3)';
              }}
            >
              Open Full 3D Viewer
            </button>

            <button
              onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'transparent',
                color: '#888',
                border: '1px solid #333',
                padding: '16px 44px',
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 12,
                letterSpacing: 3,
                textTransform: 'uppercase',
                cursor: 'pointer',
                clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#E8541A';
                e.currentTarget.style.color = '#E8541A';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.color = '#888';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              See All Biryani
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .biryani-showcase-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
