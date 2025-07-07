import { useCallback } from 'react';
import * as THREE from 'three';
import { Model } from '../types/Model';

export const useSceneHandlers = (models: Model[], setModels: React.Dispatch<React.SetStateAction<Model[]>>, selectedId: string | null, setSelectedId: React.Dispatch<React.SetStateAction<string | null>>) => {

  const handleSelect = useCallback((id: string) => {
    setSelectedId(prev => prev == id ? null : id);
  }, []);

  const handleDelete = useCallback(() => {
    if (selectedId) {
      setModels(prev => prev.filter(model => model.id != selectedId));
      setSelectedId(null);
    }
  }, [selectedId]);

  const handleUpdateModel = useCallback((id: string, updates: Partial<Model>) => {
    setModels(prev => prev.map(model => 
      model.id == id ? { ...model, ...updates } : model
    ));
  }, []);

  const handleAddCube = useCallback(() => {
    const newId = `cube${models.length + 1}`;
    const newModel: Model = {
      id: newId,
      position: [Math.random()*3, Math.random(), Math.random()*3],
      quaternion: new THREE.Quaternion(),
      scale: [1, 1, 1],
      type: 'cube'
    };
    setModels(prev => [...prev, newModel]);
    setSelectedId(newId);
  }, [models]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const newId = `external${models.length + 1}`;
        const newModel: Model = {
          id: newId,
          position: [0, 0, 0],
          quaternion: new THREE.Quaternion(),
          scale: [1, 1, 1],
          type: 'external',
          url: url
        };
        setModels(prev => [...prev, newModel]);
        setSelectedId(newId);
      };
      reader.readAsDataURL(file);
    }
  }, [models]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return {
    handleSelect,
    handleDelete,
    handleUpdateModel,
    handleAddCube,
    handleDrop,
    handleDragOver
  };
};
