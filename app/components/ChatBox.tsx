'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput('');
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setMessages(prev => [...prev, "AI roast response goes here"]);
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="bg-white bg-opacity-10 rounded-xl p-6 shadow-lg space-y-4">
      <h2 className="text-xl font-bold">Chat with Roast Bot</h2>
      <div className="h-64 overflow-y-auto space-y-2 bg-black bg-opacity-30 rounded-lg p-4">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 rounded-lg bg-purple-800 bg-opacity-50">
            {msg}
          </div>
        ))}
        {isLoading && (
          <Skeleton className="w-3/4 h-8 rounded-lg bg-purple-700 bg-opacity-50" />
        )}
      </div>
      <div className="flex space-x-2">
        <Input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="bg-white bg-opacity-20 border-purple-500"
        />
        <Button onClick={handleSend} className="bg-purple-600 hover:bg-purple-700">Send</Button>
      </div>
    </div>
  );
};

export default ChatBox;