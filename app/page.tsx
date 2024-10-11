import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CameraAccess from './components/CameraAccess';
import ImageCapture from './components/ImageCapture';
import RoastGenerator from './components/RoastGenerator';
import Leaderboard from './components/Leaderboard';
import ChatInterface from './components/ChatInterface';

export default function LandingPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isChatUnlocked, setIsChatUnlocked] = useState(false);

  const handleImageCapture = (imageUrl: string) => {
    setCapturedImage(imageUrl);
  };

  const handleShareOnSocialMedia = () => {
    // TODO: Implement social media sharing functionality
    alert('Sharing functionality to be implemented');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-600 text-white p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Roasted.lol</h1>
        <p className="text-xl">Get ready to be roasted by AI!</p>
      </header>

      <main>
        <section className="mb-8">
          <CameraAccess />
          <ImageCapture onCapture={handleImageCapture} />
          <div className="space-y-4">
            <Input placeholder="Facebook Username" />
            <Input placeholder="Instagram Username" />
            <Input placeholder="TikTok Username" />
          </div>
        </section>

        {capturedImage && (
          <section className="mb-8">
            <RoastGenerator imageUrl={capturedImage} />
            <Button onClick={handleShareOnSocialMedia}>Share on Social Media</Button>
          </section>
        )}

        <section className="mb-8">
          <Leaderboard />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Chat with Roast Bot</h2>
          {isChatUnlocked ? (
            <ChatInterface />
          ) : (
            <Button 
              className="w-full" 
              onClick={() => setIsChatUnlocked(true)}
            >
              Unlock Full Chat (Payment Required)
            </Button>
          )}
        </section>

        <footer className="text-center">
          <p>Powered by WhiteMirror</p>
          <a href="#" className="underline">Learn more about our AI smart mirror</a>
        </footer>
      </main>
    </div>
  );
}
