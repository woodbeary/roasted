'use client';

import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Camera } from 'lucide-react';

interface ImageCaptureProps {
  onCapture: (imageUrl: string) => void;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      onCapture(imageDataUrl);
      setIsCapturing(false);
    }
  };

  return (
    <div className="space-y-4">
      {isCapturing ? (
        <>
          <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
          <Button onClick={captureImage} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            <Camera className="mr-2" size={18} />
            Capture Image
          </Button>
        </>
      ) : (
        <Button onClick={startCamera} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
          <Camera className="mr-2" size={18} />
          Start Camera
        </Button>
      )}
    </div>
  );
};

export default ImageCapture;