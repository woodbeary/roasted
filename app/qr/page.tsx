'use client';

import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function QRPage() {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // Set initial width
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const qrSize = Math.min(windowWidth * 0.8, 300); // 80% of screen width, max 300px

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4 text-white">
      <h1 className="text-4xl font-bold mb-2 text-center">roasted.lol</h1>
      <p className="text-lg mb-8 text-center">Get roasted by AI and win a Magic Mirror!</p>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <QRCodeSVG 
          value="https://x.com/imjacoblopez" 
          size={qrSize}
          level="H"
          includeMargin={true}
        />
      </div>
      <p className="mt-4 text-sm text-center">Scan to follow @imjacoblopez on X</p>
    </div>
  );
}