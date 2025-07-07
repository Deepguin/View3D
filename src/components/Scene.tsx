import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { SoftShadows } from '@react-three/drei';
import { Model } from '../types/Model';
import * as THREE from 'three';
import ObjectControl from './ObjectControl';
import Cube from './Cube';
import ExternalModel from './ExternalModel';
import OrbitControls from './OrbitControls';
import CustomSky from './CustomSky';
import CameraControls from './CameraControls';
import './Scene.css';
import { useSceneHandlers } from '../hooks/useSceneHandlers'; 

const Scene: React.FC = () => {
  const [models, setModels] = useState<Model[]>([
    { 
      id: 'cube1', 
      position: [0, 0.5, 0], 
      quaternion: new THREE.Quaternion(),
      scale: [1, 1, 1], 
      type: 'cube' 
    }
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lightPosition, setLightPosition] = useState<[number, number, number]>([5, 5, 5]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    handleSelect,
    handleDelete,
    handleUpdateModel,
    handleAddCube,
    handleDrop,
    handleDragOver
  } = useSceneHandlers(models, setModels, selectedId, setSelectedId);

  const selectedModel = selectedId ? models.find(m => m.id == selectedId) : null;

  return (
    <div className="scene-container">
      <div className="controls-container">
        <ObjectControl
          position={selectedModel?.position || [0, 0, 0]}
          setPosition={(pos) => selectedId && handleUpdateModel(selectedId, { position: pos })}
          quaternion={selectedModel?.quaternion || new THREE.Quaternion()}
          setQuaternion={(quat) => selectedId && handleUpdateModel(selectedId, { quaternion: quat })}
          scale={selectedModel?.scale || [1, 1, 1]}
          setScale={(scale) => selectedId && handleUpdateModel(selectedId, { scale: scale })}
          lightPosition={lightPosition}
          setLightPosition={setLightPosition}
        />
        <div className="button-group">
          <button
            onClick={handleDelete}
            className="button button-delete"
            disabled={!selectedId}
          >
            Delete Selected
          </button>
          <button
            onClick={handleAddCube}
            className="button button-add"
          >
            Add New Cube
          </button>
        </div>
      </div>
      <div className="canvas-container" onDrop={handleDrop} onDragOver={handleDragOver}>
        <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }} ref={canvasRef}>
          <SoftShadows size={25} samples={10} />
          <CustomSky sunPosition={lightPosition} />
          <OrbitControls />
          <ambientLight intensity={0.2} />
          <directionalLight
            position={lightPosition}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <CameraControls />
          <group onClick={() => setSelectedId(null)}>
            {models.map(model => {
              switch (model.type) {
                case 'cube':
                  return (
                    <Cube
                      key={model.id}
                      id={model.id}
                      position={model.position}
                      quaternion={model.quaternion}
                      scale={model.scale}
                      onSelect={handleSelect}
                      isSelected={selectedId == model.id}
                    />
                  );
                case 'external':
                  return (
                    <ExternalModel
                      key={model.id}
                      id={model.id}
                      position={model.position}
                      quaternion={model.quaternion}
                      scale={model.scale}
                      onSelect={handleSelect}
                      isSelected={selectedId == model.id}
                      url={model.url!}
                    />
                  );
                default:
                  return null;
              }
            })}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#a0a0a0" />
            </mesh>
            <gridHelper args={[20, 20, '#ffffff', '#ffffff']} position={[0, 0.01, 0]} />
          </group>
        </Canvas>
      </div>
    </div>
  );
};

export default Scene;
