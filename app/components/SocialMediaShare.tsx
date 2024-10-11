'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter } from 'lucide-react';

const SocialMediaShare: React.FC = () => {
  const handleShare = (platform: string) => {
    // TODO: Implement actual sharing functionality
    console.log(`Sharing on ${platform}`);
    alert(`Sharing on ${platform} - functionality to be implemented`);
  };

  return (
    <div className="flex space-x-2 mt-4">
      <Button 
        onClick={() => handleShare('Facebook')} 
        className="flex-1 bg-blue-600 hover:bg-blue-700"
      >
        <Facebook className="mr-2" size={18} />
        Share on Facebook
      </Button>
      <Button 
        onClick={() => handleShare('Instagram')} 
        className="flex-1 bg-pink-600 hover:bg-pink-700"
      >
        <Instagram className="mr-2" size={18} />
        Share on Instagram
      </Button>
      <Button 
        onClick={() => handleShare('Twitter')} 
        className="flex-1 bg-sky-500 hover:bg-sky-600"
      >
        <Twitter className="mr-2" size={18} />
        Share on Twitter
      </Button>
    </div>
  );
};

export default SocialMediaShare;