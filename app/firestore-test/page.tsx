'use client';

import { useState } from 'react';
import { db } from '@/app/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';

export default function FirestoreTestPage() {
  const [lastAddedNumber, setLastAddedNumber] = useState<number | null>(null);

  const addNumberToFirestore = async () => {
    try {
      const randomNumber = Math.floor(Math.random() * 100) + 1;
      const docRef = await addDoc(collection(db, 'test_numbers'), {
        value: randomNumber,
        timestamp: new Date()
      });
      console.log("Document written with ID: ", docRef.id);
      setLastAddedNumber(randomNumber);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Firestore Connection Test</h1>
      <Button onClick={addNumberToFirestore}>Add Random Number to Firestore</Button>
      {lastAddedNumber !== null && (
        <p className="mt-4">Last added number: {lastAddedNumber}</p>
      )}
    </div>
  );
}