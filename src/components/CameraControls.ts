import React, { useCallback, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const CameraControls: React.FC = () => {
  const { camera } = useThree();
  const moveSpeed = 0.5;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    const right = new THREE.Vector3();
    camera.getWorldDirection(right);
    right.cross(camera.up).normalize();

    const up = new THREE.Vector3(0, 1, 0);

    switch (event.key) {
      case 'ArrowUp':
        camera.position.addScaledVector(up, moveSpeed);
        break;
      case 'ArrowDown':
        camera.position.addScaledVector(up, -moveSpeed);
        break;
      case 'ArrowLeft':
        camera.position.addScaledVector(right, -moveSpeed);
        break;
      case 'ArrowRight':
        camera.position.addScaledVector(right, moveSpeed);
        break;
      default:
        break;
    }
  }, [camera]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return null;
};

export default CameraControls;
