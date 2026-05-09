import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, Sparkles, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Food items data with high-quality image URLs
const foodItems = [
  {
    id: 'pratha',
    name: 'Aloo Paratha',
    price: 120,
    image: 'https://images.unsplash.com/photo-1586202905275-2315a1a4a322?w=800&h=800&fit=crop',
    position: [-4, 0, 0],
    rotation: [0, Math.PI * 0.2, 0]
  },
  {
    id: 'chanay',
    name: 'Chana Masala',
    price: 150,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=800&fit=crop',
    position: [-2, 0, -1],
    rotation: [0, -Math.PI * 0.1, 0]
  },
  {
    id: 'egg',
    name: 'Egg Curry',
    price: 180,
    image: 'https://images.unsplash.com/photo-1586232902172-f5b78c5e295c?w=800&h=800&fit=crop',
    position: [0, 0, -2],
    rotation: [0, Math.PI * 0.3, 0]
  },
  {
    id: 'biryani',
    name: 'Chicken Biryani',
    price: 300,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&h=800&fit=crop',
    position: [2, 0, -1],
    rotation: [0, -Math.PI * 0.2, 0]
  },
  {
    id: 'chicken-nihari',
    name: 'Chicken Nihari',
    price: 350,
    image: 'https://images.unsplash.com/photo-1596662959913-c8e07b0b1e5f?w=800&h=800&fit=crop',
    position: [4, 0, 0],
    rotation: [0, Math.PI * 0.1, 0]
  },
  {
    id: 'beef-nihari',
    name: 'Beef Nihari',
    price: 400,
    image: 'https://images.unsplash.com/photo-1601050895923-3b7645815e5d?w=800&h=800&fit=crop',
    position: [-1, 0, 2],
    rotation: [0, Math.PI * 0.4, 0]
  },
  {
    id: 'beverages',
    name: 'Fresh Lassi',
    price: 80,
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&h=800&fit=crop',
    position: [1, 0, 2],
    rotation: [0, -Math.PI * 0.3, 0]
  }
];

function FoodPlate({ item, index, onPlateClick }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  const texture = useMemo(() => {
    if (!item.image) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(item.image);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [item.image]);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = item.position[1] + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.1;
      // Slow rotation
      groupRef.current.rotation.y += 0.003;
    }
  });

  if (!texture) return null;

  return (
    <group
      ref={groupRef}
      position={item.position}
      rotation={item.rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onPlateClick && onPlateClick(item)}
      scale={hovered ? 1.15 : 1}
    >
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        {/* Main plate */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1.0, 0.1, 64]} />
          <meshStandardMaterial color="#f5f0e8" roughness={0.2} metalness={0.15} />
        </mesh>

        {/* Inner plate */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
          <cylinderGeometry args={[1.0, 0.9, 0.05, 64]} />
          <meshStandardMaterial color="#e8e0d4" roughness={0.25} metalness={0.1} />
        </mesh>

        {/* Gold decorative rim */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0, 0]}>
          <torusGeometry args={[1.15, 0.03, 16, 64]} />
          <meshStandardMaterial color="#c9a96e" roughness={0.1} metalness={0.95} />
        </mesh>

        {/* Food image */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <circleGeometry args={[0.9, 64]} />
          <meshStandardMaterial map={texture} roughness={0.4} metalness={0.05} side={THREE.DoubleSide} />
        </mesh>

        {/* Decorative pattern ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <torusGeometry args={[0.95, 0.008, 12, 64]} />
          <meshStandardMaterial color="#b8956a" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Steam particles for hot items */}
        {(item.id.includes('nihari') || item.id.includes('biryani') || item.id.includes('curry')) && (
          <Sparkles
            count={15}
            scale={2}
            size={2}
            speed={0.3}
            opacity={0.15}
            color="#ff9944"
            position={[0, 1, 0]}
          />
        )}

        {/* Glow effect on hover */}
        {hovered && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <circleGeometry args={[1.1, 64]} />
            <meshStandardMaterial 
              color="#E8541A" 
              transparent 
              opacity={0.1} 
              side={THREE.DoubleSide} 
            />
          </mesh>
        )}
      </Float>
    </group>
  );
}

function Scene({ onPlateClick }) {
  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.4} />
      <spotLight
        position={[8, 12, 8]}
        angle={0.35}
        penumbra={0.7}
        intensity={3}
        color="#ffeedd"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <spotLight
        position={[-8, 10, 6]}
        angle={0.4}
        penumbra={0.8}
        intensity={2}
        color="#E8541A"
      />
      <pointLight position={[0, 8, 0]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-5, 5, -3]} intensity={0.8} color="#ff8844" />
      <pointLight position={[5, 5, 3]} intensity={0.8} color="#ff8844" />

      {/* Food plates */}
      {foodItems.map((item, index) => (
        <FoodPlate
          key={item.id}
          item={item}
          index={index}
          onPlateClick={onPlateClick}
        />
      ))}

      {/* Contact shadows */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={20}
        blur={3}
        far={8}
        color="#1a0a02"
      />

      {/* Environment */}
      <Environment preset="studio" />

      {/* Fog */}
      <fog attach="fog" args={['#0a0a0a', 10, 30]} />
    </>
  );
}

export default function FoodPlates3D({ onFoodSelect }) {
  const canvasRef = useRef(null);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
    }}>
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 8, 12], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        shadows
        style={{
          background: 'linear-gradient(to bottom, #1a1208, #0a0a0a)',
          borderRadius: '12px',
          border: '1px solid rgba(232,84,26,0.15)',
        }}
      >
        <Scene onPlateClick={onFoodSelect} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={8}
          maxDistance={20}
          minPolarAngle={0.5}
          maxPolarAngle={Math.PI / 2.5}
          autoRotate
          autoRotateSpeed={0.5}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Controls hint */}
      <div style={{
        position: 'absolute',
        bottom: 20,
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
        background: 'rgba(0,0,0,0.5)',
        padding: '8px 16px',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
      }}>
        <span style={{ fontSize: 14 }}>🖖</span> Drag to rotate · Scroll to zoom · Click plates for details
      </div>
    </div>
  );
}
