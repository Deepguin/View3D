import React from 'react';
import * as THREE from 'three';
import '../index.css';

interface ObjectControlProps {
  position: [number, number, number];
  setPosition: (position: [number, number, number]) => void;
  quaternion: THREE.Quaternion;
  setQuaternion: (quaternion: THREE.Quaternion) => void;
  scale: [number, number, number];
  setScale: (scale: [number, number, number]) => void;
  lightPosition: [number, number, number];
  setLightPosition: (position: [number, number, number]) => void;
}

const ObjectControl: React.FC<ObjectControlProps> = ({
  position,
  setPosition,
  quaternion,
  setQuaternion,
  scale,
  setScale,
  lightPosition,
  setLightPosition,
}) => {
  const handleChange = (
    type: 'position' | 'rotation' | 'scale' | 'lightPosition',
    axis: 'x' | 'y' | 'z',
    value: string
  ) => {
    const newValue = parseFloat(value) || 0;
    if (type === 'position') {
      const newPosition = [...position];
      newPosition["xyz".indexOf(axis)] = newValue;
      setPosition(newPosition as [number, number, number]);
    } else if (type === 'rotation') {
      const euler = new THREE.Euler().setFromQuaternion(quaternion);
      euler[axis] = newValue * Math.PI / 180;
      setQuaternion(new THREE.Quaternion().setFromEuler(euler));
    } else if (type === 'scale') {
      const newScale = [...scale];
      newScale["xyz".indexOf(axis)] = Math.max(newValue,1);
      setScale(newScale as [number, number, number]);
    } else {
      const newLightPosition = [...lightPosition];
      newLightPosition["xyz".indexOf(axis)] = newValue;
      setLightPosition(newLightPosition as [number, number, number]);
    }
  };

  const euler = new THREE.Euler().setFromQuaternion(quaternion);

  return (
    <div className="object-control">
      <h2>Object Control</h2>
      <div className="object-control-group">
        <div>
          <h3>Position</h3>
          {['x', 'y', 'z'].map((axis) => (
            <div key={`position-${axis}`} className="object-input-group">
              <label>{axis.toUpperCase()}:</label>
              <input
                type="number"
                value={position["xyz".indexOf(axis)]}
                onChange={(e) => handleChange('position', axis as 'x' | 'y' | 'z', e.target.value)}
              />
            </div>
          ))}
        </div>
        <div>
          <h3>Rotation (degrees)</h3>
          {['x', 'y', 'z'].map((axis) => (
            <div key={`rotation-${axis}`} className="object-input-group">
              <label>{axis}:</label>
              <input
                type="number"
                value={Math.round(euler[axis as 'x' | 'y' | 'z'] * 180 / Math.PI)}
                onChange={(e) => handleChange('rotation', axis as 'x' | 'y' | 'z', e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="object-scale-group">
        <h3>Scale</h3>
        {['x', 'y', 'z'].map((axis) => (
          <div key={`scale-${axis}`} className="object-input-group">
            <label>{axis.toUpperCase()}:</label>
            <input
              type="number"
              value={scale["xyz".indexOf(axis)]}
              onChange={(e) => handleChange('scale', axis as 'x' | 'y' | 'z', e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="object-light-position-group">
        <h3>Light Position</h3>
        {['x', 'y', 'z'].map((axis) => (
          <div key={`lightPosition-${axis}`} className="object-input-group">
            <label>{axis.toUpperCase()}:</label>
            <input
              type="number"
              value={lightPosition["xyz".indexOf(axis)]}
              onChange={(e) => handleChange('lightPosition', axis as 'x' | 'y' | 'z', e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObjectControl;
