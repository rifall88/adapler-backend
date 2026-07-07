import { createQuizBatch, findQuizByMaterialId } from "../models/quizModel.js";
import { findMaterialById } from "../models/materialModel.js";
import { v4 as uuidv4 } from "uuid";
import { generateQuizWithAI } from "../services/aiService.js";

export const generateKuis = async (req, res) => {
  try {
    const { materialId } = req.body;
    const userId = req.user.id;

    const material = await findMaterialById(materialId, userId);
    if (!material) {
      return res
        .status(404)
        .json({ status: "failed", message: "Material not found" });
    }

    const existingQuiz = await findQuizByMaterialId(materialId);

    if (existingQuiz && existingQuiz.length > 0) {
      return res.status(400).json({
        status: "failed",
        message: "A quiz for this material has been created previously..",
      });
    }

    const aiQuiz = await generateQuizWithAI(material.ringkasan);

    const quizDataToInsert = aiQuiz.map((soal) => ({
      id: uuidv4(),
      material_id: materialId,
      tipe_soal: soal.tipe_soal,
      pertanyaan: soal.pertanyaan,
      kunci_jawaban: soal.kunci_jawaban,
      pembahasan: soal.pembahasan,
    }));

    await createQuizBatch(quizDataToInsert);

    return res.status(201).json({
      status: "success",
      message: "10 Questions generated successfully",
    });
  } catch (error) {
    console.error("Generate Quiz Error:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
  }
};

export const getSoalKuis = async (req, res) => {
  try {
    const { materialId } = req.params;
    const quizzes = await findQuizByMaterialId(materialId);

    if (quizzes.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "Quiz not found for this material",
      });
    }

    const safeQuizzes = quizzes.map((q) => ({
      id: q.id,
      tipe_soal: q.tipe_soal,
      pertanyaan: q.pertanyaan,
    }));

    return res.status(200).json({
      status: "success",
      data: safeQuizzes,
    });
  } catch (error) {
    console.error("Get Quiz Error:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
  }
};
