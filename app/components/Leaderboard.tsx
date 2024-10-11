'use client';

import React, { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface LeaderboardEntry {
  id: string;
  score: number;
  celebLook: string;
  imageUrl: string;
  roast: string;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLeaderboard([
        { id: '1', score: 9, celebLook: 'The Rock', imageUrl: 'https://placekitten.com/100/100', roast: "You look like The Rock, if he was made of marshmallows." },
        { id: '2', score: 7, celebLook: 'Scarlett Johansson', imageUrl: 'https://placekitten.com/101/101', roast: "Scarlett Johansson called, she wants her 'meh' look back." },
        { id: '3', score: 8, celebLook: 'Tony Stark', imageUrl: 'https://placekitten.com/102/102', roast: "Tony Stark without the stark and just the snark." },
        // Add more entries to simulate top 20
      ]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h2 className="text-xl font-bold">Leaderboard (Top 20)</h2>
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {leaderboard.slice(0, 20).map((entry, index) => (
            <Dialog key={entry.id}>
              <DialogTrigger asChild>
                <div className="flex justify-between items-center bg-white bg-opacity-10 p-2 rounded cursor-pointer hover:bg-opacity-20 transition-colors">
                  <div>
                    <span className="font-semibold">{index + 1}. {entry.celebLook}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">{entry.score}/10</span>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white text-black">
                <div className="grid gap-4 py-4">
                  <img src={entry.imageUrl} alt={entry.celebLook} className="w-full h-64 object-cover rounded" />
                  <p className="text-lg font-semibold">{entry.roast}</p>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;