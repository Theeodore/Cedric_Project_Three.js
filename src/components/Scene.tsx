import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Wall from "./Wall";
import Window from "./Window";
import ControlPanel from "./ControlPanel";
import MaterialPanel from "./MaterialPanel";
import * as THREE from "three";

export interface WindowConfig {
  width: number;
  height: number;
  depth: number;
  material: "metal" | "wood" | "brick";
}

const Scene: React.FC = () => {
  const [windowConfig, setWindowConfig] = useState<WindowConfig>({
    width: 2,
    height: 1.5,
    depth: 0.15,
    material: "metal",
  });
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Canvas
      camera={{ position: [5, 2, 5], fov: 60 }}
      shadows
      style={{ width: "100vw", height: "100vh" }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Environment */}
      <Environment preset="city" />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* Scene Objects */}
      <Wall />
      <Window config={windowConfig} />
      <ControlPanel
        config={windowConfig}
        onConfigChange={setWindowConfig}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
      />
      <MaterialPanel
        config={windowConfig}
        onConfigChange={setWindowConfig}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
      />

      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
        enabled={!isDragging}
      />
    </Canvas>
  );
};

export default Scene;
