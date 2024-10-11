'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ImageCapture from './components/ImageCapture';
import Leaderboard from './components/Leaderboard';
import { Flame, Gift, ShoppingCart, Loader2, ArrowRight } from 'lucide-react';
import { db } from '@/app/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import ReCAPTCHA from "react-google-recaptcha";
import OpenAI from 'openai';
import imageCompression from 'browser-image-compression';
import { useSessionStorage } from '@/hooks/useSessionStorage';

// Update the OpenAI initialization
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  dangerouslyAllowBrowser: true
});

export default function LandingPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [socialPlatform, setSocialPlatform] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSocialMediaInput, setShowSocialMediaInput] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [roastResult, setRoastResult] = useState<{ score: number; rank: number } | null>(null);
  const [email, setEmail] = useState<string>('');
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [socialUsername, setSocialUsername] = useState<string>('');
  const [gptResponse, setGptResponse] = useState<any>(null);
  const [socialMediaImageUrl, setSocialMediaImageUrl] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [sessionSubmitted, setSessionSubmitted] = useSessionStorage<boolean>('hasSubmittedSession', false);

  const implementationDate = new Date('2024-10-18').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    const checkLocalStorage = () => {
      const submitted = localStorage.getItem('hasSubmitted');
      if (submitted) {
        setHasSubmitted(true);
      }
    };

    checkLocalStorage();
  }, []);

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

  const handleImageCapture = async (imageUrl: string) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const compressedFile = await compressImage(new File([blob], "capture.jpg", { type: "image/jpeg" }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setCapturedImage(reader.result as string);
    };
    reader.readAsDataURL(compressedFile);
  };

  const handleSocialMediaImageLoad = async (platform: string, username: string) => {
    try {
      const imageUrl = await getProfilePictureUrl(platform, username);
      setSocialMediaImageUrl(imageUrl);
    } catch (error) {
      console.error('Error loading social media image:', error);
      alert('Failed to load social media profile picture. Please try again.');
    }
  };

  const checkEmailSubmission = async (email: string) => {
    const q = query(collection(db, 'roasts'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleSubmit = async () => {
    if (!captchaValue) {
      alert("Please complete the CAPTCHA");
      return;
    }

    if (hasSubmitted || sessionSubmitted) {
      alert("You have already submitted a roast request.");
      return;
    }

    const emailSubmitted = await checkEmailSubmission(email);
    if (emailSubmitted) {
      alert("This email has already been used for a roast request.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      let imageData;
      if (capturedImage) {
        imageData = capturedImage.split(',')[1];
      } else if (socialMediaImageUrl) {
        const response = await fetch(socialMediaImageUrl);
        const blob = await response.blob();
        const base64 = await blobToBase64(blob);
        imageData = base64.split(',')[1];
      } else {
        throw new Error("No image data available");
      }

      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this image and provide: 1) A score between 7-10 with single decimals allowed. 2) A nickname for the person that reminds you of a celebrity or movie character. 3) A concise, funny, and slightly mean roast with dark humor (keep it under 50 words). Respond in JSON format with keys 'score', 'nickname', and 'roast'." },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageData}` } },
            ],
          },
        ],
        max_tokens: 300,
        response_format: { type: "json_object" },
      });

      console.log("Raw OpenAI response:", response.choices[0]?.message?.content);

      let gptOutput;
      try {
        gptOutput = JSON.parse(response.choices[0]?.message?.content || '{}');
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError);
        throw new Error("Invalid response from OpenAI");
      }

      if (!gptOutput.score || !gptOutput.nickname || !gptOutput.roast) {
        throw new Error("Incomplete response from OpenAI");
      }

      const processedOutput = {
        score: Math.min(Math.max(parseFloat(gptOutput.score), 7), 10),
        nickname: gptOutput.nickname,
        roast: gptOutput.roast
      };

      setGptResponse(processedOutput);

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'roasts'), {
        email: email,
        score: processedOutput.score,
        nickname: processedOutput.nickname,
        roast: processedOutput.roast,
        timestamp: serverTimestamp(),
      });

      console.log("Document written with ID: ", docRef.id);

      // Set local storage and session storage
      localStorage.setItem('hasSubmitted', 'true');
      setSessionSubmitted(true);
      setHasSubmitted(true);

      setIsLoading(false);
    } catch (error) {
      console.error("Error processing image:", error);
      setIsLoading(false);
      alert("An error occurred while processing your image. Please try again.");
    }
  };

  const getProfilePictureUrl = async (platform: string, username: string) => {
    // This is a placeholder function. In a real-world scenario, you'd need to implement
    // proper API calls to fetch profile pictures from social media platforms.
    switch (platform) {
      case 'instagram':
        return `https://instagram.com/${username}/profile_picture`;
      case 'facebook':
        return `https://graph.facebook.com/${username}/picture?type=large`;
      case 'twitter':
        return `https://twitter.com/${username}/profile_image?size=original`;
      default:
        throw new Error("Unsupported platform");
    }
  };

  const compressImage = async (imageFile: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      return compressedFile;
    } catch (error) {
      console.error("Error compressing image:", error);
      return imageFile;
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleCaptchaChange = useCallback((value: string | null) => {
    setCaptchaValue(value);
  }, []);

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

    if (!gptResponse) {
      return (
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="flex items-center space-x-4">
            <img src={capturedImage} alt="Captured" className="w-16 h-16 rounded-lg object-cover" />
            <Button 
              onClick={handleSubmit} 
              className="flex-grow bg-purple-600 hover:bg-purple-700"
              disabled={!email || !captchaValue || hasSubmitted || sessionSubmitted}
            >
              {hasSubmitted || sessionSubmitted ? 'Already Submitted' : 'Submit Selfie'}
            </Button>
          </div>
          <div className="recaptcha-container">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={handleCaptchaChange}
              size="normal"
            />
          </div>
          <p className="text-sm text-gray-400">Your image will be processed securely and not stored.</p>
        </div>
      );
    }

    if (gptResponse) {
      return (
        <div className="space-y-4 text-center">
          <h3 className="text-2xl font-bold">Results</h3>
          <p className="text-xl">Your Roast Score: {gptResponse.score}/10</p>
          <p>Nickname: {gptResponse.nickname}</p>
          <p className="text-lg font-semibold mt-4">Your Roast:</p>
          <p className="italic">{gptResponse.roast}</p>
          <p className="text-sm mt-4">Check back later as your ranking might change if others score higher.</p>
          <p className="text-sm text-gray-400">Your image has been discarded and was not stored or shared.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4 text-center">
        <h3 className="text-2xl font-bold">Results</h3>
        <p className="text-xl">Your Roast Score: {gptResponse.score}/10</p>
        <p>Nickname: {gptResponse.nickname}</p>
        <p className="text-sm">Check back later as your ranking might change if others score higher.</p>
        <p className="text-sm text-gray-400">Your image has been discarded and was not stored or shared.</p>
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
        <Input
          type="text"
          placeholder="Enter your username"
          value={socialUsername}
          onChange={(e) => setSocialUsername(e.target.value)}
          required
        />
        <Button
          onClick={() => handleSocialMediaImageLoad(socialPlatform, socialUsername)}
          disabled={!socialPlatform || !socialUsername}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          Load Profile Picture
        </Button>
        {socialMediaImageUrl && (
          <img src={socialMediaImageUrl} alt="Profile" className="w-32 h-32 mx-auto rounded-full object-cover" />
        )}
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          onChange={setCaptchaValue}
        />
        <Button 
          onClick={handleSubmit}
          disabled={!socialPlatform || !socialUsername || !email || !captchaValue || !socialMediaImageUrl}
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
        <p className="text-sm text-yellow-300 mt-2">LA TechWeek After Party - October 19th, 9 PM – 2 AM</p>
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
          <h2 className="text-2xl font-bold mb-4">Are You Ready to Get Roasted?</h2>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600" disabled={hasSubmitted || sessionSubmitted}>
                {hasSubmitted || sessionSubmitted ? 'Already Submitted' : 'Start Your Roast'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] dialog-content">
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
          <h2 className="text-2xl font-bold mb-4">Two Ways to Join the Party</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Gift className="mx-auto" size={48} />
              <h3 className="text-xl font-semibold">Test Your Luck</h3>
              <p>Top 5 leaderboard scores win free entry and a Magic Mirror!</p>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-500 hover:bg-green-600" disabled={hasSubmitted || sessionSubmitted}>
                    {hasSubmitted || sessionSubmitted ? 'Already Submitted' : 'Start Your Roast'}
                  </Button>
                </DialogTrigger>
                {/* ... (DialogContent remains the same) */}
              </Dialog>
            </div>
            <div className="space-y-4">
              <ShoppingCart className="mx-auto" size={48} />
              <h3 className="text-xl font-semibold">Guaranteed Entry</h3>
              <p>Skip the competition and secure your spot for just $123!</p>
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
          <h2 className="text-2xl font-bold mb-4">Good luck!</h2>
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
        <a href="/qr" className="block mt-2 text-xs text-blue-400 hover:underline">
          Follow us on X
        </a>
      </footer>
    </div>
  );
}