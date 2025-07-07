import * as THREE from 'three';

export interface Model {
  id: string;
  position: [number, number, number];
  quaternion: THREE.Quaternion;
  scale: [number, number, number];
  type: 'cube' | 'external';
  url?: string;
}