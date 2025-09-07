// netlify/functions/ask-ai.js
import fetch from "node-fetch";

export async function handler(event, context) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const question = body.question || "Hello";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: question }]
      })
    });

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content || "No answer";

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
