import React, { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { WindowConfig } from "./Scene";

interface WindowProps {
  config: WindowConfig;
}

const Window: React.FC<WindowProps> = ({ config }) => {
  const frameRef = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.Mesh>(null);
  const [isModified, setIsModified] = useState(false);
  const [glassMaterial, setGlassMaterial] =
    useState<THREE.MeshStandardMaterial | null>(null);

  // Initialiser le matériau de la vitre ou le mettre à jour lorsque le matériau du cadre change
  useEffect(() => {
    const newGlassMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#87CEEB"),
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      metalness: 0.9,
      envMapIntensity: 1,
      map: null,
      normalMap: null,
      roughnessMap: null,
    });
    setGlassMaterial(newGlassMaterial);

    // Nettoyage : dispose du matériau précédent lors du démontage ou de la mise à jour
    return () => {
      if (glassMaterial) {
        glassMaterial.dispose();
      }
    };
  }, [config.material]); // Dépend de config.material pour recréer le matériau si le cadre change

  // Chargement des textures
  const metalTexture = useLoader(
    THREE.TextureLoader,
    "/Surface/Metal049A_4K-PNG/Metal049A_4K-PNG_Color.png"
  );
  const woodTexture = useLoader(
    THREE.TextureLoader,
    "/Surface/Wood075_4K-PNG/Wood075_4K-PNG_Color.png"
  );
  const brickTexture = useLoader(
    THREE.TextureLoader,
    "/Surface/Bricks102_4K-PNG/Bricks102_4K-PNG_Color.png"
  );

  // Chargement des normal maps
  const metalNormalMap = useLoader(
    THREE.TextureLoader,
    "/Surface/Metal049A_4K-PNG/Metal049A_4K-PNG_NormalGL.png"
  );
  const woodNormalMap = useLoader(
    THREE.TextureLoader,
    "/Surface/Wood075_4K-PNG/Wood075_4K-PNG_NormalGL.png"
  );
  const brickNormalMap = useLoader(
    THREE.TextureLoader,
    "/Surface/Bricks102_4K-PNG/Bricks102_4K-PNG_NormalGL.png"
  );

  // Chargement des roughness maps
  const metalRoughnessMap = useLoader(
    THREE.TextureLoader,
    "/Surface/Metal049A_4K-PNG/Metal049A_4K-PNG_Roughness.png"
  );
  const woodRoughnessMap = useLoader(
    THREE.TextureLoader,
    "/Surface/Wood075_4K-PNG/Wood075_4K-PNG_Roughness.png"
  );
  const brickRoughnessMap = useLoader(
    THREE.TextureLoader,
    "/Surface/Bricks102_4K-PNG/Bricks102_4K-PNG_Roughness.png"
  );

  // Configuration des textures
  const textures = {
    metal: {
      map: metalTexture,
      normalMap: metalNormalMap,
      roughnessMap: metalRoughnessMap,
      metalness: 0.9,
      roughness: 0.3,
    },
    wood: {
      map: woodTexture,
      normalMap: woodNormalMap,
      roughnessMap: woodRoughnessMap,
      metalness: 0.1,
      roughness: 0.8,
    },
    brick: {
      map: brickTexture,
      normalMap: brickNormalMap,
      roughnessMap: brickRoughnessMap,
      metalness: 0.1,
      roughness: 0.9,
    },
  };

  useFrame((state) => {
    if (glassRef.current) {
      const time = state.clock.elapsedTime;
      if (glassRef.current.material instanceof THREE.MeshStandardMaterial) {
        glassRef.current.material.opacity = 0.3 + Math.sin(time * 2) * 0.1;
        if (isModified) {
          glassRef.current.material.color.setHex(0x87ceeb);
          glassRef.current.material.opacity = 0.6;
        } else {
          glassRef.current.material.color.setHex(0x87ceeb);
          glassRef.current.material.opacity = 0.3;
        }
        // S'assurer explicitement qu'aucune carte n'est appliquée à la vitre
        glassRef.current.material.map = null;
        glassRef.current.material.normalMap = null;
        glassRef.current.material.roughnessMap = null;
        glassRef.current.material.needsUpdate = true; // Important pour forcer la mise à jour
      }
    }
  });

  useEffect(() => {
    if (isModified) {
      const timer = setTimeout(() => setIsModified(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isModified]);

  useEffect(() => {
    setIsModified(true);
  }, [config]);

  const currentTexture = textures[config.material];

  return (
    <group ref={frameRef} position={[0, 0, -0.2]}>
      {/* Cadre de la fenêtre */}
      <mesh castShadow>
        <boxGeometry
          args={[config.width + 0.2, config.height + 0.2, config.depth]}
        />
        <meshStandardMaterial {...currentTexture} envMapIntensity={1} />
      </mesh>

      {/* Vitre */}
      {glassMaterial && (
        <mesh
          ref={glassRef}
          position={[0, 0, config.depth / 2 + 0.01]}
          material={glassMaterial}
        >
          <planeGeometry args={[config.width - 0.1, config.height - 0.1]} />
        </mesh>
      )}

      {/* Séparateurs de fenêtre */}
      <group>
        {/* Séparateur horizontal */}
        <mesh position={[0, 0, config.depth / 2 + 0.02]}>
          <boxGeometry args={[config.width - 0.1, 0.05, 0.02]} />
          <meshStandardMaterial {...currentTexture} />
        </mesh>

        {/* Séparateur vertical */}
        <mesh position={[0, 0, config.depth / 2 + 0.02]}>
          <boxGeometry args={[0.05, config.height - 0.1, 0.02]} />
          <meshStandardMaterial {...currentTexture} />
        </mesh>
      </group>
    </group>
  );
};

export default Window;
