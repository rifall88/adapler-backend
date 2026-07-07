import {
  createChatHistory,
  findChatHistoryByUser,
  findChatHistory,
} from "../models/chatHistoryModel.js";
import { v4 as uuidv4 } from "uuid";
import { generateChatWithAI } from "../services/aiService.js";

export const generateChatHistory = async (req, res) => {
  try {
    const { pesan } = req.body;
    const userId = req.user.id;

    await createChatHistory({
      id: uuidv4(),
      user_id: userId,
      role: "user",
      pesan: pesan,
    });

    const history = await findChatHistoryByUser(userId);
    const aiResponse = await generateChatWithAI(history);

    const savedAiMessage = await createChatHistory({
      id: uuidv4(),
      user_id: userId,
      role: "model",
      pesan: aiResponse,
    });

    res.status(200).json({
      status: "success",
      message: "Message sent successfully",
      data: {
        reply: savedAiMessage.pesan,
      },
    });
  } catch (error) {
    console.error("Generate Planner Error:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
  }
};

export const getChatHistoryByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    const ChatHistory = await findChatHistory(userId);
    return res.status(200).json({
      status: "success",
      data: {
        chatHistory: ChatHistory || [],
      },
    });
  } catch (error) {
    console.error("Getting chat history error: ", error);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};
