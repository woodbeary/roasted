import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  gender: 'male' | 'female';
  nickname: string;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white bg-opacity-10 rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      {loading ? (
        <p>Loading leaderboard...</p>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <div key={entry.id} className="flex justify-between items-center">
              <span>{entry.nickname || entry.name}</span>
              <span className={entry.gender === 'male' ? 'text-blue-300' : 'text-pink-300'}>
                {entry.score}
              </span>
            </div>
          ))}
        </div>
      )}
      <Button onClick={fetchLeaderboard} className="mt-4">Refresh Leaderboard</Button>
    </div>
  );
};

export default Leaderboard;