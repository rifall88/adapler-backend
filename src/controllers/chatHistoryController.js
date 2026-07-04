import {
  createChatHistory,
  findChatHistoryByUser,
  findChatHistory,
  deleteChatHistory,
} from "../models/chatHistoryModel.js";
import { v4 as uuidv4 } from "uuid";
import { generateChatWithAI } from "../services/aiService.js";

export const generateChatHistory = async (req, res) => {
  try {
    const { pesan } = req.body;
    const userId = req.user.id;

    if (!pesan) {
      return res
        .status(400)
        .json({ status: "failed", message: "Message cannot be empty" });
    }

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
    console.error("Getting chat history error: ", error.message);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

export const deleteChatHistoryById = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const deletedChatHistory = await deleteChatHistory(id, userId);

    if (!deletedChatHistory) {
      return res
        .status(404)
        .json({ status: "failed", message: "Chat history not found" });
    }

    return res.status(200).json({
      status: "success",
      message: "Chat history deletion successful",
    });
  } catch (error) {
    console.error("Error while deleting chat history: ", error.message);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};
