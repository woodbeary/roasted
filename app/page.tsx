'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ImageCapture from './components/ImageCapture';
import Leaderboard from './components/Leaderboard';
import { Flame, Gift, ShoppingCart, Loader2, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [socialPlatform, setSocialPlatform] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSocialMediaInput, setShowSocialMediaInput] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [roastResult, setRoastResult] = useState<{ score: number; rank: number } | null>(null);

  const implementationDate = new Date('2024-10-18').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    if (isModalOpen) {
      requestCameraPermission();
    }
  }, [isModalOpen]);

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      setShowSocialMediaInput(true);
    }
  };

  const handleImageCapture = (imageUrl: string) => {
    setCapturedImage(imageUrl);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const score = +(Math.random() * (10 - 7) + 7).toFixed(1);
      const rank = Math.floor(Math.random() * 5) + 1;
      setRoastResult({ score, rank });
      setIsLoading(false);
    }, 3000);
  };

  const renderCameraContent = () => {
    if (hasCameraPermission === null) {
      return <div>Requesting camera access...</div>;
    }

    if (!capturedImage) {
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-400">Your image will not be stored or shared.</p>
          <ImageCapture onCapture={handleImageCapture} hasCameraPermission={hasCameraPermission} />
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="space-y-4 text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto" />
          <p>Calculating your roast score...</p>
          <p className="text-sm text-gray-400">Your image is being processed securely and will not be stored.</p>
        </div>
      );
    }

    if (roastResult) {
      return (
        <div className="space-y-4 text-center">
          <h3 className="text-2xl font-bold">Results</h3>
          <p className="text-xl">Your Roast Score: {roastResult.score}/10</p>
          <p>You're currently ranked #{roastResult.rank} out of 5!</p>
          <p className="text-sm">Check back later as your ranking might change if others score higher.</p>
          <p className="text-sm text-gray-400">Your image has been discarded and was not stored or shared.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <p className="text-lg font-semibold">Good luck!</p>
        <div className="flex items-center space-x-4">
          <img src={capturedImage} alt="Captured" className="w-16 h-16 rounded-lg object-cover" />
          <Button 
            onClick={handleSubmit} 
            className="flex-grow bg-purple-600 hover:bg-purple-700"
          >
            Submit Selfie
          </Button>
        </div>
        <p className="text-sm text-gray-400">Your image will be processed securely and not stored.</p>
      </div>
    );
  };

  const renderSocialMediaContent = () => {
    return (
      <div className="space-y-4">
        <p>No camera access. Please use your social media profile instead.</p>
        <Select onValueChange={setSocialPlatform}>
          <SelectTrigger>
            <SelectValue placeholder="Select social media platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="twitter">Twitter</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={handleSubmit}
          disabled={!socialPlatform}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          Generate Roast <ArrowRight className="ml-2" size={16} />
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white font-sans">
      <header className="text-center py-8 border-b border-purple-700">
        <h1 className="text-4xl font-bold text-white flex items-center justify-center">
          <Flame className="mr-2 text-yellow-500" size={32} />
          roasted.lol
        </h1>
        <p className="text-lg text-purple-300 mt-2">Get roasted by AI and win a Magic Mirror!</p>
        <p className="text-sm text-yellow-300 mt-2">Coming {implementationDate}</p>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <section className="text-center space-y-4">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-10 rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-xl font-semibold mb-2">1. Take a Selfie</h3>
              <p>Snap a pic and get ready for a roast</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">2. AI Roast</h3>
              <p>Our AI prepares a hilarious, personalized roast</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-2">3. Win Big</h3>
              <p>Score in the top 5 and win a free Magic Mirror!</p>
            </div>
          </div>
        </section>

        <section className="bg-white bg-opacity-10 rounded-xl p-6 shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Are You Feeling Lucky?</h2>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600">
                Test Your Luck
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {roastResult ? "Results" : (isLoading ? "Calculating..." : "Good luck!")}
                </DialogTitle>
              </DialogHeader>
              {hasCameraPermission === null ? (
                <div className="space-y-4">
                  <p>Requesting camera access...</p>
                </div>
              ) : hasCameraPermission ? (
                renderCameraContent()
              ) : showSocialMediaInput ? (
                renderSocialMediaContent()
              ) : null}
            </DialogContent>
          </Dialog>
        </section>

        <section className="bg-white bg-opacity-10 rounded-xl p-6 shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Two Ways to Get Your Magic Mirror</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Gift className="mx-auto" size={48} />
              <h3 className="text-xl font-semibold">Test Your Luck</h3>
              <p>Score in the top 5 on our leaderboard and win a free Magic Mirror!</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-green-500 hover:bg-green-600">
                    Try Your Luck
                  </Button>
                </DialogTrigger>
                {/* Use the same DialogContent as above */}
              </Dialog>
            </div>
            <div className="space-y-4">
              <ShoppingCart className="mx-auto" size={48} />
              <h3 className="text-xl font-semibold">Guaranteed Mirror</h3>
              <p>Skip the competition and get your Magic Mirror for just $123!</p>
              <Button className="bg-blue-500 hover:bg-blue-600">
                Buy Now for $123
              </Button>
            </div>
          </div>
        </section>

        <div className="w-full">
          <Leaderboard />
        </div>

        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Face the Heat and Win?</h2>
          <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-yellow-500 hover:bg-yellow-600 text-black">
            Get Roasted Now!
          </Button>
        </section>
      </main>

      <footer className="text-center py-6 border-t border-purple-700">
        <p className="text-sm text-purple-300">Powered by WhiteMirror</p>
        <a href="#" className="text-xs text-yellow-400 hover:underline">
          Learn more about our AI Magic Mirror
        </a>
      </footer>
    </div>
  );
}