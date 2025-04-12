import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { useMutation } from "@tanstack/react-query";
import { streamText } from "ai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const useChatMutate = () => {
  return useMutation({
    mutationFn: async (messages: Message[]) => {
      const google = createGoogleGenerativeAI({
        apiKey:
          process.env.NODE_ENV === "development"
            ? import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY
            : process.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY,
      });
      const { textStream } = streamText({
        model: google("gemini-1.5-flash"),
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        system:
          "You are a friendly and enthusiastic AI assistant for louli.tech. Always respond with a warm, welcoming tone and use relevant emojis to make your responses more engaging and friendly. Keep your answers focused on louli.tech topics, but do so in a cheerful way. If asked about other topics, kindly redirect the conversation back to louli.tech with a smile. Remember to be helpful, patient, and maintain a positive attitude in all your responses.",
      });
      return textStream;
    },
  });
};
