import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { WindowConfig } from "./Scene";

interface MaterialPanelProps {
  config: WindowConfig;
  onConfigChange: (config: WindowConfig) => void;
  isDragging: boolean;
  setIsDragging: (drag: boolean) => void;
}

const MaterialPanel: React.FC<MaterialPanelProps> = ({
  config,
  onConfigChange,
  isDragging,
  setIsDragging,
}) => {
  const panelRef = useRef<THREE.Group>(null);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  useFrame((state) => {
    if (panelRef.current) {
      // Animation flottante douce
      panelRef.current.position.y =
        0.5 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
      panelRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  const handleMaterialClick = (material: WindowConfig["material"]) => {
    onConfigChange({ ...config, material });
  };

  const MaterialButton: React.FC<{
    material: WindowConfig["material"];
    position: [number, number, number];
  }> = ({ material, position }) => {
    const isSelected = config.material === material;
    const isHovered = hoveredButton === material;

    return (
      <group
        position={position}
        onPointerOver={() => setHoveredButton(material)}
        onPointerOut={() => setHoveredButton(null)}
        onClick={() => handleMaterialClick(material)}
      >
        <RoundedBox args={[0.8, 0.4, 0.05]} radius={0.05} smoothness={4}>
          <meshStandardMaterial
            color={isSelected ? "#3B82F6" : isHovered ? "#60A5FA" : "#64748B"}
            transparent
            opacity={0.9}
          />
        </RoundedBox>

        <Text
          position={[0, 0, 0.03]}
          fontSize={0.1}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {material.charAt(0).toUpperCase() + material.slice(1)}
        </Text>
      </group>
    );
  };

  return (
    <group ref={panelRef} position={[-3.5, 0.5, 0]}>
      {/* Fond du panneau */}
      <RoundedBox args={[2.2, 2.8, 0.1]} radius={0.05} smoothness={4}>
        <meshStandardMaterial
          color="#1E293B"
          transparent
          opacity={0.9}
          roughness={0.1}
          metalness={0.3}
        />
      </RoundedBox>

      {/* Titre du panneau */}
      <Text
        position={[0, 1, 0.06]}
        fontSize={0.12}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Matériaux
      </Text>

      {/* Boutons de matériaux */}
      <MaterialButton material="metal" position={[0, 0.5, 0.06]} />
      <MaterialButton material="wood" position={[0, 0, 0.06]} />
      <MaterialButton material="brick" position={[0, -0.5, 0.06]} />
    </group>
  );
};

export default MaterialPanel;
