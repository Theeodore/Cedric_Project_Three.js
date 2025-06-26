import React from "react";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const Wall: React.FC = () => {
  const wallRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (wallRef.current) {
      wallRef.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.002
      );
    }
  });

  return (
    <group>
      {/* Main wall */}
      <mesh ref={wallRef} position={[0, 0, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[8, 4, 0.3]} />
        <meshStandardMaterial color="#E5E7EB" roughness={0.8} metalness={0.1} />
      </mesh>

      {}
      <mesh position={[0, 0, -0.35]}>
        <boxGeometry args={[2.2, 1.7, 0.4]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
};

export default Wall;
