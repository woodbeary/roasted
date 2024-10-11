import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

const CameraAccess: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const handleEnableCamera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setIsEnabled(true);
    } catch (error) {
      console.error('Error accessing camera and microphone:', error);
      alert('Failed to access camera and microphone. Please check your permissions.');
    }
  };

  return (
    <Button 
      className="w-full mb-4" 
      onClick={handleEnableCamera}
      disabled={isEnabled}
    >
      {isEnabled ? 'Camera & Microphone Enabled' : 'Enable Camera & Microphone'}
    </Button>
  );
};

export default CameraAccess;