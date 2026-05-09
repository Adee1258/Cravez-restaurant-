import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

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

function FoodModel({ imagePath, scale: baseScale = 3.2 }) {
  const spriteRef = useRef();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(imagePath, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    });
  }, [imagePath]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (spriteRef.current) {
      // EXTREMELY SLOW & ELEGANT FLOAT
      spriteRef.current.position.y = Math.sin(t * 0.4) * 0.1;
      spriteRef.current.position.x = Math.cos(t * 0.3) * 0.03;
      
      // Gentle tilt
      spriteRef.current.rotation.z = Math.sin(t * 0.2) * 0.02;
      
      // Breathing - use passed scale prop
      const s = baseScale * (1.0 + Math.sin(t * 0.4) * 0.015);
      spriteRef.current.scale.set(s, s, 1);
    }
  });

  if (!texture) return null;

  return (
    <sprite ref={spriteRef}>
      <spriteMaterial 
        map={texture} 
        transparent={true}
        alphaTest={0.001}
      />
    </sprite>
  );
}

export default function SingleFood3D({ imagePath, scale = 3.2 }) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'visible'
    }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={3} />
        <FoodModel imagePath={imagePath} scale={scale} />
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}
