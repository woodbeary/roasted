'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Camera } from 'lucide-react';

interface ImageCaptureProps {
  onCapture: (imageUrl: string) => void;
  hasCameraPermission: boolean;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ onCapture, hasCameraPermission }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (hasCameraPermission) {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [hasCameraPermission]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
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
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  return (
    <div className="space-y-4">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted
        className="w-full rounded-lg" 
      />
      <Button onClick={captureImage} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
        <Camera className="mr-2" size={18} />
        Capture Image
      </Button>
    </div>
  );
};

export default ImageCapture;