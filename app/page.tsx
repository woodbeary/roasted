'use client';

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CameraAccess from './components/CameraAccess';
import ImageCapture from './components/ImageCapture';
import RoastGenerator from './components/RoastGenerator';
import Leaderboard from './components/Leaderboard';
import ChatBox from './components/ChatBox';
import { Skeleton } from "@/components/ui/skeleton";
import { User, Camera, Flame, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [socialPlatform, setSocialPlatform] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setHasCameraPermission(true);
    } catch (error) {
      console.error('Error accessing camera and microphone:', error);
      setHasCameraPermission(false);
    }
  };

  const handleImageCapture = (imageUrl: string) => {
    setCapturedImage(imageUrl);
  };

  const handleSocialMediaSubmit = (platform: string) => {
    setSocialPlatform(platform);
    setIsLoading(true);
    // Simulate API call to fetch profile picture
    setTimeout(() => {
      setProfilePicture('https://placekitten.com/200/200'); // Placeholder image
      setIsLoading(false);
    }, 2000);
  };

  const getPlaceholderText = () => {
    switch (socialPlatform) {
      case 'facebook':
        return 'Enter your Facebook username';
      case 'instagram':
        return 'Enter your Instagram username';
      case 'twitter':
        return 'Enter your Twitter handle';
      default:
        return 'Enter your username';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white font-sans">
      <header className="text-center py-8 border-b border-purple-700">
        <h1 className="text-4xl font-bold text-white flex items-center justify-center">
          <Flame className="mr-2 text-yellow-500" size={32} />
          roasted.lol
        </h1>
        <p className="text-lg text-purple-300 mt-2">Get ready for an AI roasting experience!</p>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <section className="text-center space-y-4">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-10 rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-xl font-semibold mb-2">1. Take a Selfie</h3>
              <p>Snap a pic or use your social media profile</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">2. AI Magic</h3>
              <p>Our AI analyzes your photo and prepares a roast</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-semibold mb-2">3. Get Roasted</h3>
              <p>Receive a hilarious, personalized roast (and maybe win a prize!)</p>
            </div>
          </div>
        </section>

        <section className="bg-white bg-opacity-10 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Roasted?</h2>
          {hasCameraPermission === null ? (
            <CameraAccess onPermissionChange={setHasCameraPermission} />
          ) : hasCameraPermission ? (
            <div className="space-y-4">
              <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden flex items-center justify-center">
                {capturedImage ? (
                  <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <ImageCapture onCapture={handleImageCapture} />
              <Input 
                placeholder="Enter a nickname for yourself"
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white bg-opacity-20 border-purple-500"
              />
              <Button onClick={() => handleSocialMediaSubmit(socialPlatform)} className="w-full bg-purple-600 hover:bg-purple-700" disabled={!username}>
                Generate Roast <ArrowRight className="ml-2" size={16} />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-yellow-300">No camera access? Use your social media profile!</p>
              <Select onValueChange={setSocialPlatform}>
                <SelectTrigger className="w-full bg-white bg-opacity-20 border-purple-500">
                  <SelectValue placeholder="Select social media platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                placeholder={getPlaceholderText()}
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white bg-opacity-20 border-purple-500"
              />
              <Button onClick={() => handleSocialMediaSubmit(socialPlatform)} className="w-full bg-purple-600 hover:bg-purple-700" disabled={!socialPlatform || !username}>
                Generate Roast <ArrowRight className="ml-2" size={16} />
              </Button>
            </div>
          )}
        </section>

        {isLoading ? (
          <div className="space-y-4 bg-white bg-opacity-10 rounded-xl p-6 shadow-lg">
            <div className="w-full h-64 bg-black rounded-lg flex items-center justify-center">
              <User className="w-16 h-16 text-gray-400" />
            </div>
            <Skeleton className="w-full h-32 rounded-lg bg-purple-700 bg-opacity-50" />
          </div>
        ) : profilePicture || capturedImage ? (
          <div className="space-y-4 bg-white bg-opacity-10 rounded-xl p-6 shadow-lg">
            <img 
              src={profilePicture || capturedImage || ''} 
              alt="Profile" 
              className="w-full rounded-lg" 
            />
            <RoastGenerator imageUrl={profilePicture || capturedImage || ''} />
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ChatBox />
          <Leaderboard />
        </div>

        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Face the Heat?</h2>
          <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-yellow-500 hover:bg-yellow-600 text-black">
            Get Roasted Now!
          </Button>
        </section>
      </main>

      <footer className="text-center py-6 border-t border-purple-700">
        <p className="text-sm text-purple-300">Powered by WhiteMirror</p>
        <a href="#" className="text-xs text-yellow-400 hover:underline">
          Learn more about our AI smart mirror
        </a>
      </footer>
    </div>
  );
}