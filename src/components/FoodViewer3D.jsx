import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

function Plate3D({ imageUrl, name }) {
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
    if (!hovered && groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  if (!texture) return null;

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.05 : 1}
    >
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        {/* Main plate body */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[1.6, 1.4, 0.12, 128]} />
          <meshStandardMaterial
            color="#f5f0e8"
            roughness={0.25}
            metalness={0.15}
          />
        </mesh>

        {/* Plate inner depression */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
          <cylinderGeometry args={[1.35, 1.25, 0.06, 128]} />
          <meshStandardMaterial
            color="#e8e0d4"
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>

        {/* Gold rim */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <torusGeometry args={[1.55, 0.04, 24, 128]} />
          <meshStandardMaterial
            color="#c9a96e"
            roughness={0.15}
            metalness={0.9}
          />
        </mesh>

        {/* Food image - mapped on a slightly curved plane for realism */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <circleGeometry args={[1.25, 128]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.5}
            metalness={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Secondary rim detail */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <torusGeometry args={[1.28, 0.015, 16, 128]} />
          <meshStandardMaterial color="#d4c4a8" roughness={0.3} metalness={0.4} />
        </mesh>

        {/* Steam effect */}
        <Sparkles
          count={20}
          scale={3}
          size={3}
          speed={0.3}
          opacity={0.12}
          color="#ffaa66"
          position={[0, 1.5, 0]}
        />
      </Float>
    </group>
  );
}

function Scene({ imageUrl, name }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight
        position={[4, 8, 4]}
        angle={0.4}
        penumbra={0.8}
        intensity={3}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <spotLight
        position={[-4, 6, 3]}
        angle={0.5}
        penumbra={1}
        intensity={1.5}
        color="#E8541A"
      />
      <pointLight position={[0, 4, 0]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-3, 2, -2]} intensity={0.3} color="#ff8844" />

      <Plate3D imageUrl={imageUrl} name={name} />

      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.5}
        scale={8}
        blur={2}
        far={4}
        color="#1a0a02"
      />

      <Environment preset="studio" />

      <fog attach="fog" args={['#0f0f0f', 10, 25]} />
    </>
  );
}

export default function FoodViewer3D({ item, onClose, onAdd }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (item) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [item]);

  if (!item) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isVisible ? 'rgba(0,0,0,0.92)' : 'rgba(0,0,0,0)',
        backdropFilter: isVisible ? 'blur(20px)' : 'blur(0px)',
        transition: 'all 0.5s cubic-bezier(0.23,1,0.32,1)',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'all' : 'none',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '90vw',
          maxWidth: 1100,
          height: '85vh',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 0,
          background: 'linear-gradient(145deg, #1a1208 0%, #0a0a0a 100%)',
          border: '1px solid rgba(232,84,26,0.25)',
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(40px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.6s cubic-bezier(0.23,1,0.32,1) 0.15s',
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
        className="viewer-container"
      >
        {/* 3D Canvas Area */}
        <div style={{ position: 'relative', height: '100%', minHeight: 400 }}>
          <Canvas
            camera={{ position: [0, 3, 5], fov: 40 }}
            gl={{ antialias: true, alpha: false }}
            shadows
            style={{ background: 'linear-gradient(to bottom, #1a1208, #0a0a0a)' }}
          >
            <Scene imageUrl={item.image} name={item.name} />
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={3}
              maxDistance={10}
              minPolarAngle={0.2}
              maxPolarAngle={Math.PI / 2.2}
              autoRotate
              autoRotateSpeed={1.2}
              enableDamping
              dampingFactor={0.05}
            />
          </Canvas>

          {/* Zoom hint */}
          <div style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'rgba(255,255,255,0.35)',
            fontSize: 11,
            letterSpacing: 2,
            textTransform: 'uppercase',
            fontFamily: "'DM Sans',sans-serif",
          }}>
            <span style={{ fontSize: 14 }}>🖱️</span> Drag to rotate · Scroll to zoom
          </div>
        </div>

        {/* Info Panel */}
        <div style={{
          padding: '50px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderLeft: '1px solid rgba(232,84,26,0.12)',
          position: 'relative',
        }}>
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              background: 'none',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#888',
              width: 40,
              height: 40,
              cursor: 'pointer',
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#E8541A';
              e.currentTarget.style.color = '#E8541A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.color = '#888';
            }}
          >
            ×
          </button>

          <p style={{
            fontSize: 10,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#E8541A',
            marginBottom: 16,
            fontFamily: "'DM Sans',sans-serif",
          }}>
            3D Experience
          </p>

          <h2 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(28px, 3vw, 44px)',
            fontWeight: 900,
            color: '#F5F0E8',
            lineHeight: 1.1,
            marginBottom: 12,
          }}>
            {item.name}
          </h2>

          {item.badge && (
            <span style={{
              display: 'inline-block',
              background: '#E8541A',
              color: '#fff',
              fontSize: 10,
              letterSpacing: 2,
              padding: '5px 14px',
              textTransform: 'uppercase',
              fontFamily: "'DM Sans',sans-serif",
              marginBottom: 20,
              width: 'fit-content',
            }}>
              {item.badge}
            </span>
          )}

          <p style={{
            fontSize: 14,
            color: '#888',
            lineHeight: 1.8,
            marginBottom: 30,
            fontFamily: "'DM Sans',sans-serif",
            maxWidth: 340,
          }}>
            {item.desc}
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 6,
            marginBottom: 40,
          }}>
            <span style={{ fontSize: 14, color: '#888', fontFamily: "'DM Sans',sans-serif" }}>Rs.</span>
            <span style={{
              fontSize: 42,
              fontWeight: 700,
              color: '#E8541A',
              fontFamily: "'Playfair Display',serif",
            }}>
              {item.price}
            </span>
          </div>

          <button
            onClick={() => {
              onAdd(item);
              onClose();
            }}
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
              width: 'fit-content',
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
            Add to Cart
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .viewer-container {
            grid-template-columns: 1fr !important;
            grid-template-rows: 1fr auto !important;
            width: 95vw !important;
            height: 90vh !important;
          }
        }
      `}</style>
    </div>
  );
}
