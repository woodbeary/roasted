'use client';

import React from 'react';
import { Button } from "@/components/ui/button";

interface CameraAccessProps {
  onPermissionChange: (hasPermission: boolean) => void;
}

const CameraAccess: React.FC<CameraAccessProps> = ({ onPermissionChange }) => {
  const handleEnableCamera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      onPermissionChange(true);
    } catch (error) {
      console.error('Error accessing camera and microphone:', error);
      onPermissionChange(false);
    }
  };

  return (
    <div className="text-center">
      <p className="mb-4 text-gray-700">To get started, we need access to your camera and microphone.</p>
      <Button onClick={handleEnableCamera} className="bg-blue-500 hover:bg-blue-600 text-white">
        Enable Camera & Microphone
      </Button>
    </div>
  );
};

export default CameraAccess;