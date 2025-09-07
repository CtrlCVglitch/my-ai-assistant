// netlify/functions/ask-ai.js
import fetch from "node-fetch";

export async function handler(event, context) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const question = body.question || "Hello";

    const response = await fetch("https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: question })
    });

    const data = await response.json();
    const answer = data?.generated_text || data?.[0]?.generated_text || "No answer";

    return {
      statusCode: 200,
      body: JSON.stringify({ answer })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
