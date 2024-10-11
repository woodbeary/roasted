import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };

    setMessages([...messages, userMessage]);
    setInput('');

    // TODO: Replace with actual API call to chat bot
    const botResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: 'This is a mock response from the roast bot.',
      sender: 'bot',
    };

    setMessages((prevMessages) => [...prevMessages, botResponse]);
  };

  return (
    <div className="bg-white bg-opacity-10 rounded-lg p-4">
      <div className="h-64 overflow-y-auto mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2 p-2 rounded ${
              message.sender === 'user' ? 'bg-blue-500 ml-auto' : 'bg-gray-500'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <Input
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow mr-2"
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
};

export default ChatInterface;