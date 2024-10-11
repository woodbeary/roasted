import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { imageUrl } = await request.json();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Generate a humorous roast and a funny nickname based on this image. Keep it light-hearted and not offensive." },
            { type: "image_url", image_url: imageUrl },
          ],
        },
      ],
    });

    const generatedContent = response.choices[0]?.message?.content || '';
    const [nickname = '', roast = ''] = generatedContent.split('\n\n');

    return NextResponse.json({ nickname, roast });
  } catch (error) {
    console.error('Error generating roast:', error);
    return NextResponse.json({ error: 'Failed to generate roast' }, { status: 500 });
  }
}