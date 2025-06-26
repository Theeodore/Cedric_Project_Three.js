import React, { useRef, useState, useEffect, useCallback } from "react";
import { useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { WindowConfig } from "./Scene";

interface ControlPanelProps {
  config: WindowConfig;
  onConfigChange: (config: WindowConfig) => void;
  isDragging: boolean;
  setIsDragging: (drag: boolean) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  onConfigChange,
  isDragging,
  setIsDragging,
}) => {
  const panelRef = useRef<THREE.Group>(null);
  const [hoveredSlider, setHoveredSlider] = useState<string | null>(null);
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragStartValue, setDragStartValue] = useState<number | null>(null);

  useFrame((state) => {
    if (panelRef.current) {
      // Gentle floating animation
      panelRef.current.position.y =
        0.5 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
      panelRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  const handlePointerMove = (event: any) => {
    if (!dragKey || dragStartX === null || dragStartValue === null) return;
    event.stopPropagation();
    const deltaX = event.clientX - dragStartX;
    const sensitivity = 2; // Facteur de sensibilité
    const deltaValue = (deltaX / window.innerWidth) * 2 * sensitivity;
    let newValue = dragStartValue + deltaValue;
    newValue = Math.max(0, Math.min(1, newValue)); // Clamp entre 0 et 1
    let newConfig = { ...config };
    switch (dragKey) {
      case "width":
        newConfig.width = 0.5 + newValue * 3; // 0.5 to 3.5
        break;
      case "height":
        newConfig.height = 0.5 + newValue * 2.5; // 0.5 to 3
        break;
      case "depth":
        newConfig.depth = 0.05 + newValue * 0.4; // 0.05 to 0.45
        break;
    }
    onConfigChange(newConfig);
  };

  const handlePointerDown = (
    paramKey: keyof WindowConfig,
    value: number,
    event: ThreeEvent<PointerEvent>
  ) => {
    setDragKey(paramKey);
    setIsDragging(true);
    setDragStartX(event.clientX);
    let startValue;
    if (paramKey === "depth") {
      startValue = (value - 0.05) / 0.4;
    } else {
      startValue = (value - 0.5) / 3; //
    }
    setDragStartValue(startValue);
  };

  const handlePointerUp = () => {
    setDragKey(null);
    setIsDragging(false);
    setDragStartX(null);
    setDragStartValue(null);
  };

  const handlePointerMoveGlobal = useCallback(
    (event: PointerEvent) => {
      if (!dragKey) return;
      handlePointerMove(event);
    },
    [dragKey, handlePointerMove]
  );

  const handlePointerUpGlobal = useCallback(() => {
    if (dragKey) {
      handlePointerUp();
    }
  }, [dragKey]);

  useEffect(() => {
    if (dragKey) {
      document.addEventListener("pointermove", handlePointerMoveGlobal);
      document.addEventListener("pointerup", handlePointerUpGlobal);
      document.body.style.cursor = "ew-resize";
    } else {
      document.removeEventListener("pointermove", handlePointerMoveGlobal);
      document.removeEventListener("pointerup", handlePointerUpGlobal);
      document.body.style.cursor = "";
    }
    return () => {
      document.removeEventListener("pointermove", handlePointerMoveGlobal);
      document.removeEventListener("pointerup", handlePointerUpGlobal);
      document.body.style.cursor = "";
    };
  }, [dragKey, handlePointerMoveGlobal, handlePointerUpGlobal]);

  const Slider: React.FC<{
    label: string;
    value: number;
    min: number;
    max: number;
    position: [number, number, number];
    paramKey: keyof WindowConfig;
  }> = ({ label, value, min, max, position, paramKey }) => {
    const sliderRef = useRef<THREE.Group>(null);
    const normalizedValue = (value - min) / (max - min);
    const isHovered = hoveredSlider === paramKey;
    const isDrag = dragKey === paramKey;

    return (
      <group
        ref={sliderRef}
        position={position}
        onPointerOver={() => setHoveredSlider(paramKey)}
        onPointerOut={() => setHoveredSlider(null)}
        onPointerDown={(e) => handlePointerDown(paramKey, value, e)}
      >
        {/* Slider track */}
        <RoundedBox args={[1.5, 0.05, 0.02]} radius={0.01} smoothness={4}>
          <meshStandardMaterial
            color={isHovered || isDrag ? "#3B82F6" : "#64748B"}
            transparent
            opacity={0.8}
          />
        </RoundedBox>

        {/* Slider handle */}
        <RoundedBox
          args={[0.1, 0.15, 0.06]}
          radius={0.02}
          smoothness={4}
          position={[(normalizedValue - 0.5) * 1.4, 0, 0.03]}
        >
          <meshStandardMaterial
            color={isHovered || isDrag ? "#EF4444" : "#F97316"}
            roughness={0.3}
            metalness={0.7}
          />
        </RoundedBox>

        {/* Label */}
        <Text
          position={[0, 0.25, 0]}
          fontSize={0.08}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>

        {/* Value display */}
        <Text
          position={[0, -0.25, 0]}
          fontSize={0.06}
          color="#94A3B8"
          anchorX="center"
          anchorY="middle"
        >
          {value.toFixed(2)}
        </Text>
      </group>
    );
  };

  return (
    <group ref={panelRef} position={[3.5, 0.5, 0]}>
      {/* Panel background */}
      <RoundedBox args={[2.2, 2.8, 0.1]} radius={0.05} smoothness={4}>
        <meshStandardMaterial
          color="#1E293B"
          transparent
          opacity={0.9}
          roughness={0.1}
          metalness={0.3}
        />
      </RoundedBox>

      {/* Panel title */}
      <Text
        position={[0, 1, 0.06]}
        fontSize={0.12}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Window Controls
      </Text>

      {/* Controls */}
      <Slider
        label="Width"
        value={config.width}
        min={0.5}
        max={3.5}
        position={[0, 0.5, 0.06]}
        paramKey="width"
      />

      <Slider
        label="Height"
        value={config.height}
        min={0.5}
        max={3}
        position={[0, 0, 0.06]}
        paramKey="height"
      />

      <Slider
        label="Depth"
        value={config.depth}
        min={0.05}
        max={0.45}
        position={[0, -0.5, 0.06]}
        paramKey="depth"
      />
    </group>
  );
};

export default ControlPanel;
