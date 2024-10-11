import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

interface RoastGeneratorProps {
  imageUrl: string;
}

interface RoastResponse {
  roast: string;
  nickname: string;
}

const RoastGenerator: React.FC<RoastGeneratorProps> = ({ imageUrl }) => {
  const [roastData, setRoastData] = useState<RoastResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const generateRoast = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });
      const data: RoastResponse = await response.json();
      setRoastData(data);
    } catch (error) {
      console.error('Error generating roast:', error);
      alert('Failed to generate roast. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <Button onClick={generateRoast} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Roast'}
      </Button>
      {roastData && (
        <div className="mt-2 p-4 bg-white bg-opacity-10 rounded">
          <p className="mb-2"><strong>Nickname:</strong> {roastData.nickname}</p>
          <p><strong>Roast:</strong> {roastData.roast}</p>
        </div>
      )}
    </div>
  );
};

export default RoastGenerator;