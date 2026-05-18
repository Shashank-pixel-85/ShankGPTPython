from groq import Groq
import os

class GroqLLM:
    def __init__(self):
        # FIX: Create client only after .env loaded
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("❌ GROQ_API_KEY is missing. Check your .env.")

        self.client = Groq(api_key=api_key)

    def chat(self, user_message, history):
        formatted = [
            {
                "role": "user" if msg["role"] == "user" else "assistant",
                "content": msg["content"]
            }
            for msg in history
        ]

        formatted.append({"role": "user", "content": user_message})

        response = self.client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=formatted
        )

        return response.choices[0].message.content