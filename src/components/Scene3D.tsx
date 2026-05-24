"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment, ContactShadows, PerspectiveCamera } from "@react-three/drei";
import { useRef, useState, useEffect, Suspense } from "react";
import * as THREE from "three";

function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(pointer.x * 1.5, 2 + pointer.y * 0.5, 8), 0.03);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Orb({ pos, color, scale }: { pos: [number, number, number]; color: string; scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = pos[1] + Math.sin(s.clock.getElapsedTime() * 0.5 + pos[0]) * 0.3;
  });
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={pos} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial color={color} speed={2} distort={0.3} radius={0.8} />
      </mesh>
    </Float>
  );
}

function Rings() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.getElapsedTime() * 0.1; });
  return (
    <group ref={ref}>
      {[...Array(5)].map((_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 4, Math.sin(i) * 1.5, Math.sin(a) * 4]} rotation={[0.5, a, 0]}>
            <torusGeometry args={[0.5, 0.12, 16, 32]} />
            <meshStandardMaterial color="#c9a227" emissive="#c9a227" emissiveIntensity={0.5} metalness={1} roughness={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

function Particles({ count = 200 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = new THREE.Object3D();
  const particles = useRef(Array.from({ length: count }, () => ({
    p: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 20],
    s: Math.random() * 0.5 + 0.1, o: Math.random() * Math.PI * 2
  })));
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    particles.current.forEach((pt, i) => {
      dummy.position.set(pt.p[0], pt.p[1] + Math.sin(t * pt.s + pt.o) * 2, pt.p[2]);
      dummy.scale.setScalar(pt.s * 0.5);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <pointsMaterial size={0.04} color="#ffd700" transparent opacity={0.6} sizeAttenuation />
    </instancedMesh>
  );
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
      <CameraRig />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffd700" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#c9a227" />
      <Orb pos={[0, 0, 0]} color="#c9a227" scale={1.5} />
      <Orb pos={[-3, 1, -2]} color="#ffd700" scale={0.8} />
      <Orb pos={[3, -1, 2]} color="#b8860b" scale={1} />
      <Rings />
      <Particles />
      <Environment preset="sunset" />
      <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={20} blur={2} far={10} color="#c9a227" />
    </>
  );
}

export default function Scene3D() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="fixed inset-0 bg-zinc-950" />;
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas dpr={[1, 2]}><Suspense fallback={null}><Scene /></Suspense></Canvas>
    </div>
  );
}