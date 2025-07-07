import React from 'react';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three'; 

export interface Model3DProps {
  position: [number, number, number];
  scale: [number, number, number];
  quaternion: THREE.Quaternion;
  onSelect: (id: string) => void;
  isSelected: boolean;
  id: string;
  children?: React.ReactNode;
}

const Model3D: React.FC<Model3DProps> = ({ position, quaternion, scale, onSelect, id, children }) => {
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(id);
  };

  return (
    <group position={position} quaternion={quaternion} scale={scale} onClick={handleClick}>
      {children}
    </group>
  );
};

export default Model3D;