import React from 'react';
import Model3D, { Model3DProps } from './Model3D';

const Cube: React.FC<Model3DProps> = ({ quaternion, ...props }) => {
  return (
    <Model3D {...props} quaternion={quaternion}>
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#8b5cf6"
          metalness={0.1}
        />
      </mesh>
      {props.isSelected && (
        <mesh>
          <boxGeometry args={[1.01, 1.01, 1.01]} />
          <meshBasicMaterial color="white" wireframe transparent opacity={0.5} />
        </mesh>
      )}
    </Model3D>
  );
};

export default Cube;