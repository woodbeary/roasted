import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageCaptureProps {
  onCapture: (imageUrl: string) => void;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ onCapture }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Failed to access camera. Please check your permissions.');
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
      onCapture(imageDataUrl);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setCapturedImage(imageDataUrl);
        onCapture(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-4">
      {!capturedImage && (
        <>
          <video ref={videoRef} autoPlay playsInline className="w-full mb-2 rounded" />
          <div className="flex space-x-2">
            <Button onClick={startCamera}>Start Camera</Button>
            <Button onClick={captureImage}>Capture Image</Button>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <Button onClick={() => fileInputRef.current?.click()}>Upload Image</Button>
          </div>
        </>
      )}
      {capturedImage && (
        <div>
          <img src={capturedImage} alt="Captured" className="w-full mb-2 rounded" />
          <Button onClick={() => setCapturedImage(null)}>Retake</Button>
        </div>
      )}
    </div>
  );
};

export default ImageCapture;