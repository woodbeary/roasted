'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/app/firebase';

interface RoastEntry {
  id: string;
  score: number;
  nickname: string;
  roast: string;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<RoastEntry[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'roasts'), orderBy('score', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const entries: RoastEntry[] = [];
      querySnapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() } as RoastEntry);
      });
      setLeaderboard(entries);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white bg-opacity-10 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <ul className="space-y-4">
        {leaderboard.map((entry, index) => (
          <li key={entry.id} className="bg-white bg-opacity-5 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg">{index + 1}. {entry.nickname}</span>
              <span className="text-yellow-300 font-bold">{entry.score.toFixed(1)}/10</span>
            </div>
            <p className="text-sm italic text-gray-300">&quot;{entry.roast}&quot;</p>
          </li>
        ))}
      </ul>
    </div>
  );
}