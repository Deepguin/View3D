import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

interface CustomSkyProps {
  sunPosition: [number, number, number];
}

const CustomSky: React.FC<CustomSkyProps> = ({ sunPosition }) => {
  const { scene } = useThree();

  const skyShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        sunPosition: { value: new THREE.Vector3(...sunPosition) },
        topColor: { value: new THREE.Color(0x87CEEB) },
        bottomColor: { value: new THREE.Color(0xFFFFFF) },
        offset: { value: 0.5 },
        exponent: { value: 0.6 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform vec3 sunPosition;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;

        void main() {
          float h = normalize(vWorldPosition - sunPosition).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h + offset, 0.0), exponent), 0.0)), 1.0);
        }
      `,
      side: THREE.BackSide,
    });
  }, [sunPosition]);

  useEffect(() => {
    const skyGeometry = new THREE.SphereGeometry(500, 60, 40);
    const sky = new THREE.Mesh(skyGeometry, skyShaderMaterial);
    scene.add(sky);

    return () => {
      scene.remove(sky);
    };
  }, [scene, skyShaderMaterial]);

  return null;
};

export default CustomSky;
