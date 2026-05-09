import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sparkles, Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Create food-specific colored textures programmatically
const createFoodTexture = (foodType) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  
  // Create gradient based on food type
  const gradient = context.createRadialGradient(256, 256, 50, 256, 256, 200);
  
  switch(foodType) {
    case 'pratha':
      gradient.addColorStop(0, '#ffd700');
      gradient.addColorStop(0.5, '#ffb347');
      gradient.addColorStop(1, '#daa520');
      break;
    case 'chanay':
      gradient.addColorStop(0, '#ffa500');
      gradient.addColorStop(0.5, '#ff8c00');
      gradient.addColorStop(1, '#ff6347');
      break;
    case 'egg':
      gradient.addColorStop(0, '#fff8dc');
      gradient.addColorStop(0.5, '#ffe4b5');
      gradient.addColorStop(1, '#f4a460');
      break;
    case 'biryani':
      gradient.addColorStop(0, '#ff6b35');
      gradient.addColorStop(0.5, '#ff4500');
      gradient.addColorStop(1, '#8b4513');
      break;
    case 'chicken-nihari':
    case 'beef-nihari':
      gradient.addColorStop(0, '#8b4513');
      gradient.addColorStop(0.5, '#654321');
      gradient.addColorStop(1, '#3e2723');
      break;
    case 'beverages':
      gradient.addColorStop(0, '#87ceeb');
      gradient.addColorStop(0.5, '#4682b4');
      gradient.addColorStop(1, '#1e90ff');
      break;
    case 'omelet':
      gradient.addColorStop(0, '#ffeb3b');
      gradient.addColorStop(0.5, '#ffc107');
      gradient.addColorStop(1, '#ff9800');
      break;
    default:
      gradient.addColorStop(0, '#ff8c00');
      gradient.addColorStop(1, '#ff6347');
  }
  
  context.fillStyle = gradient;
  context.fillRect(0, 0, 512, 512);
  
  // Add texture details
  for (let i = 0; i < 100; i++) {
    context.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.1})`;
    context.beginPath();
    context.arc(Math.random() * 512, Math.random() * 512, Math.random() * 15, 0, Math.PI * 2);
    context.fill();
  }
  
  // Add food-specific patterns
  if (foodType === 'biryani') {
    // Rice grain pattern
    context.strokeStyle = 'rgba(139, 69, 19, 0.3)';
    context.lineWidth = 2;
    for (let i = 0; i < 20; i++) {
      context.beginPath();
      context.moveTo(Math.random() * 512, Math.random() * 512);
      context.lineTo(Math.random() * 512, Math.random() * 512);
      context.stroke();
    }
  } else if (foodType === 'pratha') {
    // Flaky layers pattern
    context.strokeStyle = 'rgba(218, 165, 32, 0.3)';
    context.lineWidth = 3;
    for (let i = 0; i < 10; i++) {
      context.beginPath();
      context.arc(256, 256, 50 + i * 20, 0, Math.PI * 2);
      context.stroke();
    }
  }
  
  return new THREE.CanvasTexture(canvas);
};

// Specific food items for hero section - scattered layout using original PNGs
const heroFoodItems = [
  {
    id: 'biryani',
    name: 'Chicken Biryani',
    image: '/assets/3d-models/food-images/Biryani.png',
    position: [4, 2.5, -4],
    scale: 1.2,
    speed: 0.6,
  },
  {
    id: 'specialdesi',
    name: 'Special Desi',
    image: '/assets/3d-models/food-images/Nehari.png',
    position: [-4.5, -2, -3],
    scale: 1.3,
    speed: 0.5,
  },
  {
    id: 'pratha',
    name: 'Aloo Paratha',
    image: '/assets/3d-models/food-images/Pratha.png',
    position: [-5, 3, -5],
    scale: 1.0,
    speed: 0.7,
  },
  {
    id: 'chanay',
    name: 'Chana Masala',
    image: '/assets/3d-models/food-images/Chanay.png',
    position: [5, -2.5, -2],
    scale: 0.9,
    speed: 0.8,
  },
  {
    id: 'egg',
    name: 'Egg Curry',
    image: '/assets/3d-models/food-images/EGG.png',
    position: [0, -3.5, -6],
    scale: 0.8,
    speed: 0.9,
  },
  {
    id: 'omelet',
    name: 'Omelet',
    image: '/assets/3d-models/food-images/Omelet.png',
    position: [6, 0.5, -4],
    scale: 0.7,
    speed: 1.0,
  },
  {
    id: 'salad',
    name: 'Fresh Salad',
    image: '/assets/3d-models/food-images/Salad.png',
    position: [-7, 0.5, -7],
    scale: 1.1,
    speed: 0.75,
  }
];

// Create a soft radial gradient texture for the glow
const createGlowTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(232, 84, 26, 0.4)');
  gradient.addColorStop(1, 'rgba(232, 84, 26, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
};

function FoodItem({ item }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const [texture, setTexture] = useState(null);
  const [hovered, setHovered] = useState(false);
  const glowTexture = useMemo(() => createGlowTexture(), []);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    if (item.image) {
      loader.load(item.image, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      });
    }
  }, [item.image]);

  const handleScrollToSection = () => {
    const sectionId = `${item.id}-showcase`;
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Smooth floating animation
    const floatY = Math.sin(t * item.speed * 0.5) * 0.4;
    const floatX = Math.cos(t * item.speed * 0.3) * 0.2;
    
    meshRef.current.position.y = floatY;
    meshRef.current.position.x = floatX;
    
    if (glowRef.current) {
      glowRef.current.position.y = floatY;
      glowRef.current.position.x = floatX;
      // Pulsing glow effect
      const glowScale = hovered ? 3.2 : 2.5;
      glowRef.current.scale.setScalar(glowScale + Math.sin(t * 1.5) * 0.2);
    }
    
    // Subtle breathing scale effect
    const baseScale = hovered ? item.scale * 1.15 : item.scale;
    const scale = baseScale * (1 + Math.sin(t * 0.5) * 0.05);
    meshRef.current.scale.set(scale, scale, 1);
    
    // Very subtle rotation tilt
    meshRef.current.rotation.z = Math.sin(t * 0.2) * 0.05;
  });

  if (!texture) return null;

  return (
    <group 
      position={item.position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleScrollToSection}
      style={{ cursor: 'pointer' }}
    >
      {/* Outer Glow Aura */}
      <mesh ref={glowRef} position={[0, 0, -0.3]}>
        <planeGeometry args={[4, 4]} />
        <meshBasicMaterial 
          map={glowTexture}
          transparent={true} 
          opacity={hovered ? 0.9 : 0.6}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={meshRef}>
        <planeGeometry args={[4, 4]} />
        <meshBasicMaterial 
          map={texture} 
          transparent={true} 
          alphaTest={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      
      {/* Small point light for each food item to give it a "lit" look */}
      <pointLight position={[0, 0, 1]} intensity={hovered ? 1.2 : 0.4} color="#E8541A" distance={6} />
    </group>
  );
}

function ParticleField() {
  const points = useMemo(() => {
    const p = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      p[i * 3] = (Math.random() - 0.5) * 25;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return p;
  }, []);

  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={200} array={points} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#E8541A" transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

function CameraController() {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const targetX = mouseRef.current.x * 0.8;
    const targetY = mouseRef.current.y * 0.4;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(0, 0, -5);
  });

  useEffect(() => {
    const onMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 5;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return null;
}

function Scene() {
  return (
    <>
      <CameraController />
      <ambientLight intensity={1} />
      
      {heroFoodItems.map((item) => (
        <FoodItem key={item.id} item={item} />
      ))}

      <Sparkles
        count={40}
        scale={20}
        size={1.5}
        speed={0.3}
        opacity={0.15}
        color="#E8541A"
      />
    </>
  );
}

export default function Hero3D() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1,
      pointerEvents: 'none',
      background: 'radial-gradient(circle at center, #1a0a02 0%, #0D0D0D 100%)',
    }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'auto' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

export { FoodItem };
