import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Group, Box3, Vector3, Mesh } from 'three';
import { Model3DProps } from './Model3D';

interface ExternalModelProps extends Model3DProps {
  url: string;
}

const ExternalModel: React.FC<ExternalModelProps> = ({ url, isSelected, quaternion, position, scale, onSelect, id }) => {
  const modelRef = useRef<Group>(null);
  const [model, setModel] = useState<Group | null>(null);
  const [boundingBox, setBoundingBox] = useState<Box3 | null>(null);
  const [boxSize, setBoxSize] = useState<Vector3 | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      const loader = new GLTFLoader();
      const gltf = await loader.loadAsync(url);
      const loadedModel = gltf.scene;

      if (loadedModel) {
        setModel(loadedModel);

        loadedModel.updateMatrixWorld(true);
        const box = new Box3().setFromObject(loadedModel);
        setBoundingBox(box);

        const center = new Vector3();
        box.getCenter(center);
        loadedModel.position.sub(center);

        const size = new Vector3();
        box.getSize(size);
        setBoxSize(size);

        loadedModel.position.y += size.y / 2;

        loadedModel.traverse((child) => {
          if (child instanceof Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
      }
    };

    loadModel();
  }, [url]);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.quaternion.copy(quaternion);
    }
  });

  return (
    <group
      ref={modelRef}
      position={position}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      {model && <primitive object={model} />}
      {isSelected && boundingBox && boxSize && (
        <mesh 
          position={[0, boxSize.y / 2, 0]}
        >
          <boxGeometry args={[boxSize.x, boxSize.y, boxSize.z]} />
          <meshBasicMaterial color="white" wireframe transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
};

export default ExternalModel;
