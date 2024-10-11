import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '@/app/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Update OpenAI initialization
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { imageUrl, email } = await request.json();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Generate a JSON response with a roast score between 7-10 (single decimal) and a nickname resembling a celebrity or movie character based on this image." },
            { type: "image_url", image_url: imageUrl },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const gptOutput = JSON.parse(response.choices[0].message.content || '{}');

    // Validate the structure of the GPT output
    if (typeof gptOutput.score !== 'number' || typeof gptOutput.nickname !== 'string') {
      throw new Error("Invalid GPT-4 Vision response structure.");
    }

    // Add to Firestore
    const docRef = await addDoc(collection(db, 'roasts'), {
      email: email,
      score: gptOutput.score,
      nickname: gptOutput.nickname,
      timestamp: serverTimestamp(),
    });

    console.log("Document written with ID: ", docRef.id);

    return NextResponse.json({ score: gptOutput.score, nickname: gptOutput.nickname });
  } catch (error) {
    console.error('Error generating roast:', error);
    return NextResponse.json({ error: 'Failed to generate roast' }, { status: 500 });
  }
}