import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WindowConfig } from "./Scene";

interface WindowProps {
  config: WindowConfig;
}

const Window: React.FC<WindowProps> = ({ config }) => {
  const frameRef = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.Mesh>(null);
  const [isModified, setIsModified] = useState(false);

  useFrame((state) => {
    if (glassRef.current) {
      // Animation subtile de réflexion du verre
      const time = state.clock.elapsedTime;
      if (glassRef.current.material instanceof THREE.MeshStandardMaterial) {
        glassRef.current.material.opacity = 0.3 + Math.sin(time * 2) * 0.1;
        // Effet visuel lors de la modification
        if (isModified) {
          glassRef.current.material.color.setHex(0x87ceeb); // Couleur bleue
          glassRef.current.material.opacity = 0.6;
        } else {
          glassRef.current.material.color.setHex(0x87ceeb); // Couleur par défaut
          glassRef.current.material.opacity = 0.3;
        }
      }
    }
  });

  // Réinitialiser l'effet après 1 seconde
  useEffect(() => {
    if (isModified) {
      const timer = setTimeout(() => setIsModified(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isModified]);

  // Mettre à jour l'effet lorsque la config change
  useEffect(() => {
    setIsModified(true);
  }, [config]);

  return (
    <group ref={frameRef} position={[0, 0, -0.2]}>
      {/* Window frame */}
      <mesh castShadow>
        <boxGeometry
          args={[config.width + 0.2, config.height + 0.2, config.depth]}
        />
        <meshStandardMaterial color="#1E40AF" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Glass pane */}
      <mesh ref={glassRef} position={[0, 0, config.depth / 2 + 0.01]}>
        <planeGeometry args={[config.width - 0.1, config.height - 0.1]} />
        <meshStandardMaterial
          color="#87CEEB"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.9}
          envMapIntensity={1}
        />
      </mesh>

      {/* Window cross dividers */}
      <group>
        {/* Horizontal divider */}
        <mesh position={[0, 0, config.depth / 2 + 0.02]}>
          <boxGeometry args={[config.width - 0.1, 0.05, 0.02]} />
          <meshStandardMaterial color="#1E40AF" />
        </mesh>

        {/* Vertical divider */}
        <mesh position={[0, 0, config.depth / 2 + 0.02]}>
          <boxGeometry args={[0.05, config.height - 0.1, 0.02]} />
          <meshStandardMaterial color="#1E40AF" />
        </mesh>
      </group>
    </group>
  );
};

export default Window;
